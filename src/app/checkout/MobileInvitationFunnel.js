"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./mobile-funnel.module.css";
import phoneStyles from "./mobile-funnel-phone.module.css";
import buildingStyles from "./mobile-building.module.css";
import layoutStyles from "./mobile-funnel-layout.module.css";

const COPY = {
  en: {
    steps: ["Date", "Envelope", "Design", "Preview"],
    kicker: "YOUR INVITATION, IN A FEW TAPS",
    namesTitle: "Whose love story are we celebrating?",
    namesText: "Start with the two names your guests will see first.",
    first: "Your first name",
    second: "Your partner’s first name",
    dateTitle: "When is your wedding date?",
    dateText: "A tentative date is perfectly fine — you can change it later.",
    dateLater: "We’re still deciding",
    envelopeTitle: "Choose the opening moment",
    envelopeText: "Swipe to preview each envelope. Every choice can be changed later.",
    heroTitle: "Choose your invitation cover",
    heroText: "Swipe through the designs and select the atmosphere that feels like you.",
    emailTitle: "Your preview is ready",
    emailText: "Enter your email to save your choices and receive a link to continue later.",
    email: "you@example.com",
    continue: "Continue",
    choose: "Use this design",
    pricing: "Save my preview & see packages",
    selected: "Selected",
    proof: "500+ happy couples",
    private: "Private, secure and editable at any time.",
    buildingTitle: "Creating your invitation",
    buildingText: "Bringing your names, date and chosen design together…",
    saveError: "We could not securely save your preview. Please try again.",
    errorNames: "Please enter both first names.",
    errorDate: "Please choose a wedding date.",
    errorEmail: "Please enter a valid email address.",
  },
  fr: {
    steps: ["Date", "Enveloppe", "Design", "Aperçu"],
    kicker: "VOTRE INVITATION, EN QUELQUES ÉTAPES",
    namesTitle: "Quelle histoire d’amour célébrons-nous ?",
    namesText: "Commencez par les deux prénoms que vos invités verront en premier.",
    first: "Votre prénom",
    second: "Le prénom de votre partenaire",
    dateTitle: "Quelle est la date de votre mariage ?",
    dateText: "Une date provisoire suffit — vous pourrez la modifier plus tard.",
    dateLater: "Nous hésitons encore",
    envelopeTitle: "Choisissez le moment d’ouverture",
    envelopeText: "Faites glisser les enveloppes. Chaque choix reste modifiable.",
    heroTitle: "Choisissez la couverture de l’invitation",
    heroText: "Faites défiler les designs et choisissez l’univers qui vous ressemble.",
    emailTitle: "Votre aperçu est prêt",
    emailText: "Indiquez votre e-mail pour enregistrer vos choix et recevoir un lien de reprise.",
    email: "vous@exemple.com",
    continue: "Continuer",
    choose: "Choisir ce design",
    pricing: "Enregistrer et voir les formules",
    selected: "Sélectionné",
    proof: "500+ couples heureux",
    private: "Privé, sécurisé et modifiable à tout moment.",
    buildingTitle: "Création de votre invitation",
    buildingText: "Nous assemblons vos prénoms, votre date et le design choisi…",
    saveError: "Nous n’avons pas pu enregistrer votre aperçu. Réessayez.",
    errorNames: "Indiquez les deux prénoms.",
    errorDate: "Choisissez une date de mariage.",
    errorEmail: "Indiquez une adresse e-mail valide.",
  },
  es: {
    steps: ["Fecha", "Sobre", "Diseño", "Vista previa"],
    kicker: "VUESTRA INVITACIÓN, EN POCOS PASOS",
    namesTitle: "¿Qué historia de amor celebramos?",
    namesText: "Empezad con los dos nombres que verán primero vuestros invitados.",
    first: "Tu nombre",
    second: "El nombre de tu pareja",
    dateTitle: "¿Cuál es la fecha de vuestra boda?",
    dateText: "Una fecha provisional es suficiente; podréis cambiarla más adelante.",
    dateLater: "Todavía no lo sabemos",
    envelopeTitle: "Elegid el momento de apertura",
    envelopeText: "Deslizad para ver los sobres. Todas las opciones se pueden cambiar.",
    heroTitle: "Elegid la portada de la invitación",
    heroText: "Deslizad los diseños y elegid el ambiente que más os represente.",
    emailTitle: "Vuestra vista previa está lista",
    emailText: "Introducid vuestro e-mail para guardar las opciones y recibir un enlace.",
    email: "vosotros@ejemplo.com",
    continue: "Continuar",
    choose: "Elegir este diseño",
    pricing: "Guardar y ver los planes",
    selected: "Seleccionado",
    proof: "500+ parejas felices",
    private: "Privado, seguro y editable en cualquier momento.",
    buildingTitle: "Creando vuestra invitación",
    buildingText: "Estamos reuniendo vuestros nombres, la fecha y el diseño elegido…",
    saveError: "No hemos podido guardar vuestra vista previa. Intentadlo de nuevo.",
    errorNames: "Introducid los dos nombres.",
    errorDate: "Elegid una fecha de boda.",
    errorEmail: "Introducid una dirección de e-mail válida.",
  },
};

