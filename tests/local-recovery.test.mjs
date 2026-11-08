import test from 'node:test';
import assert from 'node:assert/strict';
import { collectLocalWeddingData } from '../src/lib/local-recovery.mjs';
test('legacy backup reads only the signed-in customer data and never mutates storage', () => {
 const original = { orders: JSON.stringify([{email:'david@example.org',slug:'david',password:'obsolete',details:{date:'May'}},{email:'other@example.org',slug:'other'}]), eventInfo: JSON.stringify({david:{storyText:'Latest local story'},other:{storyText:'Private'}}), guests_david: JSON.stringify([{name:'Guest'}]), guests_other: JSON.stringify([{name:'Other guest'}]) };
 const storage = { getItem: key => original[key] || null, removeItem: () => { throw Error('Must not remove'); }, setItem: () => { throw Error('Must not write'); } };
 const result = collectLocalWeddingData(storage,'david@example.org',['david']);
 assert.equal(result.orders.length,1);assert.equal(result.orders[0].password,undefined);
 assert.deepEqual(Object.keys(result.weddings),['david']);assert.equal(result.weddings.david.eventInfo.storyText,'Latest local story');assert.equal(result.weddings.david.guests.length,1);
});
