import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = "https://www.folde-wedding.com";

const pages = {
  "": {
    title: "Invitaciones digitales de boda premium | FOLDÈ Wedding",
    description: "Invitaciones digitales de boda elegantes con RSVP integrado, gestión de invitados y diseños personalizados.",
    eyebrow: "INVITACIONES DIGITALES DE BODA",
    heading: "Invitaciones de boda premium y una experiencia impecable para tus invitados",
    body: "FOLDÈ Wedding reúne la invitación, el RSVP, la información del evento y la gestión de invitados en un enlace elegante. Elige una colección y crea una experiencia que se vea tan bien en móvil como en ordenador.",
    cta: "Explorar colecciones",
    ctaHref: "/es/collections",
  },
  collections: {
    title: "Colecciones de invitaciones de boda | FOLDÈ Wedding",
    description: "Explora colecciones de invitaciones digitales de boda, elegantes y personalizables.",
    eyebrow: "COLECCIONES FOLDÈ",
    heading: "Encuentra el universo visual de vuestra celebración",
    body: "Desde jardines románticos hasta composiciones minimalistas y atmósferas mediterráneas, cada colección puede personalizarse con vuestros nombres, fechas, fotos y detalles del evento.",
    cta: "Crear mi invitación",
    ctaHref: "/checkout",
  },
  packages: {
    title: "Planes de invitaciones digitales de boda | FOLDÈ Wedding",
    description: "Compara los planes Estándar, Premium y Expert de FOLDÈ Wedding.",
    eyebrow: "PLANES FOLDÈ",
    heading: "Elige el acompañamiento que necesita vuestra boda",
    body: "Estándar ofrece lo esencial: una invitación personalizada, RSVP y gestión de invitados. Premium añade créditos de imagen y música con IA. Con Expert, nuestro estudio crea y valida vuestra invitación con vosotros.",
    cta: "Ver los planes en inglés",
    ctaHref: "/packages",
  },
  approach: {
    title: "Nuestro proceso | FOLDÈ Wedding",
    description: "Descubre cómo FOLDÈ convierte los detalles de una boda en una invitación digital cuidada.",
    eyebrow: "NUESTRO PROCESO",
    heading: "De vuestra historia a una invitación lista para compartir",
    body: "Elegís una dirección visual, añadís los detalles importantes y comprobáis el resultado en una vista previa. Para el plan Expert, el estudio FOLDÈ revisa el briefing y publica el sitio tras vuestra aprobación.",
    cta: "Ver colecciones",
    ctaHref: "/es/collections",
  },
  story: {
    title: "Sobre FOLDÈ Wedding | Invitaciones digitales de boda",
    description: "La visión de FOLDÈ Wedding: tecnología útil, diseño editorial y una experiencia personal para invitados.",
    eyebrow: "SOBRE FOLDÈ",
    heading: "Más que un enlace: el primer momento de vuestra celebración",
    body: "Creemos que una invitación digital debe combinar la emoción de la papelería de lujo con la comodidad de una herramienta moderna. Por eso ponemos el diseño, la claridad y la experiencia del invitado al mismo nivel.",
    cta: "Empezar a crear",
    ctaHref: "/checkout",
  },
  blog: {
    title: "Revista de bodas | FOLDÈ Wedding",
    description: "Guías y consejos para diseñar invitaciones digitales de boda y organizar el RSVP.",
    eyebrow: "REVISTA FOLDÈ",
    heading: "Ideas claras para una invitación de boda memorable",
    body: "Consulta guías prácticas sobre RSVP, bodas de destino, suites de invitación y diseño floral. Cada artículo está pensado para ayudaros a crear una experiencia elegante y fácil para los invitados.",
    cta: "Leer las guías en inglés",
    ctaHref: "/blog",
  },
};

function getPage(segments = []) {
  // A hreflang pair must lead to a complete, equivalent human translation.
  // Do not manufacture Spanish article pages from their slugs: thin template
  // pages would be poor UX and would weaken the site's international SEO.
  if (segments.length > 1 || (segments.length === 1 && !pages[segments[0]])) return null;
  return pages[segments[0] || ""];
}

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  const page = getPage(segments);
  if (!page) return {};
  const path = segments.length ? `/${segments.join("/")}` : "";
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${SITE_URL}/es${path}`,
      languages: { en: `${SITE_URL}${path}`, es: `${SITE_URL}/es${path}`, "x-default": `${SITE_URL}${path}` },
    },
    openGraph: { title: page.title, description: page.description, locale: "es_ES", url: `${SITE_URL}/es${path}` },
  };
}

export default async function SpanishPage({ params }) {
  const { segments = [] } = await params;
  const page = getPage(segments);
  if (!page) notFound();
  const path = segments.length ? `/${segments.join("/")}` : "";
  return (
    <main style={{ minHeight: "68vh", padding: "clamp(4rem, 10vw, 8rem) 1.5rem", background: "#faf8f4", color: "#3d2b1f" }}>
      <section style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "#a97934", fontSize: ".78rem", fontWeight: 800, letterSpacing: ".16em" }}>{page.eyebrow}</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "clamp(2.6rem, 6vw, 5.2rem)", lineHeight: 1.05, margin: ".9rem 0 1.4rem" }}>{page.heading}</h1>
        <p style={{ maxWidth: "720px", margin: "0 auto", color: "rgba(61,43,31,.75)", fontSize: "1.15rem", lineHeight: 1.7 }}>{page.body}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "2.2rem" }}>
          <Link href={page.ctaHref} className="btn-primary">{page.cta}</Link>
          <Link href={path || "/"} hrefLang="en" lang="en" className="btn-secondary">Read in English</Link>
        </div>
      </section>
    </main>
  );
}
