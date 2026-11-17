"use client";

import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';

// Passwordless sign-in before payment: Google, or a one-time link by email.
const copy = {
  en: { title: 'Your private account', text: 'Sign in to continue to secure payment. No password needed.', link: 'Email me a sign-in link', sent: 'Check your inbox: we sent a sign-in link to', sentHint: 'Open it on this device to come back here signed in.', ready: 'You are signed in. Continue to payment.', close: 'Back to packages', google: 'Continue with Google', or: 'or with your email', googleError: 'Google sign-in could not start. Please try again or use your email.', linkError: 'We could not send the link. Please check your email address and try again.' },
  fr: { title: 'Votre compte privé', text: 'Connectez-vous pour accéder au paiement sécurisé. Aucun mot de passe nécessaire.', link: 'Recevoir mon lien de connexion', sent: 'Vérifiez votre boîte mail : nous avons envoyé un lien de connexion à', sentHint: 'Ouvrez-le sur cet appareil pour revenir ici connecté.', ready: 'Vous êtes connecté. Continuez vers le paiement.', close: 'Retour aux formules', google: 'Continuer avec Google', or: 'ou avec votre e-mail', googleError: 'La connexion Google n’a pas pu démarrer. Réessayez ou utilisez votre e-mail.', linkError: 'Nous n’avons pas pu envoyer le lien. Vérifiez votre adresse e-mail et réessayez.' },
  es: { title: 'Vuestra cuenta privada', text: 'Iniciad sesión para continuar al pago seguro. Sin contraseña.', link: 'Recibir mi enlace de acceso', sent: 'Revisad vuestro correo: hemos enviado un enlace de acceso a', sentHint: 'Abridlo en este dispositivo para volver aquí con la sesión iniciada.', ready: 'Sesión iniciada. Continúa al pago.', close: 'Volver a los planes', google: 'Continuar con Google', or: 'o con vuestro correo', googleError: 'No se pudo iniciar la sesión con Google. Inténtalo de nuevo o usa tu correo.', linkError: 'No hemos podido enviar el enlace. Revisad el correo e intentadlo de nuevo.' },
};

export function GoogleMark() {
  return <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>;
}

export default function CheckoutAuth({ locale, onClose, initialEmail = '' }) {
  const { currentUser, loginWithGoogle, loginWithMagicLink } = useDatabase();
  const [email, setEmail] = useState(initialEmail);
  const [sentTo, setSentTo] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const t = copy[locale] || copy.en;
  const returnPath = () => window.location.pathname + window.location.search;
  const sendLink = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const draft = JSON.parse(sessionStorage.getItem('checkoutPreviewDraft') || '{}');
      const result = await loginWithMagicLink(email, returnPath(), { name: draft.name || '', partner_name: draft.partnerName || '' });
      if (result.success) setSentTo(email.trim());
      else setMessage(t.linkError);
    } catch { setMessage(t.linkError); }
    finally { setBusy(false); }
  };
  const google = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await loginWithGoogle(returnPath());
      if (!result.success) { setMessage(t.googleError); setBusy(false); }
    } catch { setMessage(t.googleError); setBusy(false); }
  };
  const field = { width: '100%', padding: '1rem', border: '1px solid #cab9a8', borderRadius: 12, font: 'inherit', fontSize: 16 };
  const linkButton = { border: 0, background: 'none', padding: '.4rem 0', color: '#8a7867', font: 'inherit', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0008', display: 'grid', placeItems: 'center', padding: 20 }}>
      <section role="dialog" aria-modal="true" aria-labelledby="checkout-auth-title" style={{ background: '#fffaf5', color: '#3d2b1f', padding: 32, borderRadius: 20, width: 'min(100%, 440px)' }}>
        <h2 id="checkout-auth-title" style={{ margin: '0 0 .4rem' }}>{t.title}</h2>
        {currentUser ? <p>{t.ready}</p> : sentTo ? (
          <p role="status" style={{ margin: '20px 0', padding: '1rem', borderRadius: 14, background: '#f4efe7', lineHeight: 1.55 }}>
            <strong style={{ display: 'block', marginBottom: '.3rem' }}>✉ {t.sent} {sentTo}</strong>
            <span style={{ color: '#806f62', fontSize: '.9rem' }}>{t.sentHint}</span>
          </p>
        ) : <>
          <p style={{ margin: 0, color: '#806f62', fontSize: '.92rem' }}>{t.text}</p>
          <button type="button" disabled={busy} onClick={google} style={{ ...field, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderRadius: 999, background: '#fff', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer' }}>
            <GoogleMark />{t.google}
          </button>
          <p aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 0', color: '#8a7867', fontSize: 13 }}><span style={{ flex: 1, height: 1, background: '#e3d6c8' }} />{t.or}<span style={{ flex: 1, height: 1, background: '#e3d6c8' }} /></p>
          <form onSubmit={sendLink} style={{ display: 'grid', gap: 14, margin: '18px 0' }}>
            <label style={{ display: 'grid', gap: 6 }}>Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={field} /></label>
            {message && <p role="alert" style={{ margin: 0, color: '#a33b32', fontSize: '.86rem' }}>{message}</p>}
            <button disabled={busy} style={{ ...field, border: 0, borderRadius: 999, background: '#4a2f1e', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{busy ? '…' : t.link}</button>
          </form>
        </>}
        <button type="button" onClick={onClose} style={linkButton}>{t.close}</button>
      </section>
    </div>
  );
}
