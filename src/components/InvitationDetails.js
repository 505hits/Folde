"use client";

export const invitationDetailsCopy = {
  en: { title: 'Make it your invitation', text: 'Three details your guests will need. You can change them later.', venue: 'Ceremony venue', time: 'Ceremony time', deadline: 'RSVP deadline', later: 'Still deciding? You can leave these blank.' },
  fr: { title: 'Votre invitation prend forme', text: 'Trois informations utiles à vos invités. Vous pourrez les modifier ensuite.', venue: 'Lieu de la cérémonie', time: 'Heure de la cérémonie', deadline: 'Date limite de réponse', later: 'Pas encore décidé ? Vous pouvez laisser ces champs vides.' },
  es: { title: 'Vuestra invitación toma forma', text: 'Tres detalles para vuestros invitados. Podréis cambiarlos después.', venue: 'Lugar de la ceremonia', time: 'Hora de la ceremonia', deadline: 'Fecha límite de confirmación', later: '¿Sin decidir? Podéis dejar estos campos vacíos.' },
};

export default function InvitationDetails({ locale, venue, setVenue, details, setDetails, weddingDate }) {
  const t = invitationDetailsCopy[locale] || invitationDetailsCopy.en;
  const field = { width: '100%', minHeight: 48, padding: '12px', borderRadius: 10, border: '1px solid #cab9a8', background: '#fff', color: '#3d2b1f', font: 'inherit' };
  return <fieldset style={{ border: 0, padding: 0, margin: '20px 0', display: 'grid', gap: 14, textAlign: 'left', width: '100%' }}>
    <legend style={{ fontWeight: 700, marginBottom: 8 }}>{t.title}</legend>
    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{t.text}</p>
    <label>{t.venue}<input type="text" maxLength={180} value={venue} onChange={e => setVenue(e.target.value)} style={field} /></label>
    <label>{t.time}<input type="time" value={details.time} onChange={e => setDetails(v => ({ ...v, time: e.target.value }))} style={field} /></label>
    <label>{t.deadline}<input type="date" max={weddingDate && weddingDate !== 'TBD' ? weddingDate : undefined} value={details.rsvpDeadline} onChange={e => setDetails(v => ({ ...v, rsvpDeadline: e.target.value }))} style={field} /></label>
    <small>{t.later}</small>
  </fieldset>;
}
