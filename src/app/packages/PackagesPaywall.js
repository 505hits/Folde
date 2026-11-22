"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import {hasPaidAccess} from '@/lib/purchase-access.mjs';
import CheckoutAuth from '@/components/CheckoutAuth';
import StripeCheckoutSheet from "@/components/StripeCheckoutSheet";
import { supabase } from '@/lib/supabase';
import { useDatabase } from '@/context/DatabaseContext';
import styles from "./offers.module.css";

const content = {
  en: {
    eyebrow: "ONE PAYMENT · YOUR INVITATION, YOURS FOREVER",
    title: "Choose the experience that fits your celebration",
    intro: "Every package includes a beautiful mobile invitation, unlimited guests and live RSVP management.",
    preview: "YOUR LIVE DESIGN IS SAVED",
    previewTitle: "Your invitation is ready to explore.",
    seePreview: "See your invitation preview",
    previewHint: "Tap the envelope, then scroll inside the phone",
    popular: "Most popular", selected: "Selected", payment: "One-time payment", buy: "Choose", launch: "One-time launch price", countdown: "EXCLUSIVE OFFER · 40% OFF ENDS IN", expired: "Exclusive offer ended",
    secure: "Secure checkout · No subscription · No hidden fees",
    afterEyebrow: "YOUR INVITATION PREVIEW",
    afterTitle: "See your invitation come to life.",
    afterText: "Payment unlocks the complete invitation and your private dashboard. Continue with your photos, wording, schedule, music, RSVP questions and guest tables before publishing.",
    afterPoints: ["Finish the design at your own pace", "Preview every update live", "Publish only when everything feels right"],
    phoneHint: "Tap the envelope to open your invitation",
    plans: {
      standard: { name: "Standard", summary: "Everything you need to publish beautifully.", features: ["Unlock every invitation design", "Complete creative customisation", "RSVP tools & unlimited guests"] },
      premium: { name: "Premium", summary: "More creative freedom and AI tools.", features: ["Everything in Standard", "AI images & music", "Priority support"] },
      expert: { name: "Expert", summary: "Our studio creates and reviews it for you.", features: ["Every design fully unlocked", "Tailored art direction, made for you", "Studio review & publishing"] },
    },
  },
  es: {
    eyebrow: "UN ÚNICO PAGO · VUESTRA INVITACIÓN PARA SIEMPRE",
    title: "Elegid la experiencia ideal para vuestra celebración",
    intro: "Todos los planes incluyen una invitación móvil elegante, invitados ilimitados y gestión de confirmaciones en tiempo real.",
    preview: "VUESTRO DISEÑO EN DIRECTO ESTÁ GUARDADO",
    previewTitle: "Vuestra invitación está lista para explorarla.",
    seePreview: "Ver la vista previa de vuestra invitación",
    previewHint: "Tocad el sobre y desplazaos dentro del teléfono",
    popular: "Más elegido", selected: "Seleccionado", payment: "Pago único", buy: "Elegir", launch: "Precio de lanzamiento · pago único", countdown: "OFERTA EXCLUSIVA · 40% DTO. TERMINA EN", expired: "La oferta exclusiva ha terminado",
    secure: "Pago seguro · Sin suscripción · Sin costes ocultos",
    afterEyebrow: "VISTA PREVIA DE VUESTRA INVITACIÓN",
    afterTitle: "Descubrid vuestra invitación antes de comprar.",
    afterText: "El pago desbloquea la invitación completa y vuestro panel privado. Podréis completar las fotos, textos, horarios, música, preguntas de confirmación y mesas antes de publicarla.",
    afterPoints: ["Termináis el diseño a vuestro ritmo", "Previsualizáis cada cambio en directo", "Publicáis únicamente cuando todo esté listo"],
    phoneHint: "Tocad el sobre para abrir vuestra invitación",
    plans: {
      standard: { name: "Estándar", summary: "Todo lo necesario para publicar con elegancia.", features: ["Todos los diseños desbloqueados", "Personalización creativa completa", "Confirmaciones e invitados ilimitados"] },
      premium: { name: "Premium", summary: "Más libertad creativa y herramientas de IA.", features: ["Todo Estándar", "Imágenes y música con IA", "Soporte prioritario"] },
      expert: { name: "Expert", summary: "Nuestro estudio lo crea y revisa por vosotros.", features: ["Todos los diseños desbloqueados", "Dirección artística totalmente a medida", "Revisión y publicación del estudio"] },
    },
  },
  fr: {
    eyebrow: "UN PAIEMENT · VOTRE FAIRE-PART POUR TOUJOURS",
    title: "Choisissez l’expérience adaptée à votre célébration",
    intro: "Chaque formule inclut un faire-part mobile élégant, des invités illimités et la gestion RSVP en temps réel.",
    preview: "VOTRE DESIGN EST BIEN ENREGISTRÉ",
    previewTitle: "Votre invitation est prête à être découverte.",
    seePreview: "Voir l’aperçu de votre invitation",
    previewHint: "Touchez l’enveloppe puis faites défiler le téléphone",
    popular: "Le plus choisi", selected: "Sélectionnée", payment: "Paiement unique", buy: "Choisir", launch: "Prix de lancement · paiement unique", countdown: "OFFRE EXCLUSIVE · -40 % SE TERMINE DANS", expired: "L’offre exclusive est terminée",
    secure: "Paiement sécurisé · Sans abonnement · Sans frais cachés",
    afterEyebrow: "APERÇU DE VOTRE INVITATION",
    afterTitle: "Découvrez votre invitation avant de payer.",
    afterText: "Le paiement débloque l’invitation complète et votre tableau de bord privé. Vous pourrez encore personnaliser les photos, les textes, le programme, la musique, le RSVP et les tables avant la publication.",
    afterPoints: ["Terminez le design à votre rythme", "Prévisualisez chaque modification en direct", "Publiez uniquement lorsque tout est prêt"],
    phoneHint: "Touchez l’enveloppe pour ouvrir votre invitation",
    plans: {
      standard: { name: "Standard", summary: "Tout le nécessaire pour publier avec élégance.", features: ["Tous les designs débloqués", "Personnalisation créative complète", "RSVP et invités illimités"] },
      premium: { name: "Premium", summary: "Plus de liberté créative et des outils IA.", features: ["Tout Standard", "Images et musique IA", "Assistance prioritaire"] },
      expert: { name: "Expert", summary: "Notre studio crée et vérifie votre invitation.", features: ["Tous les designs débloqués", "Direction artistique entièrement sur mesure", "Révision et publication par le studio"] },
    },
  },
};

