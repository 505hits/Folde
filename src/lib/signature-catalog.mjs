// Single source of truth for the illustrated "signature" designs.
// Collections, checkout and dashboard all read this list, so a design added
// here is available everywhere. Each design has its own themeId: invitations
// saved with an older themeId are never affected.

const env = {
  ivoryVeil: '/videos/ivory-veil.mp4',
  floral: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4',
  luxury: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4',
  royal: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4',
  celestial: '/videos/celestial-veil.mp4',
  horizonBordeaux: '/videos/horizon-bordeaux.mp4',
  bordeaux: '/videos/bordeaux.mp4',
  imperial: '/videos/imperial-light.mp4',
};
const hero = {
  couple: '/videos/hero/kissing-couple.mp4',
  seaview: '/videos/hero/sea-view.mp4',
  balcony: '/videos/hero/seaview-balcony.mp4',
  castle: '/videos/hero/castle.mp4',
  royal: '/videos/hero/royal-heritage.mp4',
  seaAnim: '/videos/hero/sea-animation.mp4',
};

// Illustration used as the design's thumbnail in the dashboard picker.
const THUMBS = {  "mochamousse": {   "thumb": "/images/signature/suite/mocha-envelope.webp",   "thumbFit": "contain"  },  "classicburgundy": {   "thumb": "/images/signature/suite/burgundy-envelope.webp",   "thumbFit": "contain"  },  "photobooth": {   "thumb": "/images/signature/booth/frame.webp",   "thumbFit": "contain"  },  "olivebordeaux": {   "thumb": "/images/signature/letter/flowers-calla.webp",   "thumbFit": "contain"  },  "burgundyivory": {   "thumb": "/images/signature/props/seal-burgundy.webp",   "thumbFit": "contain"  },  "brownfloral": {   "thumb": "/images/signature/letter/flowers-brown.webp",   "thumbFit": "contain"  },  "noirfloral": {   "thumb": "/images/signature/letter/flowers-noir.webp",   "thumbFit": "contain"  },  "twilightmeadow": {   "thumb": "/images/signature/meadow/vignette.webp",   "thumbFit": "cover"  },  "nacre": {   "thumb": "/images/signature/nacre/relief-portrait.webp",   "thumbFit": "cover"  },  "jardinbrode": {   "thumb": "/images/signature/brode/frame.webp",   "thumbFit": "cover"  },  "riviera": {   "thumb": "/images/signature/riviera/arch.webp",   "thumbFit": "contain"  } };

