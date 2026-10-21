import { pageAlternates } from "@/lib/seo";
export const metadata = {
  title: "Wedding Invitation Collections | FOLDÈ Wedding",
  description: "Explore FOLDÈ's premium digital wedding invitation collections.",
  alternates: pageAlternates("en", "collections"),
};

export default function CollectionsLayout({ children }) {
  return children;
}
