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
import { getPostEs } from "@/lib/blog-es";

const SITE_URL = "https://www.folde-wedding.com";

const pageMetadata = {
  "": {
    title: "Invitaciones digitales de boda premium | FOLDÈ Wedding",
    description: "Invitaciones digitales de boda a medida con confirmación integrada, galerías de fotos y gestión de invitados en tiempo real.",
  },
  collections: {
    title: "Colecciones de invitaciones de boda | FOLDÈ Wedding",
    description: "Explora las colecciones de invitaciones digitales de boda de FOLDÈ: diseños elegantes, interactivos y completamente personalizables.",
  },
  packages: {
    title: "Planes de invitaciones digitales de boda | FOLDÈ Wedding",
    description: "Compara los planes Estándar, Premium y Expert de FOLDÈ Wedding, con confirmación integrada e invitados ilimitados.",
  },
  approach: {
    title: "Nuestro proceso | FOLDÈ Wedding",
    description: "Descubre el proceso de cuatro pasos con el que FOLDÈ crea vuestra invitación digital de boda, desde la primera conversación hasta la publicación.",
  },
  story: {
    title: "Nuestra visión | FOLDÈ Wedding",
    description: "Descubre la filosofía de FOLDÈ Wedding: diseño editorial, tecnología útil y una experiencia memorable para los invitados.",
  },
  blog: {
    title: "Ideas y tutoriales para invitaciones de boda | FOLDÈ Wedding",
    description: "Tutoriales, ideas de diseño, consejos de confirmación e inspiración para invitaciones digitales de boda de FOLDÈ Wedding.",
  },
  checkout: {
    title: "Finaliza tu invitación | FOLDÈ Wedding",
    description: "Elige tu plan y personaliza tu invitación digital de boda FOLDÈ.",
    robots: { index: false, follow: false },
  },
  dashboard: {
    title: "Tu panel de boda | FOLDÈ Wedding",
    description: "Gestiona tu invitación, invitados, confirmaciones y mesas desde tu espacio privado.",
    robots: { index: false, follow: false },
  },
  success: {
    title: "Pago confirmado | FOLDÈ Wedding",
    description: "Confirmación de tu pedido de FOLDÈ Wedding.",
    robots: { index: false, follow: false },
  },
};

function routeFromSegments(segments = []) {
  if (segments.length === 0) return { type: "page", key: "" };
  if (segments.length === 1 && pageMetadata[segments[0]]) return { type: "page", key: segments[0] };
  if (segments.length === 2 && segments[0] === "blog" && getPostEs(segments[1])) return { type: "article", slug: segments[1] };
  return null;
}

function languageAlternates(path) {
  return {
    canonical: `${SITE_URL}/es${path}`,
    languages: {
      en: `${SITE_URL}${path || "/"}`,
      es: `${SITE_URL}/es${path}`,
      fr: `${SITE_URL}/fr${path}`,
      "x-default": `${SITE_URL}${path || "/"}`,
    },
  };
}

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  const route = routeFromSegments(segments);
  if (!route) return {};
  const path = segments.length ? `/${segments.join("/")}` : "";

  if (route.type === "article") {
    const post = getPostEs(route.slug);
    return {
      title: `${post.title} | FOLDÈ Wedding`,
      description: post.description,
      alternates: languageAlternates(path),
      openGraph: { title: post.title, description: post.description, type: "article", locale: "es_ES", alternateLocale: ["en_US", "fr_FR"], url: `${SITE_URL}/es${path}`, images: [post.heroImage] },
    };
  }

  const page = pageMetadata[route.key];
  return {
    ...page,
    alternates: languageAlternates(path),
    openGraph: { ...page, locale: "es_ES", alternateLocale: ["en_US", "fr_FR"], url: `${SITE_URL}/es${path}` },
  };
}

export default async function SpanishPage({ params }) {
  const { segments = [] } = await params;
  const route = routeFromSegments(segments);
  if (!route) notFound();

  if (route.type === "article") {
    return <BlogArticle locale="es" params={Promise.resolve({ slug: route.slug })} />;
  }

  switch (route.key) {
    case "": return <Home locale="es" />;
    case "collections": return <Collections locale="es" />;
    case "packages": return <Packages locale="es" />;
    case "approach": return <Approach locale="es" />;
    case "story": return <Story locale="es" />;
    case "blog": return <BlogIndex locale="es" />;
    case "checkout": return <Checkout locale="es" />;
    case "dashboard": return <Dashboard locale="es" />;
    case "success": return <Success locale="es" />;
    default: notFound();
  }
}
