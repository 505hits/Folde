import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const STANDARD_LAUNCH_PRICE_ID = 'price_1UItNjDepfiMdtp46fHveRN0';

const PLAN_CONFIG = {
  essential: { name: 'FOLDÈ Standard', unitAmount: 4990 },
  Standard: { name: 'FOLDÈ Standard', unitAmount: 4990 },
  Custom: { name: 'FOLDÈ Expert', unitAmount: 14900 },
  custom: { name: 'FOLDÈ Expert', unitAmount: 14900 },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { plan, name, partnerName, theme, locale, launchOffer, offerExpires } = body;
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Please sign in before paying.' }, { status: 401 });
    const auth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data: { user }, error: authError } = await auth.auth.getUser(token);
    if (authError || !user?.email) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    const email = user.email;

    const planConfig = PLAN_CONFIG[plan];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Déterminer l'URL de base
    const origin = request.headers.get('origin') || 'https://folde-wedding.com';
    const localePrefix = ['fr', 'es'].includes(locale) ? `/${locale}` : '';
    const selectedTheme = theme || 'bordeaux';

    const now = Date.now();
    const parsedExpiry = Number(offerExpires);
    const isStandard = plan === 'essential' || plan === 'Standard';
    const validLaunchOffer = isStandard && launchOffer === true && parsedExpiry > now && parsedExpiry <= now + (5 * 60 * 1000) + 30000;
    const lineItem = validLaunchOffer
      ? { price: STANDARD_LAUNCH_PRICE_ID, quantity: 1 }
      : { price_data: { currency: 'usd', unit_amount: planConfig.unitAmount, product_data: { name: planConfig.name } }, quantity: 1 };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [lineItem],
      ...(email ? { customer_email: email } : {}),
      metadata: {
        name,
        partnerName,
        email,
        plan,
        theme: selectedTheme,
        locale: ['fr', 'es'].includes(locale) ? locale : 'en',
        launchOffer: validLaunchOffer ? 'true' : 'false',
        userId: user.id,
      },
      success_url: `${origin}${localePrefix}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${localePrefix}/checkout?template=${encodeURIComponent(selectedTheme)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
