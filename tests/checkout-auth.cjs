// Run against a local server configured with NEXT_PUBLIC_SUPABASE_URL=https://local-test.supabase.co.
// All authentication and payment calls in the browser are mocked; no emails or payments are sent.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', error => console.error('Browser error:', error.message));
    let authMode = 'invalid', payments = [];
    const user = { id: '11111111-1111-4111-8111-111111111111', email: 'buyer@example.org', user_metadata: { name: 'Emma', partner_name: 'Lucas' }, aud: 'authenticated', role: 'authenticated' };
    const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now()/1000)+3600 })).toString('base64url')}.signature`;
    await context.route('https://local-test.supabase.co/**', async route => {
      const url = route.request().url();
      if (url.includes('/auth/v1/signup')) return route.fulfill({ json: { ...user, identities: [] } });
      if (url.includes('/auth/v1/token')) {
        if (authMode === 'invalid') return route.fulfill({ status: 400, json: { error: 'invalid_grant', error_description: 'Invalid login credentials' } });
        return route.fulfill({ json: { access_token: token, refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer', user } });
      }
      if (url.includes('/auth/v1/user')) return route.fulfill({ json: user });
      return route.fulfill({ json: [] });
    });
    await context.route('**/api/create-checkout-session', route => {
      payments.push({ body: route.request().postDataJSON(), authorization: route.request().headers().authorization });
      return route.fulfill({ status: 500, json: { error: 'Mock payment stopped before charging' } });
    });
    await page.addInitScript(() => localStorage.setItem('currentUser', JSON.stringify({ email: 'stale@example.org', password: 'obsolete' })));
    await page.goto(base + '/packages');
    const buy = page.getByRole('button', { name: /Choose Standard/ });
    await buy.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.equal(payments.length, 0, 'A stale local profile must not bypass sign-in');
    await dialog.getByLabel('Email', { exact: true }).fill(user.email);
    await dialog.getByLabel(/Password/).fill('wrong-password');
    await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.getByText('Invalid login credentials', { exact: true }).waitFor();
    assert.equal(payments.length, 0, 'Invalid credentials must not open payment');
    await dialog.getByRole('button', { name: 'Create an account', exact: true }).click();
    await dialog.getByRole('button', { name: 'Create an account', exact: true }).click();
    await page.getByText(/Confirm your email using/).waitFor();
    assert.equal(payments.length, 0, 'An unconfirmed signup must not open payment');
    authMode = 'valid';
    await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
    await dialog.waitFor({ state: 'detached' });
    await buy.click();
    await page.getByText('Mock payment stopped before charging', { exact: true }).waitFor();
    assert.equal(payments.length, 1);
    assert.equal(payments[0].authorization, `Bearer ${token}`);
    assert.equal(payments[0].body.email, user.email);
    assert.ok(!localStoragePassword(await page.evaluate(() => localStorage.getItem('pendingOrder'))));
    console.log('PASS stale session, bad password, confirmation required, valid login, authenticated checkout, no stored password');
    await page.reload();
    await buy.click();
    await page.getByText('Mock payment stopped before charging', { exact: true }).waitFor();
    assert.equal(payments.length, 2, 'The genuine Supabase session survives a page reload');
    console.log('PASS session restored after reload');

    await context.route('**/api/verify-session', route => route.fulfill({ json: {
      status: 'paid', customerEmail: user.email, amountTotal: 4990,
      metadata: { email: user.email, name: 'Emma', partnerName: 'Lucas', theme: 'rosas', plan: 'essential' },
    } }));
    await page.goto(base + '/success?session_id=cs_mock');
    await page.getByRole('heading', { name: 'Payment Validated!', exact: true }).waitFor();
    await page.getByRole('link', { name: 'ACCESS MY DASHBOARD' }).click();
    await page.getByRole('button', { name: /Log Out/ }).waitFor();
    assert.equal(await page.getByRole('heading', { name: 'No active order', exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('currentUser')).email), user.email);
    console.log('PASS paid return keeps the authenticated account through dashboard access');

    await page.goto(base + '/collections');
    for (const name of ['Rosas', 'Atelier Indigo', 'Orange', 'Editorial', 'Excellence']) {
      const card = page.locator('.tpl-card').filter({ has: page.getByText(name, { exact: true }) });
      assert.equal(await card.count(), 1);
      const media = card.locator('.tpl-phone video, .tpl-phone img').first();
      await media.waitFor();
      const src = await media.getAttribute('src');
      assert.ok(src && !src.includes('wedgo.co'), `${name}: self-hosted media`);
      const response = await context.request.get(base + src);
      assert.ok(response.ok(), `${name}: media returns 200`);
      await page.waitForFunction(name => {
        const card = [...document.querySelectorAll('.tpl-card')].find(c => [...c.querySelectorAll('span')].some(s => s.textContent === name));
        const m = card?.querySelector('.tpl-phone video, .tpl-phone img');
        return m?.tagName === 'VIDEO' ? m.readyState >= 2 : m?.naturalWidth > 0;
      }, name);
    }
    console.log('PASS five template previews load real image/video data');
    await page.goto(base + '/success');
    await page.getByRole('heading', { name: 'Payment Issue', exact: true }).waitFor();
    console.log('PASS direct success page cannot claim payment validation');
    const api = await context.request.post(base + '/api/create-checkout-session', { data: { plan: 'essential' } });
    assert.equal(api.status(), 401);
    console.log('PASS server rejects checkout without authentication');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

function localStoragePassword(raw) { return raw && Object.hasOwn(JSON.parse(raw), 'password'); }
