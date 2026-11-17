import AffiliateLanding from "@/components/affiliates/AffiliateLanding";
import { pageAlternates } from "@/lib/seo";
import { absolute, pagePath } from "@/lib/routes.mjs";

const title = "Affiliate Program: Earn 30% Commission | FOLDÈ Wedding";
const description = "Recommend FOLDÈ digital wedding invitations and earn 30% on every sale: personal link, 60-day cookie, an email for every sale and monthly payouts by PayPal or Wise.";

export const metadata = {
  title: { absolute: title },
  description,
  alternates: pageAlternates("en", "affiliates"),
  openGraph: { title, description, type: "website", siteName: "FOLDÈ Wedding", url: absolute(pagePath("en", "affiliates")), images: [{ url: "/images/affiliates/reel-1.jpg", alt: "FOLDÈ digital wedding invitation reel" }] },
};

export default function AffiliatesPage({ locale = "en" }) {
  return <AffiliateLanding locale={locale} />;
}
