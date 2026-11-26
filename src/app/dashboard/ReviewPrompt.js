"use client";

// Satisfaction prompt shown once a couple has really started using the dashboard.
// Every rating can lead to Trustpilot (Trustpilot forbids inviting only happy
// customers); 4-5 stars get the invitation up front, 1-3 stars are first asked
// what went wrong so the team can fix it, with the public review still offered.

import { useEffect, useState } from 'react';
import { authenticatedFetch } from '@/lib/wedding-client';
import s from './review-prompt.module.css';

export const TRUSTPILOT_URL = 'https://www.trustpilot.com/evaluate/folde-wedding.com';
const DELAY_MS = 60 * 1000;            // time spent in the dashboard before asking
const SNOOZE_MS = 3 * 24 * 3600 * 1000; // "Later" asks again after three days
const MIN_DRAFT_SAVES = 3;             // edits that count as having started

const COPY = {
  en: {
    title: 'How is your invitation coming along?', text: 'Your opinion helps us improve FOLDÈ.', rate: (n) => `${n} star${n > 1 ? 's' : ''}`,
    later: 'Later', close: 'Close',
    happyTitle: 'Thank you, that means a lot!', happyText: 'Would you share it on Trustpilot? It takes one minute and really helps a small studio like ours reach other couples.', happyCta: 'Leave a review on Trustpilot',
    sadTitle: 'We are sorry it is not perfect yet', sadText: 'What should we improve? Our team reads every message and will get back to you.', placeholder: 'Tell us what went wrong or what is missing…', send: 'Send', sending: 'Sending…',
    thanksTitle: 'Thank you for telling us', thanksText: 'We will look into it and reply by email.', publicLink: 'You can also leave a public review on Trustpilot', error: 'Your message could not be sent. Please try again.',
  },
  fr: {
    title: 'Comment se passe la création de votre faire-part ?', text: 'Votre avis nous aide à améliorer FOLDÈ.', rate: (n) => `${n} étoile${n > 1 ? 's' : ''}`,
    later: 'Plus tard', close: 'Fermer',
    happyTitle: 'Merci, ça nous touche beaucoup !', happyText: 'Accepteriez-vous de le dire sur Trustpilot ? Cela prend une minute et aide vraiment un petit atelier comme le nôtre à se faire connaître d’autres couples.', happyCta: 'Laisser un avis sur Trustpilot',
    sadTitle: 'Désolés que tout ne soit pas parfait', sadText: 'Qu’est-ce qu’on devrait améliorer ? Notre équipe lit chaque message et vous répond.', placeholder: 'Dites-nous ce qui n’a pas marché ou ce qui vous manque…', send: 'Envoyer', sending: 'Envoi…',
    thanksTitle: 'Merci de nous l’avoir dit', thanksText: 'Nous regardons cela et vous répondons par e-mail.', publicLink: 'Vous pouvez aussi laisser un avis public sur Trustpilot', error: 'Votre message n’a pas pu être envoyé. Réessayez.',
  },
  es: {
    title: '¿Qué tal va la creación de vuestra invitación?', text: 'Vuestra opinión nos ayuda a mejorar FOLDÈ.', rate: (n) => `${n} estrella${n > 1 ? 's' : ''}`,
    later: 'Más tarde', close: 'Cerrar',
    happyTitle: '¡Gracias, nos hace mucha ilusión!', happyText: '¿Os animáis a contarlo en Trustpilot? Es un minuto y ayuda mucho a un estudio pequeño como el nuestro a llegar a otras parejas.', happyCta: 'Dejar una reseña en Trustpilot',
    sadTitle: 'Sentimos que no sea perfecto', sadText: '¿Qué deberíamos mejorar? Nuestro equipo lee cada mensaje y os responderá.', placeholder: 'Contadnos qué ha fallado o qué echáis de menos…', send: 'Enviar', sending: 'Enviando…',
    thanksTitle: 'Gracias por contárnoslo', thanksText: 'Lo revisamos y os respondemos por correo.', publicLink: 'También podéis dejar una reseña pública en Trustpilot', error: 'No se ha podido enviar el mensaje. Intentadlo de nuevo.',
  },
};

const storageKey = (id) => `folde-review-${id}`;
const readState = (id) => { try { return JSON.parse(window.localStorage.getItem(storageKey(id)) || 'null'); } catch { return null; } };
const writeState = (id, value) => { try { window.localStorage.setItem(storageKey(id), JSON.stringify(value)); } catch {} };
const markRated = (id, rating) => writeState(id, { done: true, rating, at: Date.now() });
const snooze = (id) =>writeState(id, { snoozedUntil: Date.now() + SNOOZE_MS });

