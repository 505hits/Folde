export const templateCopy = {
 en: {eyebrow:'Wedding celebration',storyTitle:'Our story',storyText:'We look forward to celebrating this special day with you.',introTitle:'Our story begins here',introText:'Join us for a day filled with love and joy.',venueTitle:'Location',scheduleTitle:'Wedding timeline',menuTitle:'The menu',galleryTitle:'Our photos',giftTitle:'A note on gifts',giftText:'Your presence is our greatest gift.',countdownEyebrow:'Counting down to',countdownTitle:'Our Forever',days:'Days',hours:'Hours',minutes:'Min',seconds:'Sec'},
 fr: {eyebrow:'Notre mariage',storyTitle:'Notre histoire',storyText:'Nous avons hâte de célébrer cette journée avec vous.',introTitle:'Notre histoire commence ici',introText:'Rejoignez-nous pour une journée pleine d’amour et de joie.',venueTitle:'Le lieu',scheduleTitle:'Le programme',menuTitle:'Le menu',galleryTitle:'Nos photos',giftTitle:'Un mot sur les cadeaux',giftText:'Votre présence est notre plus beau cadeau.',countdownEyebrow:'Plus que quelques instants avant',countdownTitle:'Notre grand jour',days:'Jours',hours:'Heures',minutes:'Min',seconds:'Sec'},
 es: {eyebrow:'Nuestra boda',storyTitle:'Nuestra historia',storyText:'Estamos deseando celebrar este día tan especial con vosotros.',introTitle:'Nuestra historia comienza aquí',introText:'Acompañadnos en un día lleno de amor y alegría.',venueTitle:'El lugar',scheduleTitle:'El programa',menuTitle:'El menú',galleryTitle:'Nuestras fotos',giftTitle:'Sobre los regalos',giftText:'Vuestra presencia es nuestro mejor regalo.',countdownEyebrow:'Cuenta atrás para',countdownTitle:'Nuestro gran día',days:'Días',hours:'Horas',minutes:'Min',seconds:'Seg'}
};
export function localizedSignature(signature, language) {
 if (!signature) return signature;
 const locale = templateCopy[language] ? language : 'en';
 return {...signature,...(locale === 'en' ? {eyebrow:signature.eyebrow === 'Atelier de mariage' ? 'Wedding atelier' : signature.eyebrow} : templateCopy[locale]),...(signature.ornament === 'ISSUE 01' && locale !== 'en' ? {ornament:locale === 'fr' ? 'NUMÉRO 01' : 'EDICIÓN 01'} : {})};
}
export function weddingDateLabel(value,language='en') {
 const date=new Date(value);
 return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat({en:'en-US',fr:'fr-FR',es:'es-ES'}[language] || 'en-US',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
}
