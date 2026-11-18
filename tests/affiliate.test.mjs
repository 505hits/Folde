import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRoute, mockDatabase, ok, failure, request } from './load-route.mjs';
import { commissionCents, normalizeCode, readRefCookie, referralState, suggestCode, summarizeReferrals } from '../src/lib/affiliate.mjs';

delete process.env.RESEND_API_KEY;
const buyer = '22222222-2222-4222-8222-222222222222';
const session = { id: 'cs_test_aff', payment_status: 'paid', amount_total: 14900, currency: 'usd', payment_intent: 'pi_123', metadata: { affiliate: 'anna-weds', userId: buyer, plan: 'Custom', email: 'buyer@example.org', name: 'Emma', partnerName: 'Lucas' } };

test('codes, cookie and the 30% commission follow the program rules', () => {
  assert.equal(normalizeCode(' Anna-Weds '), 'anna-weds');
  for (const bad of ['ab', '-anna', 'anna-', 'a b c', 'x'.repeat(25), null]) assert.equal(normalizeCode(bad), null);
  assert.equal(readRefCookie('theme=1; folde_ref=anna-weds; other=2'), 'anna-weds');
  assert.equal(readRefCookie('folde_ref=<script>'), null);
  assert.equal(commissionCents(4990), 1497);
  assert.equal(commissionCents(14900), 4470);
  assert.equal(commissionCents(-5), 0);
  assert.equal(suggestCode('Émilie Rose'), 'emilie-rose');
  assert.ok(normalizeCode(suggestCode('a@b.c')));
});

test('commissions stay on hold for 30 days, then become payable', () => {
  const now = Date.parse('2026-12-31T00:00:00Z');
  const rows = [
    { status: 'pending', commission_cents: 1497, created_at: '2026-12-20T00:00:00Z' },
    { status: 'pending', commission_cents: 4470, created_at: '2026-11-01T00:00:00Z' },
    { status: 'paid', commission_cents: 1497, created_at: '2026-10-01T00:00:00Z' },
    { status: 'refunded', commission_cents: 4470, created_at: '2026-12-01T00:00:00Z' },
  ];
  assert.equal(referralState(rows[0], now), 'pending');
  assert.equal(referralState(rows[1], now), 'payable');
  assert.deepEqual(summarizeReferrals(rows, now), { sales: 3, earnedCents: 7464, pendingCents: 1497, payableCents: 4470, paidCents: 1497, refundedCents: 4470 });
});

test('a paid session records the referral once and emails amounts only', async () => {
  const db = mockDatabase([ok({ inserted: true, email: 'anna@example.org', locale: 'fr', code: 'anna-weds', sales_count: 3, total_commission_cents: 9000 })]);
  const { recordAffiliateSale } = await loadRoute('lib/affiliate-sale.js', db);
  const sent = [];
  const team = [];
  await recordAffiliateSale(session, db, async (to, details) => sent.push({ to, details }), async (details) => team.push(details));
  assert.equal(team.length, 1);
  assert.equal(team[0].code, 'anna-weds');
  assert.equal(team[0].commissionCents, 4470);
  assert.doesNotMatch(JSON.stringify(team[0]), /buyer@example|Emma|Lucas/);
  const call = db.calls[0];
  assert.equal(call.table, 'record_affiliate_sale');
  assert.deepEqual(call.value, { p_code: 'anna-weds', p_session_id: 'cs_test_aff', p_payment_intent: 'pi_123', p_buyer_user_id: buyer, p_amount_cents: 14900, p_commission_cents: 4470, p_currency: 'usd', p_plan: 'Custom' });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'anna@example.org');
  assert.doesNotMatch(JSON.stringify(sent[0].details), /buyer@example|Emma|Lucas/);

  const again = mockDatabase([ok({ inserted: false, reason: 'duplicate' })]);
  const repeat = [];
  await recordAffiliateSale(session, again, async () => repeat.push(1), async () => repeat.push(2));
  assert.equal(repeat.length, 0);
});

