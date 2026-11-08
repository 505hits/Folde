export function collectLocalWeddingData(storage, email, ownedSlugs = []) {
  const read = key => { try { return JSON.parse(storage.getItem(key) || 'null'); } catch { return null; } };
  const cachedOrders = read('orders');
  const matching = Array.isArray(cachedOrders) ? cachedOrders.filter(o => String(o?.email || o?.user_email || '').toLowerCase() === email.toLowerCase()) : [];
  const slugs = [...new Set([...ownedSlugs, ...matching.map(o => o.slug)].filter(s => typeof s === 'string' && /^[a-zA-Z0-9_-]{1,200}$/.test(s)))];
  const info = read('eventInfo');
  const result = { format: 'folde-local-recovery-v1', orders: matching.map(({ password: _password, ...order }) => order), weddings: {} };
  for (const slug of slugs) {
    const data = {};
    if (info && typeof info === 'object' && info[slug]) data.eventInfo = info[slug];
    for (const prefix of ['guests', 'tables', 'generated_photos']) {
      const value = read(`${prefix}_${slug}`);
      if (value != null) data[prefix] = value;
    }
    if (Object.keys(data).length) result.weddings[slug] = data;
  }
  return result;
}
