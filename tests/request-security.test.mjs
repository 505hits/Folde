import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { matchesImageType } from '../src/lib/image-file.mjs';

const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const source = await readFile(new URL('../src/lib/request-security.js', import.meta.url), 'utf8');
const security = await import(moduleUrl(source.replace("'botid/server'", JSON.stringify(moduleUrl(`
  export async function checkBotId(options) {
    if (options.advancedOptions.checkLevel !== 'basic') throw new Error('Unexpected paid check');
    if (globalThis.__botFailure) throw new Error('Unavailable');
    return {isBot: !!globalThis.__isBot};
  }
`)))));
const request = headers => new Request('https://folde-wedding.com/api/rsvp', { method: 'POST', headers });

test('cross-site submissions and oversized bodies are rejected before bot verification', async () => {
  assert.equal((await security.protectRequest(request({ origin: 'https://external.example' }))).status, 403);
  assert.equal((await security.protectRequest(request({ 'sec-fetch-site': 'cross-site' }))).status, 403);
  assert.equal((await security.protectRequest(request({ 'content-length': '20000' }), { maxBytes: 1000 })).status, 413);
});

test('bot submissions and unavailable verification cannot pass as successful submissions', async () => {
  globalThis.__isBot = true;
  assert.equal((await security.protectRequest(request())).status, 403);
  globalThis.__isBot = false;
  globalThis.__botFailure = true;
  assert.equal((await security.protectRequest(request())).status, 503);
  globalThis.__botFailure = false;
  assert.equal(await security.protectRequest(request({ origin: 'https://folde-wedding.com' })), null);
});

test('throttling isolates clients and resets after the fixed window', async () => {
  assert.equal(security.rateLimit('client-a', 1, 60000, 1000), 0);
  assert.equal(security.rateLimit('client-a', 1, 60000, 2000), 59);
  assert.equal(security.rateLimit('client-b', 1, 60000, 2000), 0);
  assert.equal(security.rateLimit('client-a', 1, 60000, 61000), 0);
  await security.protectRequest(request(), { identity: 'limited-user', limit: 1 });
  const blocked = await security.protectRequest(request(), { identity: 'limited-user', limit: 1 });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('Retry-After')) > 0);
});

test('a forged image MIME type cannot upload HTML or scripts as an image', () => {
  const html = Buffer.from('<html><script>alert(1)</script></html>');
  for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']) {
    assert.equal(matchesImageType(html, type), false);
  }
  assert.equal(matchesImageType(Buffer.from([255,216,255,224]), 'image/jpeg'), true);
  assert.equal(matchesImageType(Buffer.from('RIFFxxxxWEBP'), 'image/webp'), true);
  assert.equal(matchesImageType(Buffer.from('GIF89a'), 'image/gif'), true);
});

test('AI tasks are bound to their owner, generation type and expiry', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-task-signing-only';
  const aiSource = (await readFile(new URL('../src/lib/ai-access.js', import.meta.url), 'utf8'))
    .replace("'./request-security'", JSON.stringify(moduleUrl('export const protectRequest = async () => null;')))
    .replace("'./server-database'", JSON.stringify(moduleUrl('export const authenticated = async () => ({error:"Unauthorized",status:401});')));
  const ai = await import(moduleUrl(aiSource));
  const token = ai.signTask('provider-task', 'owner', 'photo');
  assert.equal(ai.readTask(token, 'owner', 'photo'), 'provider-task');
  assert.equal(ai.readTask(token, 'another-owner', 'photo'), null);
  assert.equal(ai.readTask(token, 'owner', 'music'), null);
  assert.equal(ai.readTask(token + 'x', 'owner', 'photo'), null);
  const originalNow = Date.now;
  try {
    Date.now = () => originalNow() + 3600001;
    assert.equal(ai.readTask(token, 'owner', 'photo'), null);
  } finally {
    Date.now = originalNow;
  }
  const denied = await ai.aiAccess(new Request('https://folde-wedding.com/api/ai-photo', {
    method: 'POST', headers: { 'x-folde-ai-reference': '1' },
  }));
  assert.equal(denied.status, 401);
});
