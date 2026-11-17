import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {mockDatabase,ok,failure} from './load-route.mjs';
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
let sequence=0;
async function load(db, storage) {
 const key=`__photoTest${sequence++}`;
 globalThis[key]={...db,storage:{from:()=>storage}};
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://test.supabase.co';
 process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';
 const securityUrl = moduleUrl((await readFile(new URL('../src/lib/request-security.js',import.meta.url),'utf8')).replace("'botid/server'", JSON.stringify(moduleUrl('export const checkBotId = async () => ({isBot:false});'))));
 const imageUrl = moduleUrl(await readFile(new URL('../src/lib/image-file.mjs',import.meta.url),'utf8'));
 let source=await readFile(new URL('../src/app/api/guest-upload/route.js',import.meta.url),'utf8');
 source=source.replace("'next/server'",JSON.stringify(moduleUrl('export const NextResponse=Response;'))).replace("'@supabase/supabase-js'",JSON.stringify(moduleUrl(`export const createClient=()=>globalThis.${key};`)));
 source=source.replace("'@/lib/request-security'",JSON.stringify(securityUrl)).replace("'@/lib/image-file.mjs'",JSON.stringify(imageUrl));
 return import(moduleUrl(source));
}
const wedding={paid:true,status:'Live',id:'test-order',slug:'test-couple',couple:'Test couple',publishedLanguage:'es',draftLanguage:'fr'};
function upload() { const form=new FormData();form.set('slug','test-couple');form.set('file',new File([new Uint8Array([255,216,255,224])],'test.jpg',{type:'image/jpeg'}));return new Request('https://test/api/guest-upload',{method:'POST',body:form}); }
test('a saved photo survives both a signing error and an unexpected signing exception',async()=>{
 for(const throws of [false,true]) {
  const removed=[];const db=mockDatabase([ok(wedding),ok({id:'photo-1',created_at:'2026-01-01'})]);
  const route=await load(db,{upload:async()=>ok({}),createSignedUrl:async()=>{if(throws)throw new Error('network');return failure;},remove:async p=>{removed.push(p);return ok({});}});
  const result=await route.POST(upload());
  assert.equal(result.status,200);
  assert.equal((await result.json()).photo.id,'photo-1');
  assert.equal(removed.length,0,'a committed photo must never be removed');
 }
});
test('a failed metadata insert cleans up only the newly uploaded object',async()=>{
 const removed=[];let path;
 const route=await load(mockDatabase([ok(wedding),failure]),{upload:async p=>{path=p;return ok({});},remove:async paths=>{removed.push(...paths);return ok({});}});
 assert.equal((await route.POST(upload())).status,500);assert.deepEqual(removed,[path]);assert.match(path,/^test-couple\//);
});
test('gallery pagination signs each saved path and uses the published language',async()=>{
 const photos=Array.from({length:61},(_,i)=>({id:`p${i}`,storage_path:`test-couple/p${i}.jpg`}));
 const db=mockDatabase([ok(wedding),ok(photos)]);
 const from=db.from.bind(db);db.from=table=>{const q=from(table);q.range=()=>q;return q;};
 const route=await load(db,{createSignedUrls:async paths=>ok(paths.toReversed().map(path=>({path,signedUrl:`https://test/${path}`})))});
 const result=await route.GET(new Request('https://test/api/guest-upload?slug=test-couple'));
 assert.equal(result.status,200);const body=await result.json();assert.equal(body.photos.length,60);assert.equal(body.nextOffset,60);assert.equal(body.wedding.language,'es');assert.equal(body.photos[0].url,'https://test/test-couple/p0.jpg');
});
test('a failed preview cannot silently make a saved gallery look empty',async()=>{
 const db=mockDatabase([ok(wedding),ok([{id:'p',storage_path:'p.jpg'}])]);const from=db.from.bind(db);db.from=t=>{const q=from(t);q.range=()=>q;return q;};
 const route=await load(db,{createSignedUrls:async()=>ok([{path:'p.jpg',error:'unavailable'}])});
 assert.equal((await route.GET(new Request('https://test/api/guest-upload?slug=test-couple'))).status,500);
});
function jsonStep(body) { return new Request('https://test/api/guest-upload',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); }
async function withRangeFetch(bytes, run) {
 const original=globalThis.fetch;const ranges=[];
 globalThis.fetch=async(url,init)=>{ranges.push(init?.headers?.Range);return new Response(new Uint8Array(bytes));};
 try { return await run(ranges); } finally { globalThis.fetch=original; }
}
test('direct upload: the server signs the upload, never receives the file, and records it after checking the stored bytes',async()=>{
 const removed=[];const inserted=[];
 const db=mockDatabase([ok(wedding),ok(null),ok({id:'photo-9',created_at:'2026-01-02'})]);
 const from=db.from.bind(db);db.from=t=>{const q=from(t);const ins=q.insert;q.insert=v=>{inserted.push(v);return ins(v);};return q;};
 const storage={createSignedUploadUrl:async p=>ok({path:p,token:'upload-token'}),info:async()=>ok({size:2048}),createSignedUrl:async p=>ok({signedUrl:`https://storage.test/${p}`}),remove:async p=>{removed.push(...p);return ok({});}};
 const route=await load(db,storage);
 const prepared=await (await route.POST(jsonStep({step:'prepare',slug:'test-couple',type:'image/jpeg',size:2048,guestName:'Ana',caption:'Hi'}))).json();
 assert.equal(prepared.upload.token,'upload-token');assert.match(prepared.upload.path,/^test-couple\/.+\.jpg$/);
 await withRangeFetch([255,216,255,224],async ranges=>{
  const confirmed=await route.POST(jsonStep({step:'confirm',ticket:prepared.ticket}));
  assert.equal(confirmed.status,200);assert.equal((await confirmed.json()).photo.id,'photo-9');
  assert.deepEqual(ranges,['bytes=0-31']);
 });
 assert.equal(inserted[0].storage_path,prepared.upload.path);assert.equal(inserted[0].order_id,'test-order');assert.equal(inserted[0].guest_name,'Ana');
 assert.equal(removed.length,0);
});
test('direct upload: a file whose bytes are not an image is deleted, and a tampered ticket is refused',async()=>{
 const removed=[];
 const storage={createSignedUploadUrl:async p=>ok({path:p,token:'t'}),info:async()=>ok({size:10}),createSignedUrl:async p=>ok({signedUrl:`https://storage.test/${p}`}),remove:async p=>{removed.push(...p);return ok({});}};
 const route=await load(mockDatabase([ok(wedding),ok(null)]),storage);
 const prepared=await (await route.POST(jsonStep({step:'prepare',slug:'test-couple',type:'image/jpeg',size:10}))).json();
 await withRangeFetch([60,104,116,109,108],async()=>{const r=await route.POST(jsonStep({step:"confirm",ticket:prepared.ticket}));assert.equal(r.status,400);});
 assert.deepEqual(removed,[prepared.upload.path]);
 const [payload,signature]=prepared.ticket.split('.');
 const forged=Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(payload,'base64url')),orderId:'someone-else'})).toString('base64url')+'.'+signature;
 assert.equal((await route.POST(jsonStep({step:'confirm',ticket:forged}))).status,400);
 assert.equal((await route.POST(jsonStep({step:'prepare',slug:'test-couple',type:'image/jpeg',size:9*1024*1024}))).status,400);
});
