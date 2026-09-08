"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const isExpert = (order) => ['custom', 'expert'].includes(String(order?.plan || '').toLowerCase());
const label = (value) => value || 'No indicado';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [access, setAccess] = useState('checking');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [filter, setFilter] = useState('expert');
  const [saving, setSaving] = useState(false);

  const request = async (method = 'GET', body) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/admin/orders', { method, headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Ha ocurrido un error.');
    return data;
  };
  const loadOrders = async () => {
    setLoading(true); setError('');
    try {
      setOrders((await request()).orders || []);
      setAccess('authorized');
    } catch (err) {
      setError(err.message);
      setAccess(err.message === 'Inicia sesión para acceder al estudio.' ? 'signed-out' : 'forbidden');
    } finally { setLoading(false); }
  };
  useEffect(() => {
    const timer = setTimeout(() => { loadOrders(); }, 0);
    return () => clearTimeout(timer);
  }, []);
  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoginError(''); setSigningIn(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: credentials.email.trim(), password: credentials.password });
    if (authError) {
      setLoginError(authError.message === 'Invalid login credentials' ? 'El correo o la contraseña no son válidos.' : authError.message);
      setSigningIn(false);
      return;
    }
    setAccess('checking');
    await loadOrders();
    setSigningIn(false);
  };
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

  if (access !== 'authorized') {
    return <AdminAccessGate access={access} credentials={credentials} setCredentials={setCredentials} loginError={loginError || (access === 'forbidden' ? error : '')} signingIn={signingIn} onSubmit={handleSignIn} />;
  }

  return <main style={{ minHeight: '100vh', background: '#f7f4ef', color: '#2d211b', fontFamily: 'var(--font-body)', padding: '2rem clamp(1rem, 4vw, 4rem)' }}>
    <header style={{ maxWidth: '1400px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}><div><div style={{ letterSpacing: '.16em', color: '#9a765e', fontWeight: 800, fontSize: '.7rem' }}>FOLDÈ STUDIO</div><h1 style={{ fontFamily: 'var(--font-heading)', margin: '.35rem 0 0', fontSize: '2rem' }}>Pedidos Expert</h1></div><div style={{ display: 'flex', gap: '.7rem' }}><button onClick={loadOrders} style={buttonSecondary}>Actualizar</button><button onClick={async () => { await supabase.auth.signOut(); setAccess('signed-out'); setOrders([]); setSelected(null); }} style={buttonSecondary}>Cerrar sesión</button><Link href="/" style={{ ...buttonSecondary, textDecoration: 'none' }}>Ver sitio web</Link></div></header>
    {error && <div style={{ maxWidth: '1400px', margin: '0 auto 1rem', padding: '1rem', borderRadius: '12px', background: '#fff2f2', color: '#b42318' }}>{error}{error.includes('not configured') && ' Añade ADMIN_EMAILS en Vercel con la dirección de correo de tu administrador.'}</div>}
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(320px, .85fr) minmax(0, 1.5fr)', gap: '1.5rem', alignItems: 'start' }}>
      <section style={panelStyle}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}><h2 style={headingStyle}>Pedidos</h2><select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}><option value="expert">Solo Expert</option><option value="all">Todos los pedidos</option></select></div>{loading ? <p style={{ color: '#766b62' }}>Cargando pedidos del estudio…</p> : visibleOrders.length === 0 ? <p style={{ color: '#766b62' }}>No se han encontrado pedidos.</p> : visibleOrders.map(order => <button key={order.id} onClick={() => setSelected(order)} style={{ ...orderRowStyle, borderColor: selected?.id === order.id ? '#8a5b38' : '#eadfd5' }}><div><strong>{order.couple}</strong><div style={{ color: '#766b62', fontSize: '.8rem', marginTop: '.25rem' }}>{order.user_email || order.email} · {order.plan}</div></div><span style={statusStyle(order.status)}>{order.status || 'En creación'}</span></button>)}</section>
      <section style={panelStyle}>{!selected ? <div style={{ minHeight: '440px', display: 'grid', placeItems: 'center', textAlign: 'center', color: '#766b62' }}>Selecciona un pedido para ver el briefing completo del cliente.</div> : <>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid #eadfd5', paddingBottom: '1.25rem', marginBottom: '1.4rem' }}><div><div style={{ color: '#9a765e', letterSpacing: '.12em', fontSize: '.7rem', fontWeight: 800 }}>{selected.id} · {selected.plan}</div><h2 style={{ ...headingStyle, marginTop: '.4rem' }}>{selected.couple}</h2><p style={{ margin: '.35rem 0 0', color: '#766b62' }}>{selected.user_email || selected.email} · Pedido {selected.created_at ? new Date(selected.created_at).toLocaleDateString('es-ES') : selected.date}</p></div><span style={statusStyle(selected.status)}>{selected.status || 'En creación'}</span></div>
        <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}><a href={`/invite/${selected.slug}?preview=true`} target="_blank" rel="noreferrer" style={{ ...buttonSecondary, textDecoration: 'none' }}>Vista previa</a>{selected.status === 'Live' && <a href={`/invite/${selected.slug}`} target="_blank" rel="noreferrer" style={{ ...buttonSecondary, textDecoration: 'none' }}>Abrir sitio publicado</a>}<button disabled={saving} onClick={() => updateOrder('status', 'In Creation')} style={buttonSecondary}>En creación</button><button disabled={saving} onClick={() => updateOrder('status', 'Changes Requested')} style={buttonSecondary}>Solicitar cambios</button><button disabled={saving} onClick={() => updateOrder('publish')} style={buttonPrimary}>{saving ? 'Guardando…' : 'Validar y publicar'}</button></div>
        <div style={gridStyle}><Info title="Contacto del cliente" rows={[["Correo", selected.user_email || selected.email], ["Teléfono", details.phone], ["Número de invitados", details.guestCount], ["Idiomas", details.languages]]}/><Info title="Boda" rows={[["Fecha", details.date], ["Lugar", details.ceremonyVenue], ["Ciudad / país", details.receptionVenue], ["Tema", selected.theme]]}/><Info title="Selecciones de diseño" rows={[["Sobre", details.envelopeChoice], ["Vídeo de portada", details.heroVideoChoice], ["Colores", details.colorPreferences], ["Secciones", Object.entries(details.sections || {}).filter(([, enabled]) => enabled).map(([key]) => key.replace(/^show/, '')).join(', ')]]}/></div>
        <TextBlock title="Historia de la celebración" value={details.designStory}/><TextBlock title="Dirección creativa" value={details.creativeDirection}/><TextBlock title="Enlaces de inspiración" value={details.inspirationLinks}/><TextBlock title="Solicitudes adicionales" value={details.specialRequests}/><TextBlock title="Notas sobre el menú y la recepción" value={details.menu?.map(item => `${item.course}: ${item.dish}`).join('\n')}/>
        <div style={{ marginTop: '1rem', padding: '1rem 1.15rem', border: '1px solid #eadfd5', borderRadius: '14px', background: '#fffcf8' }}><strong style={{ fontSize: '.9rem' }}>Archivos enviados</strong><p style={{ color: '#766b62', fontSize: '.85rem', margin: '.5rem 0 0' }}>{details.submittedAssets?.length ? details.submittedAssets.join(', ') : 'No se han enviado archivos con este pedido.'}</p></div>
      </>}</section>
    </div>
  </main>;
}
function AdminAccessGate({ access, credentials, setCredentials, loginError, signingIn, onSubmit }) {
  const checking = access === 'checking';
  const denied = access === 'forbidden';
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f7f4ef', color: '#2d211b', fontFamily: 'var(--font-body)', padding: '1rem' }}>
    <section style={{ width: 'min(100%, 420px)', background: '#fff', border: '1px solid #eadfd5', borderRadius: '22px', boxShadow: '0 18px 50px rgba(81, 54, 36, .08)', padding: '2rem', boxSizing: 'border-box' }}>
      <div style={{ letterSpacing: '.16em', color: '#9a765e', fontWeight: 800, fontSize: '.7rem' }}>FOLDÈ STUDIO</div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '.55rem 0' }}>{checking ? 'Comprobando el acceso…' : denied ? 'Acceso restringido' : 'Acceso de administrador'}</h1>
      <p style={{ color: '#766b62', lineHeight: 1.55, margin: '0 0 1.5rem' }}>{denied ? 'Esta cuenta no está autorizada para acceder a Folde Studio.' : 'Inicia sesión con el correo y la contraseña de una cuenta autorizada de Folde Studio.'}</p>
      {!checking && !denied && <form onSubmit={onSubmit} style={{ display: 'grid', gap: '.9rem' }}>
        <label style={{ fontSize: '.82rem', fontWeight: 700 }}>Email<input type="email" required autoComplete="email" value={credentials.email} onChange={event => setCredentials({ ...credentials, email: event.target.value })} style={{ ...inputStyle, marginTop: '.4rem' }} /></label>
        <label style={{ fontSize: '.82rem', fontWeight: 700 }}>Contraseña<input type="password" required autoComplete="current-password" value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} style={{ ...inputStyle, marginTop: '.4rem' }} /></label>
        {loginError && <div style={{ background: '#fff2f2', color: '#b42318', borderRadius: '9px', padding: '.7rem .8rem', fontSize: '.84rem' }}>{loginError}</div>}
        <button type="submit" disabled={signingIn} style={{ ...buttonPrimary, width: '100%', padding: '.8rem', opacity: signingIn ? .7 : 1 }}>{signingIn ? 'Iniciando sesión…' : 'Entrar en Studio'}</button>
      </form>}
      {denied && <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} style={buttonPrimary}>Usar otra cuenta</button>}
    </section>
  </main>;
}
function Info({ title, rows }) { return <div style={{ border: '1px solid #eadfd5', borderRadius: '14px', padding: '1rem', background: '#fffcf8' }}><strong style={{ fontSize: '.9rem' }}>{title}</strong>{rows.map(([name, value]) => <div key={name} style={{ marginTop: '.65rem', fontSize: '.85rem' }}><span style={{ color: '#8a7b70' }}>{name}</span><div style={{ marginTop: '.12rem', wordBreak: 'break-word' }}>{label(value)}</div></div>)}</div>; }
function TextBlock({ title, value }) { if (!value) return null; return <section style={{ marginTop: '1rem', padding: '1rem 1.15rem', border: '1px solid #eadfd5', borderRadius: '14px', background: '#fffcf8' }}><strong style={{ fontSize: '.9rem' }}>{title}</strong><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, color: '#5f554e', margin: '.55rem 0 0' }}>{value}</p></section>; }
const panelStyle = { background: '#fff', border: '1px solid #eadfd5', borderRadius: '22px', padding: '1.3rem', boxShadow: '0 10px 30px rgba(81, 54, 36, .05)' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '.75rem .8rem', border: '1px solid #dacabb', borderRadius: '9px', font: 'inherit', color: '#2d211b', background: '#fff' };
const headingStyle = { fontFamily: 'var(--font-heading)', fontSize: '1.35rem', margin: 0 };
const buttonSecondary = { border: '1px solid #dacabb', background: '#fff', color: '#5c3a1e', borderRadius: '9px', padding: '.6rem .85rem', fontFamily: 'inherit', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer' };
const buttonPrimary = { ...buttonSecondary, background: '#5c3a1e', color: '#fff', borderColor: '#5c3a1e' };
const selectStyle = { border: '1px solid #dacabb', borderRadius: '8px', padding: '.45rem', color: '#5c3a1e', background: '#fff' };
const orderRowStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', gap: '.75rem', textAlign: 'left', alignItems: 'center', padding: '1rem .2rem', background: 'transparent', border: '1px solid', borderLeft: '0', borderRight: '0', cursor: 'pointer', fontFamily: 'inherit' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' };
const statusStyle = (status) => ({ padding: '.3rem .55rem', borderRadius: '999px', fontSize: '.7rem', fontWeight: 800, whiteSpace: 'nowrap', background: status === 'Live' ? '#e8f7ec' : status === 'Changes Requested' ? '#fff1e9' : '#fff7d9', color: status === 'Live' ? '#24713a' : status === 'Changes Requested' ? '#b54613' : '#8a6710' });
