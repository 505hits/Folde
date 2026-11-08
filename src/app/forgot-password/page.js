"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      if (result.error) throw result.error;
      setMessage('If this email belongs to an account, you will receive a secure link to choose your password. Please also check your spam folder.');
    } catch { setError('We could not send the recovery link. Please try again in a moment.'); }
    finally { setBusy(false); }
  };
  return <main style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', padding: '2rem', background: '#faf8f5' }}>
    <section style={{ maxWidth: 440, width: '100%', background: '#fff', padding: '2rem', border: '1px solid #e0dcd7', borderRadius: 20 }}>
      <h1>Choose or reset your password</h1>
      <p>Use the email address from your purchase. Your wedding invitation and guest responses will stay unchanged.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
        <label>Email<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} style={{ display: 'block', width: '100%', padding: '.75rem', marginTop: '.5rem' }} /></label>
        <button disabled={busy} style={{ padding: '.85rem', borderRadius: 8, border: 0, background: '#5c3a1e', color: '#fff' }}>{busy ? 'Sending…' : 'Send a secure recovery link'}</button>
      </form>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      <Link href="/dashboard">Back to sign in</Link>
    </section>
  </main>;
}
