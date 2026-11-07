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

// Compare the full JSON document so concurrent edits cannot overwrite other fields.
export async function updateDetails(db, order, details) {
  let query = db.from('orders').update({ details }).eq('id', order.id);
  query = order.details == null ? query.is('details', null) : query.eq('details', JSON.stringify(order.details));
  const { data, error } = await query.select('*').maybeSingle();
  if (error) throw new Error('Unable to save your wedding.');
  return data;
}
