import { SITE_URL, PAGE_SLUGS, absolute, blogPath, pagePath } from "@/lib/routes.mjs";
import { blogPosts } from "@/lib/blog";
import { blogPostsFr } from "@/lib/blog-fr";
import { blogPostsEs } from "@/lib/blog-es";

const HREFLANG = { en: "en", fr: "fr", es: "es" };
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
  alternateName: "FOLDÈ Design",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  email: "folde.wedding@gmail.com",
  sameAs: ["https://www.instagram.com/foldedesign"],
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

// Prices mirror src/app/packages/PackagesPaywall.js (regular prices, USD).
export function productSchema({ name, description, url, inLanguage }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    inLanguage,
    image: `${SITE_URL}/images/logo.png`,
    brand: { "@type": "Brand", name: "FOLDÈ Wedding" },
    offers: [
      { "@type": "Offer", name: "Standard", price: "49.90", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE_URL}${pagePath(inLanguage.slice(0, 2), "packages")}` },
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