// A couple has "started" once they published, or saved several edits.
export function hasStartedUsing(order) {
  const details = order?.details || {};
  return Boolean(details.publishedData) || Number(details._draftVersion || 0) >= MIN_DRAFT_SAVES;
}

export default function ReviewPrompt({ order, locale = 'en' }) {
  const t = COPY[locale] || COPY.en;
  const id = order?.id || order?.slug;
  const started = Boolean(order?.paid) && hasStartedUsing(order);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('rate'); // rate | happy | sad | thanks
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !started) return;
    const force = new URLSearchParams(window.location.search).has('review-prompt');
    const saved = readState(id);
    if (!force && (saved?.done || (saved?.snoozedUntil && saved.snoozedUntil > Date.now()))) return;
    const timer = window.setTimeout(() => setOpen(true), force ? 300 : DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [id, started]);

  if (!open) return null;

  const send = (value, text = '') => authenticatedFetch('/api/send-feedback', {
    method: 'POST', body: JSON.stringify({ slug: order.slug, rating: value, comment: text }),
  });
  const choose = (value) => {
    setRating(value);
    markRated(id, value);
    if (value >= 4) { setStep('happy'); send(value).catch(() => {}); } else setStep('sad');
  };
  const later = () => { snooze(id); setOpen(false); };
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const res = await send(rating, comment.trim());
      if (!res.ok) throw new Error();
      setStep('thanks');
    } catch { setError(t.error); }
    finally { setBusy(false); }
  };
  const shown = hover || rating;

  return (
    <div className={s.backdrop} role="presentation" onClick={(e) => { if (e.target === e.currentTarget) step === 'rate' ? later() : setOpen(false); }}>
      <section className={s.card} role="dialog" aria-modal="true" aria-labelledby="review-prompt-title">
        <button type="button" className={s.close} aria-label={t.close} onClick={() => (step === 'rate' ? later() : setOpen(false))}>×</button>
        <div className={s.seal} aria-hidden="true">F</div>

        {step === 'rate' && <>
          <h2 id="review-prompt-title" className={s.title}>{t.title}</h2>
          <p className={s.text}>{t.text}</p>
          <div className={s.stars} role="radiogroup" aria-label={t.title} onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={t.rate(n)}
                className={`${s.star} ${n <= shown ? s.starOn : ''}`} onMouseEnter={() => setHover(n)} onFocus={() => setHover(n)} onClick={() => choose(n)}>★</button>
            ))}
          </div>
          <button type="button" className={s.later} onClick={later}>{t.later}</button>
        </>}

        {step === 'happy' && <>
          <div className={s.result} aria-hidden="true">{'★'.repeat(rating)}</div>
          <h2 id="review-prompt-title" className={s.title}>{t.happyTitle}</h2>
          <p className={s.text}>{t.happyText}</p>
          <a className={s.primary} href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer" onClick={() => window.setTimeout(() => setOpen(false), 400)}>
            <span className={s.tpStar} aria-hidden="true">★</span> {t.happyCta}
          </a>
          <button type="button" className={s.later} onClick={() => setOpen(false)}>{t.later}</button>
        </>}

        {step === 'sad' && <form onSubmit={submit}>
          <div className={s.result} aria-hidden="true">{'★'.repeat(rating)}<span className={s.resultOff}>{'★'.repeat(5 - rating)}</span></div>
          <h2 id="review-prompt-title" className={s.title}>{t.sadTitle}</h2>
          <p className={s.text}>{t.sadText}</p>
          <textarea className={s.textarea} required autoFocus rows={4} maxLength={3000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t.placeholder} />
          {error && <p className={s.error} role="alert">{error}</p>}
          <button type="submit" className={s.primary} disabled={busy || !comment.trim()}>{busy ? t.sending : t.send}</button>
          <a className={s.public} href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">{t.publicLink}</a>
        </form>}

        {step === 'thanks' && <>
          <h2 id="review-prompt-title" className={s.title}>{t.thanksTitle}</h2>
          <p className={s.text}>{t.thanksText}</p>
          <button type="button" className={s.primary} onClick={() => setOpen(false)}>{t.close}</button>
          <a className={s.public} href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">{t.publicLink}</a>
        </>}
      </section>
    </div>
  );
}
