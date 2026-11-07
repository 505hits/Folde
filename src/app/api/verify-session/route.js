import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    const auth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data: { user }, error } = await auth.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userId
      ? session.metadata.userId !== user.id
      : (session.customer_email || session.metadata?.email)?.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json({ error: 'This payment belongs to another account.' }, { status: 403 });
    }

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
