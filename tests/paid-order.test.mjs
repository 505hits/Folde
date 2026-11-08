import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRoute, mockDatabase, ok, failure } from './load-route.mjs';
const session={id:'cs_test_one',payment_status:'paid',amount_total:4990,metadata:{name:'Émilie',partnerName:'Alex',plan:'Standard',theme:'sage'}};
const user={id:'f2122cc6-5d15-4561-a793-cd600929d708',email:'owner@example.org'};
test('payment creates a server-owned order with a stable ID and sanitized preview',async()=>{
 const db=mockDatabase([ok(null),ok({id:'saved',slug:'wedding'})]);const {persistPaidOrder}=await loadRoute('lib/paid-order.js',db);
 await persistPaidOrder(session,user,{partner1:'Forged',_seatingPlan:{bad:true},publishedData:{bad:true}});
 const saved=db.calls.at(-1).value;
 assert.match(saved.id,/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
 assert.equal(db.calls[0].filters[0][1],saved.id);
 assert.equal(saved.user_id,user.id);assert.equal(saved.user_email,user.email);assert.equal(saved.details.partner1,'Émilie');assert.equal(saved.details._seatingPlan,undefined);assert.equal(saved.details.publishedData,undefined);assert.equal(saved.price,49.9);
});
test('checkout plan and studio status values match the production constraints',async()=>{
 for (const [input,plan,status] of [['essential','Essential','Live'],['Custom','Custom','Awaiting Details']]) {
  const db=mockDatabase([ok(null),ok({id:'saved',slug:'wedding'})]);const {persistPaidOrder}=await loadRoute('lib/paid-order.js',db);
  await persistPaidOrder({...session,metadata:{...session.metadata,plan:input}},user);
  assert.equal(db.calls.at(-1).value.plan,plan);assert.equal(db.calls.at(-1).value.status,status);
 }
});
test('payment recovery returns the existing order without inserting duplicates',async()=>{
 const db=mockDatabase([ok({id:'ORD-cs_test_one',user_email:user.email})]);const {persistPaidOrder}=await loadRoute('lib/paid-order.js',db);
 assert.equal((await persistPaidOrder(session,user)).id,'ORD-cs_test_one');assert.equal(db.calls.length,1);
});
test('unpaid sessions and refused writes cannot become successful orders',async()=>{
 const db=mockDatabase([ok(null),failure]);const {persistPaidOrder}=await loadRoute('lib/paid-order.js',db);
 await assert.rejects(()=>persistPaidOrder({...session,payment_status:'unpaid'},user),/not complete/);
 await assert.rejects(()=>persistPaidOrder(session,user),/could not be saved/);
});
