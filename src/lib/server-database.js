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

// Older dashboards stored uploaded images, videos and music as base64 data URLs
// inside the wedding details. Every read of the order then downloaded those
// files again (Supabase egress), and large ones made saves fail. These helpers
// move them to the public "media" bucket and keep only their address.
const INLINE_MEDIA = /^data:((?:image|video|audio)\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/;
const MEDIA_EXTENSIONS = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'image/heic': 'heic', 'image/heif': 'heif', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm',
  'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'aac',
  'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/ogg': 'ogg',
};

export function hasInlineMedia(value) {
  const text = JSON.stringify(value ?? null);
  return /"data:(?:image|video|audio)\//.test(text);
}

export async function extractInlineMedia(value, upload, cache = new Map()) {
  if (typeof value === 'string') {
    if (value.length < 512 || !value.startsWith('data:')) return value;
    const match = INLINE_MEDIA.exec(value);
    const extension = match && MEDIA_EXTENSIONS[match[1].toLowerCase()];
    if (!extension) return value;
    if (!cache.has(value)) cache.set(value, upload(Buffer.from(match[2], 'base64'), match[1].toLowerCase(), extension));
    return cache.get(value);
  }
  if (Array.isArray(value)) {
    const items = [];
    for (const item of value) items.push(await extractInlineMedia(item, upload, cache));
    return items;
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, item] of Object.entries(value)) result[key] = await extractInlineMedia(item, upload, cache);
    return result;
  }
  return value;
}

export function mediaUploader(db, orderId) {
  return async (bytes, contentType, extension) => {
    const path = `weddings/${orderId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await db.storage.from('media').upload(path, bytes, { contentType, upsert: false, cacheControl: '31536000' });
    if (error) throw new Error('Media upload failed');
    const { data } = db.storage.from('media').getPublicUrl(path);
    if (!data?.publicUrl) throw new Error('Media address unavailable');
    return data.publicUrl;
  };
}

// One-time, best-effort migration of a stored order. Returns the order to use.
export async function migrateInlineMedia(db, order) {
  if (!order?.id || !hasInlineMedia(order.details)) return order;
  try {
    const details = await extractInlineMedia(order.details, mediaUploader(db, order.id));
    const saved = await updateDetails(db, order, details);
    return saved || { ...order, details };
  } catch {
    console.warn('Inline media migration skipped for one wedding');
    return order;
  }
}
