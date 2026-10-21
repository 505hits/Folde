// Single source of truth for public URLs: host, localized slugs and legacy redirects.
// Pure ESM (no path aliases) so next.config.mjs can import it too.

export const SITE_URL = "https://folde-wedding.com";
export const LOCALES = ["en", "fr", "es"];

// Marketing pages. Keys are internal identifiers (and the English slug).
export const PAGE_SLUGS = {
  home: { en: "", fr: "", es: "" },
  collections: { en: "collections", fr: "modeles-faire-part", es: "plantillas-invitaciones" },
  packages: { en: "packages", fr: "tarifs", es: "precios" },
  approach: { en: "approach", fr: "notre-methode", es: "como-trabajamos" },
  story: { en: "story", fr: "notre-histoire", es: "nuestra-historia" },
  blog: { en: "blog", fr: "blog", es: "blog" },
  landing: { fr: "faire-part-mariage-numerique", es: "invitaciones-de-boda-digitales" },
};

// Blog posts that exist in several languages, keyed by the English slug.
// A locale missing here means the post does not exist in that language.
export const POST_SLUGS = {
  "wedding-invitations-with-floral-design": { en: "wedding-invitations-with-floral-design", fr: "faire-part-mariage-fleuri", es: "invitaciones-de-boda-con-flores" },
  "wedding-invitations-with-rsvp": { en: "wedding-invitations-with-rsvp", fr: "faire-part-mariage-avec-rsvp", es: "invitaciones-de-boda-con-confirmacion" },
  "destination-wedding-invitations": { en: "destination-wedding-invitations", fr: "faire-part-mariage-a-l-etranger", es: "invitaciones-boda-de-destino" },
  "wedding-invitation-suite": { en: "wedding-invitation-suite", fr: "papeterie-de-mariage", es: "papeleria-de-boda" },
  "all-in-one-wedding-invitations": { en: "all-in-one-wedding-invitations", fr: "faire-part-et-site-de-mariage", es: "invitacion-y-web-de-boda" },
  "wedding-welcome-signs": { en: "wedding-welcome-signs", fr: "panneau-de-bienvenue-mariage", es: "cartel-de-bienvenida-boda" },
  "winter-wedding-invitations": { en: "winter-wedding-invitations", fr: "faire-part-mariage-hiver", es: "invitaciones-boda-invierno" },
  "traditional-wedding-invitations": { en: "traditional-wedding-invitations", fr: "faire-part-mariage-classique", es: "invitaciones-de-boda-clasicas" },
  "photo-wedding-invitations": { en: "photo-wedding-invitations", fr: "faire-part-mariage-photo", es: "invitaciones-de-boda-con-foto" },
  "vintage-wedding-invitations": { en: "vintage-wedding-invitations", fr: "faire-part-mariage-vintage", es: "invitaciones-de-boda-vintage" },
};

export function localeRoot(locale) {
  return locale === "en" ? "" : `/${locale}`;
}

export function pagePath(locale, key) {
  const slug = PAGE_SLUGS[key]?.[locale];
  if (slug === undefined) return localeRoot(locale) || "/";
  const path = `${localeRoot(locale)}${slug ? `/${slug}` : ""}`;
  return path || "/";
}

export function blogPath(locale, slug) {
  return `${localeRoot(locale)}/blog/${slug}`;
}

export function absolute(path) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

// Maps an incoming pathname to the equivalent page in another language.
// Falls back to the target language homepage when no equivalent exists.
export function equivalentPath(pathname = "/", target, extraPosts = {}) {
  const match = pathname.match(/^\/(fr|es)(?=\/|$)/);
  const locale = match ? match[1] : "en";
  const rest = (match ? pathname.slice(3) : pathname).replace(/^\/+|\/+$/g, "");
  const [first, second] = rest.split("/");
  if (!rest) return pagePath(target, "home");
  if (first === "blog" && second) {
    const all = { ...POST_SLUGS, ...extraPosts };
    const entry = Object.values(all).find((item) => item[locale] === second);
    return entry?.[target] ? blogPath(target, entry[target]) : pagePath(target, "blog");
  }
  const key = Object.keys(PAGE_SLUGS).find((k) => PAGE_SLUGS[k][locale] === first);
  if (key && PAGE_SLUGS[key][target] !== undefined) return pagePath(target, key);
  if (["checkout", "dashboard"].includes(first)) return `${localeRoot(target)}/${first}`;
  return pagePath(target, "home");
}

// 301 redirects from the old English slugs used under /fr and /es.
export function legacyRedirects() {
  const out = [];
  for (const locale of ["fr", "es"]) {
    for (const key of ["collections", "packages", "approach", "story"]) {
      out.push({ source: `/${locale}/${key}`, destination: pagePath(locale, key), statusCode: 301 });
    }
    for (const [enSlug, slugs] of Object.entries(POST_SLUGS)) {
      if (slugs[locale] && slugs[locale] !== enSlug) {
        out.push({ source: `/${locale}/blog/${enSlug}`, destination: blogPath(locale, slugs[locale]), statusCode: 301 });
      }
    }
  }
  return out;
}

// Turns an English-style internal path ("/collections", "/checkout?x=1") into
// the right URL for a locale, using the localized slugs above.
export function localizeHref(locale, path) {
  if (locale === "en") return path;
  const match = path.match(/^\/([^/?#]*)(.*)$/);
  const first = match ? match[1] : "";
  const tail = match ? match[2] : "";
  if (first && PAGE_SLUGS[first]?.[locale] !== undefined && !tail.startsWith("/")) return `${pagePath(locale, first)}${tail}`;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
