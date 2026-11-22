// Browser checks use mocked providers: no real email or charge.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
const user = { id: '11111111-1111-4111-8111-111111111111', email: 'buyer@example.org', user_metadata: {}, aud: 'authenticated', role: 'authenticated' };
const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now()/1000)+3600 })).toString('base64url')}.signature`;
(async () => {
 const browser = await chromium.launch({headless:true});
 try {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  // The production BotID challenge is served by Vercel, absent on localhost.
  // Only this browser fixture is mocked; API providers are mocked below too.
  await context.route('**/a-4-a/c.js?**',r=>r.fulfill({contentType:'application/javascript',body:'(window.V_C=window.V_C||[]).push({b:1});'}));
  const page = await context.newPage();
  const errors = []; page.on('pageerror',e=>errors.push(e.message));
  const otp = [], payments = [];
  await context.route('https://local-test.supabase.co/**',route=>{
    if(route.request().url().includes('/auth/v1/otp')) { otp.push({url:route.request().url(),body:route.request().postDataJSON()}); return route.fulfill({json:{}}); }
    if(route.request().url().includes('/auth/v1/user')) return route.fulfill({json:user});
    return route.fulfill({json:[]});
  });
  await context.route('**/api/wedding',r=>r.fulfill({json:{orders:[]}}));
  await context.route('**/api/send-preview',r=>r.fulfill({json:{saved:true,delivered:false}}));
  await context.route('**/api/create-checkout-session',r=>{
    payments.push({body:r.request().postDataJSON(),authorization:r.request().headers().authorization});
    return r.fulfill({status:500,json:{error:'Mock payment stopped before charging'}});
  });
  await page.goto(base+'/checkout?partner1=Emma&partner2=Lucas');
  await page.locator('input[type=date]').fill('2027-06-12');
  for(let i=0;i<3;i++)await page.getByRole('button',{name:/Continue/}).click();
  await page.getByLabel('Ceremony venue').fill('Château des Fleurs');
  await page.getByLabel('Ceremony time').fill('15:30');
  await page.getByLabel('RSVP deadline').fill('2027-05-01');
  await page.getByRole('button',{name:/Continue/}).click();
  await page.getByPlaceholder('you@example.com').fill(user.email);
  await page.getByRole('button',{name:'Continue with Google'}).waitFor();
  assert.equal(await page.locator('input[type=password]').count(),0);
  assert.equal(payments.length,0);
  await page.getByRole('button',{name:'Email me a sign-in link'}).click();
  await page.getByText(/Check your inbox/).waitFor();
  assert.equal(otp.length,1);assert.equal(otp[0].body.email,user.email);
  const returnUrl=new URL(otp[0].url).searchParams.get('redirect_to');
  assert.ok(returnUrl.includes('/checkout?resume='));
  const resumed=JSON.parse(Buffer.from(new URL(returnUrl).searchParams.get('resume'),'base64url').toString());
  assert.equal(resumed.invitationDetails.time,'15:30');
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('checkoutPreviewDraft')));
  assert.equal(draft.previewData.ceremonyVenue,'Château des Fleurs');
  assert.equal(draft.previewData.time,'15:30');assert.equal(draft.previewData.rsvpDeadline,'2027-05-01');
  console.log('PASS mobile personalisation, passwordless auth, draft saved before redirect, no unauthenticated checkout');
  // Magic links commonly open in another tab: sessionStorage is deliberately absent.
  const returned=await context.newPage();
  returned.on('console',m=>{if(m.type()==='error')console.log('Return page:',m.text().slice(0,250));});
  await returned.goto(returnUrl+'#access_token='+token+'&refresh_token=test-refresh&expires_in=3600&token_type=bearer&type=magiclink',{waitUntil:'domcontentloaded'});
  try { await returned.waitForURL('**/packages',{waitUntil:'domcontentloaded',timeout:15000}); }
  catch(e) { console.log('Return URL:',returned.url(),(await returned.locator('body').innerText()).slice(0,1800)); throw e; }
  await returned.waitForFunction(()=>JSON.parse(localStorage.getItem('currentUser')||'null')?.email==='buyer@example.org');
  await returned.waitForFunction(()=>!!localStorage.getItem('sb-local-test-auth-token'));
  await returned.getByRole('button',{name:/Choose Standard/}).click();
  await returned.getByRole('dialog').getByText('Mock payment stopped before charging',{exact:true}).waitFor();
  assert.equal(payments.length,1); assert.equal(payments[0].authorization,'Bearer '+token);
  assert.equal(payments[0].body.embedded,true);
  const pending=await returned.evaluate(()=>JSON.parse(localStorage.getItem('pendingOrder')));
  assert.equal(pending.previewData.ceremonyVenue,'Château des Fleurs');assert.equal(pending.previewData.time,'15:30');assert.equal(pending.price,29.9);
  assert.equal(await returned.getByRole('dialog').getByRole('button',{name:/Continue on Stripe/}).count(),1);
  await Promise.all([
    returned.waitForResponse(r=>r.url().includes('/api/create-checkout-session')),
    returned.getByRole('dialog').getByRole('button',{name:/Continue on Stripe/}).click(),
  ]);
  assert.equal(payments.length,2);assert.equal(payments[1].body.embedded,false);
  await returned.keyboard.press('Escape');
  await returned.getByRole('dialog').waitFor({state:'detached'});
  assert.equal(await returned.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await returned.reload({waitUntil:'domcontentloaded'});
  await returned.getByRole('button',{name:/Choose Standard/}).waitFor();
  await returned.screenshot({path:process.env.SCREENSHOT_PATH || '../../outputs/folde-mobile-preview.png',fullPage:true,style:'nextjs-portal{display:none}'});
  const phoneWidth=await returned.locator('[class*="finalPhone"]').evaluate(e=>e.getBoundingClientRect().width);
  assert.ok(phoneWidth>=270,`Prominent mobile preview (${phoneWidth}px)`);
  await returned.setViewportSize({width:1440,height:1000});
  await returned.reload({waitUntil:'domcontentloaded'});
  assert.equal(await returned.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await returned.screenshot({path:'../../outputs/folde-desktop-preview.png',fullPage:true,style:'nextjs-portal{display:none}'});
  // Check Google uses the current locale and returns to the offer page.
  const googleContext=await browser.newContext();
  await googleContext.addInitScript(()=>localStorage.setItem('currentUser','stale-test-profile'));
  let googleUrl='';
  await googleContext.route('https://local-test.supabase.co/auth/v1/authorize**',r=>{googleUrl=r.request().url();return r.fulfill({contentType:'text/html',body:'Simulated Google sign-in'});});
  const googlePage=await googleContext.newPage();
  await googlePage.goto(base+'/fr/packages',{waitUntil:'domcontentloaded'});
  await googlePage.waitForFunction(()=>!localStorage.getItem('currentUser'));
  await googlePage.getByRole('button',{name:/Choisir Standard/}).click();
  await googlePage.getByRole('dialog').waitFor();
  await googlePage.getByRole('dialog').getByRole('button',{name:/Google/}).click();
  await googlePage.waitForURL('https://local-test.supabase.co/auth/v1/authorize**');
  assert.equal(new URL(googleUrl).searchParams.get('provider'),'google');
  assert.equal(new URL(googleUrl).searchParams.get('redirect_to'),base+'/fr/packages');
  await googleContext.close();
  assert.deepEqual(errors,[]);
  console.log('PASS magic-link new-tab return, preserved invitation, authenticated checkout, Stripe fallback, Escape, mobile width');
  console.log('PASS prominent preview, desktop width, Google authentication and French return URL');
  await context.close();
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
