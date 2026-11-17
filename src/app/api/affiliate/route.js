import { NextResponse } from 'next/server';
import { authenticated } from '@/lib/server-database';
import { protectRequest } from '@/lib/request-security';
import { isReservedCode, isValidPayoutEmail, normalizeCode } from '@/lib/affiliate.mjs';
import { sendAffiliateWelcomeEmail } from '@/lib/affiliate-email';

const PROFILE = 'id,code,name,channel,locale,payout_method,payout_email,status,clicks,sales_count,total_commission_cents,created_at';
const REFERRAL = 'id,amount_cents,commission_cents,currency,plan,status,created_at,paid_at';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function payoutFields(body) {
  const method = body.payoutMethod === 'wise' ? 'wise' : body.payoutMethod === 'paypal' ? 'paypal' : null;
  const email = clean(body.payoutEmail, 200).toLowerCase();
  if (!method) return { error: 'Choose PayPal or Wise for your payouts.' };
  if (!isValidPayoutEmail(email)) return { error: 'Enter the email address of your PayPal or Wise account.' };
  return { payout_method: method, payout_email: email };
}

export async function GET(request) {
  const access = await authenticated(request);
  if (access.error) return reply({ error: access.error }, access.status);
  const { data: affiliate, error } = await access.db.from('affiliates').select(PROFILE).eq('user_id', access.user.id).maybeSingle();
  if (error) return reply({ error: 'Unable to load your affiliate account.' }, 503);
  if (!affiliate) return reply({ affiliate: null, referrals: [] });
  const { data: referrals, error: referralError } = await access.db.from('affiliate_referrals').select(REFERRAL)
    .eq('affiliate_id', affiliate.id).order('created_at', { ascending: false }).limit(500);
  if (referralError) return reply({ error: 'Unable to load your sales.' }, 503);
  return reply({ affiliate, referrals: referrals || [] });
}

export async function POST(request) {
  const access = await authenticated(request);
  if (access.error) return reply({ error: access.error }, access.status);
  const blocked = await protectRequest(request, { limit: 5, maxBytes: 5000, identity: access.user.id });
  if (blocked) return blocked;
  const body = await request.json().catch(() => ({}));
  const code = normalizeCode(body.code);
  const name = clean(body.name, 80);
  const payout = payoutFields(body);
  if (!name) return reply({ error: 'Please enter your name.' }, 400);
  if (!code) return reply({ error: 'Your code needs 3 to 24 letters, numbers or dashes.' }, 400);
  if (isReservedCode(code)) return reply({ error: 'This code is not available. Please choose another one.' }, 409);
  if (payout.error) return reply({ error: payout.error }, 400);
  if (body.acceptTerms !== true) return reply({ error: 'Please accept the program rules.' }, 400);
  const locale = ['fr', 'es'].includes(body.locale) ? body.locale : 'en';
  const { data, error } = await access.db.from('affiliates').insert({
    user_id: access.user.id, email: access.user.email, name, code, channel: clean(body.channel, 200) || null, locale, ...payout,
  }).select(PROFILE).single();
  if (error?.code === '23505') {
    const mine = await access.db.from('affiliates').select(PROFILE).eq('user_id', access.user.id).maybeSingle();
    if (mine.data) return reply({ affiliate: mine.data, referrals: [] });
    return reply({ error: 'This code is already taken. Please choose another one.' }, 409);
  }
  if (error || !data) return reply({ error: 'Unable to create your affiliate account. Please try again.' }, 503);
  await sendAffiliateWelcomeEmail(access.user.email, { locale, code });
  return reply({ affiliate: data, referrals: [] }, 201);
}

export async function PATCH(request) {
  const access = await authenticated(request);
  if (access.error) return reply({ error: access.error }, access.status);
  const blocked = await protectRequest(request, { limit: 10, maxBytes: 5000, identity: access.user.id });
  if (blocked) return blocked;
  const body = await request.json().catch(() => ({}));
  const payout = payoutFields(body);
  if (payout.error) return reply({ error: payout.error }, 400);
  const name = clean(body.name, 80);
  const { data, error } = await access.db.from('affiliates')
    .update({ ...payout, ...(name ? { name } : {}), channel: clean(body.channel, 200) || null, updated_at: new Date().toISOString() })
    .eq('user_id', access.user.id).select(PROFILE).maybeSingle();
  if (error) return reply({ error: 'Unable to save your details.' }, 503);
  if (!data) return reply({ error: 'Join the program first.' }, 404);
  return reply({ affiliate: data });
}
