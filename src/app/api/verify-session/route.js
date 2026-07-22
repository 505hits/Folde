import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,       // 'paid' | 'unpaid' | 'no_payment_required'
      customerEmail: session.customer_email,
      metadata: session.metadata,           // { name, partnerName, email, plan, theme }
      amountTotal: session.amount_total,    // en centimes
    });
  } catch (error) {
    console.error('Stripe session verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify session' },
      { status: 500 }
    );
  }
}
