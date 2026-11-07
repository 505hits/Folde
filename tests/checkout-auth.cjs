// Local regression only: provider requests are mocked, no emails or charges.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
const buyer = { id: '11111111-1111-4111-8111-111111111111', email: 'buyer@example.org', user_metadata: { name: 'Emma', partner_name: 'Lucas' }, aud: 'authenticated', role: 'authenticated' };
const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: buyer.id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.signature`;
const session = { access_token: token, refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer', user: buyer };

async function setup(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const state = { authMode: 'invalid', signupMode: 'confirm', previewOk: true, authCalls: [], previews: [], payments: [] };
  await context.route('https://local-test.supabase.co/**', async route => {
    const url = route.request().url();
    if (url.includes('/auth/v1/signup')) {
      state.authCalls.push(route.request().postDataJSON());
      return route.fulfill({ json: state.signupMode === 'valid' ? session : { ...buyer, identities: [] } });
    }
    if (url.includes('/auth/v1/token')) {
      state.authCalls.push(route.request().postDataJSON());
      return state.authMode === 'valid'
        ? route.fulfill({ json: session })
        : route.fulfill({ status: 400, json: { error: 'invalid_grant', error_description: 'Invalid login credentials' } });
    }
    if (url.includes('/auth/v1/user')) return route.fulfill({ json: buyer });
    return route.fulfill({ json: [] });
  });
  await context.route('**/api/send-preview', route => {
    state.previews.push(route.request().postDataJSON());
    return route.fulfill({ status: state.previewOk ? 200 : 500, json: { saved: state.previewOk, delivered: state.previewOk } });
  });
  await context.route('**/api/create-checkout-session', route => {
    state.payments.push({ body: route.request().postDataJSON(), authorization: route.request().headers().authorization });
    return route.fulfill({ json: { url: 'https://checkout.stripe.com/c/pay/cs_test_mock' } });
  });
  await context.route('https://checkout.stripe.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Mock Stripe payment interface</h1>' }));
  const page = await context.newPage();
  page.on('pageerror', e => console.error('Browser error:', e.message));
  return { context, page, state };
}

async function saveMobilePreview(page) {
  await page.goto(base + '/checkout?partner1=Emma&partner2=Lucas');
  await page.getByRole('button', { name: /We’re still deciding/ }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByRole('heading', { name: 'Choose the opening moment' }).waitFor();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByRole('heading', { name: 'Choose your invitation cover' }).waitFor();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByText('Your preview is ready', { exact: true }).waitFor();
  await page.getByLabel('Email', { exact: true }).fill(buyer.email);
  await page.getByRole('button', { name: /Save my preview/ }).click();
}

async function assertDirectPayment(page, state) {
  await page.waitForURL(base + '/packages');
  assert.equal(await page.locator('input[type="password"]').count(), 0, 'No password form on packages');
  const authCount = state.authCalls.length;
  await page.getByRole('button', { name: /Choose Standard/ }).click();
  await page.waitForURL('https://checkout.stripe.com/**');
  await page.getByRole('heading', { name: 'Mock Stripe payment interface' }).waitFor();
  assert.equal(state.authCalls.length, authCount, 'Pay must not trigger another login');
  assert.equal(state.payments.at(-1).authorization, `Bearer ${token}`);
  assert.equal(state.payments.at(-1).body.email, buyer.email);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const { context, page, state } = await setup(browser);
    await page.addInitScript(() => localStorage.setItem('currentUser', JSON.stringify({ email: 'stale@example.org', password: 'obsolete' })));
    await saveMobilePreview(page);
    await page.getByRole('heading', { name: 'Your preview is saved' }).waitFor();
    assert.equal(state.previews.length, 1);
    assert.equal(state.payments.length, 0);
    assert.equal(await page.getByRole('textbox', { name: 'Email', exact: true }).getAttribute('readonly'), '');
    assert.equal(await page.getByRole('textbox', { name: 'Email', exact: true }).inputValue(), buyer.email);
    await page.getByLabel('Password', { exact: false }).fill('secure-test-password');
    await page.getByRole('button', { name: 'Create my account & see packages' }).click();
    await page.getByText(/Confirm your email using/).waitFor();
    assert.ok(page.url().includes('/checkout'), 'Unconfirmed signup stays before packages');
    await page.getByLabel('Password', { exact: false }).fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in & see packages' }).click();
    await page.getByText('Invalid login credentials', { exact: true }).waitFor();
    state.authMode = 'valid';
    await page.getByLabel('Password', { exact: false }).fill('secure-test-password');
    await page.getByRole('button', { name: 'Sign in & see packages' }).click();
    await page.waitForURL(base + '/packages');
    await page.reload();
    await assertDirectPayment(page, state);
    console.log('PASS mobile preview -> prefilled email/password -> confirmed login -> packages -> direct Stripe, including reload');
    const pending = await context.newPage();
    await pending.goto(base + '/packages');
    assert.ok(!Object.hasOwn(JSON.parse(await pending.evaluate(() => localStorage.getItem('pendingOrder'))), 'password'));
    await context.close();

    const fresh = await setup(browser);
    fresh.state.signupMode = 'valid';
    await saveMobilePreview(fresh.page);
    await fresh.page.getByRole('heading', { name: 'Your preview is saved' }).waitFor();
    await fresh.page.getByLabel('Password', { exact: false }).fill('new-secure-password');
    await fresh.page.getByRole('button', { name: 'Create my account & see packages' }).click();
    await assertDirectPayment(fresh.page, fresh.state);
    console.log('PASS new account is connected before packages; Pay immediately redirects to Stripe');
    await fresh.context.close();

    const recovery = await setup(browser);
    await recovery.page.addInitScript(draft => localStorage.setItem('checkoutPreviewDraft', JSON.stringify(draft)), state.previews[0].draft);
    await recovery.page.goto(base + '/packages');
    await recovery.page.getByRole('button', { name: /Choose Standard/ }).click();
    await recovery.page.waitForURL(base + '/checkout?account=1');
    await recovery.page.getByRole('heading', { name: 'Your preview is saved' }).waitFor();
    assert.equal(await recovery.page.getByRole('textbox', { name: 'Email', exact: true }).inputValue(), buyer.email);
    assert.equal(recovery.state.payments.length, 0);
    console.log('PASS expired session returns to the earlier account step with the saved email, without a payment-page login popup');
    await recovery.context.close();

    const failed = await setup(browser);
    failed.state.previewOk = false;
    await saveMobilePreview(failed.page);
    await failed.page.getByRole('alert').waitFor();
    assert.equal(failed.state.authCalls.length, 0, 'No account creation after failed preview save');
    assert.equal(failed.state.payments.length, 0);
    console.log('PASS failed preview save blocks account/payment progression');
    await failed.context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
