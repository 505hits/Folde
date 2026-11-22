"use client";

import { useEffect, useId, useState } from 'react';
import styles from './invitation-details.module.css';

const copy = {
  en: { eyebrow: 'THE SETTING FOR YOUR DAY', title: 'Where will you say “I do”?', text: 'A château, a garden, somewhere special. Add your venue to bring your invitation to life.', venue: 'Wedding location', placeholder: 'Venue name, city or full address', hint: 'Include the city for a more precise map.', map: 'Map of your wedding location', empty: 'Your celebration starts here', emptyText: 'Enter a venue or address to see it on the map.', open: 'Open in Google Maps', later: 'Still looking for the perfect place? You can add it later.', badge: 'Your wedding location' },
  fr: { eyebrow: 'LE DÉCOR DE VOTRE GRAND JOUR', title: 'Où allez-vous vous dire oui ?', text: 'Un château, un jardin, un lieu qui vous ressemble. Ajoutez-le pour donner vie à votre invitation.', venue: 'Lieu du mariage', placeholder: 'Nom du lieu, ville ou adresse complète', hint: 'Ajoutez la ville pour une carte plus précise.', map: 'Carte du lieu de votre mariage', empty: 'Votre histoire se célèbre ici', emptyText: 'Indiquez un lieu ou une adresse pour le découvrir sur la carte.', open: 'Ouvrir dans Google Maps', later: 'Vous cherchez encore le lieu idéal ? Vous pourrez l’ajouter plus tard.', badge: 'Le lieu de votre mariage' },
  es: { eyebrow: 'EL ESCENARIO DE VUESTRO GRAN DÍA', title: '¿Dónde os daréis el sí?', text: 'Un jardín, un castillo, un lugar especial. Añadidlo para dar vida a vuestra invitación.', venue: 'Lugar de la boda', placeholder: 'Nombre del lugar, ciudad o dirección completa', hint: 'Añadid la ciudad para un mapa más preciso.', map: 'Mapa del lugar de vuestra boda', empty: 'Vuestra celebración empieza aquí', emptyText: 'Introducid un lugar o dirección para verlo en el mapa.', open: 'Abrir en Google Maps', later: '¿Seguís buscando el lugar perfecto? Podéis añadirlo más adelante.', badge: 'El lugar de vuestra boda' },
};

function Pin() {
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

export default function InvitationDetails({ locale = 'en', venue = '', setVenue }) {
  const t = copy[locale] || copy.en;
  const id = useId();
  const [mapQuery, setMapQuery] = useState('');
  const [mapLoading, setMapLoading] = useState(false);
  useEffect(() => {
    if (venue.trim() === mapQuery) return;
    const timer = window.setTimeout(() => { setMapQuery(venue.trim()); setMapLoading(Boolean(venue.trim())); }, 700);
    return () => window.clearTimeout(timer);
  }, [venue, mapQuery]);
  return <section className={styles.card} aria-labelledby={`${id}-title`}>
    <header className={styles.header}>
      <span className={styles.eyebrow}>{t.eyebrow}</span>
      <h2 id={`${id}-title`}>{t.title}</h2>
      <p>{t.text}</p>
    </header>
    <div className={styles.field}>
      <label htmlFor={`${id}-venue`}>{t.venue}</label>
      <div className={styles.inputWrap}><Pin /><input id={`${id}-venue`} type="text" maxLength={180} autoComplete="street-address" value={venue} onChange={e => setVenue(e.target.value)} placeholder={t.placeholder} aria-describedby={`${id}-hint`} /></div>
      <small id={`${id}-hint`}>{t.hint}</small>
    </div>
    <div className={styles.map} aria-busy={Boolean(mapQuery && mapLoading)}>
      {mapQuery ? <><iframe key={mapQuery} title={t.map} src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&hl=${['fr', 'es'].includes(locale) ? locale : 'en'}&output=embed`} onLoad={() => setMapLoading(false)} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />{mapLoading && <div className={styles.mapLoading} role="status"><Pin /><span>{locale === 'fr' ? 'Votre lieu apparaît sur la carte…' : locale === 'es' ? 'Buscando vuestro lugar en el mapa…' : 'Finding your place on the map…'}</span></div>}</> : <div className={styles.empty}><span className={styles.pin}><Pin /></span><strong>{t.empty}</strong><p>{t.emptyText}</p></div>}
    </div>
    {mapQuery && <div className={styles.mapCaption}><div><span>{t.badge}</span><strong>{mapQuery}</strong></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" aria-label={t.open}>↗</a></div>}
    <p className={styles.later}><span aria-hidden="true">◇</span>{t.later}</p>
  </section>;
}
