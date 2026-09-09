import { notFound } from "next/navigation";
import Home from "@/app/page";
import Collections from "@/app/collections/page";
import Packages from "@/app/packages/page";
import Approach from "@/app/approach/page";
import Story from "@/app/story/page";
import BlogIndex from "@/app/blog/page";
import BlogArticle from "@/app/blog/[slug]/page";
import { getPostFr } from "@/lib/blog-fr";

const SITE_URL = "https://www.folde-wedding.com";
const pageMetadata = {
  "": { title: "Faire-part de mariage numérique haut de gamme | FOLDÈ Wedding", description: "FOLDÈ crée des faire-part de mariage numériques sur mesure avec RSVP intégré, galerie photo et gestion des invités en temps réel." },
  collections: { title: "Collections de faire-part de mariage | FOLDÈ Wedding", description: "Découvrez les collections de faire-part de mariage numériques FOLDÈ : des créations élégantes, interactives et entièrement personnalisables." },
  packages: { title: "Formules de faire-part de mariage numérique | FOLDÈ Wedding", description: "Comparez les formules Standard, Premium et Expert de FOLDÈ Wedding, avec RSVP intégré et nombre d’invités illimité." },
  approach: { title: "Notre méthode de création | FOLDÈ Wedding", description: "Découvrez les quatre étapes de création de votre faire-part de mariage numérique, du premier échange jusqu’à sa mise en ligne." },
  story: { title: "Notre vision | FOLDÈ Wedding", description: "Découvrez la philosophie FOLDÈ : direction artistique éditoriale, technologie utile et expérience mémorable pour vos invités." },
  blog: { title: "Idées et conseils pour vos faire-part de mariage | FOLDÈ Wedding", description: "Guides, inspirations graphiques et conseils RSVP pour concevoir un faire-part de mariage numérique élégant et pratique." }
};

function routeFromSegments(segments = []) {
  if (!segments.length) return { type: "page", key: "" };
  if (segments.length === 1 && pageMetadata[segments[0]]) return { type: "page", key: segments[0] };
  if (segments.length === 2 && segments[0] === "blog" && getPostFr(segments[1])) return { type: "article", slug: segments[1] };
  return null;
}

function alternates(path) {
  return { canonical: `${SITE_URL}/fr${path}`, languages: { en: `${SITE_URL}${path || "/"}`, es: `${SITE_URL}/es${path}`, fr: `${SITE_URL}/fr${path}`, "x-default": `${SITE_URL}${path || "/"}` } };
}

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  const route = routeFromSegments(segments);
  if (!route) return {};
  const path = segments.length ? `/${segments.join("/")}` : "";
  if (route.type === "article") {
    const post = getPostFr(route.slug);
    return { title: `${post.title} | FOLDÈ Wedding`, description: post.description, alternates: alternates(path), openGraph: { title: post.title, description: post.description, type: "article", locale: "fr_FR", alternateLocale: ["en_US", "es_ES"], url: `${SITE_URL}/fr${path}`, images: [post.heroImage] }, twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.heroImage] } };
  }
  const page = pageMetadata[route.key];
  return { ...page, alternates: alternates(path), openGraph: { ...page, locale: "fr_FR", alternateLocale: ["en_US", "es_ES"], url: `${SITE_URL}/fr${path}` }, twitter: { card: "summary_large_image", ...page } };
}

export default async function FrenchPage({ params }) {
  const { segments = [] } = await params;
  const route = routeFromSegments(segments);
  if (!route) notFound();
  if (route.type === "article") return <BlogArticle locale="fr" params={Promise.resolve({ slug: route.slug })} />;
  switch (route.key) {
    case "": return <Home locale="fr" />;
    case "collections": return <Collections locale="fr" />;
    case "packages": return <Packages locale="fr" />;
    case "approach": return <Approach locale="fr" />;
    case "story": return <Story locale="fr" />;
    case "blog": return <BlogIndex locale="fr" />;
    default: notFound();
  }
}
