"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { pagePath } from "@/lib/routes.mjs";

const FULLSCREEN = ["/dashboard", "/checkout", "/es/checkout", "/fr/checkout", "/kissing-couple-wedding-invitation", "/invite",
  ...["en", "fr", "es"].flatMap((l) => [pagePath(l, "packages"), pagePath(l, "collections")])];

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  
  // Hide header and footer on checkout, dashboard and invitation routes
  const hideHeaderFooter = FULLSCREEN.some((prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`));
  const isBlog = pathname?.startsWith("/blog") || pathname?.startsWith("/es/blog") || pathname?.startsWith("/fr/blog");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className={isBlog ? "blog-shell" : undefined}>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