export const SIGNATURE_TEMPLATES = [
  {
    id: 'mochamousse', name: 'Mocha Mousse', tag: 'WARM', color: '#4A3426',
    desc: { en: 'A stationery suite in mocha, ivory and gold leaf.', fr: 'Une papeterie moka, ivoire et feuille d’or.', es: 'Una papelería en moca, marfil y pan de oro.' },
    envelope: env.horizonBordeaux, envelopeId: 'env_horizon_bordeaux', hero: hero.couple, heroId: 'hero_couple',
    partner1: 'Elizabeth', partner2: 'George', date: 'JUN 18, 2027',
  },
  {
    id: 'classicburgundy', name: 'Classic Burgundy', tag: 'ROMANTIC', color: '#6B1626',
    desc: { en: 'Burgundy lace, pearls and a baroque mirror frame.', fr: 'Dentelle bordeaux, perles et cadre baroque.', es: 'Encaje burdeos, perlas y marco barroco.' },
    envelope: env.bordeaux, envelopeId: 'env_rosas', hero: hero.castle, heroId: 'hero_castle',
    partner1: 'Rachel', partner2: 'Carter', date: 'JUN 18, 2027',
  },
  {
    id: 'photobooth', name: 'Ivory Photobooth', tag: 'ROMANTIC', color: '#B79B6B',
    desc: { en: 'Your photo strip prints inside a gilded frame.', fr: 'Votre bande photo s’imprime dans un cadre doré.', es: 'Vuestra tira de fotos se imprime en un marco dorado.' },
    envelope: env.ivoryVeil, envelopeId: 'env_ivory_veil', hero: hero.couple, heroId: 'hero_couple',
    partner1: 'Rachel', partner2: 'Carter', date: 'SEP 09, 2027',
  },
  {
    id: 'olivebordeaux', name: 'Olive & Burgundy', tag: 'ELEGANT', color: '#55602F',
    desc: { en: 'A love letter in olive with a vinyl you can play.', fr: 'Une lettre d’amour olive avec un vinyle à écouter.', es: 'Una carta de amor oliva con un vinilo para escuchar.' },
    envelope: env.royal, envelopeId: 'env_royal', hero: hero.royal, heroId: 'hero_royal',
    partner1: 'Adeline', partner2: 'Morgan', date: 'AUG 27, 2027',
  },
  {
    id: 'burgundyivory', name: 'Burgundy & Ivory', tag: 'ROMANTIC', color: '#5A1420',
    desc: { en: 'A burgundy love letter, calla lilies and polaroids.', fr: 'Une lettre bordeaux, des callas et des polaroïds.', es: 'Una carta burdeos, calas y polaroids.' },
    envelope: env.bordeaux, envelopeId: 'env_bordeaux', hero: hero.couple, heroId: 'hero_couple',
    partner1: 'Adeline', partner2: 'Morgan', date: 'AUG 27, 2027',
  },
  {
    id: 'brownfloral', name: 'Brown & Gold Floral', tag: 'WARM', color: '#5B3B25',
    desc: { en: 'Chocolate paper, gold foil and autumn florals.', fr: 'Papier chocolat, dorure et fleurs d’automne.', es: 'Papel chocolate, dorado y flores de otoño.' },
    envelope: env.luxury, envelopeId: 'env_luxury', hero: hero.balcony, heroId: 'hero_sea_balcony',
    partner1: 'Adeline', partner2: 'Morgan', date: 'OCT 09, 2027',
  },
  {
    id: 'noirfloral', name: 'Black & White Floral', tag: 'MINIMAL', color: '#1C1C1C',
    desc: { en: 'Black paper, white blooms, timeless contrast.', fr: 'Papier noir, fleurs blanches, contraste intemporel.', es: 'Papel negro, flores blancas, contraste atemporal.' },
    envelope: env.imperial, envelopeId: 'env_imperial_light', hero: hero.couple, heroId: 'hero_couple',
    partner1: 'Adeline', partner2: 'Morgan', date: 'NOV 13, 2027',
  },
  {
    id: 'twilightmeadow', name: 'Twilight Meadow', tag: 'NATURAL', color: '#6F7A4B',
    desc: { en: 'An oil-painted wildflower meadow at golden hour.', fr: 'Une prairie fleurie peinte à l’huile au crépuscule.', es: 'Una pradera de flores pintada al óleo al atardecer.' },
    envelope: env.floral, envelopeId: 'env_floral', hero: hero.seaAnim, heroId: 'hero_sea_anim',
    partner1: 'Lucie', partner2: 'Thomas', date: 'SEP 09, 2027',
  },
  {
    id: 'nacre', name: 'Nacre', tag: 'ELEGANT', color: '#3D4A66',
    desc: { en: 'Sculpted plaster, mother-of-pearl and a gold seal.', fr: 'Plâtre sculpté, nacre et cachet doré.', es: 'Yeso esculpido, nácar y sello dorado.' },
    envelope: env.ivoryVeil, envelopeId: 'env_ivory_veil', hero: hero.seaview, heroId: 'hero_seaview',
    partner1: 'Cornelia', partner2: 'James', date: 'MAY 20, 2027',
  },
  {
    id: 'jardinbrode', name: 'Jardin Brodé', tag: 'NATURAL', color: '#6F7D62',
    desc: { en: 'Hand embroidery, wisteria, doves and pearls.', fr: 'Broderie, glycine, colombes et perles.', es: 'Bordado, glicinias, palomas y perlas.' },
    envelope: env.floral, envelopeId: 'env_floral', hero: hero.couple, heroId: 'hero_couple',
    partner1: 'Camille', partner2: 'Antoine', date: 'JUN 12, 2027',
  },
  {
    id: 'riviera', name: 'Riviera', tag: 'WARM', color: '#2F5F9E',
    desc: { en: 'Palette-knife Mediterranean, lemons and tiles.', fr: 'Méditerranée au couteau, citrons et azulejos.', es: 'Mediterráneo a espátula, limones y azulejos.' },
    envelope: env.celestial, envelopeId: 'env_celestial_veil', hero: hero.balcony, heroId: 'hero_sea_balcony',
    partner1: 'Diana', partner2: 'Richard', date: 'JUL 27, 2027',
  },
].map((template) => ({ ...template, ...THUMBS[template.id], isNew: true, popular: true, signature: true }));


export const SIGNATURE_IDS = new Set(SIGNATURE_TEMPLATES.map((template) => template.id));

// Every signature design opens with its own composition (envelope, relief,
// curtains, painting…), so the classic envelope overlay and hero video are
// skipped for all of them.
export const INTROLESS_IDS = SIGNATURE_IDS;

export const signatureTemplate = (id) => SIGNATURE_TEMPLATES.find((template) => template.id === id) || null;

export const signatureDescription = (template, locale = 'en') => template?.desc?.[locale] || template?.desc?.en || '';

// Fallback colours used by the classic template when it needs a theme object.
export const SIGNATURE_THEME_COLORS = Object.fromEntries(SIGNATURE_TEMPLATES.map((template) => [template.id, {
  primary: template.color, secondary: template.color, accent: template.color,
  fontHeading: "'Cormorant Garamond', serif", bgColor: '#F7F3EC',
}]));
