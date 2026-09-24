"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import styles from "./offers.module.css";

const content = {
  en: {
    eyebrow: "ONE PAYMENT · YOUR INVITATION, YOURS FOREVER",
    title: "Choose the experience that fits your celebration",
    intro: "Every package includes a beautiful mobile invitation, unlimited guests and live RSVP management.",
    preview: "YOUR LIVE DESIGN IS SAVED",
    previewTitle: "Continue personalising your invitation after payment.",
    seePreview: "See your invitation preview",
    previewHint: "Tap the envelope, then scroll inside the phone",
    popular: "Most popular", selected: "Selected", payment: "One-time payment", buy: "Choose", launch: "Launch price · 40% off", countdown: "EXCLUSIVE OFFER · 40% OFF ENDS IN", expired: "Exclusive offer ended",
    secure: "Secure checkout · No subscription · No hidden fees",
    afterEyebrow: "YOUR INVITATION AFTER PAYMENT",
    afterTitle: "Keep personalising every detail from your private studio.",
    afterText: "Payment unlocks the complete invitation and your private dashboard. Continue with your photos, wording, schedule, music, RSVP questions and guest tables before publishing.",
    afterPoints: ["Finish the design at your own pace", "Preview every update live", "Publish only when everything feels right"],
    phoneHint: "Example of the mobile invitation your guests will receive",
    plans: {
      standard: { name: "Standard", summary: "Everything you need to publish beautifully.", features: ["Your chosen design", "RSVP & guest tools", "Unlimited guests"] },
      premium: { name: "Premium", summary: "More creative freedom and AI tools.", features: ["Everything in Standard", "AI images & music", "Priority support"] },
      expert: { name: "Expert", summary: "Our studio creates and reviews it for you.", features: ["Everything in Standard", "Bespoke art direction", "Studio publishing"] },
    },
  },
  es: {
    eyebrow: "UN ÚNICO PAGO · VUESTRA INVITACIÓN PARA SIEMPRE",
    title: "Elegid la experiencia ideal para vuestra celebración",
    intro: "Todos los planes incluyen una invitación móvil elegante, invitados ilimitados y gestión de confirmaciones en tiempo real.",
    preview: "VUESTRO DISEÑO EN DIRECTO ESTÁ GUARDADO",
    previewTitle: "Seguid personalizando vuestra invitación después del pago.",
    seePreview: "Ver la vista previa de vuestra invitación",
    previewHint: "Tocad el sobre y desplazaos dentro del teléfono",
    popular: "Más elegido", selected: "Seleccionado", payment: "Pago único", buy: "Elegir", launch: "Precio de lanzamiento · 40% dto.", countdown: "OFERTA EXCLUSIVA · 40% DTO. TERMINA EN", expired: "La oferta exclusiva ha terminado",
    secure: "Pago seguro · Sin suscripción · Sin costes ocultos",
    afterEyebrow: "VUESTRA INVITACIÓN DESPUÉS DEL PAGO",
    afterTitle: "Seguid personalizando cada detalle desde vuestro estudio privado.",
    afterText: "El pago desbloquea la invitación completa y vuestro panel privado. Podréis completar las fotos, textos, horarios, música, preguntas de confirmación y mesas antes de publicarla.",
    afterPoints: ["Termináis el diseño a vuestro ritmo", "Previsualizáis cada cambio en directo", "Publicáis únicamente cuando todo esté listo"],
    phoneHint: "Ejemplo de la invitación móvil que recibirán vuestros invitados",
    plans: {
      standard: { name: "Estándar", summary: "Todo lo necesario para publicar con elegancia.", features: ["Diseño elegido", "Confirmaciones e invitados", "Invitados ilimitados"] },
      premium: { name: "Premium", summary: "Más libertad creativa y herramientas de IA.", features: ["Todo Estándar", "Imágenes y música con IA", "Soporte prioritario"] },
      expert: { name: "Expert", summary: "Nuestro estudio lo crea y revisa por vosotros.", features: ["Todo Estándar", "Dirección artística", "Publicación por el estudio"] },
    },
  },
  fr: {
    eyebrow: "UN PAIEMENT · VOTRE FAIRE-PART POUR TOUJOURS",
    title: "Choisissez l’expérience adaptée à votre célébration",
    intro: "Chaque formule inclut un faire-part mobile élégant, des invités illimités et la gestion RSVP en temps réel.",
    preview: "VOTRE DESIGN EST BIEN ENREGISTRÉ",
    previewTitle: "Continuez à personnaliser votre invitation après le paiement.",
    seePreview: "Voir l’aperçu de votre invitation",
    previewHint: "Touchez l’enveloppe puis faites défiler le téléphone",
    popular: "Le plus choisi", selected: "Sélectionnée", payment: "Paiement unique", buy: "Choisir", launch: "Prix de lancement · -40 %", countdown: "OFFRE EXCLUSIVE · -40 % SE TERMINE DANS", expired: "L’offre exclusive est terminée",
    secure: "Paiement sécurisé · Sans abonnement · Sans frais cachés",
    afterEyebrow: "VOTRE INVITATION APRÈS LE PAIEMENT",
    afterTitle: "Finalisez chaque détail depuis votre studio privé.",
    afterText: "Le paiement débloque l’invitation complète et votre tableau de bord privé. Vous pourrez encore personnaliser les photos, les textes, le programme, la musique, le RSVP et les tables avant la publication.",
    afterPoints: ["Terminez le design à votre rythme", "Prévisualisez chaque modification en direct", "Publiez uniquement lorsque tout est prêt"],
    phoneHint: "Exemple de l’invitation mobile que recevront vos invités",
    plans: {
      standard: { name: "Standard", summary: "Tout le nécessaire pour publier avec élégance.", features: ["Design sélectionné", "RSVP et gestion invités", "Invités illimités"] },
      premium: { name: "Premium", summary: "Plus de liberté créative et des outils IA.", features: ["Tout Standard", "Images et musique IA", "Assistance prioritaire"] },
      expert: { name: "Expert", summary: "Notre studio crée et vérifie votre invitation.", features: ["Tout Standard", "Direction artistique", "Publication par le studio"] },
    },
  },
};

