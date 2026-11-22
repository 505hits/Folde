import { protectRequest } from '@/lib/request-security';
import { readRefCookie } from '@/lib/affiliate.mjs';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const PLAN_CONFIG = {
  essential: { name: 'FOLDÈ Standard', unitAmount: 2990 },
  Standard: { name: 'FOLDÈ Standard', unitAmount: 2990 },
  Custom: { name: 'FOLDÈ Expert', unitAmount: 14900 },
  custom: { name: 'FOLDÈ Expert', unitAmount: 14900 },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { plan, name, partnerName, theme, locale } = body;
    const embedded = body.embedded === true;
    const elements = embedded && body.elements === true;
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Please sign in before paying.' }, { status: 401 });

    const auth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data: { user }, error: authError } = await auth.auth.getUser(token);
    if (authError || !user?.email) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

    const blocked = await protectRequest(request, { limit: 10, maxBytes: 20000 });
    if (blocked) return blocked;
    const affiliate = readRefCookie(request.headers.get('cookie'));
    const planConfig = Object.hasOwn(PLAN_CONFIG, plan) ? PLAN_CONFIG[plan] : null;
    if (!planConfig) return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });

    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://folde-wedding.com').origin;
    const localePrefix = ['fr', 'es'].includes(locale) ? '/' + locale : '';
    const selectedTheme = theme || 'bordeaux';
    const isStandard = plan === 'essential' || plan === 'Standard';
    const lineItem = { price_data: { currency: 'usd', unit_amount: planConfig.unitAmount, product_data: { name: planConfig.name } }, quantity: 1 };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        name: name || '',
        partnerName: partnerName || '',
        email: user.email,
        plan,
        theme: selectedTheme,
        locale: ['fr', 'es'].includes(locale) ? locale : 'en',
        launchOffer: isStandard ? 'true' : 'false',
        userId: user.id,
        ...(affiliate ? { affiliate } : {}),
      },
      ...(embedded
        ? {
            ui_mode: elements ? 'elements' : 'embedded_page',
            return_url: origin + localePrefix + '/success?session_id={CHECKOUT_SESSION_ID}',
            ...(!elements ? { redirect_on_completion: 'always' } : {}),
          }
        : {
            success_url: origin + localePrefix + '/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: origin + localePrefix + '/packages',
          }),
    });

    if (embedded) {
      return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id, returnUrl: origin + localePrefix + '/success?session_id=' + session.id });
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
