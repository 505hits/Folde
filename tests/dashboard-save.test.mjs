import test from 'node:test';import assert from 'node:assert/strict';
import {createWeddingWriter} from '../src/lib/wedding-writer.mjs';
import {dashboardLocale} from '../src/lib/dashboard-locale.mjs';
import {selectHero} from '../src/lib/wedding-media.mjs';
import {templateMedia} from '../src/lib/template-catalog.mjs';
import {mediaPosters} from '../src/lib/media-posters.mjs';
import {existsSync} from 'node:fs';
import {loadRoute,mockDatabase,request,ok,order} from './load-route.mjs';
test('a large photo draft uses a short revision filter and retains the stored photo',async()=>{
 const image='data:image/jpeg;base64,'+'a'.repeat(600000);const original={...order,details:{...order.details,gallery:[image]}};
 const db=mockDatabase([ok(original),ok(original)]);const route=await loadRoute('app/api/wedding/route.js',db);
 assert.equal((await route.PATCH(request({slug:'couple',action:'details',details:{partner1:'Updated'},expectedVersion:0},'PATCH'))).status,200);
 const mutation=db.calls.at(-1);assert.ok(JSON.stringify(mutation.filters).length<250);assert.equal(mutation.value.details.gallery[0],image);assert.equal(mutation.value.details._draftVersion,1);
});
test('publish atomically includes the latest names, date, memories and dress photo',async()=>{
 const details={partner1:'New name',date:'2027-09-23',gallery:['https://test/photo.jpg'],dressCode:{image:'https://test/dress.jpg'},_seatingPlan:{tables:['forged']},publishedData:{bad:true},_draftVersion:999};
 const original={...order,details:{...order.details,_seatingPlan:{version:5,tables:[]}}};
 const db=mockDatabase([ok(original),ok(original)]);const route=await loadRoute('app/api/wedding/route.js',db);
 assert.equal((await route.PATCH(request({slug:'couple',action:'publish',details,expectedVersion:0},'PATCH'))).status,200);
 const result=db.calls.at(-1).value.details;assert.equal(result.publishedData.partner1,'New name');assert.equal(result.publishedData.date,'2027-09-23');assert.deepEqual(result.publishedData.gallery,details.gallery);assert.deepEqual(result.publishedData.dressCode,details.dressCode);assert.equal(result._seatingPlan.version,5);assert.equal(result.publishedData._seatingPlan,undefined);assert.equal(result.publishedData._draftVersion,undefined);assert.equal(result.publishedData.publishedData,undefined);assert.equal(result._draftVersion,1);
});
test('a draft from another device cannot overwrite newer saved content',async()=>{
 const db=mockDatabase([ok({...order,details:{...order.details,_draftVersion:3}})]);const route=await loadRoute('app/api/wedding/route.js',db);
 assert.equal((await route.PATCH(request({slug:'couple',action:'details',details:{partner1:'Stale'},expectedVersion:2},'PATCH'))).status,409);assert.equal(db.calls.length,1);
});
test('autosave and publish run in order and advance the version without overlapping',async()=>{
 let release;const first=new Promise(resolve=>release=resolve);let count=0,active=0,maxActive=0;const calls=[];
 const writer=createWeddingWriter(async(url,options)=>{active++;maxActive=Math.max(maxActive,active);const body=JSON.parse(options.body);calls.push(body);const sequence=++count;if(sequence===1)await first;active--;return{order:{details:{_draftVersion:sequence}}};});
 writer.seed('couple',0);const saving=writer.save('couple',{partner1:'First'});const publishing=writer.publish('couple',{partner1:'Latest'});await Promise.resolve();assert.equal(calls.length,0);release();await Promise.all([saving,publishing]);assert.equal(maxActive,1);assert.deepEqual(calls.map(c=>[c.action,c.expectedVersion,c.details.partner1]),[['details',0,'First'],['publish',1,'Latest']]);
});
test('English is the default and checkout locale remains independent of invitation language',()=>{
 assert.equal(dashboardLocale('en',{language:'fr'}),'en');assert.equal(dashboardLocale('en',{dashboardLocale:'fr',language:'en'}),'fr');assert.equal(dashboardLocale('es',{dashboardLocale:'fr'}),'es');
});
test('switching from a photo or AI image to video removes the old visual override only',()=>{
 const initial={partner1:'Keep',gallery:['keep.jpg'],customHeroImage:'old.jpg',images:{hero:'old.jpg',dress:'keep.jpg',scratchCover:'old-cover.jpg'},videos:{envelope:'keep.mp4'}};
 const selected=selectHero(initial,'/videos/hero/sea-view.mp4');assert.equal(selected.customHeroImage,null);assert.equal(selected.images.hero,null);assert.equal(selected.videos.hero,'/videos/hero/sea-view.mp4');assert.equal(selected.videos.envelope,'keep.mp4');assert.deepEqual(selected.gallery,['keep.jpg']);assert.equal(selectHero(selected,'new.png').images.hero,'new.png');
});
test('all 36 dashboard designs have an actual media source and a bundled static preview',()=>{
 assert.equal(Object.keys(templateMedia).length,36);
 for(const [id,media] of Object.entries(templateMedia)){
  assert.ok(media.hero,`${id} hero`);assert.ok(media.envelope,`${id} envelope`);
  assert.ok(mediaPosters[media.hero],`${id} poster`);
  assert.ok(existsSync(new URL('../public'+mediaPosters[media.hero],import.meta.url)),`${id} bundled poster`);
 }
});
test('media upload requires ownership and returns the durable stored URL',async()=>{
 const db=mockDatabase([ok(order)]);const calls=[];db.storage={from:bucket=>({upload:async(path,bytes,options)=>{calls.push({bucket,path,size:bytes.length,options});return ok({path});},getPublicUrl:path=>({data:{publicUrl:`https://test/media/${path}`}})})};
 const route=await loadRoute('app/api/wedding-media/route.js',db);const form=new FormData();form.set('slug','couple');form.set('file',new File(['test image'],'dress.jpg',{type:'image/jpeg'}));
 const response=await route.POST(new Request('http://localhost/api/wedding-media',{method:'POST',headers:{authorization:'Bearer valid'},body:form}));assert.equal(response.status,200);assert.match((await response.json()).url,/^https:\/\/test\/media\/weddings\/order-1\//);assert.equal(calls[0].options.upsert,false);
 const anonymous=new FormData();anonymous.set('slug','couple');assert.equal((await route.POST(new Request('http://localhost/api/wedding-media',{method:'POST',body:anonymous}))).status,401);assert.equal(calls.length,1);
});
