import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRoute, mockDatabase, ok, order, request } from './load-route.mjs';

process.env.KIE_API_KEY = 'test-only';
const premium = { ...order, plan: 'Premium', details: { ...order.details } };
const kieCalls = [];
globalThis.fetch = async (url) => {
  kieCalls.push(String(url));
  return new Response(JSON.stringify({ code: 200, data: { taskId: 'task-1' } }), { status: 200 });
};

test('AI credits are counted on the server and stop at the limit', async () => {
  const exhausted = { ...premium, details: { ...premium.details, _aiCredits: { photo: 5, music: 0 } } };
  const blocked = await loadRoute('app/api/ai-photo/route.js', mockDatabase([ok([exhausted]), ok([exhausted])]));
  const before = kieCalls.length;
  assert.equal((await blocked.POST(request({ slug: 'couple', prompt: 'a portrait' }))).status, 403);
  assert.equal(kieCalls.length, before);

  const db = mockDatabase([ok([premium]), ok([premium]), ok({ ...premium, details: { _aiCredits: { photo: 1 } } })]);
  const route = await loadRoute('app/api/ai-photo/route.js', db);
  const response = await route.POST(request({ slug: 'couple', prompt: 'a portrait' }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).creditsUsed, 1);
  assert.equal(db.calls.find(call => call.operation === 'update').value.details._aiCredits.photo, 1);
});

test('a refused KIE job gives the credit back', async () => {
  const saved = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ code: 500, msg: 'provider error' }), { status: 500 });
  try {
    const reserved = { ...premium, details: { _aiCredits: { music: 1 } } };
    const db = mockDatabase([ok([premium]), ok([premium]), ok(reserved), ok({ ...premium, details: { _aiCredits: { music: 0 } } })]);
    const route = await loadRoute('app/api/ai-music/route.js', db);
    assert.equal((await route.POST(request({ slug: 'couple', prompt: 'piano' }))).status, 502);
    const updates = db.calls.filter(call => call.operation === 'update');
    assert.deepEqual(updates.map(call => call.value.details._aiCredits.music), [1, 0]);
  } finally { globalThis.fetch = saved; }
});

test('customers cannot reset their AI credits through a dashboard save', async () => {
  const db = mockDatabase([ok({ ...premium, details: { _aiCredits: { photo: 5 } } }), ok(premium)]);
  const route = await loadRoute('app/api/wedding/route.js', db);
  await route.PATCH(request({ slug: 'couple', action: 'details', details: { partner1: 'Alice', _aiCredits: { photo: 0 } } }, 'PATCH'));
  assert.equal(db.calls.find(call => call.operation === 'update').value.details._aiCredits.photo, 5);
});
