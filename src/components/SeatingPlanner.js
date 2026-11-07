"use client";

import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { weddingRequest } from '@/lib/wedding-client';
import { partySize } from '@/lib/seating.mjs';

const card = { background: '#fffdfb', border: '1px solid #e0dcd7', borderRadius: 16, padding: '1.25rem' };
const button = { background: '#5c3a1e', color: '#fff', border: 0, borderRadius: 8, padding: '.65rem 1rem', cursor: 'pointer' };

export default function SeatingPlanner({ slug }) {
  const { guests, fetchGuests } = useDatabase();
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [legacy, setLegacy] = useState(null);
  const [partySizes, setPartySizes] = useState({});
  const guestList = (guests[slug] || []).filter(g => g.status === 'Attending');
  const byId = new Map(guestList.map(g => [String(g.id), g]));
  const tables = plan?.tables || [];
  const assigned = new Set(tables.flatMap(t => t.guestIds));
  const unassigned = guestList.filter(g => !assigned.has(String(g.id)));
  const seats = table => table.guestIds.reduce((sum, id) => sum + (byId.has(id) ? table.seatCounts?.[id] ?? partySize(byId.get(id)) : 0), 0);

  const load = useCallback(async () => {
    setBusy(true); setError('');
    try {
      const [result] = await Promise.all([weddingRequest('/api/wedding'), fetchGuests(slug)]);
      const order = result.orders.find(o => o.slug === slug);
      if (!order) throw new Error('Your wedding could not be found.');
      setPlan(order.details?._seatingPlan || { version: 0, tables: [] });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }, [slug, fetchGuests]);

  useEffect(() => { Promise.resolve().then(load); }, [load]);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      try { const saved = JSON.parse(localStorage.getItem(`tables_${slug}`) || 'null'); if (active && Array.isArray(saved)) setLegacy(saved); }
      catch { /* Invalid old browser data is never imported automatically. */ }
    });
    return () => { active = false; };
  }, [slug]);

  const save = async nextTables => {
    if (busy || !plan) return false;
    setBusy(true); setError(''); setNotice('');
    try {
      // Remove assignments for guests who have since declined their invitation.
      const cleaned = nextTables.map(t => ({ ...t, guestIds: t.guestIds.filter(id => byId.has(id)) }));
      const result = await weddingRequest('/api/wedding', { method: 'PATCH', body: JSON.stringify({ slug, action: 'seating', version: plan.version, tables: cleaned }) });
      setPlan(result.seatingPlan);
      setNotice('Saved to your wedding account.');
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setBusy(false); }
  };

  const assign = (guestId, tableId) => {
    const guest = byId.get(guestId), target = tables.find(t => t.id === tableId);
    if (!guest || !target) return;
    const count = partySizes[guestId] || partySize(guest);
    if (seats(target) + count > target.capacity) { setError('Not enough seats at this table, including accompanying guests.'); return; }
    save(tables.map(t => ({ ...t, guestIds: [...t.guestIds.filter(id => id !== guestId), ...(t.id === tableId ? [guestId] : [])], ...(t.id === tableId ? { seatCounts: { ...t.seatCounts, [guestId]: count } } : {}) })));
  };

  const importLegacy = async () => {
    try {
      const mapped = legacy.map(t => ({ id: String(t.id), name: String(t.name), capacity: Number(t.capacity), guestIds: (t.assignedGuestNames || []).map(n => {
        const matches = guestList.filter(g => g.name === n);
        if (matches.length !== 1) throw new Error(`Please assign ${n} manually: the old plan cannot identify this guest reliably.`);
        return String(matches[0].id);
      }) }));
      if (await save(mapped)) { localStorage.removeItem(`tables_${slug}`); setLegacy(null); }
    } catch (err) { setError(err.message); }
  };

  return <section style={{ display: 'grid', gap: '1rem' }} aria-label="Table seating planner">
    <div style={card}>
      <h2>Table seating planner</h2>
      <p>Each change is saved to your wedding account. Include accompanying guests and family members in the number of seats before assigning a response.</p>
      <p>{guestList.length} confirmed responses · {tables.reduce((n, t) => n + seats(t), 0)} seats assigned · {unassigned.length} responses to seat</p>
      {busy && <p role="status">Loading or saving…</p>}
      {notice && <p role="status" style={{ color: '#166534' }}>{notice}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      <button type="button" style={button} disabled={busy} onClick={load}>Reload saved plan</button>
    </div>
    {plan && <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: 'grid', gap: '1rem' }}>
      {legacy && plan.version === 0 && <div style={card}>
        <p>A previous plan exists in this browser. Import it only if it belongs to this wedding.</p>
        <button type="button" style={button} onClick={importLegacy}>Import previous plan</button>
      </div>}
      <form style={{ ...card, display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'end' }} onSubmit={async e => {
        e.preventDefault();
        if (await save([...tables, { id: crypto.randomUUID(), name: name.trim(), capacity: Number(capacity), guestIds: [] }])) setName('');
      }}>
        <label>Table name<input required maxLength={120} value={name} onChange={e => setName(e.target.value)} style={{ display: 'block', padding: '.6rem', maxWidth: '100%' }} /></label>
        <label>Seats<input type="number" min={1} max={100} required value={capacity} onChange={e => setCapacity(e.target.value)} style={{ display: 'block', padding: '.6rem', width: 80 }} /></label>
        <button style={button} type="submit">Add table</button>
      </form>
      <div style={card}><h3>Guests to seat</h3>
        {!unassigned.length && <p>No confirmed guests waiting for a table.</p>}
        {unassigned.map(g => <div key={g.id} style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginBottom: '.75rem', alignItems: 'center' }}>
          <span>{g.name}{g.hasPlusOne ? ` + ${g.plusOneName || 'accompanying guest'}` : ''}</span>
          <label>Seats <input aria-label={`Seats for ${g.name}`} type="number" min={partySize(g)} max={100} value={partySizes[String(g.id)] || partySize(g)} onChange={e => setPartySizes(prev => ({ ...prev, [String(g.id)]: Math.max(partySize(g), Math.min(100, Number(e.target.value) || partySize(g))) }))} style={{ width: 60 }} /></label>
          <select aria-label={`Assign ${g.name}`} value="" onChange={e => assign(String(g.id), e.target.value)}>
            <option value="">Choose a table…</option>
            {tables.map(t => <option key={t.id} value={t.id} disabled={seats(t) + (partySizes[String(g.id)] || partySize(g)) > t.capacity}>{t.name} ({seats(t)}/{t.capacity})</option>)}
          </select>
        </div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
        {tables.map(t => <article key={t.id} style={card}>
          <h3>{t.name}</h3><p>{seats(t)} / {t.capacity} seats</p>
          {t.guestIds.map(id => <div key={id} style={{ marginBottom: '.75rem' }}>
            <span>{byId.get(id)?.name || 'Guest no longer attending'}{byId.get(id)?.hasPlusOne ? ` + ${byId.get(id).plusOneName || 'accompanying guest'}` : ''} ({t.seatCounts?.[id] || (byId.has(id) ? partySize(byId.get(id)) : 0)} seats)</span>{' '}
            <button type="button" aria-label={`Unassign ${byId.get(id)?.name || 'guest'}`} onClick={() => save(tables.map(table => ({ ...table, guestIds: table.guestIds.filter(g => g !== id) })))}>Remove</button>
          </div>)}
          <button type="button" onClick={() => { if (confirm(`Delete ${t.name}? Its guests will become unassigned.`)) save(tables.filter(table => table.id !== t.id)); }}>Delete table</button>
        </article>)}
      </div>
    </fieldset>}
  </section>;
}
