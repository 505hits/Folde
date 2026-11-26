import { OG_IMAGE, pageAlternates, productSchema } from "@/lib/seo";
import PackagesPaywall from "./PackagesPaywall";
import { absolute, pagePath } from "@/lib/routes.mjs";

const PRODUCT_COPY = {
  en: { name: "FOLDÈ digital wedding invitation", description: "An interactive digital wedding invitation shared with one link: animated envelope, schedule, map, photo gallery and built-in RSVP, with unlimited guests and a live guest dashboard." },
  fr: { name: "Faire-part de mariage numérique FOLDÈ", description: "Un faire-part de mariage interactif partagé par un seul lien : enveloppe animée, programme, plan d’accès, galerie photo et RSVP intégré, invités illimités et suivi des réponses en direct." },
  es: { name: "Invitación de boda digital FOLDÈ", description: "Una invitación de boda interactiva que se comparte con un enlace: sobre animado, horarios, mapa, galería de fotos y confirmación integrada, con invitados ilimitados y panel de respuestas en directo." },
};

export const metadata = {
  title: "Digital Wedding Invitation Pricing | FOLDÈ Wedding",
  description: "Standard $29.90 or Expert $149: one-time payment, unlimited guests, built-in RSVP and a live guest dashboard. Preview your invitation free before you pay.",
  alternates: pageAlternates("en", "packages"),
  openGraph: { url: "https://folde-wedding.com/packages", images: [OG_IMAGE] },
};

export default function Packages({ locale = "en" }) {
  const copy = PRODUCT_COPY[locale] || PRODUCT_COPY.en;
  const schema = productSchema({ ...copy, url: absolute(pagePath(locale, "packages")), inLanguage: locale });
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <PackagesPaywall locale={locale} />
  </>;
}
