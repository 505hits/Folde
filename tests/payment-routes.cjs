const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function route(name, { user = null, authError = null, metadata = {}, customerEmail = '' } = {}) {
  const calls = [];
  const checkout = { id: 'cs_mock', url: 'https://checkout.stripe.com/mock', client_secret: 'cs_mock_secret', payment_status: 'paid', customer_email: customerEmail, metadata, amount_total: 4990 };
  const context = {
    protectRequest: async () => null,
    process: { env: {} }, console, URL,
    Stripe: class { constructor() { this.checkout = { sessions: {
      create: async args => { calls.push(args); return checkout; },
      retrieve: async () => checkout,
    } }; } },
    NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) },
    createClient: () => ({ auth: { getUser: async () => ({ data: { user }, error: authError }) } }),
    persistPaidOrder: async () => ({ id: 'saved-order', slug: 'saved-wedding' }),
    readRefCookie: header => /(?:^|;\s*)folde_ref=([a-z0-9-]{3,24})(?:;|$)/.exec(header || '')?.[1] || null,
  };
  const source = fs.readFileSync(`${__dirname}/../src/app/api/${name}/route.js`, 'utf8')
    .replace(/^import .*;$/gm, '').replace('export async function POST', 'async function POST');
  vm.createContext(context);
  vm.runInContext(source + '\nthis.handler = POST;', context);
  return { calls, post: (body, token, headers = {}) => context.handler({ json: async () => body, headers: new Headers({ ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) }) }) };
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
test('checkout rejects an inherited plan name and keeps payment redirects on Folde', async () => {
  const r = route('create-checkout-session', { user: { id: 'buyer-id', email: 'buyer@example.org' } });
  assert.equal((await r.post({ plan: 'constructor' }, 'valid')).status, 400);
  assert.equal((await r.post({ plan: 'essential' }, 'valid', { origin: 'https://external.example' })).status, 200);
  assert.equal(new URL(r.calls[0].success_url).origin, 'https://folde-wedding.com');
  assert.equal(new URL(r.calls[0].cancel_url).origin, 'https://folde-wedding.com');
});
test('checkout passes the affiliate cookie into the Stripe metadata', async () => {
  const r = route('create-checkout-session', { user: { id: 'buyer-id', email: 'buyer@example.org' } });
  await r.post({ plan: 'Custom' }, 'valid', { cookie: 'other=1; folde_ref=anna-weds' });
  assert.equal(r.calls[0].metadata.affiliate, 'anna-weds');
  await r.post({ plan: 'Custom' }, 'valid');
  assert.equal('affiliate' in r.calls[1].metadata, false);
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

test('embedded checkout returns a client secret, preserves ownership and uses stable pricing', async () => {
  const r = route('create-checkout-session', { user: { id: 'buyer-id', email: 'buyer@example.org' } });
  const result = await r.post({ plan: 'essential', embedded: true, offerExpires: 0 }, 'valid');
  assert.equal(result.status, 200);
  assert.equal(result.body.clientSecret, 'cs_mock_secret');
  assert.equal(result.body.sessionId, 'cs_mock');
  assert.equal(r.calls[0].ui_mode, 'embedded_page');
  assert.equal(r.calls[0].redirect_on_completion, 'always');
  assert.ok(r.calls[0].return_url.includes('{CHECKOUT_SESSION_ID}'));
  assert.equal(r.calls[0].metadata.userId, 'buyer-id');
  assert.equal(r.calls[0].line_items[0].price_data.unit_amount, 2990);
  assert.equal(r.calls[0].line_items[0].price_data.currency, 'usd');
  assert.equal(r.calls[0].success_url, undefined);
});

test('hosted checkout remains available as a fallback', async () => {
  const r = route('create-checkout-session', { user: { id: 'buyer-id', email: 'buyer@example.org' } });
  const result = await r.post({ plan: 'essential' }, 'valid');
  assert.equal(result.body.url, 'https://checkout.stripe.com/mock');
  assert.equal(r.calls[0].ui_mode, undefined);
  assert.ok(r.calls[0].success_url.includes('{CHECKOUT_SESSION_ID}'));
});
