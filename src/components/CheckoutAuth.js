"use client";

import { useEffect, useRef, useState } from 'react';
import { useDatabase, MIN_PASSWORD_LENGTH } from '@/context/DatabaseContext';

const copy = {
  en: { title: 'Save your invitation', text: 'Keep your design and continue with your private account.', google: 'Continue with Google', close: 'Back', error: 'Unable to sign in. Please try again.', or: 'or with your email' },
  fr: { title: 'Enregistrez votre invitation', text: 'Retrouvez votre design et continuez avec votre compte privé.', google: 'Continuer avec Google', close: 'Retour', error: 'Connexion impossible. Réessayez.', or: 'ou avec votre e-mail' },
  es: { title: 'Guardad vuestra invitación', text: 'Conservad vuestro diseño y continuad con vuestra cuenta privada.', google: 'Continuar con Google', close: 'Volver', error: 'No se ha podido iniciar sesión. Intentadlo de nuevo.', or: 'o con vuestro correo' },
};

// Shared wording for the "email, then password" step used across the checkout.
export const PASSWORD_COPY = {
  en: { email: 'Email', password: 'Password', hint: 'New here? Choose a password (5 characters or more): your account is created instantly.', continue: 'Continue', change: 'Change email', short: 'Your password needs at least 5 characters.', wrong: 'This email already has an account and the password does not match. Try again or continue with Google.', confirm: 'Your account is created. Please confirm it from the email we just sent, then come back here.', invalidEmail: 'Please enter a valid email address.' },
  fr: { email: 'E-mail', password: 'Mot de passe', hint: 'Nouveau ? Choisissez un mot de passe (5 caractères ou plus) : votre compte est créé tout de suite.', continue: 'Continuer', change: 'Modifier l’e-mail', short: 'Votre mot de passe doit contenir au moins 5 caractères.', wrong: 'Cet e-mail a déjà un compte et le mot de passe ne correspond pas. Réessayez ou continuez avec Google.', confirm: 'Votre compte est créé. Confirmez-le depuis l’e-mail que nous venons d’envoyer, puis revenez ici.', invalidEmail: 'Indiquez une adresse e-mail valide.' },
  es: { email: 'Correo', password: 'Contraseña', hint: '¿Nuevos? Elegid una contraseña (5 caracteres o más): la cuenta se crea al instante.', continue: 'Continuar', change: 'Cambiar el correo', short: 'La contraseña necesita al menos 5 caracteres.', wrong: 'Este correo ya tiene una cuenta y la contraseña no coincide. Intentadlo de nuevo o continuad con Google.', confirm: 'La cuenta está creada. Confirmadla desde el correo que acabamos de enviar y volved aquí.', invalidEmail: 'Introducid un correo válido.' },
};
export const passwordCopy = (locale) => PASSWORD_COPY[locale] || PASSWORD_COPY.en;
export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value || '');
export function passwordMessage(result, locale) {
  const p = passwordCopy(locale);
  if (result?.code === 'short') return p.short;
  if (result?.code === 'wrong-password') return p.wrong;
  if (result?.code === 'confirm-email') return p.confirm;
  return result?.error || (copy[locale] || copy.en).error;
}
export { MIN_PASSWORD_LENGTH };

export function GoogleMark() {
  return <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>;
}

export default function CheckoutAuth({ locale, onClose, onReady, initialEmail = '' }) {
  const { currentUser, loginWithGoogle, signInOrCreate } = useDatabase();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [passwordStep, setPasswordStep] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const continued = useRef(false);
  const readyRef = useRef(onReady);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);
  const t = copy[locale] || copy.en;
  const p = passwordCopy(locale);
  const returnPath = locale === 'fr' || locale === 'es' ? `/${locale}/packages` : '/packages';
  useEffect(() => {
    if (!currentUser || continued.current) return;
    continued.current = true;
    Promise.resolve().then(() => readyRef.current()).catch(() => {
      continued.current = false;
      setMessage(t.error);
    });
  }, [currentUser, t.error]);
  const google = async () => {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      const result = await loginWithGoogle(returnPath);
      if (!result.success) setMessage(result.error || t.error);
    } catch { setMessage(t.error); }
    finally { setBusy(false); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setMessage('');
    if (!passwordStep) {
      if (!isEmail(email)) return setMessage(p.invalidEmail);
      return setPasswordStep(true);
    }
    setBusy(true);
    try {
      const result = await signInOrCreate(email, password);
      if (!result.success) setMessage(passwordMessage(result, locale));
    } catch { setMessage(t.error); }
    finally { setBusy(false); }
  };
  const field = { width: '100%', minHeight: 50, padding: '1rem', border: '1px solid #cab9a8', borderRadius: 12, font: 'inherit', boxSizing: 'border-box' };
  return <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0008', display: 'grid', placeItems: 'center', padding: 20 }}>
    <section role="dialog" aria-modal="true" aria-labelledby="checkout-auth-title" style={{ background: '#fffaf5', color: '#3d2b1f', padding: 28, borderRadius: 24, width: 'min(100%, 440px)' }}>
      <h2 id="checkout-auth-title">{t.title}</h2><p>{t.text}</p>
      {!currentUser && <>
        <button autoFocus type="button" disabled={busy} onClick={google} style={{ ...field, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#fff', fontWeight: 700 }}><GoogleMark />{t.google}</button>
        <p style={{ textAlign: 'center', color: '#806f62' }}>{t.or}</p>
        <form onSubmit={submit} style={{ display: 'grid', gap: 14, margin: '16px 0' }}>
          <label>{p.email}<input required type="email" autoComplete="email" readOnly={passwordStep} value={email} onChange={e => setEmail(e.target.value)} style={field} /></label>
          {passwordStep && <>
            <label>{p.password}<input autoFocus required type="password" autoComplete="current-password" minLength={MIN_PASSWORD_LENGTH} value={password} onChange={e => setPassword(e.target.value)} style={field} /></label>
            <small style={{ color: '#806f62', lineHeight: 1.5 }}>{p.hint}</small>
            <button type="button" onClick={() => { setPasswordStep(false); setPassword(''); setMessage(''); }} style={{ justifySelf: 'start', background: 'none', border: 0, padding: 0, color: '#8a5a35', fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>{p.change}</button>
          </>}
          <button disabled={busy} style={{ ...field, background: '#4b2d1c', color: '#fff', fontWeight: 700 }}>{busy ? '…' : p.continue} →</button>
        </form>
      </>}
      {message && <p role="alert">{message}</p>}
      <button type="button" onClick={onClose} style={{ ...field, background: 'transparent' }}>{t.close}</button>
    </section>
  </div>;
}
