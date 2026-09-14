"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./offers.module.css";

const content = {
  en: {
    eyebrow: "ONE PAYMENT · YOUR INVITATION, YOURS FOREVER",
    title: "Choose the experience that fits your celebration",
    intro: "Every package includes a beautiful mobile invitation, unlimited guests and live RSVP management.",
    preview: "LIVE INVITATION PREVIEW",
    previewTitle: "Made to feel special from the first tap.",
    popular: "Most popular", selected: "Selected", payment: "One-time payment", buy: "Continue with",
    secure: "Secure checkout · No subscription · No hidden fees",
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
    preview: "VISTA PREVIA DE LA INVITACIÓN",
    previewTitle: "Una experiencia especial desde el primer toque.",
    popular: "Más elegido", selected: "Seleccionado", payment: "Pago único", buy: "Continuar con",
    secure: "Pago seguro · Sin suscripción · Sin costes ocultos",
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
    preview: "APERÇU DU FAIRE-PART",
    previewTitle: "Une expérience précieuse dès le premier geste.",
    popular: "Le plus choisi", selected: "Sélectionnée", payment: "Paiement unique", buy: "Continuer avec",
    secure: "Paiement sécurisé · Sans abonnement · Sans frais cachés",
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

export default function PackagesPaywall({ locale = "en" }) {
  const copy = content[locale] || content.en;
  const [selectedId, setSelectedId] = useState("premium");
  const selected = plans.find((plan) => plan.id === selectedId) || plans[1];
  const selectedCopy = copy.plans[selected.id];
  const checkoutPath = locale === "en" ? "/checkout" : `/${locale}/checkout`;

  return (
    <div className={styles.page}>
      <section className={styles.paywall} aria-labelledby="packages-title">
        <div className={styles.preview}>
          <div className={styles.previewCopy}>
            <span>{copy.preview}</span>
            <strong>{copy.previewTitle}</strong>
          </div>
          <div className={styles.phone} aria-hidden="true">
            <div className={styles.notch} />
            <Image src="/images/envelope-posters/romanticgarden.webp" alt="" fill priority sizes="220px" />
            <div className={styles.invitationNames}>SOFIA <i>&amp;</i> MATEO</div>
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
