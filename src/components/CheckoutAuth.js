"use client";

import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';

const copy = {
  en: { title: 'Your private account', login: 'Sign in', signup: 'Create an account', password: 'Password (at least 6 characters)', confirm: 'Confirm your email using the link we sent, then sign in here.', ready: 'You are signed in. Continue to payment.', close: 'Back to packages' },
  fr: { title: 'Votre compte privé', login: 'Se connecter', signup: 'Créer un compte', password: 'Mot de passe (6 caractères minimum)', confirm: 'Confirmez votre adresse via le lien reçu par e-mail, puis connectez-vous ici.', ready: 'Vous êtes connecté. Continuez vers le paiement.', close: 'Retour aux formules' },
  es: { title: 'Vuestra cuenta privada', login: 'Iniciar sesión', signup: 'Crear una cuenta', password: 'Contraseña (mínimo 6 caracteres)', confirm: 'Confirma tu correo con el enlace recibido y después inicia sesión aquí.', ready: 'Sesión iniciada. Continúa al pago.', close: 'Volver a los planes' },
};

export default function CheckoutAuth({ locale, onClose, onReady }) {
  const { currentUser, login, register } = useDatabase();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const t = copy[locale] || copy.en;
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const draft = JSON.parse(sessionStorage.getItem('checkoutPreviewDraft') || '{}');
      const result = mode === 'login'
        ? await login(email, password)
        : await register(email, password, draft.name || '', draft.partnerName || '');
      if (!result.success) setMessage(result.error);
      else if (result.requiresConfirmation) { setMessage(t.confirm); setMode('login'); }
      else onReady();
    } catch { setMessage('Unable to sign in. Please try again.'); }
    finally { setBusy(false); }
  };
  const field = { width: '100%', padding: '1rem', border: '1px solid #cab9a8', borderRadius: 8 };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0008', display: 'grid', placeItems: 'center', padding: 20 }}>
      <section role="dialog" aria-modal="true" aria-labelledby="checkout-auth-title" style={{ background: '#fffaf5', color: '#3d2b1f', padding: 32, borderRadius: 20, width: 'min(100%, 440px)' }}>
        <h2 id="checkout-auth-title">{t.title}</h2>
        {currentUser ? <p>{t.ready}</p> : <form onSubmit={submit} style={{ display: 'grid', gap: 16, margin: '20px 0' }}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={field} /></label>
          <label>{t.password}<input required minLength={6} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} style={field} /></label>
          {message && <p role="status">{message}</p>}
          <button disabled={busy} style={field}>{busy ? '…' : t[mode]}</button>
          <button type="button" disabled={busy} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}>{mode === 'login' ? t.signup : t.login}</button>
        </form>}
        <button type="button" onClick={onClose}>{t.close}</button>
      </section>
    </div>
  );
}
