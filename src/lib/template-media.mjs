// Keep previously saved invitations usable when the external supplier is down.
const legacyMedia = {
  'https://wedgo.co/prototype-assets/videos/rosas-intro.mp4': '/videos/bordeaux.mp4',
  'https://wedgo.co/prototype-assets/external/rosas-template__plantilla-floral-v2-Cl-HZWE8.mp4': '/videos/hero/kissing-couple.mp4',
  'https://wedgo.co/prototype-assets/external/wedgo__waxsealintrobeige.mp4': '/videos/ivory.mp4',
  'https://wedgo.co/_next/image?url=%2Fprototype-assets%2Fexternal%2Fwedgo__navy-timeline-footer-custom.webp&w=3840&q=75': '/images/hero-posters/royal-heritage.webp',
  'https://wedgo.co/prototype-assets/videos/orange-intro.mp4': '/videos/terracotta.mp4',
  'https://wedgo.co/prototype-assets/videos/orange-hero.mp4': '/videos/hero/sea-view.mp4',
  'https://wedgo.co/editorial-assets/intro-poster-clean.jpg': '/images/envelope-posters/ivory.webp',
  'https://wedgo.co/editorial-assets/wedding-dance.png': '/images/hero-posters/kissing-couple.webp',
  'https://wedgo.co/prototype-assets/excellence-assets/hero-bg.mp4': '/videos/sage.mp4',
};

export function resolveTemplateMedia(url) {
  if (!url) return url;
  const clean = url.replace(/#t=.*$/, '');
  return legacyMedia[clean] || url;
}
