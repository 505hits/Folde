"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import styles from "./offers.module.css";

const content = {
  en: {
    eyebrow: "ONE PAYMENT · YOUR INVITATION, YOURS FOREVER",
    title: "Choose the experience that fits your celebration",
    intro: "Every package includes a beautiful mobile invitation, unlimited guests and live RSVP management.",
    preview: "YOUR LIVE DESIGN IS SAVED",
    previewTitle: "Continue personalising your invitation after payment.",
    previewHint: "Tap the envelope, then scroll inside the phone",
    popular: "Most popular", selected: "Selected", payment: "One-time payment", buy: "Continue with",
    secure: "Secure checkout · No subscription · No hidden fees",
    afterEyebrow: "YOUR INVITATION AFTER PAYMENT",
    afterTitle: "Keep personalising every detail from your private studio.",
    afterText: "Payment unlocks the complete invitation and your private dashboard. Continue with your photos, wording, schedule, music, RSVP questions and guest tables before publishing.",
    afterPoints: ["Finish the design at your own pace", "Preview every update live", "Publish only when everything feels right"],
    phoneHint: "Example of the mobile invitation your guests will receive",
    plans: {
      standard: { name: "Standard", summary: "An elegant invitation with all the essentials.", features: ["Your chosen design, personalized", "RSVP, guests and table planner", "Unlimited guests", "No AI credits"] },
      premium: { name: "Premium", summary: "More creative freedom, managed by you.", features: ["Everything in Standard", "5 AI image credits", "5 AI music credits", "Priority support"] },
      expert: { name: "Expert", summary: "Our studio handles the creative work for you.", features: ["Everything in Premium", "Bespoke art direction", "Studio review and publishing", "Personal concierge"] },
    },
  },
  es: {
    eyebrow: "UN ÚNICO PAGO · VUESTRA INVITACIÓN PARA SIEMPRE",
    title: "Elegid la experiencia ideal para vuestra celebración",
    intro: "Todos los planes incluyen una invitación móvil elegante, invitados ilimitados y gestión de confirmaciones en tiempo real.",
    preview: "VUESTRO DISEÑO EN DIRECTO ESTÁ GUARDADO",
    previewTitle: "Seguid personalizando vuestra invitación después del pago.",
    previewHint: "Tocad el sobre y desplazaos dentro del teléfono",
    popular: "Más elegido", selected: "Seleccionado", payment: "Pago único", buy: "Continuar con",
    secure: "Pago seguro · Sin suscripción · Sin costes ocultos",
    afterEyebrow: "VUESTRA INVITACIÓN DESPUÉS DEL PAGO",
    afterTitle: "Seguid personalizando cada detalle desde vuestro estudio privado.",
    afterText: "El pago desbloquea la invitación completa y vuestro panel privado. Podréis completar las fotos, textos, horarios, música, preguntas de confirmación y mesas antes de publicarla.",
    afterPoints: ["Termináis el diseño a vuestro ritmo", "Previsualizáis cada cambio en directo", "Publicáis únicamente cuando todo esté listo"],
    phoneHint: "Ejemplo de la invitación móvil que recibirán vuestros invitados",
    plans: {
      standard: { name: "Estándar", summary: "Una invitación elegante con todo lo esencial.", features: ["Diseño elegido y personalizado", "Confirmaciones, invitados y mesas", "Invitados ilimitados", "Sin créditos de IA"] },
      premium: { name: "Premium", summary: "Más libertad creativa, gestionada por vosotros.", features: ["Todo lo incluido en Estándar", "5 créditos de imagen con IA", "5 créditos de música con IA", "Soporte prioritario"] },
      expert: { name: "Expert", summary: "Nuestro estudio se encarga de la creación.", features: ["Todo lo incluido en Premium", "Dirección artística a medida", "Revisión y publicación del estudio", "Atención personalizada"] },
    },
  },
  fr: {
    eyebrow: "UN PAIEMENT · VOTRE FAIRE-PART POUR TOUJOURS",
    title: "Choisissez l’expérience adaptée à votre célébration",
    intro: "Chaque formule inclut un faire-part mobile élégant, des invités illimités et la gestion RSVP en temps réel.",
    preview: "VOTRE DESIGN EST BIEN ENREGISTRÉ",
    previewTitle: "Continuez à personnaliser votre invitation après le paiement.",
    previewHint: "Touchez l’enveloppe puis faites défiler le téléphone",
    popular: "Le plus choisi", selected: "Sélectionnée", payment: "Paiement unique", buy: "Continuer avec",
    secure: "Paiement sécurisé · Sans abonnement · Sans frais cachés",
    afterEyebrow: "VOTRE INVITATION APRÈS LE PAIEMENT",
    afterTitle: "Finalisez chaque détail depuis votre studio privé.",
    afterText: "Le paiement débloque l’invitation complète et votre tableau de bord privé. Vous pourrez encore personnaliser les photos, les textes, le programme, la musique, le RSVP et les tables avant la publication.",
    afterPoints: ["Terminez le design à votre rythme", "Prévisualisez chaque modification en direct", "Publiez uniquement lorsque tout est prêt"],
    phoneHint: "Exemple de l’invitation mobile que recevront vos invités",
    plans: {
      standard: { name: "Standard", summary: "Un faire-part élégant avec tous les essentiels.", features: ["Design choisi et personnalisé", "RSVP, invités et plan de table", "Invités illimités", "Aucun crédit IA"] },
      premium: { name: "Premium", summary: "Plus de liberté créative, gérée par vous.", features: ["Tout Standard", "5 crédits image IA", "5 crédits musique IA", "Assistance prioritaire"] },
      expert: { name: "Expert", summary: "Notre studio prend en charge toute la création.", features: ["Tout Premium", "Direction artistique sur mesure", "Révision et publication par le studio", "Conciergerie personnelle"] },
    },
  },
};

