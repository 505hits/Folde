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
 let source=await readFile(new URL('../src/app/api/guest-upload/route.js',import.meta.url),'utf8');
 source=source.replace("'next/server'",JSON.stringify(moduleUrl('export const NextResponse=Response;'))).replace("'@supabase/supabase-js'",JSON.stringify(moduleUrl(`export const createClient=()=>globalThis.${key};`)));
 return import(moduleUrl(source));
}
const wedding={id:'test-order',slug:'test-couple',couple:'Test couple',details:{language:'fr',publishedData:{language:'es'}}};
function upload() { const form=new FormData();form.set('slug','test-couple');form.set('file',new File(['test bytes'],'test.jpg',{type:'image/jpeg'}));return new Request('https://test/api/guest-upload',{method:'POST',body:form}); }
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
