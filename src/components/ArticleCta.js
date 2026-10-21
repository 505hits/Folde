import Link from "next/link";
import { pagePath } from "@/lib/routes.mjs";
import styles from "@/app/blog/blog.module.css";

// Inline call to action for articles. Two variants so the mid-article block and
// the closing block don't repeat the same sentence.
const copy = {
  fr: {
    mid: { label: "ESSAYER SUR UN VRAI MODÈLE", title: "Voyez ce que ça donne sur un téléphone", text: "Choisissez un modèle, tapez vos prénoms et votre date : l’aperçu se met à jour en direct, et il est gratuit.", button: "Créer mon faire-part", secondary: "Voir les modèles" },
    end: { label: "PRÊTS À ENVOYER ?", title: "Un lien, et vos invités ont tout : programme, plan, RSVP", text: "Paiement unique, invités illimités, réponses centralisées dans votre tableau de bord.", button: "Commencer mon faire-part", secondary: "Voir les tarifs" },
  },
  es: {
    mid: { label: "PROBADLO CON UNA PLANTILLA", title: "Mirad cómo queda en un móvil", text: "Elegid una plantilla, escribid vuestros nombres y la fecha: la vista previa se actualiza al momento y es gratis.", button: "Crear nuestra invitación", secondary: "Ver plantillas" },
    end: { label: "¿LISTOS PARA ENVIARLA?", title: "Un enlace con todo: horarios, mapa y confirmación", text: "Pago único, invitados ilimitados y todas las respuestas en vuestro panel.", button: "Empezar la invitación", secondary: "Ver precios" },
  },
  en: {
    mid: { label: "TRY IT ON A REAL TEMPLATE", title: "See how it looks on a phone", text: "Pick a template, add your names and date: the preview updates live, and it’s free.", button: "Create your invitation", secondary: "Browse templates" },
    end: { label: "READY TO SEND?", title: "One link with the schedule, map and RSVP", text: "One-time payment, unlimited guests, every reply in your dashboard.", button: "Start your invitation", secondary: "See pricing" },
  },
};

export default function ArticleCta({ locale = "en", variant = "mid" }) {
  const t = (copy[locale] || copy.en)[variant];
  const root = locale === "en" ? "" : `/${locale}`;
  const secondaryHref = variant === "mid" ? pagePath(locale, "collections") : pagePath(locale, "packages");
  return (
    <aside className={styles.inlineCta} aria-label={t.label}>
      <p className={styles.label}>{t.label}</p>
      <p className={styles.inlineCtaTitle}>{t.title}</p>
      <p>{t.text}</p>
      <div className={styles.introActions}>
        <Link className={styles.primaryButton} href={`${root}/checkout`}>{t.button}</Link>
        <Link className={styles.secondaryButton} href={secondaryHref}>{t.secondary}</Link>
      </div>
    </aside>
  );
}
