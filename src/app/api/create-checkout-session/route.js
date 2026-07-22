import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Mapping des plans vers les Price IDs Stripe
const PRICE_MAP = {
  essential: 'price_1Tw4pSDepfiMdtp4CtFaXDs9',
  Standard: 'price_1Tw4pSDepfiMdtp4CtFaXDs9',
  premium: 'price_1Tw4q7DepfiMdtp4ezofU3Ur',
  Premium: 'price_1Tw4q7DepfiMdtp4ezofU3Ur',
  Custom: 'price_1Tw4qfDepfiMdtp4r9k0bNpP',
  custom: 'price_1Tw4qfDepfiMdtp4r9k0bNpP',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { plan, name, partnerName, email, theme } = body;

    const priceId = PRICE_MAP[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Déterminer l'URL de base
    const origin = request.headers.get('origin') || 'https://foldedesign.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        name,
        partnerName,
        email,
        plan,
        theme: theme || 'bordeaux',
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
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
