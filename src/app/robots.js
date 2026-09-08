export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/api/"] },
    sitemap: "https://www.folde-wedding.com/sitemap.xml"
  };
}
