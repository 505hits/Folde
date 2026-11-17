import { protectRequest } from './request-security';
import { authenticated } from './server-database';
import { createHmac, timingSafeEqual } from 'node:crypto';

export async function aiAccess(request) {
  if (!/^Bearer\s+\S+$/i.test(request.headers.get('authorization') || '')) {
    return { error: 'Please sign in.', status: 401 };
  }
  const access = await authenticated(request);
  if (access.error) return access;
  const { data, error } = await access.db.from('orders').select('plan,status')
    .eq('user_email', access.user.email).eq('paid', true);
  if (error) return { error: 'Unable to verify your plan.', status: 503 };
  if (!data?.some(order => order.status !== 'Cancelled' &&
    ['premium', 'custom', 'expert'].includes(String(order.plan).toLowerCase()))) {
    return { error: 'AI Studio requires an eligible plan.', status: 403 };
  }
  if (request.method === 'POST') {
    const blocked = await protectRequest(request, { limit: 10, maxBytes: 6 * 1024 * 1024, identity: access.user.id });
    if (blocked) return { error: (await blocked.json()).error, status: blocked.status };
  }
  return access;
}

function taskSignature(payload, userId, kind) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update(JSON.stringify([payload, userId, kind])).digest();
}

export function signTask(taskId, userId, kind) {
  const payload = Buffer.from(JSON.stringify({ id: taskId, expires: Date.now() + 3600000 })).toString('base64url');
  return payload + '.' + taskSignature(payload, userId, kind).toString('base64url');
}

export function readTask(value, userId, kind) {
  if (!value || value.length > 1024 || !/^[\w-]+\.[\w-]+$/.test(value)) return null;
  try {
    const [payload, signature] = value.split('.');
    const supplied = Buffer.from(signature, 'base64url');
    const expected = taskSignature(payload, userId, kind);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const { id, expires } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof id === 'string' && expires > Date.now() ? id : null;
  } catch {
    return null;
  }
}
