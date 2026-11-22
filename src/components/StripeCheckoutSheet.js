"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import styles from "./stripe-checkout-sheet.module.css";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const translations = {
  en: {
    title: "Secure payment",
    benefit: "Unlock your invitation and private wedding studio",
    oneTime: "One-time payment",
    loading: "Preparing secure payment…",
    stripeError: "Secure payment could not load. You can complete your purchase on Stripe.",
    fallback: "Continue on Stripe",
    close: "Close payment",
    footer: "Secure payment by Stripe · No subscription · No hidden fees",
  },
  fr: {
    title: "Paiement sécurisé",
    benefit: "Débloquez votre faire-part et votre studio privé",
    oneTime: "Paiement unique",
    loading: "Préparation du paiement sécurisé…",
    stripeError: "Le paiement ne s'affiche pas. Vous pouvez terminer sur Stripe.",
    fallback: "Continuer sur Stripe",
    close: "Fermer le paiement",
    footer: "Paiement sécurisé par Stripe · Sans abonnement · Sans frais cachés",
  },
  es: {
    title: "Pago seguro",
    benefit: "Desbloquead vuestra invitación y estudio privado",
    oneTime: "Pago único",
    loading: "Preparando el pago seguro…",
    stripeError: "El pago no se puede mostrar. Podéis finalizar la compra en Stripe.",
    fallback: "Continuar en Stripe",
    close: "Cerrar pago",
    footer: "Pago seguro con Stripe · Sin suscripción · Sin costes ocultos",
  },
};

export default function StripeCheckoutSheet({
  locale = "en",
  planName,
  amount,
  clientSecret,
  sessionId,
  onClose,
  onFallback,
}) {
  const t = translations[locale] || translations.en;
  const closeRef = useRef(null);
  const mountRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [error, setError] = useState("");
  onCloseRef.current = onClose;

  useEffect(() => {
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!clientSecret || !sessionId) return;
    let alive = true;
    let embeddedCheckout;

    const mountCheckout = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe publishable key is missing.");
        if (!alive) return;
        const createEmbedded = stripe.createEmbeddedCheckoutPage?.bind(stripe)
          || stripe.initEmbeddedCheckout?.bind(stripe);
        if (!createEmbedded) throw new Error("Embedded Stripe Checkout is unavailable.");
        embeddedCheckout = await createEmbedded({
          fetchClientSecret: async () => clientSecret,
        });
        if (!alive) {
          embeddedCheckout.destroy();
          return;
        }
        embeddedCheckout.mount(mountRef.current);
      } catch (cause) {
        console.error("Unable to mount embedded Stripe Checkout", cause);
        if (alive) setError(t.stripeError);
      }
    };

    mountCheckout();
    return () => {
      alive = false;
      if (embeddedCheckout) embeddedCheckout.destroy();
    };
  }, [clientSecret, sessionId, locale, t.stripeError]);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stripe-sheet-title"
      >
        <div className={styles.grabber} aria-hidden="true" />
        <header className={styles.header}>
          <div>
            <h2 id="stripe-sheet-title">{t.title}</h2>
            <p>{t.benefit}</p>
          </div>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            className={styles.close}
            aria-label={t.close}
          >
            ×
          </button>
        </header>

        <div className={styles.summary}>
          <span>{planName} · {t.oneTime}</span>
          <strong>{"$" + Number(amount).toFixed(2) + " USD"}</strong>
        </div>

        {!clientSecret && !error && (
          <p role="status" className={styles.loading}>{t.loading}</p>
        )}
        {error && (
          <div role="alert" className={styles.error}>
            <p>{error}</p>
            <button type="button" className={styles.fallback} onClick={onFallback}>
              {t.fallback} →
            </button>
          </div>
        )}
        <div ref={mountRef} className={styles.checkoutMount} />
        <p className={styles.footer}>{t.footer}</p>
      </section>
    </div>
  );
}
