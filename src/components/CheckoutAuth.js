"use client";

import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';

const copy = {
  en: { title: 'Your private account', login: 'Sign in', signup: 'Create an account', password: 'Password (at least 6 characters)', confirm: 'Confirm your email using the link we sent, then sign in here.', ready: 'You are signed in. Continue to payment.', close: 'Back to packages', google: 'Continue with Google', or: 'or with your email', googleError: 'Google sign-in could not start. Please try again or use your email.' },
  fr: { title: 'Votre compte privé', login: 'Se connecter', signup: 'Créer un compte', password: 'Mot de passe (6 caractères minimum)', confirm: 'Confirmez votre adresse via le lien reçu par e-mail, puis connectez-vous ici.', ready: 'Vous êtes connecté. Continuez vers le paiement.', close: 'Retour aux formules', google: 'Continuer avec Google', or: 'ou avec votre e-mail', googleError: 'La connexion Google n’a pas pu démarrer. Réessayez ou utilisez votre e-mail.' },
  es: { title: 'Vuestra cuenta privada', login: 'Iniciar sesión', signup: 'Crear una cuenta', password: 'Contraseña (mínimo 6 caracteres)', confirm: 'Confirma tu correo con el enlace recibido y después inicia sesión aquí.', ready: 'Sesión iniciada. Continúa al pago.', close: 'Volver a los planes', google: 'Continuar con Google', or: 'o con vuestro correo', googleError: 'No se pudo iniciar la sesión con Google. Inténtalo de nuevo o usa tu correo.' },
};

export function GoogleMark() {
  return <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>;
}

export default function CheckoutAuth({ locale, onClose, onReady, initialEmail = '', initialMode = 'login', onBeforeGoogle }) {
  const { currentUser, login, register, loginWithGoogle } = useDatabase();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState(initialEmail);
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
      else await onReady();
    } catch { setMessage('Unable to sign in. Please try again.'); }
    finally { setBusy(false); }
  };
  const google = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      if (onBeforeGoogle) await onBeforeGoogle();
      const result = await loginWithGoogle();
      if (!result.success) { setMessage(t.googleError); setBusy(false); }
    } catch { setMessage(t.googleError); setBusy(false); }
  };
  const field = { width: '100%', padding: '1rem', border: '1px solid #cab9a8', borderRadius: 8 };
  const linkButton = { border: 0, background: 'none', padding: '.4rem 0', color: '#4a2f1e', font: 'inherit', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0008', display: 'grid', placeItems: 'center', padding: 20 }}>
      <section role="dialog" aria-modal="true" aria-labelledby="checkout-auth-title" style={{ background: '#fffaf5', color: '#3d2b1f', padding: 32, borderRadius: 20, width: 'min(100%, 440px)' }}>
        <h2 id="checkout-auth-title">{t.title}</h2>
        {!currentUser && <>
          <button type="button" disabled={busy} onClick={google} style={{ ...field, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#fff', color: '#1a1a1a', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            <GoogleMark />{t.google}
          </button>
          <p aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 0', color: '#8a7867', fontSize: 13 }}><span style={{ flex: 1, height: 1, background: '#e3d6c8' }} />{t.or}<span style={{ flex: 1, height: 1, background: '#e3d6c8' }} /></p>
        </>}
        {currentUser ? <p>{t.ready}</p> : <form onSubmit={submit} style={{ display: 'grid', gap: 16, margin: '20px 0' }}>
          <label style={initialEmail ? {display:'none'} : undefined}>Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={field} /></label>
          <label>{t.password}<input required minLength={6} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} style={field} /></label>
          {message && <p role="status">{message}</p>}
          <button disabled={busy} style={{ ...field, border: 0, borderRadius: 999, background: '#4a2f1e', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{busy ? '…' : t[mode]}</button>
          <button type="button" disabled={busy} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }} style={linkButton}>{mode === 'login' ? t.signup : t.login}</button>
        </form>}
        <button type="button" onClick={onClose} style={{ ...linkButton, color: '#8a7867', fontWeight: 500 }}>{t.close}</button>
      </section>
    </div>
  );
}
