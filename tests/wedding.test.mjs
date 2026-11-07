import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRoute,mockDatabase,request,order,ok,failure } from './load-route.mjs';
const routePath='app/api/wedding/route.js';
const table={id:'t1',name:'Family',capacity:4,guestIds:['g1']};
test('seating saves return the cloud plan and preserve invitation details',async()=>{
 const db=mockDatabase([ok(order),ok([{id:'g1',status:'Attending'}]),ok({...order,details:{...order.details,_seatingPlan:{version:1,tables:[table]}}})]);
 const route=await loadRoute(routePath,db);const response=await route.PATCH(request({slug:'couple',action:'seating',version:0,tables:[table]},'PATCH'));
 assert.equal(response.status,200);assert.equal((await response.json()).seatingPlan.version,1);
 assert.equal(db.calls.at(-1).value.details.partner1,'Alice');assert.deepEqual(db.calls.at(-1).value.details.publishedData,{partner1:'Alice'});
 assert.ok(db.calls.at(-1).filters.some(([key,value])=>key==='details'&&value===JSON.stringify(order.details)));
});
test('seating version conflicts cannot overwrite another device',async()=>{
 const db=mockDatabase([ok({...order,details:{_seatingPlan:{version:2,tables:[]}}})]);const route=await loadRoute(routePath,db);
 assert.equal((await route.PATCH(request({slug:'couple',action:'seating',version:1,tables:[]},'PATCH'))).status,409);
 assert.equal(db.calls.length,1);
});
test('a concurrent details edit results in a conflict instead of a lost update',async()=>{
 const route=await loadRoute(routePath,mockDatabase([ok(order),ok([]),ok(null)]));
 assert.equal((await route.PATCH(request({slug:'couple',action:'seating',version:0,tables:[]},'PATCH'))).status,409);
});
test('save failures cannot return success',async()=>{
 const route=await loadRoute(routePath,mockDatabase([ok(order),ok([]),failure]));
 assert.equal((await route.PATCH(request({slug:'couple',action:'seating',version:0,tables:[]},'PATCH'))).status,503);
});
test('anonymous and other customers cannot read or change a plan',async()=>{
 const db=mockDatabase([ok({...order,user_email:'other@example.org'})]);const route=await loadRoute(routePath,db);
 assert.equal((await route.GET(request(null,'GET',null))).status,401);
 assert.equal((await route.PATCH(request({slug:'couple',action:'seating',version:0,tables:[]},'PATCH'))).status,404);
});
test('invitation updates cannot overwrite the seating plan or published snapshot',async()=>{
 const details={...order.details,_seatingPlan:{version:5,tables:[]}};
 const db=mockDatabase([ok({...order,details}),ok({...order,details})]);const route=await loadRoute(routePath,db);
 assert.equal((await route.PATCH(request({slug:'couple',action:'details',details:{partner1:'Changed',_seatingPlan:{version:0},publishedData:{bad:true}}},'PATCH'))).status,200);
 assert.equal(db.calls.at(-1).value.details._seatingPlan.version,5);
 assert.deepEqual(db.calls.at(-1).value.details.publishedData,order.details.publishedData);
});
test('public invitations omit seating plans and drafts; previews require ownership',async()=>{
 const db=mockDatabase([ok({...order,details:{...order.details,partner1:'Draft',_seatingPlan:{tables:[table]}}})]);const route=await loadRoute('app/api/invitation/route.js',db);
 const response=await route.GET(request(null,'GET',null,'?slug=couple'));const result=await response.json();
 assert.equal(result.invitation.partner1,'Alice');assert.equal(result.invitation._seatingPlan,undefined);
 assert.equal((await route.GET(request(null,'GET',null,'?slug=couple&preview=true'))).status,401);
});