const plans = [
  { id: "standard", checkoutId: "essential", price: "49.90 €" },
  { id: "premium", checkoutId: "premium", price: "79.90 €", popular: true },
  { id: "expert", checkoutId: "Custom", price: "149.90 €" },
];

const fallbackPreview = {
  language: "en",
  partner1: "Sofia",
  partner2: "Mateo",
  date: "SEP 19, 2026",
  time: "16:00",
  ceremonyVenue: "Your Dream Venue",
  receptionVenue: "",
  themeId: "romanticgarden",
  videos: {
    envelope: "https://eftesa.com/assets/themes/romantic-garden/Floral-garden-intro-video.mp4",
    hero: "/images/blog/destination-wedding.webp",
  },
  timeline: [
    { time: "15:00", title: "Ceremony" },
    { time: "16:30", title: "Cocktail" },
    { time: "19:00", title: "Dinner" },
  ],
  accommodations: [],
  menu: [],
  sections: { showIntro: true, showVenue: true, showSchedule: true, showRSVP: true, showGallery: true, showDressCode: true, showGuestGallery: true },
  gallery: [],
  guestGallery: [],
  images: {},
};

function InvitationPhone({ data, compact = false }) {
  const previewKey = `${data.themeId}-${data.videos?.envelope}-${data.videos?.hero}`;
  return (
    <div className={compact ? styles.phone : styles.finalPhone}>
      <div className={compact ? styles.notch : styles.finalNotch} />
      <div className={styles.phoneScreen}>
        <div className={styles.phoneTemplate}>
          <BordeauxTemplate key={previewKey} data={data} editMode={false} autoPlaySimulation={false} heroHeight="970px" />
        </div>
      </div>
    </div>
  );
}

export default function PackagesPaywall({ locale = "en" }) {
  const copy = content[locale] || content.en;
  const [selectedId, setSelectedId] = useState("standard");
  const [previewData, setPreviewData] = useState({ ...fallbackPreview, language: locale });
  const selected = plans.find((plan) => plan.id === selectedId) || plans[0];
  const selectedCopy = copy.plans[selected.id];
  const checkoutPath = locale === "en" ? "/checkout" : `/${locale}/checkout`;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const savedDraft = window.sessionStorage.getItem("checkoutPreviewDraft");
    if (!savedDraft) return;
    let frameId;
    try {
      const draft = JSON.parse(savedDraft);
      if (draft.previewData) {
        frameId = window.requestAnimationFrame(() => setPreviewData({ ...draft.previewData, language: locale }));
      }
    } catch (error) {
      console.warn("Unable to restore the live preview on the packages page.", error);
    }
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [locale]);

  return (
    <div className={styles.page}>
      <section className={styles.paywall} aria-labelledby="packages-title">
        <div className={styles.preview}>
          <div className={styles.previewCopy}>
            <span>{copy.preview}</span>
            <strong>{copy.previewTitle}</strong>
          </div>
          <div className={styles.previewPhoneWrap}>
            <InvitationPhone data={previewData} compact />
            <small>{copy.previewHint}</small>
          </div>
        </div>

        <div className={styles.content}>
          <header className={styles.heading}>
            <p>{copy.eyebrow}</p>
            <h1 id="packages-title">{copy.title}</h1>
            <span>{copy.intro}</span>
          </header>

          <div className={styles.planGrid} role="radiogroup" aria-label={copy.title}>
            {plans.map((plan) => {
              const planCopy = copy.plans[plan.id];
              const active = selectedId === plan.id;
              return (
                <button type="button" role="radio" aria-checked={active} className={`${styles.plan} ${active ? styles.planSelected : ""}`} key={plan.id} onClick={() => setSelectedId(plan.id)}>
                  {plan.popular && <span className={styles.badge}>{copy.popular}</span>}
                  <span className={styles.radio} aria-hidden="true"><i /></span>
                  <span className={styles.planTop}>
                    <span><strong>{planCopy.name}</strong><small>{planCopy.summary}</small></span>
                    <span className={styles.price}><strong>{plan.price}</strong><small>{copy.payment}</small></span>
                  </span>
                  <span className={styles.features}>{planCopy.features.map((feature) => <span key={feature}><i>✓</i>{feature}</span>)}</span>
                  {active && <span className={styles.selectedLabel}>{copy.selected}</span>}
                </button>
              );
            })}
          </div>

          <section className={styles.afterPayment} aria-labelledby="after-payment-title">
            <div className={styles.afterCopy}>
              <p>{copy.afterEyebrow}</p>
              <h2 id="after-payment-title">{copy.afterTitle}</h2>
              <span>{copy.afterText}</span>
              <ul>
                {copy.afterPoints.map((point) => <li key={point}><i aria-hidden="true">✓</i>{point}</li>)}
              </ul>
            </div>
            <div className={styles.finalPreview}>
              <InvitationPhone data={previewData} />
              <small>{copy.phoneHint}</small>
            </div>
          </section>
        </div>
      </section>

      <div className={styles.purchaseBar}>
        <div className={styles.purchaseSummary}><span>{selectedCopy.name}</span><strong>{selected.price}</strong></div>
        <Link href={`${checkoutPath}?plan=${selected.checkoutId}&step=3`} className={styles.purchaseButton}>
          {copy.buy} {selectedCopy.name}<span aria-hidden="true">→</span>
        </Link>
        <small>{copy.secure}</small>
      </div>
    </div>
  );
}
