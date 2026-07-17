"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  
  // Hide header and footer on dashboard and invitation routes
  const hideHeaderFooter = pathname?.startsWith("/dashboard") || 
                           pathname?.startsWith("/kissing-couple-wedding-invitation") ||
                           pathname?.startsWith("/collections") ||
                           pathname?.startsWith("/[couple]") ||
                           pathname?.startsWith("/invite");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
