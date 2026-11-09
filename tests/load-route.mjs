import { readFile } from 'node:fs/promises';
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
let sequence = 0;

export async function loadRoute(file, db) {
  const key = `__foldeTest${sequence++}`;
  globalThis[key] = db;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
  const client = moduleUrl(`export const createClient = () => globalThis.${key};`);
  const databaseSource = (await readFile(new URL('../src/lib/server-database.js', import.meta.url), 'utf8')).replace("'@supabase/supabase-js'", JSON.stringify(client));
  const dbUrl = moduleUrl(databaseSource);
  const seatingUrl = moduleUrl(await readFile(new URL('../src/lib/seating.mjs', import.meta.url), 'utf8'));
  let source = await readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
  source = source.replaceAll("'@/lib/server-database'", JSON.stringify(dbUrl)).replaceAll("'@/lib/seating.mjs'", JSON.stringify(seatingUrl));
  return import(moduleUrl(`${source}\n// test ${key}`));
}

export function mockDatabase(responses = [], user = { id: 'owner', email: 'owner@example.org', email_confirmed_at: '2026-01-01' }) {
  const calls = [];
  return {
    calls,
    auth: { getUser: async token => ({ data: { user: token === 'valid' ? user : null }, error: token === 'valid' ? null : new Error('Invalid session') }) },
    from(table) {
      const call = { table, operation: 'select', filters: [] }; calls.push(call);
      const builder = {
        select() { return builder; },
        insert(value) { call.operation = 'insert'; call.value = value; return builder; },
        update(value) { call.operation = 'update'; call.value = value; return builder; },
        delete() { call.operation = 'delete'; return builder; },
        eq(key, value) { call.filters.push([key, value]); return builder; },
        is(key, value) { call.filters.push([key, value]); return builder; },
        order() { return builder; }, maybeSingle() { return builder; }, single() { return builder; },
        then(resolve, reject) {
          if (!responses.length) return Promise.reject(new Error(`Unexpected query ${table}/${call.operation}`)).then(resolve, reject);
          return Promise.resolve(responses.shift()).then(resolve, reject);
        },
      };
      return builder;
    },
  };
}
export function request(body, method = 'POST', token = 'valid', query = '') {
  return new Request(`http://localhost/api/test${query}`, { method, ...(body ? { body: JSON.stringify(body) } : {}), headers: token ? { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {} });
}
export const order = { id: 'order-1', slug: 'couple', user_email: 'owner@example.org', paid: true, status: 'Live', updated_at:'2026-01-01T00:00:00.123456+00:00', details: { partner1: 'Alice', publishedData: { partner1: 'Alice' } } };
export const ok = data => ({ data, error: null });
export const failure = { data: null, error: { message: 'Database refused operation' } };