const plans = [
  { id: "standard", checkoutId: "essential", regularPrice: 49.90, offerPrice: 29.90 },
  { id: "expert", checkoutId: "Custom", regularPrice: 149 },
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
  const [offerExpires, setOfferExpires] = useState(0);
  const [now, setNow] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const selected = plans.find((plan) => plan.id === selectedId) || plans[0];
  const selectedCopy = copy.plans[selected.id];

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const frameId = window.requestAnimationFrame(() => window.scrollTo(0, 0));
    const settleId = window.setTimeout(() => window.scrollTo(0, 0), 250);
    const mediaSettleId = window.setTimeout(() => window.scrollTo(0, 0), 900);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(settleId);
      window.clearTimeout(mediaSettleId);
      window.history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const expiryKey = "foldeStandardOfferExpires";
    const startedKey = "foldeStandardOfferStarted";
    let expiry = Number(window.sessionStorage.getItem(expiryKey));
    if (!window.sessionStorage.getItem(startedKey)) {
      expiry = Date.now() + 5 * 60 * 1000;
      window.sessionStorage.setItem(startedKey, "1");
      window.sessionStorage.setItem(expiryKey, String(expiry));
    }
    const frameId = window.requestAnimationFrame(() => {
      setOfferExpires(expiry || 0);
      setNow(Date.now());
    });
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearInterval(timer);
    };
  }, []);

  const offerActive = offerExpires > now;
  const secondsLeft = Math.max(0, Math.ceil((offerExpires - now) / 1000));
  const countdown = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const selectedPrice = selected.id === "standard" && offerActive ? selected.offerPrice : selected.regularPrice;

  const startStripeCheckout = async () => {
    if (paymentLoading) return;
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const savedDraft = JSON.parse(window.sessionStorage.getItem("checkoutPreviewDraft") || "{}");
      window.localStorage.setItem("pendingOrder", JSON.stringify({
        name: savedDraft.name || previewData.partner1,
        partnerName: savedDraft.partnerName || previewData.partner2,
        email: savedDraft.email || "",
        theme: savedDraft.selectedTheme || previewData.themeId,
        previewData: { ...previewData, themeId: savedDraft.selectedTheme || previewData.themeId, selectedEnvelope: savedDraft.selectedEnvelope, selectedHeroVideo: savedDraft.selectedHeroVideo },
        selectedEnvelope: savedDraft.selectedEnvelope,
        selectedHeroVideo: savedDraft.selectedHeroVideo,
        plan: selectedCopy.name,
        planId: selected.checkoutId,
        price: selectedPrice,
      }));
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selected.checkoutId,
          name: savedDraft.name || previewData.partner1,
          partnerName: savedDraft.partnerName || previewData.partner2,
          email: savedDraft.email || "",
          theme: savedDraft.selectedTheme || previewData.themeId,
          locale,
          launchOffer: selected.id === "standard" && offerActive,
          offerExpires,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Unable to open secure checkout.");
      window.location.assign(result.url);
    } catch (error) {
      setPaymentError(error.message || "Unable to open secure checkout.");
      setPaymentLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.paywall} aria-labelledby="packages-title">
        <div className={styles.preview}>
          <div className={styles.previewCopy}>
            <span>{copy.preview}</span>
            <strong>{copy.previewTitle}</strong>
            <a href="#invitation-preview" className={styles.previewLink}>{copy.seePreview}<span aria-hidden="true">↓</span></a>
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
            <div className={`${styles.offerTimer} ${!offerActive ? styles.offerTimerExpired : ""}`}>
              <span>{offerActive ? copy.countdown : copy.expired}</span>
              {offerActive && <strong>{countdown}</strong>}
            </div>
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
                    <span className={styles.price}>
                      {plan.id === "standard" && offerActive && <span className={styles.priceLine}><del>$49.90</del><em>-40%</em></span>}
                      <strong>${(plan.id === "standard" && offerActive ? plan.offerPrice : plan.regularPrice).toFixed(2)}</strong>
                      <small>{copy.payment}</small>
                    </span>
                  </span>
                  <span className={styles.features}>{planCopy.features.map((feature) => <span key={feature}><i>✓</i>{feature}</span>)}</span>
                  {active && <span className={styles.selectedLabel}>{copy.selected}</span>}
                  {plan.id === "standard" && offerActive && <span className={styles.launchLabel}>{copy.launch}</span>}
                </button>
              );
            })}
          </div>

          <section id="invitation-preview" className={styles.afterPayment} aria-labelledby="after-payment-title">
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
        <div className={styles.purchaseSummary}><span>{selectedCopy.name}</span><strong>${selectedPrice.toFixed(2)}</strong></div>
        <button type="button" onClick={startStripeCheckout} disabled={paymentLoading} className={styles.purchaseButton}>
          {paymentLoading ? "Secure checkout…" : `${copy.buy} ${selectedCopy.name}`}<span aria-hidden="true">→</span>
        </button>
        {paymentError && <span className={styles.paymentError}>{paymentError}</span>}
        <small>{copy.secure}</small>
      </div>
    </div>
  );
}
