import { getPostEs } from "@/lib/blog-es";
import { landingContent } from "@/lib/landing-content";
import { localizedMetadata, renderLocalized } from "@/lib/localized-route";

const pageMetadata = {
  home: { title: "FOLDÈ – Invitaciones y web de boda online con confirmación", description: "Cread una invitación de boda elegante que se comparte con un enlace: confirmación de asistencia online, horarios, mapa, galería de fotos y gestión de invitados." },
  landing: { title: landingContent.es.metaTitle, description: landingContent.es.description },
  collections: { title: "Plantillas de invitaciones de boda digitales | FOLDÈ", description: "47 plantillas de invitaciones de boda digitales: sobre animado, papelería ilustrada Signature y confirmación integrada. Vista previa gratis con vuestros nombres." },
  packages: { title: "Precios de las invitaciones de boda digitales | FOLDÈ", description: "Estándar 29,90 $ o Expert 149 $: pago único, invitados ilimitados, confirmación integrada y panel de respuestas. Vista previa gratis antes de pagar." },
  approach: { title: "Cómo trabajamos: de la idea a la invitación online | FOLDÈ", description: "Los cuatro pasos con los que creamos vuestra invitación de boda digital, desde la primera conversación hasta el envío." },
  story: { title: "Nuestro estudio | FOLDÈ Wedding", description: "FOLDÈ es un pequeño estudio de diseño: cada sobre, escena en acuarela y monograma lo diseña a mano nuestro equipo y luego cobra vida como invitación digital." },
  blog: { title: "Blog de bodas: invitaciones, textos e ideas | FOLDÈ", description: "Textos para invitaciones, ideas originales y consejos para preparar y enviar las invitaciones de vuestra boda." },
  checkout: { title: "Crear vuestra invitación | FOLDÈ", description: "Elegid vuestro plan y personalizad la invitación de boda digital." },
  dashboard: { title: "Vuestro panel | FOLDÈ", description: "Gestionad la invitación, los invitados y las confirmaciones." },
  success: { title: "Pago confirmado | FOLDÈ", description: "Confirmación de vuestro pedido FOLDÈ." },
  affiliates: { title: "Programa de afiliados: 30 % de comisión | FOLDÈ", description: "Recomienda las invitaciones de boda digitales de FOLDÈ y gana el 30 % de cada venta: enlace personal, cookie de 60 días, email con cada venta y pago mensual por PayPal o Wise." },
  "affiliate-dashboard": { title: "Panel de afiliado | FOLDÈ", description: "Tu enlace de afiliado, tus clics, tus ventas y tus comisiones." },
};

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  return localizedMetadata("es", segments, getPostEs, pageMetadata);
}

export default async function SpanishPage({ params }) {
  const { segments = [] } = await params;
  return renderLocalized("es", segments, getPostEs);
}
