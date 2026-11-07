import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSeating } from '../src/lib/seating.mjs';
const guests=[{id:'g1',name:'Alex',status:'Attending',has_plus_one:true},{id:'g2',name:'Alex',status:'Attending'},{id:'g3',status:'Declined'}];
const table={id:'t1',name:'Family',capacity:3,guestIds:['g1','g2']};
test('homonyms are seated independently by ID and the accompanying guest uses a seat',()=>{
 assert.deepEqual(validateSeating([table],guests),[table]);
 assert.throws(()=>validateSeating([{...table,capacity:2}],guests),/Not enough seats/);
});
test('duplicate assignments and table IDs are rejected',()=>{
 assert.throws(()=>validateSeating([table,{...table,id:'t2'}],guests),/two tables/);
 assert.throws(()=>validateSeating([{...table,guestIds:[]},{...table,guestIds:[]}],guests),/identifier/);
});
test('declined guests, unknown IDs and invalid capacities are rejected',()=>{
 for(const guestIds of [['g3'],['missing']])assert.throws(()=>validateSeating([{...table,guestIds}],guests),/confirmed/);
 for(const capacity of [0,101,2.5,'4'])assert.throws(()=>validateSeating([{...table,capacity}],guests),/capacity/);
});
test('family groups reserve the specified number of seats and respect capacity',()=>{
 const family={...table,capacity:6,seatCounts:{g1:5}};
 assert.equal(validateSeating([family],guests)[0].seatCounts.g1,5);
 assert.throws(()=>validateSeating([{...family,capacity:5}],guests),/Not enough seats/);
 assert.throws(()=>validateSeating([{...family,seatCounts:{g1:1}}],guests),/Invalid number/);
});
