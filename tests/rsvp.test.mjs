import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRoute, mockDatabase, request, order, ok, failure } from './load-route.mjs';
const routePath = 'app/api/rsvp/route.js';
const id = '11111111-1111-4111-8111-111111111111';
const body = { slug: 'couple', name: ' Alice ', status: 'yes', responseId: id };
test('private guest list and deletion reject unauthenticated visitors before reading rows', async () => {
 const db = mockDatabase(); const route = await loadRoute(routePath, db);
 for (const method of ['GET','DELETE']) assert.equal((await route[method](request(null, method, null, '?slug=couple&id=g'))).status,401);
 assert.equal(db.calls.length,0);
});
test('another customer cannot read or delete guests', async () => {
 const db = mockDatabase([ok({...order,user_email:'other@example.org'}),ok({...order,user_email:'other@example.org'})]); const route = await loadRoute(routePath,db);
 for(const method of ['GET','DELETE']) assert.equal((await route[method](request(null,method,'valid','?slug=couple&id=g'))).status,404);
 assert.equal(db.calls.every(c=>c.table==='orders'),true);
});
test('owner receives cloud guests and reads failures explicitly', async () => {
 const db=mockDatabase([ok(order),ok([{id,name:'Alice',has_plus_one:true}]),ok(order),failure]); const route=await loadRoute(routePath,db);
 const response=await route.GET(request(null,'GET','valid','?slug=couple'));
 assert.equal((await response.json()).guests[0].hasPlusOne,true);
 assert.equal((await route.GET(request(null,'GET','valid','?slug=couple'))).status,503);
});
test('blank names and pattern injection in wedding IDs are rejected without a database query',async()=>{
 const db=mockDatabase();const route=await loadRoute(routePath,db);
 for(const value of [{...body,name:'   '},{...body,slug:'couple,slug.neq.x'}]) assert.equal((await route.POST(request(value))).status,400);
 assert.equal(db.calls.length,0);
});
test('an unknown or unpaid wedding cannot receive a reply',async()=>{
 const route=await loadRoute(routePath,mockDatabase([ok(null)]));
 assert.equal((await route.POST(request(body))).status,404);
});
test('public replies require a live wedding and cannot add Pending records',async()=>{
 const route=await loadRoute(routePath,mockDatabase([ok(order)]));
 assert.equal((await route.POST(request({...body,status:'Pending'},'POST',null))).status,403);
});
test('insert failures never produce successful RSVP confirmations',async()=>{
 const db=mockDatabase([ok(order),ok(null),ok(null),failure]);const route=await loadRoute(routePath,db);
 const response=await route.POST(request(body,'POST',null));
 assert.equal(response.status,503);assert.equal((await response.json()).success,false);
});
test('a saved RSVP carries its database identity and invitation link',async()=>{
 const db=mockDatabase([ok(order),ok(null),ok({id:'inv'}),ok({id,slug:'couple',name:'Alice',status:'Attending'})]);const route=await loadRoute(routePath,db);
 const response=await route.POST(request(body,'POST',null));assert.equal(response.status,200);
 assert.equal((await response.json()).guest.id,id);
 assert.equal(db.calls.at(-1).value.invitation_id,'inv');assert.equal(db.calls.at(-1).value.name,'Alice');
});
test('response IDs never update a guest belonging to another wedding',async()=>{
 const db=mockDatabase([ok(order),ok({id,slug:'another-wedding'})]);const route=await loadRoute(routePath,db);
 assert.equal((await route.POST(request(body))).status,403);assert.equal(db.calls.some(c=>c.operation==='update'),false);
});
test('a repeat reply updates by ID, preserving homonyms and clearing a declined plus one',async()=>{
 const db=mockDatabase([ok(order),ok({id,slug:'couple'}),ok({id,name:'Alice',status:'Declined',has_plus_one:false})]);const route=await loadRoute(routePath,db);
 const response=await route.POST(request({...body,status:'no',hasPlusOne:true}));assert.equal(response.status,200);
 assert.equal(db.calls.at(-1).value.has_plus_one,false);assert.deepEqual(db.calls.at(-1).filters,[['id',id],['slug','couple']]);
});
test('delete requires a returned database row',async()=>{
 const route=await loadRoute(routePath,mockDatabase([ok(order),failure]));
 assert.equal((await route.DELETE(request(null,'DELETE','valid','?slug=couple&id=g'))).status,503);
});
