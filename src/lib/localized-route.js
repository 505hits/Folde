import { notFound } from "next/navigation";
import Home from "@/app/page";
import Collections from "@/app/collections/page";
import Packages from "@/app/packages/page";
import Approach from "@/app/approach/page";
import Story from "@/app/story/page";
import BlogIndex from "@/app/blog/page";
import BlogArticle from "@/app/blog/[slug]/page";
import Checkout from "@/app/checkout/page";
import Dashboard from "@/app/dashboard/page";
import Success from "@/app/success/page";
import LandingPage from "@/components/LandingPage";
import { PAGE_SLUGS, absolute, blogPath, pagePath } from "@/lib/routes.mjs";
import { articleAlternates, pageAlternates } from "@/lib/seo";

const PRIVATE = ["checkout", "dashboard", "success"];
const OG_LOCALE = { fr: "fr_FR", es: "es_ES", en: "en_US" };

export function resolveRoute(locale, segments = [], getPost) {
  if (!segments.length) return { type: "page", key: "home" };
  if (segments.length === 1) {
    const [slug] = segments;
    if (PRIVATE.includes(slug)) return { type: "private", key: slug };
    const key = Object.keys(PAGE_SLUGS).find((k) => k !== "home" && PAGE_SLUGS[k][locale] === slug);
    if (key) return { type: "page", key };
  }
  if (segments.length === 2 && segments[0] === "blog" && getPost(segments[1])) return { type: "article", slug: segments[1] };
  return null;
}

export function localizedMetadata(locale, segments, getPost, pageMetadata) {
  const route = resolveRoute(locale, segments, getPost);
  if (!route) return { robots: { index: false } };
  const alternateLocale = Object.values(OG_LOCALE).filter((l) => l !== OG_LOCALE[locale]);
  if (route.type === "private") {
    const page = pageMetadata[route.key];
    return { ...page, robots: { index: false, follow: false } };
  }
  if (route.type === "article") {
    const post = getPost(route.slug);
    const url = absolute(blogPath(locale, post.slug));
    return {
      title: `${post.metaTitle || post.title} | FOLDÈ`,
      description: post.description,
      alternates: articleAlternates(locale, post),
      robots: post.indexable === false ? { index: false, follow: true } : undefined,
      openGraph: { title: post.title, description: post.description, type: "article", locale: OG_LOCALE[locale], alternateLocale, url, images: [post.heroImage] },
      twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.heroImage] },
    };
  }
  const page = pageMetadata[route.key];
  const url = absolute(pagePath(locale, route.key));
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: pageAlternates(locale, route.key),
    openGraph: { title: page.title, description: page.description, type: "website", siteName: "FOLDÈ Wedding", locale: OG_LOCALE[locale], alternateLocale, url, images: [{ url: absolute("/images/logo.png"), alt: "FOLDÈ Wedding" }] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [absolute("/images/logo.png")] },
  };
}

export function renderLocalized(locale, segments, getPost) {
  const route = resolveRoute(locale, segments, getPost);
  if (!route) notFound();
  if (route.type === "article") return <BlogArticle locale={locale} params={Promise.resolve({ slug: route.slug })} />;
  switch (route.key) {
    case "home": return <Home locale={locale} />;
    case "collections": return <Collections locale={locale} />;
    case "packages": return <Packages locale={locale} />;
    case "approach": return <Approach locale={locale} />;
    case "story": return <Story locale={locale} />;
    case "blog": return <BlogIndex locale={locale} />;
    case "landing": return <LandingPage locale={locale} />;
    case "checkout": return <Checkout locale={locale} />;
    case "dashboard": return <Dashboard locale={locale} />;
    case "success": return <Success locale={locale} />;
    default: notFound();
  }
}
