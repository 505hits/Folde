"use client";

// "Made with FOLDÈ Wedding" card shown at the end of every invitation.
// Guests see a polished, clickable credit inviting them to create their own.

import React from 'react';
import s from './FoldeCredit.module.css';

const COPY = {
  en: { made: 'This invitation was designed with', cta: 'Create your own invitation', note: 'Animated invitations · Online RSVP · Ready in minutes' },
  fr: { made: 'Cette invitation a été créée avec', cta: 'Créer votre faire-part', note: 'Faire-part animés · RSVP en ligne · Prêt en quelques minutes' },
  es: { made: 'Esta invitación se ha creado con', cta: 'Crear vuestra invitación', note: 'Invitaciones animadas · RSVP online · Lista en minutos' },
  it: { made: 'Questo invito è stato creato con', cta: 'Crea il tuo invito', note: 'Inviti animati · RSVP online · Pronto in pochi minuti' },
  de: { made: 'Diese Einladung wurde gestaltet mit', cta: 'Eigene Einladung erstellen', note: 'Animierte Einladungen · Online-RSVP · In Minuten fertig' },
  pt: { made: 'Este convite foi criado com', cta: 'Criar o vosso convite', note: 'Convites animados · RSVP online · Pronto em minutos' },
  nl: { made: 'Deze uitnodiging is gemaakt met', cta: 'Maak jullie uitnodiging', note: 'Geanimeerde uitnodigingen · Online RSVP · Klaar in minuten' },
};
const COLLECTIONS_PATH = { fr: '/fr/modeles-faire-part', es: '/es/plantillas-invitaciones' };

export function foldeCreditHref(language = 'en', themeId = 'invitation') {
  const path = COLLECTIONS_PATH[language] || '/collections';
  const params = new URLSearchParams({ utm_source: 'invitation', utm_medium: 'credit', utm_campaign: themeId || 'invitation' });
  return `https://folde-wedding.com${path}?${params}`;
}

/**
 * tone: 'light' (dark ink on paper) or 'dark' (light ink on a dark page).
 * accent: the design's accent colour, used for the seal and the button.
 */
export default function FoldeCredit({ language = 'en', themeId, tone = 'light', accent = '#8A5A35', background, className = '' }) {
  const copy = COPY[language] || COPY.en;
  return (
    <aside className={`${s.wrap} ${className}`} data-tone={tone} style={{ '--fc-accent': accent, ...(background ? { '--fc-bg': background } : {}) }}>
      <a className={s.card} href={foldeCreditHref(language, themeId)} target="_blank" rel="noopener" aria-label={`${copy.made} FOLDÈ Wedding — ${copy.cta}`}>
        <span className={s.envelope} aria-hidden="true">
          <span className={s.letter}><i /><i /><i /></span>
          <span className={s.pocket} />
          <span className={s.flap} />
          <span className={s.seal}>F</span>
        </span>
        <span className={s.text}>
          <span className={s.made}>{copy.made}</span>
          <span className={s.brand}>FOLDÈ <em>Wedding</em></span>
          <span className={s.cta}>{copy.cta}<svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M0 5h14M10 1l4 4-4 4" /></svg></span>
          <span className={s.note}>{copy.note}</span>
        </span>
        <span className={s.shine} aria-hidden="true" />
      </a>
    </aside>
  );
}

const HOME_PATH = { fr: '/fr', es: '/es' };

/** A single quiet line ("Made with FOLDÈ Wedding") linking to the landing page. */
export function FoldeMadeWith({ language = 'en', themeId, className = '' }) {
  const params = new URLSearchParams({ utm_source: 'invitation', utm_medium: 'made-with', utm_campaign: themeId || 'invitation' });
  const label = { fr: 'Créé avec', es: 'Creado con', it: 'Creato con', de: 'Erstellt mit', pt: 'Criado com', nl: 'Gemaakt met' }[language] || 'Made with';
  return (
    <p className={`${s.madeWith} ${className}`}>
      <a href={`https://folde-wedding.com${HOME_PATH[language] || '/'}?${params}`} target="_blank" rel="noopener">
        <span>{label}</span> <strong>FOLDÈ</strong> <em>Wedding</em>
      </a>
    </p>
  );
}
