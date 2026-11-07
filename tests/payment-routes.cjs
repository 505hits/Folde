const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function route(name, { user = null, authError = null, metadata = {}, customerEmail = '' } = {}) {
  const calls = [];
  const checkout = { id: 'cs_mock', url: 'https://checkout.stripe.com/mock', payment_status: 'paid', customer_email: customerEmail, metadata, amount_total: 4990 };
  const context = {
    process: { env: {} }, console,
    Stripe: class { constructor() { this.checkout = { sessions: {
      create: async args => { calls.push(args); return checkout; },
      retrieve: async () => checkout,
    } }; } },
    NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) },
    createClient: () => ({ auth: { getUser: async () => ({ data: { user }, error: authError }) } }),
    persistPaidOrder: async () => ({ id: 'saved-order', slug: 'saved-wedding' }),
  };
  const source = fs.readFileSync(`${__dirname}/../src/app/api/${name}/route.js`, 'utf8')
    .replace(/^import .*;$/gm, '').replace('export async function POST', 'async function POST');
  vm.createContext(context);
  vm.runInContext(source + '\nthis.handler = POST;', context);
  return { calls, post: (body, token) => context.handler({ json: async () => body, headers: new Headers(token ? { authorization: `Bearer ${token}` } : {}) }) };
}

test('checkout rejects missing and invalid sessions', async () => {
  const r = route('create-checkout-session');
  assert.equal((await r.post({ plan: 'essential' })).status, 401);
  assert.equal((await r.post({ plan: 'essential' }, 'invalid')).status, 401);
  assert.equal(r.calls.length, 0);
});
test('checkout uses verified email and user ID, ignoring a supplied email', async () => {
  const r = route('create-checkout-session', { user: { id: 'buyer-id', email: 'buyer@example.org' } });
  assert.equal((await r.post({ plan: 'essential', email: 'other@example.org', name: 'Emma', partnerName: 'Lucas' }, 'valid')).status, 200);
  assert.equal(r.calls[0].customer_email, 'buyer@example.org');
  assert.equal(r.calls[0].metadata.userId, 'buyer-id');
});
test('payment verification rejects another account and allows the owner', async () => {
  const other = route('verify-session', { user: { id: 'other-id' }, metadata: { userId: 'buyer-id' } });
  assert.equal((await other.post({ sessionId: 'cs_mock' }, 'valid')).status, 403);
  const owner = route('verify-session', { user: { id: 'buyer-id' }, metadata: { userId: 'buyer-id' } });
  assert.equal((await owner.post({ sessionId: 'cs_mock' }, 'valid')).body.status, 'paid');
  assert.equal((await owner.post({ sessionId: 'cs_mock' })).status, 401);
});
test('saved template media resolve locally and custom uploads stay intact', async () => {
  const { resolveTemplateMedia } = await import('../src/lib/template-media.mjs');
  const url = resolveTemplateMedia('https://wedgo.co/prototype-assets/videos/rosas-intro.mp4#t=0.001');
  assert.equal(url, '/videos/bordeaux.mp4');
  assert.ok(fs.existsSync(__dirname + '/../public' + url));
  assert.equal(resolveTemplateMedia('https://example.org/custom.mp4'), 'https://example.org/custom.mp4');
});
