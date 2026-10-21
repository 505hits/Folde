import { pageAlternates } from "@/lib/seo";
import PackagesPaywall from "./PackagesPaywall";

export const metadata = {
  title: "Wedding Invitation Packages | FOLDÈ Wedding",
  description: "Compare FOLDÈ's one-time digital wedding invitation packages: Standard, Premium and Expert.",
  alternates: pageAlternates("en", "packages"),
};

export default function Packages({ locale = "en" }) {
  return <PackagesPaywall locale={locale} />;
}