const isImage = (url = "") => /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(url) || url.includes("/_next/image?");

function Media({ option, kind }) {
  if (!option?.url) return <div className={styles.mediaFallback} style={{ background: option?.color || "#eadfd2" }} />;
  return isImage(option.url) ? (
    <img src={option.url} alt={`${option.name} ${kind}`} />
  ) : (
    <video src={option.url} muted loop autoPlay playsInline preload="metadata" aria-label={`${option.name} ${kind}`} />
  );
}

export default function MobileInvitationFunnel({
  locale = "en",
  account,
  setAccount,
  previewDate,
  setPreviewDate,
  selectedEnvelope,
  setSelectedEnvelope,
  selectedHeroVideo,
  setSelectedHeroVideo,
  envelopeOptions,
  heroOptions,
  onComplete,
}) {
  const copy = COPY[locale] || COPY.en;
  const [screen, setScreen] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [building, setBuilding] = useState(false);
  const envelopeRail = useRef(null);
  const heroRail = useRef(null);
  const stageRef = useRef(null);
  const featuredEnvelopes = useMemo(() => envelopeOptions.filter((item) => item.url && item.id !== "env_custom"), [envelopeOptions]);
  const featuredHeroes = useMemo(() => heroOptions.filter((item) => item.url && item.id !== "hero_custom"), [heroOptions]);

  useEffect(() => {
    if (screen !== 3) return;
    const frameId = requestAnimationFrame(() => {
      stageRef.current?.scrollTo({ top: 0, behavior: "instant" });
      heroRail.current?.scrollTo({ left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frameId);
  }, [screen]);

  useEffect(() => {
    if (!building) return;
    const timer = window.setTimeout(() => setBuilding(false), 3200);
    return () => window.clearTimeout(timer);
  }, [building]);

  const validateAndContinue = async () => {
    setError("");
    if (screen === 1 && !previewDate) return setError(copy.errorDate);
    if (screen === 4) {
      if (!/^\S+@\S+\.\S+$/.test(account.email || "")) return setError(copy.errorEmail);
      setSubmitting(true);
      try {
        await onComplete(account.email.trim());
      } catch (saveError) {
        console.warn("Preview save failed.", saveError);
        setError(copy.saveError);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (screen === 2) {
      setScreen(3);
      requestAnimationFrame(() => {
        stageRef.current?.scrollTo({ top: 0, behavior: "instant" });
        heroRail.current?.scrollTo({ left: 0, behavior: "instant" });
      });
      return;
    }
    if (screen === 3) {
      setBuilding(true);
      setScreen(4);
      return;
    }
    setScreen((current) => Math.min(4, current + 1));
  };

  const selectAndCenter = (id, setter, railRef) => {
    setter(id);
    requestAnimationFrame(() => {
      railRef.current?.querySelector(`[data-option="${id}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  };

  const selectedLabel = screen === 2
    ? featuredEnvelopes.find((item) => item.id === selectedEnvelope)?.name
    : featuredHeroes.find((item) => item.id === selectedHeroVideo)?.name;

  return (
    <main className={`${styles.funnel} ${layoutStyles.fullPage}`}>
      <header className={styles.header}>
        <button type="button" onClick={() => screen === 1 ? history.back() : setScreen((current) => current - 1)} aria-label="Back">←</button>
        <a href={locale === "en" ? "/" : `/${locale}`} className={styles.logo}>FOLDÈ</a>
        <span>{screen}/4</span>
      </header>

      <div className={styles.progress} style={{ gridTemplateColumns: "repeat(4, 1fr)" }} aria-label={`Step ${screen} of 4`}>
        {copy.steps.map((label, index) => <i key={label} className={index < screen ? styles.done : ""} />)}
      </div>

      <section ref={stageRef} className={`${styles.stage} ${(screen === 2 || screen === 3) ? `${styles.stageGallery} ${layoutStyles.galleryStage}` : ""}`}>
        {screen !== 4 && (
          <div className={styles.copy}>
            <p>{copy.kicker}</p>
            <h1>{screen === 1 ? copy.dateTitle : screen === 2 ? copy.envelopeTitle : copy.heroTitle}</h1>
            <span>{screen === 1 ? copy.dateText : screen === 2 ? copy.envelopeText : copy.heroText}</span>
          </div>
        )}

        {screen === 1 && (
          <div className={styles.dateCard}>
            <input type="date" autoFocus value={previewDate === "TBD" ? "" : previewDate} onChange={(event) => setPreviewDate(event.target.value)} min={new Date().toISOString().split("T")[0]} />
            <button
              type="button"
              onClick={() => setPreviewDate("TBD")}
              style={{ minHeight: 44, padding: ".65rem 1rem", border: "1px solid rgba(61,43,31,.14)", borderRadius: 999, color: "#654126", background: "#f6efe6", fontSize: ".78rem", fontWeight: 800 }}
            >
              {previewDate === "TBD" ? "✓ " : ""}{copy.dateLater}
            </button>
            <small>{account.name || "You"} &amp; {account.partnerName || "your partner"}</small>
          </div>
        )}

        {(screen === 2 || screen === 3) && (
          <>
            <div className={styles.rail} ref={screen === 2 ? envelopeRail : heroRail}>
              {(screen === 2 ? featuredEnvelopes : featuredHeroes).map((option) => {
                const selected = (screen === 2 ? selectedEnvelope : selectedHeroVideo) === option.id;
                return (
                  <button
                    type="button"
                    data-option={option.id}
                    className={`${styles.designCard} ${selected ? styles.designSelected : ""}`}
                    key={option.id}
                    onClick={() => selectAndCenter(option.id, screen === 2 ? setSelectedEnvelope : setSelectedHeroVideo, screen === 2 ? envelopeRail : heroRail)}
                    aria-pressed={selected}
                  >
                    <span className={phoneStyles.phoneShell}>
                      <span className={phoneStyles.phoneNotch} />
                      <span className={phoneStyles.phoneScreen}><Media option={option} kind={screen === 2 ? "envelope" : "hero"} /></span>
                    </span>
                    <span className={styles.designMeta}><strong>{option.name}</strong><small>{selected ? `✓ ${copy.selected}` : copy.choose}</small></span>
                  </button>
                );
              })}
            </div>
            <div className={styles.swipeHint}><span>←</span> {selectedLabel || copy.choose} <span>→</span></div>
          </>
        )}

        {screen === 4 && building && (
          <div className={buildingStyles.buildingCard} role="status" aria-live="polite">
            <div className={buildingStyles.buildingVisual} aria-hidden="true">
              <i /><i className={buildingStyles.orbitTwo} />
              <div className={buildingStyles.miniInvitation}><span>{account.name?.[0] || "F"}</span><b>&amp;</b><span>{account.partnerName?.[0] || "W"}</span></div>
              <span className={buildingStyles.sparkOne}>✦</span><span className={buildingStyles.sparkTwo}>✦</span><span className={buildingStyles.sparkThree}>✦</span>
            </div>
            <div className={buildingStyles.buildingCopy}><strong>{copy.buildingTitle}</strong><span>{copy.buildingText}</span></div>
            <div className={buildingStyles.buildingProgress}><i /></div>
          </div>
        )}

        {screen === 4 && !building && (
          <div className={styles.emailCard}>
            <div className={styles.readyMark}>✓</div>
            <div><strong>{copy.emailTitle}</strong><span>{copy.emailText}</span></div>
            <label><span>Email</span><input type="email" autoFocus autoComplete="email" value={account.email} onChange={(event) => setAccount((value) => ({ ...value, email: event.target.value }))} placeholder={copy.email} /></label>
            <small>◇ {copy.private}</small>
          </div>
        )}
      </section>

      {!building && <footer className={`${styles.footer} ${(screen === 2 || screen === 3) ? layoutStyles.galleryFooter : ""}`}>
        {error && <p role="alert">{error}</p>}
        <div className={phoneStyles.footerInner}>
          <div className={phoneStyles.socialProof}><strong>★★★★★ 4.9/5</strong><span>{copy.proof}</span></div>
          <button type="button" onClick={validateAndContinue} disabled={submitting}>
            {submitting ? "…" : screen === 4 ? copy.pricing : copy.continue}<span aria-hidden="true">→</span>
          </button>
        </div>
      </footer>}
    </main>
  );
}
