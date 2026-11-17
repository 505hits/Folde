// Affiliate program rules shared by the browser, the API routes and the tests.
// Pure ESM with no imports so the tests can load it directly.

export const REF_COOKIE = 'folde_ref';
export const REF_MAX_AGE_DAYS = 60;
export const COMMISSION_RATE = 0.3;
// Commissions wait this long (the refund window) before they can be paid out.
export const HOLD_DAYS = 30;
export const PLAN_PRICES = { standard: 4990, expert: 14900 };

const CODE = /^[a-z0-9][a-z0-9-]{1,22}[a-z0-9]$/;
const RESERVED = new Set(['admin', 'folde', 'foldewedding', 'test', 'null', 'undefined', 'affiliate', 'affiliates', 'support', 'stripe']);

export function normalizeCode(value) {
  if (typeof value !== 'string') return null;
  const code = value.trim().toLowerCase();
  return CODE.test(code) ? code : null;
}

export function isReservedCode(code) {
  return RESERVED.has(code);
}

export function suggestCode(source = '') {
  const base = String(source).split('@')[0].normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18).replace(/-+$/g, '');
  const code = base.length >= 3 ? base : `${base || 'love'}-wed`;
  return normalizeCode(code) || 'my-wedding-link';
}

export function commissionCents(amountCents) {
  const amount = Number(amountCents);
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * COMMISSION_RATE) : 0;
}

export function readRefCookie(cookieHeader = '') {
  for (const part of String(cookieHeader || '').split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === REF_COOKIE) {
      try { return normalizeCode(decodeURIComponent(rest.join('='))); } catch { return null; }
    }
  }
  return null;
}

export function isValidPayoutEmail(value) {
  return typeof value === 'string' && value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

// pending → still inside the refund window; payable → ready for the next payout.
export function referralState(referral, now = Date.now()) {
  if (referral.status !== 'pending') return referral.status;
  const age = now - new Date(referral.created_at).getTime();
  return age >= HOLD_DAYS * 86400000 ? 'payable' : 'pending';
}

export function summarizeReferrals(referrals = [], now = Date.now()) {
  const totals = { sales: 0, earnedCents: 0, pendingCents: 0, payableCents: 0, paidCents: 0, refundedCents: 0 };
  for (const referral of referrals) {
    const state = referralState(referral, now);
    const cents = Number(referral.commission_cents) || 0;
    if (state === 'refunded') { totals.refundedCents += cents; continue; }
    totals.sales += 1;
    totals.earnedCents += cents;
    if (state === 'pending') totals.pendingCents += cents;
    else if (state === 'payable') totals.payableCents += cents;
    else if (state === 'paid') totals.paidCents += cents;
  }
  return totals;
}

export function formatMoney(cents, locale = 'en', currency = 'usd') {
  const tag = locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US';
  return new Intl.NumberFormat(tag, { style: 'currency', currency: String(currency || 'usd').toUpperCase(), currencyDisplay: 'narrowSymbol' }).format((Number(cents) || 0) / 100);
}
