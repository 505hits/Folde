import { blogPosts } from "@/lib/blog";

const siteUrl = "https://www.folde-wedding.com";

export default function sitemap() {
  const pages = ["", "/collections", "/approach", "/packages", "/story", "/blog"];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-09-08"), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.8 })),
    ...pages.map((path) => ({ url: `${siteUrl}/es${path}`, lastModified: new Date("2026-09-08"), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 0.9 : 0.7 })),
    ...blogPosts.flatMap((post) => [
      { url: `${siteUrl}/blog/${post.slug}`, lastModified: new Date("2026-09-08"), changeFrequency: "monthly", priority: 0.7 },
      { url: `${siteUrl}/es/blog/${post.slug}`, lastModified: new Date("2026-09-08"), changeFrequency: "monthly", priority: 0.6 }
    ])
  ];
}
