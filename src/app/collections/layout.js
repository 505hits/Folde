import { OG_IMAGE, pageAlternates } from "@/lib/seo";
export const metadata = {
  title: "Digital Wedding Invitation Designs: 47 Templates | FOLDÈ Wedding",
  description: "Browse 47 digital wedding invitation designs, from animated envelope openings to illustrated Signature stationery. Preview any design with your names for free.",
  alternates: pageAlternates("en", "collections"),
  openGraph: { url: "https://folde-wedding.com/collections", images: [OG_IMAGE] },
};

export default function CollectionsLayout({ children }) {
  return children;
}
