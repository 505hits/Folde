import PackagesPaywall from "./PackagesPaywall";

export const metadata = {
  title: "Wedding Invitation Packages | FOLDÈ Wedding",
  description: "Compare FOLDÈ's one-time digital wedding invitation packages: Standard, Premium and Expert.",
  alternates: {
    canonical: "https://www.folde-wedding.com/packages",
    languages: {
      en: "https://www.folde-wedding.com/packages",
      es: "https://www.folde-wedding.com/es/packages",
      fr: "https://www.folde-wedding.com/fr/packages",
      "x-default": "https://www.folde-wedding.com/packages",
    },
  },
};

export default function Packages({ locale = "en" }) {
  return <PackagesPaywall locale={locale} />;
}
