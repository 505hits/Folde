import { getPostEs } from "@/lib/blog-es";
import { landingContent } from "@/lib/landing-content";
import { localizedMetadata, renderLocalized } from "@/lib/localized-route";

const pageMetadata = {
  home: { title: "FOLDÈ – Invitaciones y web de boda online con confirmación", description: "Cread una invitación de boda elegante que se comparte con un enlace: confirmación de asistencia online, horarios, mapa, galería de fotos y gestión de invitados." },
  landing: { title: landingContent.es.metaTitle, description: landingContent.es.description },
  collections: { title: "Plantillas de invitaciones de boda digitales | FOLDÈ", description: "Explorad nuestras plantillas de invitaciones de boda digitales: sobre animado, tipografías cuidadas y personalización completa." },
  packages: { title: "Precios de las invitaciones de boda digitales | FOLDÈ", description: "Planes Estándar y Expert: pago único, invitados ilimitados y confirmación de asistencia integrada. Comparad qué incluye cada uno." },
  approach: { title: "Cómo trabajamos: de la idea a la invitación online | FOLDÈ", description: "Los cuatro pasos con los que creamos vuestra invitación de boda digital, desde la primera conversación hasta el envío." },
  story: { title: "Nuestra historia | FOLDÈ Wedding", description: "La filosofía de FOLDÈ: diseño de papelería, tecnología útil y una experiencia memorable para los invitados." },
  blog: { title: "Blog de bodas: invitaciones, textos e ideas | FOLDÈ", description: "Textos para invitaciones, ideas originales y consejos para preparar y enviar las invitaciones de vuestra boda." },
  checkout: { title: "Crear vuestra invitación | FOLDÈ", description: "Elegid vuestro plan y personalizad la invitación de boda digital." },
  dashboard: { title: "Vuestro panel | FOLDÈ", description: "Gestionad la invitación, los invitados y las confirmaciones." },
  success: { title: "Pago confirmado | FOLDÈ", description: "Confirmación de vuestro pedido FOLDÈ." },
};

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  return localizedMetadata("es", segments, getPostEs, pageMetadata);
}

export default async function SpanishPage({ params }) {
  const { segments = [] } = await params;
  return renderLocalized("es", segments, getPostEs);
}
