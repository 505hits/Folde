"use client";

import { useEffect, useRef, useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';

const copy = {
  en: { title: 'Save your invitation', text: 'Keep your design and continue with your private account.', google: 'Continue with Google', magic: 'Email me a sign-in link', sent: 'Check your inbox. Open the secure link to continue with your invitation. No password needed.', close: 'Back', error: 'Unable to sign in. Please try again.', or: 'or', sending: 'Sending…' },
  fr: { title: 'Enregistrez votre invitation', text: 'Retrouvez votre design et continuez avec votre compte privé.', google: 'Continuer avec Google', magic: 'Recevoir un lien de connexion', sent: 'Consultez votre boîte e-mail. Ouvrez le lien sécurisé pour retrouver votre invitation. Aucun mot de passe nécessaire.', close: 'Retour', error: 'Connexion impossible. Réessayez.', or: 'ou', sending: 'Envoi…' },
  es: { title: 'Guardad vuestra invitación', text: 'Conservad vuestro diseño y continuad con vuestra cuenta privada.', google: 'Continuar con Google', magic: 'Recibir un enlace de acceso', sent: 'Revisad vuestro correo. Abrid el enlace seguro para continuar con vuestra invitación. Sin contraseña.', close: 'Volver', error: 'No se ha podido iniciar sesión. Intentadlo de nuevo.', or: 'o', sending: 'Enviando…' },
};

export default function CheckoutAuth({ locale, onClose, onReady, initialEmail = '' }) {
  const { currentUser, loginWithGoogle, loginWithMagicLink } = useDatabase();
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const continued = useRef(false);
  const readyRef = useRef(onReady);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);
  const t = copy[locale] || copy.en;
  const returnPath = locale === 'fr' || locale === 'es' ? `/${locale}/packages` : '/packages';
  useEffect(() => {
    if (!currentUser || continued.current) return;
    continued.current = true;
    Promise.resolve().then(() => readyRef.current()).catch(() => {
      continued.current = false;
      setMessage(t.error);
    });
  }, [currentUser, t.error]);
  const authenticate = async (google) => {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      const result = google ? await loginWithGoogle(returnPath) : await loginWithMagicLink(email, returnPath);
      if (!result.success) setMessage(result.error || t.error);
      else if (!google) setSent(true);
    } catch { setMessage(t.error); }
    finally { setBusy(false); }
  };
  const field = { width: '100%', minHeight: 50, padding: '1rem', border: '1px solid #cab9a8', borderRadius: 12, font: 'inherit', boxSizing: 'border-box' };
  return <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0008', display: 'grid', placeItems: 'center', padding: 20 }}>
    <section role="dialog" aria-modal="true" aria-labelledby="checkout-auth-title" style={{ background: '#fffaf5', color: '#3d2b1f', padding: 28, borderRadius: 24, width: 'min(100%, 440px)' }}>
      <h2 id="checkout-auth-title">{t.title}</h2><p>{t.text}</p>
      {!currentUser && <>
        <button autoFocus type="button" disabled={busy} onClick={() => authenticate(true)} style={{ ...field, background: '#fff', fontWeight: 700 }}><span aria-hidden="true" style={{ color: '#4285f4', marginRight: 12 }}>G</span>{t.google}</button>
        <p style={{ textAlign: 'center', color: '#806f62' }}>{t.or}</p>
        <form onSubmit={e => { e.preventDefault(); authenticate(false); }} style={{ display: 'grid', gap: 16, margin: '20px 0' }}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setSent(false); }} style={field} /></label>
          <button disabled={busy} style={{ ...field, background: '#4b2d1c', color: '#fff', fontWeight: 700 }}>{busy ? t.sending : t.magic}</button>
        </form>
      </>}
      {sent && <p role="status">{t.sent}</p>}
      {message && <p role="alert">{message}</p>}
      <button type="button" onClick={onClose} style={{ ...field, background: 'transparent' }}>{t.close}</button>
    </section>
  </div>;
}
