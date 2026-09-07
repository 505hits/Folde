"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const isExpert = (order) => ['custom', 'expert'].includes(String(order?.plan || '').toLowerCase());
const label = (value) => value || 'Not provided';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('expert');
  const [saving, setSaving] = useState(false);

  const request = async (method = 'GET', body) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/admin/orders', { method, headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    return data;
  };
  const loadOrders = async () => {
    setLoading(true); setError('');
    try { setOrders((await request()).orders || []); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => {
    const timer = setTimeout(() => { loadOrders(); }, 0);
    return () => clearTimeout(timer);
  }, []);
  const visibleOrders = useMemo(() => filter === 'expert' ? orders.filter(isExpert) : orders, [orders, filter]);
  const updateOrder = async (action, status) => {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      const { order } = await request('PATCH', { orderId: selected.id, action, status });
      const next = { ...selected, ...order, details: order.details || selected.details };
      setSelected(next); setOrders(current => current.map(item => item.id === next.id ? next : item));
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const details = selected?.details || {};

  return <main style={{ minHeight: '100vh', background: '#f7f4ef', color: '#2d211b', fontFamily: 'var(--font-body)', padding: '2rem clamp(1rem, 4vw, 4rem)' }}>
    <header style={{ maxWidth: '1400px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}><div><div style={{ letterSpacing: '.16em', color: '#9a765e', fontWeight: 800, fontSize: '.7rem' }}>FOLDÈ STUDIO</div><h1 style={{ fontFamily: 'var(--font-heading)', margin: '.35rem 0 0', fontSize: '2rem' }}>Expert orders</h1></div><div style={{ display: 'flex', gap: '.7rem' }}><button onClick={loadOrders} style={buttonSecondary}>Refresh</button><Link href="/" style={{ ...buttonSecondary, textDecoration: 'none' }}>View website</Link></div></header>
    {error && <div style={{ maxWidth: '1400px', margin: '0 auto 1rem', padding: '1rem', borderRadius: '12px', background: '#fff2f2', color: '#b42318' }}>{error}{error.includes('not configured') && ' Add ADMIN_EMAILS to Vercel, with your administrator email address.'}</div>}
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(320px, .85fr) minmax(0, 1.5fr)', gap: '1.5rem', alignItems: 'start' }}>
      <section style={panelStyle}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}><h2 style={headingStyle}>Orders</h2><select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}><option value="expert">Expert only</option><option value="all">All orders</option></select></div>{loading ? <p style={{ color: '#766b62' }}>Loading studio orders…</p> : visibleOrders.length === 0 ? <p style={{ color: '#766b62' }}>No orders found.</p> : visibleOrders.map(order => <button key={order.id} onClick={() => setSelected(order)} style={{ ...orderRowStyle, borderColor: selected?.id === order.id ? '#8a5b38' : '#eadfd5' }}><div><strong>{order.couple}</strong><div style={{ color: '#766b62', fontSize: '.8rem', marginTop: '.25rem' }}>{order.user_email || order.email} · {order.plan}</div></div><span style={statusStyle(order.status)}>{order.status || 'In Creation'}</span></button>)}</section>
      <section style={panelStyle}>{!selected ? <div style={{ minHeight: '440px', display: 'grid', placeItems: 'center', textAlign: 'center', color: '#766b62' }}>Select an order to see its complete client brief.</div> : <>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid #eadfd5', paddingBottom: '1.25rem', marginBottom: '1.4rem' }}><div><div style={{ color: '#9a765e', letterSpacing: '.12em', fontSize: '.7rem', fontWeight: 800 }}>{selected.id} · {selected.plan}</div><h2 style={{ ...headingStyle, marginTop: '.4rem' }}>{selected.couple}</h2><p style={{ margin: '.35rem 0 0', color: '#766b62' }}>{selected.user_email || selected.email} · Ordered {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : selected.date}</p></div><span style={statusStyle(selected.status)}>{selected.status || 'In Creation'}</span></div>
        <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}><a href={`/invite/${selected.slug}?preview=true`} target="_blank" rel="noreferrer" style={{ ...buttonSecondary, textDecoration: 'none' }}>Preview draft</a>{selected.status === 'Live' && <a href={`/invite/${selected.slug}`} target="_blank" rel="noreferrer" style={{ ...buttonSecondary, textDecoration: 'none' }}>Open live site</a>}<button disabled={saving} onClick={() => updateOrder('status', 'In Creation')} style={buttonSecondary}>In creation</button><button disabled={saving} onClick={() => updateOrder('status', 'Changes Requested')} style={buttonSecondary}>Request changes</button><button disabled={saving} onClick={() => updateOrder('publish')} style={buttonPrimary}>{saving ? 'Saving…' : 'Validate & publish'}</button></div>
        <div style={gridStyle}><Info title="Client contact" rows={[["Email", selected.user_email || selected.email], ["Phone", details.phone], ["Guest count", details.guestCount], ["Languages", details.languages]]}/><Info title="Wedding" rows={[["Date", details.date], ["Venue", details.ceremonyVenue], ["City / country", details.receptionVenue], ["Theme", selected.theme]]}/><Info title="Design selections" rows={[["Envelope", details.envelopeChoice], ["Hero video", details.heroVideoChoice], ["Colors", details.colorPreferences], ["Sections", Object.entries(details.sections || {}).filter(([, enabled]) => enabled).map(([key]) => key.replace(/^show/, '')).join(', ')]]}/></div>
        <TextBlock title="Celebration story" value={details.designStory}/><TextBlock title="Creative direction" value={details.creativeDirection}/><TextBlock title="Inspiration links" value={details.inspirationLinks}/><TextBlock title="Additional requests" value={details.specialRequests}/><TextBlock title="Menu and reception notes" value={details.menu?.map(item => `${item.course}: ${item.dish}`).join('\n')}/>
        <div style={{ marginTop: '1rem', padding: '1rem 1.15rem', border: '1px solid #eadfd5', borderRadius: '14px', background: '#fffcf8' }}><strong style={{ fontSize: '.9rem' }}>Submitted files</strong><p style={{ color: '#766b62', fontSize: '.85rem', margin: '.5rem 0 0' }}>{details.submittedAssets?.length ? details.submittedAssets.join(', ') : 'No files submitted with this order.'}</p></div>
      </>}</section>
    </div>
  </main>;
}
function Info({ title, rows }) { return <div style={{ border: '1px solid #eadfd5', borderRadius: '14px', padding: '1rem', background: '#fffcf8' }}><strong style={{ fontSize: '.9rem' }}>{title}</strong>{rows.map(([name, value]) => <div key={name} style={{ marginTop: '.65rem', fontSize: '.85rem' }}><span style={{ color: '#8a7b70' }}>{name}</span><div style={{ marginTop: '.12rem', wordBreak: 'break-word' }}>{label(value)}</div></div>)}</div>; }
function TextBlock({ title, value }) { if (!value) return null; return <section style={{ marginTop: '1rem', padding: '1rem 1.15rem', border: '1px solid #eadfd5', borderRadius: '14px', background: '#fffcf8' }}><strong style={{ fontSize: '.9rem' }}>{title}</strong><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, color: '#5f554e', margin: '.55rem 0 0' }}>{value}</p></section>; }
const panelStyle = { background: '#fff', border: '1px solid #eadfd5', borderRadius: '22px', padding: '1.3rem', boxShadow: '0 10px 30px rgba(81, 54, 36, .05)' };
const headingStyle = { fontFamily: 'var(--font-heading)', fontSize: '1.35rem', margin: 0 };
const buttonSecondary = { border: '1px solid #dacabb', background: '#fff', color: '#5c3a1e', borderRadius: '9px', padding: '.6rem .85rem', fontFamily: 'inherit', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer' };
const buttonPrimary = { ...buttonSecondary, background: '#5c3a1e', color: '#fff', borderColor: '#5c3a1e' };
const selectStyle = { border: '1px solid #dacabb', borderRadius: '8px', padding: '.45rem', color: '#5c3a1e', background: '#fff' };
const orderRowStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', gap: '.75rem', textAlign: 'left', alignItems: 'center', padding: '1rem .2rem', background: 'transparent', border: '1px solid', borderLeft: '0', borderRight: '0', cursor: 'pointer', fontFamily: 'inherit' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' };
const statusStyle = (status) => ({ padding: '.3rem .55rem', borderRadius: '999px', fontSize: '.7rem', fontWeight: 800, whiteSpace: 'nowrap', background: status === 'Live' ? '#e8f7ec' : status === 'Changes Requested' ? '#fff1e9' : '#fff7d9', color: status === 'Live' ? '#24713a' : status === 'Changes Requested' ? '#b54613' : '#8a6710' });
