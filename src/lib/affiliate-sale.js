import { database } from '@/lib/server-database';
import { commissionCents, normalizeCode } from '@/lib/affiliate.mjs';
import { sendAffiliateSaleEmail, sendTeamSaleEmail } from '@/lib/affiliate-email';

// Records the affiliate commission of a paid Checkout session. Safe to call
// several times for the same session (success page and Stripe webhook): the
// database keeps one referral per session and the email goes out once.
// Throws when the database refuses, so the webhook can ask Stripe to retry.
export async function recordAffiliateSale(session, db = database(), notify = sendAffiliateSaleEmail, notifyTeam = sendTeamSaleEmail) {
  const code = normalizeCode(session?.metadata?.affiliate);
  const amount = Number(session?.amount_total) || 0;
  if (!code || session.payment_status !== 'paid' || amount <= 0) return null;
  const commission = commissionCents(amount);
  const intent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null;
  const buyer = /^[0-9a-f-]{36}$/i.test(session.metadata?.userId || '') ? session.metadata.userId : null;
  const { data, error } = await db.rpc('record_affiliate_sale', {
    p_code: code, p_session_id: session.id, p_payment_intent: intent, p_buyer_user_id: buyer,
    p_amount_cents: amount, p_commission_cents: commission, p_currency: session.currency || 'usd',
    p_plan: String(session.metadata?.plan || '').slice(0, 40) || null,
  });
  if (error) throw new Error('Affiliate sale could not be recorded.');
  const result = Array.isArray(data) ? data[0] : data;
  if (result?.inserted) {
    const details = {
      locale: result.locale, code: result.code, amountCents: amount, commissionCents: commission,
      totalCommissionCents: result.total_commission_cents, salesCount: result.sales_count, currency: session.currency || 'usd',
    };
    // Both emails go out once per sale; neither contains the buyer's details.
    await Promise.all([
      notify(result.email, details),
      notifyTeam({ ...details, name: result.name, affiliateEmail: result.email, plan: session.metadata?.plan }),
    ]);
  }
  return result || null;
}
