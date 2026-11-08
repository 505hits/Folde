// Local browser verification: all API writes are intercepted; no customer data is changed.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.TEST_BASE_URL || 'http://localhost:3100';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  let language='fr',theme='atelierindigo',uploads=0,failSecond=false;
  const photoUrl='/images/couple_beach_sunset_1782995185709.png';
  const photos=Array.from({length:61},(_,i)=>({id:`photo-${i}`,url:photoUrl,guestName:`Guest ${i}`,caption:i===0?'A beautiful memory':''}));
  await context.route('https://**',route=>route.abort());
  await context.route('**/api/invitation?**',route=>route.fulfill({json:{invitation:{slug:'test-couple',themeId:theme,partner1:'Emma',partner2:'Lucas',date:'2027-05-23',language,ceremonyVenue:'Lake House',receptionVenue:'Como',images:{envelope:photoUrl},videos:{envelope:photoUrl,hero:photoUrl},sections:{showIntro:true,showSchedule:true,showRSVP:true,showGuestGallery:true},timeline:[{time:'15:00',title:'Ceremony'}],menu:[{course:'Starter',dish:'Risotto'}],accommodations:[]}}}));
  await context.route('**/api/guest-upload**',route=>{
   if(route.request().method()==='POST') {
    uploads++;if(failSecond && uploads===2)return route.fulfill({status:503,json:{error:'simulated failure'}});
    return route.fulfill({json:{success:true,photo:{id:`saved-${uploads}`,url:null}}});
   }
   const offset=Number(new URL(route.request().url()).searchParams.get('offset') || 0);
   return route.fulfill({json:{success:true,wedding:{slug:'test-couple',couple:'Emma & Lucas',language},photos:photos.slice(offset,offset+60),nextOffset:offset===0?60:null}});
  });
  const copy=await import('../src/lib/template-copy.mjs');
  for(const selected of ['en','fr','es','it','de','pt','ar','ru','nl']) {
   language=selected;await page.goto(base+'/invite/test-couple');
   await page.getByText(copy.templateCopy[selected].countdownTitle,{exact:true}).waitFor();
   assert.ok(!(await page.locator('body').innerText()).includes('Atelier de mariage'));
   assert.equal(await page.locator('[lang="'+selected+'"]').count()>0,true);
  }
  language='en';
  const headings={rosas:'Our story, written in roses',atelierindigo:'A quiet story, beautifully composed',orange:'A celebration made of warmth',editorial:'We are getting married',excellence:'A timeless beginning'};
  for(const [selected,heading] of Object.entries(headings)) {
   theme=selected;await page.goto(base+'/invite/test-couple');await page.getByRole('heading',{name:heading,exact:true}).waitFor();
  }
  language='fr';theme='atelierindigo';await page.goto(base+'/guest-gallery/test-couple');
  await page.getByRole('button',{name:'Voir plus',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('button[aria-label^="Agrandir la photo"]').length===61);
  await page.getByRole('button',{name:'Agrandir la photo · Guest 0',exact:true}).click();
  await page.getByRole('button',{name:'Fermer la photo',exact:true}).waitFor();
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Fermer la photo',exact:true}).count(),0);
  const output=process.env.QA_OUTPUT;
  if(output){fs.mkdirSync(output,{recursive:true});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:output+'/galerie-mobile.png'});}
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);assert.equal(overflow,false);
  await page.goto(base+'/guest-upload/test-couple');await page.getByText('Choisir vos photos',{exact:true}).waitFor();
  const image={name:'test.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')};
  await page.locator('input[type=file]').setInputFiles(image);
  await page.getByText('Photos enregistrées : 1',{exact:true}).waitFor();
  uploads=0;failSecond=true;await page.locator('input[type=file]').setInputFiles([image,image]);
  await page.getByText('Impossible d’enregistrer cette photo. Réessayez.',{exact:true}).waitFor();
  assert.equal(await page.getByText('Photos enregistrées : 1',{exact:true}).count(),1);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: nine languages, five designs, mobile gallery, 61 photos, lightbox, saved photo without preview, partial batch failure. APIs mocked; no production writes.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
