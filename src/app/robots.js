import { SITE_URL } from "@/lib/routes.mjs";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/fr/dashboard", "/es/dashboard", "/affiliate-dashboard", "/fr/affiliate-dashboard", "/es/affiliate-dashboard", "/api/", "/guest-upload/", "/guest-gallery/", "/success", "/fr/success", "/es/success"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