const plans = [
  { id: "standard", checkoutId: "essential", regularPrice: 29.90 },
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
          <BordeauxTemplate embedded key={previewKey} data={data} editMode={false} autoPlaySimulation={false} heroHeight="970px" />
        </div>
      </div>
    </div>
  );
}

export default function PackagesPaywall({ locale = "en" }) {
  const { currentUser } = useDatabase();
  const [needsAuth, setNeedsAuth] = useState(false);
  useEffect(()=>{let active=true;const check=async()=>{const {data:{session}}=await supabase.auth.getSession();if(session && await hasPaidAccess(session) && active)window.location.replace(locale==='en'?'/dashboard':`/${locale}/dashboard`);};check().catch(()=>{});const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{setTimeout(()=>check().catch(()=>{}),0);});return()=>{active=false;subscription.unsubscribe();};},[locale]);
  const copy = content[locale] || content.en;
  const [selectedId, setSelectedId] = useState("standard");
  const [previewData, setPreviewData] = useState({ ...fallbackPreview, language: locale });
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [embeddedCheckout, setEmbeddedCheckout] = useState(null);
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

  const selectedPrice = selected.regularPrice;

  const createCheckoutSession = async (embedded) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Please sign in to continue.");
    const savedDraft = JSON.parse(window.sessionStorage.getItem("checkoutPreviewDraft") || "{}");
    window.localStorage.setItem("pendingOrder", JSON.stringify({
      name: savedDraft.name || previewData.partner1,
      partnerName: savedDraft.partnerName || previewData.partner2,
      email: session.user.email,
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
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token },
      body: JSON.stringify({
        plan: selected.checkoutId,
        name: savedDraft.name || previewData.partner1,
        partnerName: savedDraft.partnerName || previewData.partner2,
        theme: savedDraft.selectedTheme || previewData.themeId,
        locale,
        embedded,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to open secure checkout.");
    return result;
  };

  const startStripeCheckout = async () => {
    if (paymentLoading) return;
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setNeedsAuth(true);
        return;
      }
      if (await hasPaidAccess(session)) {
        window.location.replace(locale === "en" ? "/dashboard" : "/" + locale + "/dashboard");
        return;
      }
      setEmbeddedCheckout(null);
      setShowPaymentSheet(true);
      const result = await createCheckoutSession(true);
      if (!result.clientSecret || !result.sessionId) throw new Error("Secure payment is temporarily unavailable.");
      setEmbeddedCheckout(result);
    } catch (error) {
      setPaymentError(error.message || "Unable to open secure checkout.");
      setShowPaymentSheet(false);
    } finally {
      setPaymentLoading(false);
    }
  };

  const startHostedCheckout = async () => {
    if (paymentLoading) return;
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const result = await createCheckoutSession(false);
      if (!result.url) throw new Error("Unable to open Stripe Checkout.");
      window.location.assign(result.url);
    } catch (error) {
      setPaymentError(error.message || "Unable to open Stripe Checkout.");
      setShowPaymentSheet(false);
      setPaymentLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {needsAuth && <CheckoutAuth locale={locale} onClose={() => setNeedsAuth(false)} onReady={() => { setNeedsAuth(false); }} />}
      {showPaymentSheet && <StripeCheckoutSheet locale={locale} planName={selectedCopy.name} amount={selectedPrice} clientSecret={embeddedCheckout?.clientSecret} sessionId={embeddedCheckout?.sessionId} onClose={() => setShowPaymentSheet(false)} onFallback={startHostedCheckout} />}
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
          <header className={styles.heading}>
            <p>{copy.eyebrow}</p>
            <h1 id="packages-title">{copy.title}</h1>
            <span>{copy.intro}</span>
            <p className={styles.launchPriceNote}>{copy.launch}</p>
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
                      <strong>${plan.regularPrice.toFixed(2)}</strong>
                      <small>{copy.payment}</small>
                    </span>
                  </span>
                  <span className={styles.features}>{planCopy.features.map((feature) => <span key={feature}><i>✓</i>{feature}</span>)}</span>
                  {active && <span className={styles.selectedLabel}>{copy.selected}</span>}
                  {plan.id === "standard" && <span className={styles.launchLabel}>{copy.launch}</span>}
                </button>
              );
            })}
          </div>


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
