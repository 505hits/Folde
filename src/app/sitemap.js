import { blogPosts } from "@/lib/blog";

const siteUrl = "https://www.folde-wedding.com";

export default function sitemap() {
  const pages = ["", "/collections", "/approach", "/packages", "/story", "/blog"];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-09-08"), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.8 })),
    ...blogPosts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: new Date("2026-09-08"), changeFrequency: "monthly", priority: 0.7 }))
  ];
}
