import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { database } from '@/lib/server-database';
import { recordAffiliateSale } from '@/lib/affiliate-sale';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_missing');

// Stripe calls this even when the buyer closes the tab before /success, so no
// affiliate commission is lost. Order creation stays on the success page,
// which carries the couple's invitation choices.
export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 });
  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }
  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await recordAffiliateSale(event.data.object);
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const intent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      // Only a full refund cancels the commission.
      if (intent && charge.refunded) {
        const { error } = await database().rpc('refund_affiliate_sale', { p_payment_intent: intent });
        if (error) throw new Error('Refund could not be recorded.');
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook failed:', event.type, error.message);
    return NextResponse.json({ error: 'Temporary failure, please retry.' }, { status: 500 });
  }
}
