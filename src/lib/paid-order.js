import { createHash } from 'node:crypto';
import { database } from '@/lib/server-database';

export async function persistPaidOrder(session, user, preview = {}) {
  if (session.payment_status !== 'paid') throw new Error('Payment is not complete.');
  const db = database();
  // The production schema uses UUID primary keys and requires an auth user_id.
  const identity = createHash('sha256').update(`folde:stripe:${session.id}`).digest();
  identity[6] = (identity[6] & 15) | 80;
  identity[8] = (identity[8] & 63) | 128;
  const hex = identity.toString('hex').slice(0, 32);
  const id = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  const existing = await db.from('orders').select('*').eq('id', id).maybeSingle();
  if (existing.error) throw new Error('Unable to load the order.');
  if (existing.data) {
    if (existing.data.user_email?.toLowerCase() !== user.email?.toLowerCase()) throw new Error('Order owner mismatch.');
    return existing.data;
  }
  const metadata = session.metadata || {};
  const name = metadata.name || 'Partner', partnerName = metadata.partnerName || 'Partner';
  const plan = { essential: 'Essential', standard: 'Standard', premium: 'Premium', custom: 'Custom', expert: 'Custom' }[String(metadata.plan || 'Standard').toLowerCase()];
  if (!plan) throw new Error('Unknown wedding plan.');
  const standard = ['standard', 'essential'].includes(plan.toLowerCase());
  const suffix = createHash('sha256').update(session.id).digest('hex').slice(0, 16);
  const base = `${name}-et-${partnerName}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 120);
  const safePreview = preview && typeof preview === 'object' && !Array.isArray(preview) && JSON.stringify(preview).length < 500000 ? { ...preview } : {};
  delete safePreview._seatingPlan; delete safePreview.publishedData;
  const details = { ...safePreview, dashboardLocale: ['fr','es'].includes(metadata.locale) ? metadata.locale : 'en', language: safePreview.language || (['fr','es'].includes(metadata.locale) ? metadata.locale : 'en'), partner1: name, partner2: partnerName, themeId: metadata.theme || 'bordeaux' };
  const values = { id, user_id: user.id, user_email: user.email, couple: `${name} et ${partnerName}`, slug: `${base}-${suffix}`, plan, price: session.amount_total / 100, status: standard ? 'Live' : 'Awaiting Details', paid: true, date: new Date().toISOString().slice(0, 10), theme: metadata.theme || 'bordeaux', details };
  const saved = await db.from('orders').insert(values).select('*').single();
  if (saved.error?.code === '23505') {
    const retry = await db.from('orders').select('*').eq('id', id).single();
    if (!retry.error && retry.data?.user_email?.toLowerCase() === user.email?.toLowerCase()) return retry.data;
  }
  if (saved.error || !saved.data) throw new Error('Your payment is confirmed, but the order could not be saved. Please retry.');
  return saved.data;
}
