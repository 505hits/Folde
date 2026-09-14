"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  
  // Hide header and footer on checkout, dashboard and invitation routes
  const hideHeaderFooter = pathname?.startsWith("/dashboard") || 
                           pathname?.startsWith("/checkout") ||
                           pathname?.startsWith("/kissing-couple-wedding-invitation") ||
                           pathname?.startsWith("/collections") ||
                           pathname?.startsWith("/es/collections") ||
                           pathname?.startsWith("/fr/collections") ||
                           pathname?.startsWith("/[couple]") ||
                           pathname?.startsWith("/invite");
  const isBlog = pathname?.startsWith("/blog") || pathname?.startsWith("/es/blog") || pathname?.startsWith("/fr/blog");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className={isBlog ? "blog-shell" : undefined}>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
