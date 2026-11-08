"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const accept = session => { if (active) { setReady(!!session?.user); setChecking(false); } };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => accept(session));
    supabase.auth.getSession().then(({ data, error }) => { if (active) accept(error ? null : data.session); }).catch(() => { if (active) { setReady(false); setChecking(false); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const submit = async event => {
    event.preventDefault(); setError('');
    if (password.length < 8 || password !== confirmation) { setError('Use at least 8 characters and enter the same password twice.'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword(''); setConfirmation(''); setSaved(true);
    } catch (err) { setError(err.message || 'Your password could not be saved. Please request a new recovery link.'); }
    finally { setBusy(false); }
  };
  return <main style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', padding: '2rem', background: '#faf8f5' }}>
    <section style={{ maxWidth: 440, width: '100%', background: '#fff', padding: '2rem', border: '1px solid #e0dcd7', borderRadius: 20 }}>
      <h1>Set your password</h1>
      {checking ? <p role="status">Checking your secure link…</p> : saved ? <><p role="status">Your password has been saved. Your wedding details and guest responses have not been changed.</p><Link href="/dashboard">Open your dashboard</Link></> : !ready ? <><p>This recovery link is missing or has expired.</p><Link href="/forgot-password">Request a new recovery link</Link></> : <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
        <label>New password<input type="password" minLength={8} autoComplete="new-password" required value={password} onChange={event => setPassword(event.target.value)} style={{ display: 'block', width: '100%', padding: '.75rem', marginTop: '.5rem' }} /></label>
        <label>Confirm password<input type="password" minLength={8} autoComplete="new-password" required value={confirmation} onChange={event => setConfirmation(event.target.value)} style={{ display: 'block', width: '100%', padding: '.75rem', marginTop: '.5rem' }} /></label>
        <button disabled={busy} style={{ padding: '.85rem', borderRadius: 8, border: 0, background: '#5c3a1e', color: '#fff' }}>{busy ? 'Saving…' : 'Save my password'}</button>
      </form>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
    </section>
  </main>;
}
