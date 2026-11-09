import { createClient } from '@supabase/supabase-js';

export function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Database is not configured');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function authenticated(request, db = database()) {
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return { error: 'Please sign in.', status: 401 };
  const { data, error } = await db.auth.getUser(token);
  if (error || !data?.user?.email || !data.user.email_confirmed_at) return { error: 'Please sign in again.', status: 401 };
  return { db, user: data.user };
}

export async function ownedOrder(request, slug, db = database()) {
  const access = await authenticated(request, db);
  if (access.error) return access;
  const { data: order, error } = await db.from('orders').select('*').eq('slug', slug).maybeSingle();
  if (error) return { error: 'Unable to load your wedding.', status: 503 };
  if (!order || String(order.user_email).toLowerCase() !== access.user.email.toLowerCase()) return { error: 'Wedding not found.', status: 404 };
  return { ...access, order };
}

// Compare a short revision token. Filtering on the full JSON creates oversized
// request URLs as soon as a wedding contains images or a published snapshot.
export async function updateDetails(db, order, details) {
  const previousTime = new Date(order.updated_at || 0).getTime();
  const updated_at = new Date(Math.max(Date.now(), (Number.isFinite(previousTime) ? previousTime : 0) + 1)).toISOString();
  let query = db.from('orders').update({ details, updated_at }).eq('id', order.id);
  query = order.updated_at == null ? query.is('updated_at', null) : query.eq('updated_at', order.updated_at);
  const { data, error } = await query.select('*').maybeSingle();
  if (error) { console.error('Wedding save failed:', error.code || 'database', error.message || 'Write refused'); throw new Error('Unable to save your wedding.'); }
  return data;
}