test('sales without a valid code, unpaid sessions and database errors', async () => {
  const db = mockDatabase([]);
  const { recordAffiliateSale } = await loadRoute('lib/affiliate-sale.js', db);
  assert.equal(await recordAffiliateSale({ ...session, metadata: {} }, db), null);
  assert.equal(await recordAffiliateSale({ ...session, metadata: { affiliate: '../x' } }, db), null);
  assert.equal(await recordAffiliateSale({ ...session, payment_status: 'unpaid' }, db), null);
  assert.equal(db.calls.length, 0);
  await assert.rejects(() => recordAffiliateSale(session, mockDatabase([failure])), /could not be recorded/);
});

test('saving an order attributes the sale but never fails because of it', async () => {
  const user = { id: buyer, email: 'buyer@example.org' };
  const db = mockDatabase([ok(null), ok({ id: 'saved', slug: 'wedding' }), failure]);
  const { persistPaidOrder } = await loadRoute('lib/paid-order.js', db);
  const order = await persistPaidOrder(session, user);
  assert.equal(order.id, 'saved');
  assert.equal(db.calls.at(-1).table, 'record_affiliate_sale');
});

test('the sale email shows amounts and escapes the code', async () => {
  const { saleEmail } = await loadRoute('lib/affiliate-email.js', mockDatabase());
  const email = saleEmail({ locale: 'en', code: '<b>x</b>', amountCents: 14900, commissionCents: 4470, totalCommissionCents: 9000, salesCount: 3 });
  assert.match(email.subject, /\$44\.70/);
  assert.match(email.html, /\$149\.00/);
  assert.match(email.html, /\$90\.00/);
  assert.doesNotMatch(email.html, /<b>x<\/b>/);
});

test('joining validates the code, payout details and terms', async () => {
  const valid = { name: 'Anna', code: 'Anna-Weds', payoutMethod: 'paypal', payoutEmail: 'Anna@Example.org', acceptTerms: true, locale: 'fr' };
  const cases = [
    [{ ...valid, code: 'a' }, 400], [{ ...valid, code: 'admin' }, 409], [{ ...valid, payoutMethod: 'bank' }, 400],
    [{ ...valid, payoutEmail: 'nope' }, 400], [{ ...valid, acceptTerms: false }, 400], [{ ...valid, name: '' }, 400],
  ];
  for (const [index, [body, status]] of cases.entries()) {
    const { POST } = await loadRoute('app/api/affiliate/route.js', mockDatabase([], { id: `case-${index}`, email: 'owner@example.org', email_confirmed_at: '2026-01-01' }));
    assert.equal((await POST(request(body))).status, status, JSON.stringify(body));
  }
  const db = mockDatabase([ok({ id: 'aff-1', code: 'anna-weds' })]);
  const { POST } = await loadRoute('app/api/affiliate/route.js', db);
  const response = await POST(request(valid));
  assert.equal(response.status, 201);
  const insert = db.calls[0].value;
  assert.equal(insert.user_id, 'owner');
  assert.equal(insert.email, 'owner@example.org');
  assert.equal(insert.code, 'anna-weds');
  assert.equal(insert.payout_email, 'anna@example.org');
  assert.equal(insert.locale, 'fr');
  assert.equal((await POST(request(valid, 'POST', null))).status, 401);
});

test('a taken code is refused without exposing its owner', async () => {
  const db = mockDatabase([{ data: null, error: { code: '23505' } }, ok(null)], { id: 'taken-case', email: 'other@example.org', email_confirmed_at: '2026-01-01' });
  const { POST } = await loadRoute('app/api/affiliate/route.js', db);
  const response = await POST(request({ name: 'Anna', code: 'taken', payoutMethod: 'wise', payoutEmail: 'a@b.co', acceptTerms: true }));
  assert.equal(response.status, 409);
});

test('the team copy names the affiliate and links to the payout list', async () => {
  const { teamSaleEmail, TEAM_EMAIL } = await loadRoute('lib/affiliate-email.js', mockDatabase());
  const email = teamSaleEmail({ name: 'Anna', code: 'anna-weds', affiliateEmail: 'anna@example.org', amountCents: 4990, commissionCents: 1497, totalCommissionCents: 5967, salesCount: 2, plan: 'Standard' });
  assert.equal(TEAM_EMAIL, 'folde.wedding@gmail.com');
  assert.match(email.subject, /anna-weds.*\$14\.97/);
  assert.match(email.html, /anna@example\.org/);
  assert.match(email.html, /\/admin\/affiliates/);
});
