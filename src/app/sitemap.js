import { blogPosts } from "@/lib/blog";
import { blogPostsFr } from "@/lib/blog-fr";
import { blogPostsEs } from "@/lib/blog-es";
import { PAGE_SLUGS, absolute, blogPath, pagePath } from "@/lib/routes.mjs";
import { articleAlternates, pageAlternates } from "@/lib/seo";

const LAST_MODIFIED = new Date("2026-10-21");

// Only canonical, indexable 200 URLs, each with its hreflang alternates.
export default function sitemap() {
  const pages = [];
  for (const key of Object.keys(PAGE_SLUGS)) {
    for (const locale of ["en", "fr", "es"]) {
      if (PAGE_SLUGS[key][locale] === undefined) continue;
      pages.push({
        url: absolute(pagePath(locale, key)),
        lastModified: LAST_MODIFIED,
        changeFrequency: key === "home" || key === "blog" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : key === "landing" ? 0.9 : 0.7,
        alternates: { languages: pageAlternates(locale, key).languages },
      });
    }
  }
  const posts = [["en", blogPosts], ["fr", blogPostsFr], ["es", blogPostsEs]].flatMap(([locale, list]) =>
    list.filter((post) => post.indexable !== false).map((post) => {
      const alt = articleAlternates(locale, post);
      return {
        url: absolute(blogPath(locale, post.slug)),
        lastModified: new Date(post.dateModified || post.datePublished || "2026-09-28"),
        changeFrequency: "monthly",
        priority: post.original ? 0.8 : 0.6,
        ...(alt.languages ? { alternates: { languages: alt.languages } } : {}),
      };
    })
  );
  return [...pages, ...posts];
}
