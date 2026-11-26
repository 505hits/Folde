import { SITE_URL, PAGE_SLUGS, absolute, blogPath, pagePath } from "@/lib/routes.mjs";
import { blogPosts } from "@/lib/blog";
import { blogPostsFr } from "@/lib/blog-fr";
import { blogPostsEs } from "@/lib/blog-es";

const HREFLANG = { en: "en", fr: "fr", es: "es" };

// 1200x630 social preview (phones showing real designs), used by every page without its own image.
export const OG_IMAGE = { url: `${SITE_URL}/images/og/folde-wedding-og.jpg`, width: 1200, height: 630, alt: "FOLDÈ Wedding digital wedding invitations on a phone" };
const postsByLocale = { en: blogPosts, fr: blogPostsFr, es: blogPostsEs };

// Canonical + reciprocal hreflang for a marketing page key.
export function pageAlternates(locale, key) {
  const languages = {};
  for (const loc of ["en", "fr", "es"]) {
    if (PAGE_SLUGS[key]?.[loc] !== undefined) languages[HREFLANG[loc]] = absolute(pagePath(loc, key));
  }
  if (languages.en) languages["x-default"] = languages.en;
  return { canonical: absolute(pagePath(locale, key)), languages };
}

// Only indexable translations of the same article are listed, so every
// hreflang target is a 200, self-canonical, indexable URL that links back.
export function articleAlternates(locale, post) {
  const canonical = absolute(blogPath(locale, post.slug));
  if (post.indexable === false) return { canonical };
  const languages = {};
  if (post.original) {
    languages[HREFLANG[locale]] = canonical;
    return { canonical, languages };
  }
  const enSlug = post.enSlug || post.slug;
  for (const loc of ["en", "fr", "es"]) {
    const match = postsByLocale[loc].find((item) => (item.enSlug || item.slug) === enSlug && !item.original);
    if (match && match.indexable !== false) languages[HREFLANG[loc]] = absolute(blogPath(loc, match.slug));
  }
  if (Object.keys(languages).length < 2) return { canonical };
  if (languages.en) languages["x-default"] = languages.en;
  return { canonical, languages };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "FOLDÈ Wedding",
  alternateName: ["FOLDÈ Design", "Folde Wedding"],
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: OG_IMAGE.url,
  description: "FOLDÈ Wedding designs digital wedding invitations: one mobile link with an animated envelope, the couple's details, schedule, map, photo gallery and a built-in RSVP form, managed from a private dashboard. Available in English, French and Spanish.",
  knowsLanguage: ["en", "fr", "es"],
  knowsAbout: ["Digital wedding invitations", "Wedding RSVP", "Save the date", "Wedding websites"],
  email: "folde.wedding@gmail.com",
  sameAs: ["https://www.instagram.com/folde.design/"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "FOLDÈ Wedding",
  url: SITE_URL,
  inLanguage: ["en", "fr", "es"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Prices mirror src/app/packages/PackagesPaywall.js and the Stripe amounts in
// src/app/api/create-checkout-session/route.js (USD). No rating markup: Google
// does not allow self-collected reviews to be marked up for your own business.
export function productSchema({ name, description, url, inLanguage }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    inLanguage,
    image: OG_IMAGE.url,
    brand: { "@type": "Brand", name: "FOLDÈ Wedding" },
    offers: [
      { "@type": "Offer", name: "Standard", price: "29.90", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE_URL}${pagePath(inLanguage.slice(0, 2), "packages")}` },
      { "@type": "Offer", name: "Expert", price: "149.00", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE_URL}${pagePath(inLanguage.slice(0, 2), "packages")}` },
    ],
  };
}

export function faqSchema(faqs) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
}

export function breadcrumbSchema(items) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: absolute(path) })) };
}
