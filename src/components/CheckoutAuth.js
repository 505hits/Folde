"use client";

import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { pagePath } from '@/lib/routes.mjs';

const copy = {
  en: {
    title: 'Your preview is saved', text: 'Choose a password to keep your invitation in your private account.',
    loginText: 'Sign in with your password to continue with your saved preview.',
    login: 'Sign in & see packages', signup: 'Create my account & see packages',
    password: 'Password', hint: 'At least 6 characters', confirm: 'Confirm your email using the link we sent. Your choices are saved; you can then continue to the packages.',
    existing: 'Already have an account? Sign in', new: 'Create an account',
    ready: 'You are signed in. Your preview is saved.', continue: 'See packages', back: 'Change email',
  },
  fr: {
    title: 'Votre aperçu est enregistré', text: 'Choisissez un mot de passe pour retrouver votre invitation dans votre compte privé.',
    loginText: 'Connectez-vous avec votre mot de passe pour continuer avec votre aperçu enregistré.',
    login: 'Me connecter et voir les formules', signup: 'Créer mon compte et voir les formules',
    password: 'Mot de passe', hint: '6 caractères minimum', confirm: 'Confirmez votre adresse via le lien reçu par e-mail. Vos choix sont enregistrés ; vous pourrez ensuite voir les formules.',
    existing: 'Déjà un compte ? Se connecter', new: 'Créer un compte',
    ready: 'Vous êtes connecté. Votre aperçu est enregistré.', continue: 'Voir les formules', back: 'Modifier mon e-mail',
  },
  es: {
    title: 'Vuestra vista previa está guardada', text: 'Elige una contraseña para guardar tu invitación en tu cuenta privada.',
    loginText: 'Inicia sesión con tu contraseña para continuar con la vista previa guardada.',
    login: 'Iniciar sesión y ver los planes', signup: 'Crear mi cuenta y ver los planes',
    password: 'Contraseña', hint: 'Mínimo 6 caracteres', confirm: 'Confirma tu correo con el enlace recibido. Las opciones están guardadas; después podrás ver los planes.',
    existing: '¿Ya tienes cuenta? Iniciar sesión', new: 'Crear una cuenta',
    ready: 'Sesión iniciada. Vuestra vista previa está guardada.', continue: 'Ver los planes', back: 'Cambiar e-mail',
  },
};

export default function CheckoutAuth({ locale = 'en', email, onClose, onReady }) {
  const { currentUser, login, register } = useDatabase();
  const [mode, setMode] = useState('signup');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const t = copy[locale] || copy.en;
  const signedIn = currentUser?.email?.toLowerCase() === email.toLowerCase();
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      if (signedIn) { await onReady(); return; }
      const draft = JSON.parse(sessionStorage.getItem('checkoutPreviewDraft') || '{}');
      const result = mode === 'login'
        ? await login(email, password)
        : await register(email, password, draft.name || '', draft.partnerName || '', `${window.location.origin}${pagePath(locale, 'packages')}`);
      if (!result.success) setMessage(result.error);
      else if (result.requiresConfirmation) { setMessage(t.confirm); setMode('login'); setPassword(''); }
      else { setPassword(''); await onReady(); }
    } catch (error) { setMessage(error.message || 'Unable to sign in. Please try again.'); }
    finally { setBusy(false); }
  };
  const field = { width: '100%', padding: '1rem', border: '1px solid #cab9a8', borderRadius: 12, font: 'inherit', boxSizing: 'border-box' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#faf7f1', display: 'grid', placeItems: 'center', padding: 20, overflowY: 'auto' }}>
      <section aria-labelledby="checkout-auth-title" style={{ background: '#fffdf9', color: '#3d2b1f', padding: 28, borderRadius: 24, width: 'min(100%, 440px)', boxSizing: 'border-box', border: '1px solid #e6dacc' }}>
        <h1 id="checkout-auth-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem' }}>{t.title}</h1>
        <p style={{ lineHeight: 1.6 }}>{signedIn ? t.ready : mode === 'signup' ? t.text : t.loginText}</p>
        <form onSubmit={submit} style={{ display: 'grid', gap: 16, margin: '20px 0' }}>
          <label>Email<input readOnly type="email" autoComplete="username" value={email} style={{ ...field, background: '#f3ede5' }} /></label>
          {!signedIn && <label>{t.password}<input required minLength={6} type="password" autoFocus autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} style={field} /><small>{t.hint}</small></label>}
          {message && <p role="status" style={{ lineHeight: 1.5 }}>{message}</p>}
          <button disabled={busy} style={{ ...field, background: '#5c3a1e', color: '#fff', fontWeight: 700, minHeight: 54 }}>{busy ? '…' : signedIn ? t.continue : t[mode]}</button>
          {!signedIn && <button type="button" disabled={busy} style={{ border: 0, background: 'transparent', color: '#5c3a1e', font: 'inherit', fontSize: '.9rem', textDecoration: 'underline', minHeight: 44, cursor: 'pointer' }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); setPassword(''); }}>{mode === 'login' ? t.new : t.existing}</button>}
        </form>
        <button type="button" disabled={busy} style={{ border: 0, background: 'transparent', color: '#806f62', font: 'inherit', fontSize: '.85rem', minHeight: 44, padding: '0 .25rem', cursor: 'pointer' }} onClick={onClose}>{t.back}</button>
      </section>
    </div>
  );
}
