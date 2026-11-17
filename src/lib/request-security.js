import { checkBotId } from 'botid/server';
import { isIP } from 'node:net';

// Supplemental per-instance throttling. BotID verifies browser challenges across
// instances. Platform firewall limits should also be used for volumetric attacks.
const buckets = new Map();
const MAX_BUCKETS = 10000;

export function rateLimit(key, limit, windowMs = 60000, now = Date.now()) {
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.expires) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [entry, value] of buckets) {
        if (value.expires <= now) buckets.delete(entry);
      }
      if (buckets.size >= MAX_BUCKETS) buckets.delete(buckets.keys().next().value);
    }
    bucket = { count: 0, expires: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count > limit ? Math.max(1, Math.ceil((bucket.expires - now) / 1000)) : 0;
}

export async function protectRequest(request, { limit = 60, maxBytes = 1024 * 1024, identity } = {}) {
  const reject = (error, status, headers = {}) => Response.json(
    { success: false, error }, { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(request.url).origin)) {
    return reject('Please submit this request from the invitation website.', 403);
  }
  if (Number(request.headers.get('content-length')) > maxBytes) {
    return reject('This request is too large. Please use a smaller file.', 413);
  }
  const address = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() : '';
  const client = identity || (isIP(address || '') ? address : 'unknown');
  const retryAfter = rateLimit(`${new URL(request.url).pathname}:${client}`, limit);
  if (retryAfter) return reject('Too many requests. Please wait a minute and try again.', 429, { 'Retry-After': String(retryAfter) });
  try {
    const verification = await checkBotId({ advancedOptions: { checkLevel: 'basic' } });
    if (verification.isBot) return reject('Browser verification failed. Please refresh the page and try again.', 403);
  } catch {
    return reject('Browser verification is temporarily unavailable. Please try again.', 503);
  }
  return null;
}
