import HomeClient from "@/components/HomeClient";
import { pageAlternates } from "@/lib/seo";

export const metadata = {
  title: { absolute: "FOLDÈ – Digital Wedding Invitations with Online RSVP" },
  description: "Elegant digital wedding invitations you share with one link: online RSVP, schedule, maps, guest photo gallery and live guest management. Free preview, one-time payment.",
  alternates: pageAlternates("en", "home"),
};

export default function Home({ locale = "en" }) {
  return <HomeClient locale={locale} />;
}
