import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { HOLD_DAYS } from '@/lib/affiliate.mjs';

// Same access rule as the orders studio: a signed-in email listed in ADMIN_EMAILS.
async function adminDatabase(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const allowed = String(process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
  if (!url || !anonKey || !serviceKey || !allowed.length) return { error: 'Admin access is not configured.', status: 503 };
  if (!token) return { error: 'Please sign in to access the studio.', status: 401 };
  const auth = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: { user }, error } = await auth.auth.getUser(token);
  if (error || !user || !allowed.includes(String(user.email || '').toLowerCase())) return { error: 'You are not authorized to access the studio.', status: 403 };
  return { db: createClient(url, serviceKey, { auth: { persistSession: false } }) };
}

const cutoff = () => new Date(Date.now() - HOLD_DAYS * 86400000).toISOString();

export async function GET(request) {
  const access = await adminDatabase(request);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
  const [affiliates, pending, payouts] = await Promise.all([
    access.db.from('affiliates').select('id,code,name,email,channel,payout_method,payout_email,status,clicks,sales_count,total_commission_cents,created_at').order('created_at', { ascending: false }),
    access.db.from('affiliate_referrals').select('affiliate_id,commission_cents,created_at').eq('status', 'pending'),
    access.db.from('affiliate_payouts').select('id,affiliate_id,amount_cents,method,payout_email,referral_count,created_at').order('created_at', { ascending: false }).limit(50),
  ]);
  if (affiliates.error || pending.error || payouts.error) return NextResponse.json({ error: 'We could not load the affiliates. Did you run supabase_affiliates_setup.sql?' }, { status: 502 });
  const limit = cutoff();
  const owed = {};
  for (const row of pending.data || []) {
    const entry = owed[row.affiliate_id] ||= { payableCents: 0, holdCents: 0 };
    if (row.created_at <= limit) entry.payableCents += row.commission_cents; else entry.holdCents += row.commission_cents;
  }
  return NextResponse.json({
    cutoff: limit,
    affiliates: (affiliates.data || []).map(item => ({ ...item, ...(owed[item.id] || { payableCents: 0, holdCents: 0 }) })),
    payouts: payouts.data || [],
  });
}

// Records that the administrator has sent the money (PayPal or Wise). It never sends money.
export async function POST(request) {
  const access = await adminDatabase(request);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
  const { affiliateId, action, status, note } = await request.json().catch(() => ({}));
  if (!/^[0-9a-f-]{36}$/i.test(affiliateId || '')) return NextResponse.json({ error: 'An affiliate is required.' }, { status: 400 });
  if (action === 'mark-paid') {
    const { data, error } = await access.db.rpc('mark_affiliate_paid', { p_affiliate_id: affiliateId, p_cutoff: cutoff(), p_note: typeof note === 'string' ? note.slice(0, 200) : null });
    if (error) return NextResponse.json({ error: 'The payout could not be recorded.' }, { status: 502 });
    return NextResponse.json({ payout: data });
  }
  if (action === 'status' && ['active', 'paused'].includes(status)) {
    const { error } = await access.db.from('affiliates').update({ status, updated_at: new Date().toISOString() }).eq('id', affiliateId);
    if (error) return NextResponse.json({ error: 'The status could not be updated.' }, { status: 502 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}
