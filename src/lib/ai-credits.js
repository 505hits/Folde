import { updateDetails } from '@/lib/server-database';

// AI generations cost real money at KIE. aiAccess() checks the plan; this module
// enforces the per-wedding allowance on the server (the browser count is only a hint).
export const AI_CREDIT_LIMIT = 5;
const AI_PLANS = ['premium', 'custom', 'expert'];

// Keys only the server may write; strip them from anything a browser sends.
export const SERVER_ONLY_KEYS = ['_aiCredits'];

const used = (order, kind) => Number(order?.details?._aiCredits?.[kind]) || 0;

async function change(db, order, kind, delta) {
  let current = order;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const count = used(current, kind);
    if (delta > 0 && count >= AI_CREDIT_LIMIT) {
      return { error: `You have reached the maximum of ${AI_CREDIT_LIMIT} AI creations.`, status: 403 };
    }
    const credits = { photo: 0, music: 0, ...(current.details?._aiCredits || {}), [kind]: Math.max(0, count + delta) };
    const saved = await updateDetails(db, current, { ...(current.details || {}), _aiCredits: credits });
    if (saved) return { order: saved, used: credits[kind] };
    const { data, error } = await db.from('orders').select('*').eq('id', current.id).maybeSingle();
    if (error || !data) return { error: 'Unable to load your wedding.', status: 503 };
    current = data;
  }
  return { error: 'Your wedding is busy saving. Please try again.', status: 409 };
}

// Reserves one credit on the signed-in customer's eligible wedding before calling KIE.
export async function reserveAiCredit(access, slug, kind) {
  const { data, error } = await access.db.from('orders').select('*')
    .eq('user_email', access.user.email).eq('paid', true);
  if (error) return { error: 'Unable to verify your plan.', status: 503 };
  const eligible = (data || []).filter(order => order.status !== 'Cancelled'
    && AI_PLANS.includes(String(order.plan || '').toLowerCase()));
  const order = eligible.find(item => item.slug === slug) || (eligible.length === 1 ? eligible[0] : null);
  if (!order) return { error: 'AI Studio requires an eligible plan.', status: 403 };
  const result = await change(access.db, order, kind, 1);
  return result.error ? result : { ...result, db: access.db };
}

// Gives the credit back when KIE refused the job.
export async function refundAiCredit(reservation, kind) {
  try { await change(reservation.db, reservation.order, kind, -1); }
  catch (error) { console.error('AI credit refund failed:', error?.message || 'database'); }
}
