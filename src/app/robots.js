export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/api/", "/guest-upload/", "/guest-gallery/"] },
    sitemap: "https://www.folde-wedding.com/sitemap.xml"
  };
}
