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
    orCard: "Or pay by card", confirm: "Confirm payment", processing: "Processing…", paymentFailed: "Payment could not be completed. Please try again or choose another method.",
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
    orCard: "Ou payer par carte", confirm: "Confirmer le paiement", processing: "Paiement en cours…", paymentFailed: "Le paiement n’a pas abouti. Réessayez ou choisissez un autre moyen de paiement.",
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
    orCard: "O pagar con tarjeta", confirm: "Confirmar el pago", processing: "Procesando…", paymentFailed: "No se ha podido completar el pago. Intentadlo de nuevo o elegid otro método.",
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
  returnUrl,
  onClose,
  onFallback,
  paymentError = '',
  invitationNames = '',
}) {
  const t = translations[locale] || translations.en;
  const closeRef = useRef(null);
  const mountRef = useRef(null);
  const expressRef = useRef(null);
  const confirmRef = useRef(null);
  const busyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [walletsAvailable, setWalletsAvailable] = useState(null);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [error, setError] = useState("");
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const priorOverflow = document.body.style.overflow;
    const priorFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCloseRef.current?.();
      if (event.key === 'Tab') {
        const items = dialogRef.current?.querySelectorAll('button:not(:disabled), a[href], iframe, input:not(:disabled)');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      document.removeEventListener("keydown", onKeyDown);
      priorFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (!clientSecret || !sessionId || !returnUrl) return;
    let alive = true;
    let paymentElement, expressElement;
    const mount = async () => {
      try {
        const stripe = await stripePromise;
        if (!alive) return;
        if (!stripe?.initCheckoutElementsSdk) throw new Error('Stripe Elements is unavailable.');
        const checkout = stripe.initCheckoutElementsSdk({ clientSecret, elementsOptions: {
          appearance: { theme: 'stripe', variables: { fontFamily: 'system-ui, sans-serif', fontSizeBase: '16px', colorPrimary: '#4b2d1c', colorText: '#182230', borderRadius: '12px', spacingUnit: '4px' } },
          savedPaymentMethod: { enableSave: 'never', enableRedisplay: 'never' },
        } });
        const actionsReady = checkout.loadActions();
        paymentElement = checkout.createPaymentElement({ layout: 'tabs', paymentMethodOrder: ['card'], wallets: { applePay: 'never', googlePay: 'never', link: 'never' } });
        expressElement = checkout.createExpressCheckoutElement({
          buttonHeight: 52,
          buttonTheme: { applePay: 'black', googlePay: 'black' },
          paymentMethodOrder: ['apple_pay', 'google_pay', 'link'],
          paymentMethods: { applePay: 'always', googlePay: 'always', link: 'auto' },
          layout: { maxColumns: 2, maxRows: 2, overflow: 'never' },
        });
        paymentElement.on('ready', () => { if (alive) setPaymentReady(true); });
        paymentElement.on('loaderror', () => { if (alive) setError(t.stripeError); });
        expressElement.on('ready', event => { if (alive) setWalletsAvailable(Boolean(event.availablePaymentMethods && Object.values(event.availablePaymentMethods).some(Boolean))); });
        expressElement.on('cancel', () => { busyRef.current = false; if (alive) setBusy(false); });
        expressElement.on('confirm', async event => { await actionsReady; if (alive) confirmRef.current?.(event); });
        paymentElement.mount(mountRef.current);
        expressElement.mount(expressRef.current);
        const result = await actionsReady;
        if (!alive) return;
        if (result.type !== 'success') throw new Error(result.error?.message || t.stripeError);
        confirmRef.current = async expressCheckoutConfirmEvent => {
          if (busyRef.current) return;
          busyRef.current = true; setBusy(true); setError('');
          try {
            const confirmation = await result.actions.confirm({ returnUrl, redirect: 'always', ...(expressCheckoutConfirmEvent ? { expressCheckoutConfirmEvent } : {}) });
            if (!alive) return;
            if (confirmation.type === 'error') setError(confirmation.error.message || t.paymentFailed);
            else window.location.assign(returnUrl);
          } catch { if (alive) setError(t.paymentFailed); }
          finally { busyRef.current = false; if (alive) setBusy(false); }
        };
        setReady(true);
      } catch (cause) {
        console.error('Unable to mount Stripe payment elements', cause);
        if (alive) setError(t.stripeError);
      }
    };
    mount();
    return () => { alive = false; confirmRef.current = null; paymentElement?.destroy(); expressElement?.destroy(); };
  }, [clientSecret, sessionId, returnUrl, t.stripeError, t.paymentFailed]);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stripe-sheet-title"
      >
        <div className={styles.grabber} aria-hidden="true" />
        <header className={styles.header}>
          <div>
            <h2 id="stripe-sheet-title">{t.title}</h2>
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

        <div className={styles.benefit}><span aria-hidden="true">✓</span><div><strong>{t.benefit}</strong>{invitationNames && <small>{invitationNames}</small>}</div></div>

        <div className={styles.summary}>
          <span>{planName} · {t.oneTime}</span>
          <strong>{new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(Number(amount))}</strong>
        </div>

        {!clientSecret && !error && !paymentError && (
          <p role="status" className={styles.loading}>{t.loading}</p>
        )}
        {(error || paymentError) && (
          <div role="alert" className={styles.error}>
            <p>{paymentError || error}</p>
          </div>
        )}
        <div className={styles.expressGroup} style={walletsAvailable === false ? { display: 'none' } : undefined}>
          <div ref={expressRef} />
          <p className={styles.separator}>{t.orCard}</p>
        </div>
        <div ref={mountRef} className={styles.checkoutMount} />
        {clientSecret && <button type="button" className={styles.confirmPayment} disabled={!ready || !paymentReady || busy} onClick={() => confirmRef.current?.()}>{busy ? t.processing : t.confirm}</button>}
        <button type="button" className={styles.fallback} onClick={onFallback}>{t.fallback} →</button>
        <p className={styles.footer}>{t.footer}</p>
      </section>
    </div>
  );
}
