"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackBlog } from "@/lib/blog-track";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";
import { localizeHref } from "@/lib/routes.mjs";
import styles from "./article-tools.module.css";

// Interface text of the invitation tool, per article language.
const TOOL_COPY = {
  en: { label: "TRY IT WITH YOUR NAMES", title: "What could your invitation look like?", subtitle: "Type your names and pick a design. These are the same designs as on our collections page, shown exactly as guests see them.", first: "First partner", second: "Second partner", firstPh: "Emma", secondPh: "Lucas", date: "Wedding date", optional: "(optional)", design: "Design", cta: "Create my invitation", note: "Free to preview. Your names carry over to the editor; nothing is saved from this page.", opening: "▶ Watch the envelope opening", caption: (name, tag) => `${name} · ${tag} design from the FOLDÈ collection.`, strip: "Put it in a real FOLDÈ design", fallbackDate: "SEP 19, 2026" },
  fr: { label: "ESSAYEZ AVEC VOS PRÉNOMS", title: "À quoi ressemblerait votre faire-part ?", subtitle: "Tapez vos prénoms et choisissez un design : ce sont les mêmes que sur notre page modèles, tels que vos invités les verront.", first: "Votre prénom", second: "Prénom de votre partenaire", firstPh: "Claire", secondPh: "Thomas", date: "Date du mariage", optional: "(facultatif)", design: "Design", cta: "Créer mon faire-part", note: "Aperçu gratuit. Vos prénoms sont repris dans l’éditeur ; rien n’est enregistré depuis cette page.", opening: "▶ Voir l’ouverture de l’enveloppe", caption: (name) => `${name}, un design de la collection FOLDÈ.`, strip: "Dans un vrai design FOLDÈ", fallbackDate: "JUN 12, 2027" },
  es: { label: "PROBADLO CON VUESTROS NOMBRES", title: "¿Cómo quedaría vuestra invitación?", subtitle: "Escribid vuestros nombres y elegid un diseño: son los mismos de nuestra página de plantillas, tal como los verán vuestros invitados.", first: "Tu nombre", second: "Nombre de tu pareja", firstPh: "Lucía", secondPh: "Javier", date: "Fecha de la boda", optional: "(opcional)", design: "Diseño", cta: "Crear mi invitación", note: "Vista previa gratuita. Vuestros nombres pasan al editor; desde esta página no se guarda nada.", opening: "▶ Ver la apertura del sobre", caption: (name) => `${name}, un diseño de la colección FOLDÈ.`, strip: "En un diseño real de FOLDÈ", fallbackDate: "JUN 12, 2027" },
};

// The first six designs of the /collections page, with the same names, tags
// and media. The preview renders them with the same component as that page.
export const TOOL_STYLES = [
  { id: "rosas", name: "Rosas", tag: "Romantic", video: "/videos/hero/kissing-couple.mp4", envelope: "/videos/bordeaux.mp4", thumb: "/images/envelope-posters/bordeaux.webp" },
  { id: "atelierindigo", name: "Atelier Indigo", tag: "Elegant", video: "/images/hero-posters/royal-heritage.webp", isImage: true, envelope: "/videos/ivory.mp4", thumb: "/images/hero-posters/royal-heritage.webp" },
  { id: "orange", name: "Orange", tag: "Warm", video: "/videos/hero/sea-view.mp4", envelope: "/videos/terracotta.mp4", thumb: "/images/envelope-posters/terracotta.webp" },
  { id: "editorial", name: "Editorial", tag: "Minimal", video: "/images/hero-posters/kissing-couple.webp", isImage: true, envelope: "/images/envelope-posters/ivory.webp", thumb: "/images/envelope-posters/ivory.webp" },
  { id: "excellence", name: "Excellence", tag: "Elegant", video: "/videos/sage.mp4", envelope: "/videos/sage.mp4", thumb: "/images/envelope-posters/sage.webp" },
  { id: "bloom", name: "Bloom", tag: "Natural", video: "https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4", envelope: "https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4", thumb: "/images/envelope-posters/bloom.webp" },
];

function DesignStrip({ article, variant, label = "Put it in a real FOLDÈ design", locale = "en" }) {
  return (
    <div className={styles.designStrip}>
      <p>{label}</p>
      <div>
        {TOOL_STYLES.slice(0, 4).map((item) => (
          <Link key={item.id} href={localizeHref(locale, `/checkout?template=${item.id}`)} onClick={() => trackBlog("blog_tool_click", { article, variant, template: item.id })}>
            <Image src={item.thumb} alt="" width={72} height={96} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const clean = (value) => value.replace(/[<>]/g, "").slice(0, 40);

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
}

function checkoutHref(style, partner1, partner2) {
  const params = new URLSearchParams({ template: style });
  if (partner1.trim()) params.set("partner1", partner1.trim());
  if (partner2.trim()) params.set("partner2", partner2.trim());
  return `/checkout?${params.toString()}`;
}

function useToolTracking(article, variant) {
  const ref = useRef(null);
  const interacted = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { trackBlog("blog_tool_view", { article, variant }); observer.disconnect(); }
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [article, variant]);
  const interact = () => {
    if (interacted.current) return;
    interacted.current = true;
    trackBlog("blog_tool_interact", { article, variant });
  };
  return { ref, interact };
}

function InvitationVariant({ article, title, subtitle, locale = "en" }) {
  const t = TOOL_COPY[locale] || TOOL_COPY.en;
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [date, setDate] = useState("");
  const [styleId, setStyleId] = useState(TOOL_STYLES[0].id);
  const style = TOOL_STYLES.find((item) => item.id === styleId) || TOOL_STYLES[0];
  const [playing, setPlaying] = useState(false);
  const [opening, setOpening] = useState(false);
  const { ref, interact } = useToolTracking(article, "invitation");
  const shownDate = formatDate(date) || t.fallbackDate;

  return (
    <section id="folde-tool" ref={ref} className={styles.tool} aria-labelledby="folde-tool-title">
      <div className={styles.toolForm}>
        <p className={styles.toolLabel}>{t.label}</p>
        <h2 id="folde-tool-title" className={styles.toolTitle}>{title || t.title}</h2>
        <p className={styles.toolSubtitle}>{subtitle || t.subtitle}</p>
        <div className={styles.nameRow}>
          <label>{t.first}<input value={partner1} maxLength={40} placeholder={t.firstPh} onChange={(e) => { interact(); setPartner1(clean(e.target.value)); }} /></label>
          <label>{t.second}<input value={partner2} maxLength={40} placeholder={t.secondPh} onChange={(e) => { interact(); setPartner2(clean(e.target.value)); }} /></label>
        </div>
        <label className={styles.dateField}>{t.date} <span>{t.optional}</span><input type="date" value={date} onChange={(e) => { interact(); setDate(e.target.value); }} /></label>
        <fieldset className={styles.moods}>
          <legend>{t.design}</legend>
          {TOOL_STYLES.map((item) => (
            <button type="button" key={item.id} aria-pressed={item.id === styleId} className={item.id === styleId ? styles.moodActive : ""} onClick={() => { interact(); setStyleId(item.id); setOpening(false); setPlaying(true); }}>
              <span className={styles.moodSwatch}><Image src={item.thumb} alt="" width={44} height={44} /></span>
              {item.name}
            </button>
          ))}
        </fieldset>
        <Link className={styles.toolButton} href={localizeHref(locale, checkoutHref(style.id, partner1, partner2))} onClick={() => trackBlog("blog_tool_click", { article, variant: "invitation", template: style.id, locale })}>
          {t.cta}
        </Link>
        <p className={styles.toolNote}>{t.note}</p>
      </div>
      <figure className={styles.toolPreview} aria-live="polite">
        <div className={styles.phone} onMouseEnter={() => setPlaying(true)} onClick={() => setPlaying(true)}>
          <TemplateHeroPreview
            key={`${style.id}-${opening ? "envelope" : "hero"}`}
            partner1={partner1.trim() || t.firstPh}
            partner2={partner2.trim() || t.secondPh}
            date={shownDate}
            videoSrc={style.video}
            envelopeSrc={style.envelope}
            isImage={style.isImage || false}
            showEnvelope={opening}
            active={playing}
            preloadEnvelopeFrame
            language={locale}
          />
        </div>
        <button type="button" className={styles.openingButton} onClick={() => { interact(); setOpening(true); setPlaying(true); }}>
          {t.opening}
        </button>
        <figcaption>{t.caption(style.name, style.tag.toLowerCase())}</figcaption>
      </figure>
    </section>
  );
}

function RsvpVariant({ article, title, subtitle }) {
  const [attend, setAttend] = useState("");
  const [company, setCompany] = useState("");
  const [diet, setDiet] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { ref, interact } = useToolTracking(article, "rsvp");
  const summary = useMemo(() => {
    if (!attend) return "No demo response yet";
    if (attend === "no") return "Declined · the couple sees it instantly";
    const party = { alone: "1 guest", guest: "2 guests (with a guest)", family: "Family (names listed)" }[company] || "Party size not chosen yet";
    return `Attending · ${party}${diet ? ` · Dietary note: ${diet}` : ""}`;
  }, [attend, company, diet]);
  // Every change shows up on the couple's side right away; sending confirms it.
  const update = (setter) => (e) => { interact(); setter(e.target.value); setSent(false); setError(""); };
  const submit = (e) => {
    e.preventDefault();
    interact();
    if (!attend) return setError("Choose whether you will attend first.");
    if (attend === "yes" && !company) return setError("Tell the couple who is coming with you.");
    setError("");
    setSent(true);
  };

  return (
    <section id="folde-tool" ref={ref} className={styles.tool} aria-labelledby="folde-tool-title">
      <div className={styles.toolForm}>
        <p className={styles.toolLabel}>DEMO · WHAT YOUR GUESTS FILL IN</p>
        <h2 id="folde-tool-title" className={styles.toolTitle}>{title || "Try a digital RSVP in 20 seconds"}</h2>
        <p className={styles.toolSubtitle}>{subtitle || "These are the same questions a FOLDÈ invitation asks. This demo sends nothing."}</p>
        <form className={styles.rsvpForm} onSubmit={submit} noValidate>
          <label>Will you attend?
            <select value={attend} onChange={update(setAttend)} aria-invalid={error && !attend ? "true" : undefined}>
              <option value="">Please select</option>
              <option value="yes">Yes, with pleasure!</option>
              <option value="no">Regretfully decline</option>
            </select>
          </label>
          {attend === "yes" && (
            <label>Will you be accompanied?
              <select value={company} onChange={update(setCompany)} aria-invalid={error && !company ? "true" : undefined}>
                <option value="">Please select</option>
                <option value="alone">I&apos;m coming alone</option>
                <option value="guest">With a guest</option>
                <option value="family">With family</option>
              </select>
            </label>
          )}
          {attend === "yes" && (
            <label>Allergies and dietary needs
              <input value={diet} maxLength={60} placeholder="e.g. vegetarian" onChange={(e) => { interact(); setDiet(clean(e.target.value)); setSent(false); setError(""); }} />
            </label>
          )}
          {error && <p className={styles.rsvpError} role="alert">{error}</p>}
          <button type="submit" className={styles.toolGhostButton}>{sent ? "✓ Sent · see the couple's view" : "Submit demo RSVP"}</button>
        </form>
      </div>
      <div className={styles.dashboardCard} aria-live="polite">
        <p className={styles.toolLabel}>WHAT THE COUPLE SEES</p>
        <p className={styles.dashboardLine}><span className={sent ? styles.dotLive : styles.dot} />{summary}</p>
        <p className={styles.rsvpStatus}>{sent ? "✓ Answer received just now (demo)" : attend ? "Preview · not sent yet" : "Answer on the left to see it here"}</p>
        <p className={styles.toolNote}>In a real invitation, each answer lands in the couple&apos;s private dashboard with the guest&apos;s name and email.</p>
        <Link className={styles.toolButton} href="/checkout" onClick={() => trackBlog("blog_tool_click", { article, variant: "rsvp" })}>Create my invitation with RSVP</Link>
        <DesignStrip article={article} variant="rsvp" />
      </div>
    </section>
  );
}

const WORDING = {
  wedding: {
    formal: (a, b, d) => `Together with their families\n${a} and ${b}\nrequest the pleasure of your company\nat the celebration of their marriage\n${d}\nKindly reply by the date below.`,
    modern: (a, b, d) => `${a} & ${b} are getting married!\nJoin us on ${d}\nfor vows, dinner and a long night of dancing.\nRSVP inside.`,
    relaxed: (a, b, d) => `We're tying the knot!\n${a} and ${b}\n${d}\nCome eat, drink and celebrate with us.\nTell us you're coming below.`,
  },
  rehearsal: {
    formal: (a, b, d) => `Please join us for the rehearsal dinner\nin honor of ${a} and ${b}\n${d}\nThe favor of a reply is requested.`,
    modern: (a, b, d) => `The night before the big day\nRehearsal dinner for ${a} & ${b}\n${d}\nDrinks, dinner and a few stories.`,
    relaxed: (a, b, d) => `Before the "I do"s, let's eat!\nRehearsal dinner for ${a} & ${b}\n${d}\nLet us know if you can make it.`,
  },
  // Shower: a = guest of honor, b = host.
  shower: {
    formal: (a, b, d) => `Please join us for a bridal shower\nhonoring ${a}\n${d}\nHosted by ${b}\nKindly reply to ${b} by the date below.`,
    modern: (a, b, d) => `Love is brewing!\nCelebrate ${a} at a bridal shower\n${d}\nHosted by ${b} · Registry details inside.`,
    relaxed: (a, b, d) => `Brunch, bubbly and the bride-to-be!\nJoin us to shower ${a} with love\n${d}\nText ${b} to let us know you're coming.`,
  },
  engagement: {
    formal: (a, b, d) => `Please join us\nin celebrating the engagement of\n${a} and ${b}\n${d}\nKindly reply by the date below.`,
    modern: (a, b, d) => `It's official!\nCome celebrate ${a} & ${b}\n${d}\nDrinks, toasts and good company.`,
    relaxed: (a, b, d) => `We're engaged!\nJoin ${a} & ${b} for a casual celebration\n${d}\nNo gifts, just your company.`,
  },
  reception: {
    formal: (a, b, d) => `${a} and ${b}\nrequest the pleasure of your company\nat a reception celebrating their marriage\n${d}\nDinner and dancing to follow.`,
    modern: (a, b, d) => `We eloped!\nNow let's celebrate with everyone we love.\nJoin ${a} & ${b}\n${d}`,
    relaxed: (a, b, d) => `We said "I do" with just our families.\nNow it's party time!\nCelebrate with ${a} & ${b}\n${d}`,
  },
};

const WORDING_FIELDS = {
  shower: { first: "Guest of honor", second: "Hosted by", firstPlaceholder: "Emma", secondPlaceholder: "Aunt Claire", fallbackSecond: "Aunt Claire", date: "Sunday, the ninth of August" },
  rehearsal: { date: "Friday, the eleventh of September" },
  engagement: { date: "Saturday, the sixth of June" },
  reception: { date: "Saturday, the third of October" },
};

function formatLongDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function WordingVariant({ article, event = "wedding", title, subtitle }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [date, setDate] = useState("");
  const [tone, setTone] = useState("formal");
  const [copied, setCopied] = useState(false);
  const { ref, interact } = useToolTracking(article, `wording-${event}`);
  const fields = WORDING_FIELDS[event] || {};
  const fallbackDate = fields.date || "Saturday, the twelfth of September";
  const text = (WORDING[event] || WORDING.wedding)[tone](a.trim() || "Emma", b.trim() || fields.fallbackSecond || "Lucas", formatLongDate(date) || fallbackDate);
  const copy = async () => {
    interact();
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  };

  return (
    <section id="folde-tool" ref={ref} className={styles.tool} aria-labelledby="folde-tool-title">
      <div className={styles.toolForm}>
        <p className={styles.toolLabel}>WORDING GENERATOR</p>
        <h2 id="folde-tool-title" className={styles.toolTitle}>{title || "Draft your wording with your names"}</h2>
        <p className={styles.toolSubtitle}>{subtitle || "Pick a tone, add your names, then copy the text or use it in your invitation."}</p>
        <div className={styles.nameRow}>
          <label>{fields.first || "First partner"}<input value={a} maxLength={40} placeholder={fields.firstPlaceholder || "Emma"} onChange={(e) => { interact(); setA(clean(e.target.value)); }} /></label>
          <label>{fields.second || "Second partner"}<input value={b} maxLength={40} placeholder={fields.secondPlaceholder || "Lucas"} onChange={(e) => { interact(); setB(clean(e.target.value)); }} /></label>
        </div>
        <label className={styles.dateField}>Date <span>(optional)</span><input type="date" value={date} onChange={(e) => { interact(); setDate(e.target.value); }} /></label>
        <fieldset className={styles.moods}>
          <legend>Tone</legend>
          {["formal", "modern", "relaxed"].map((item) => (
            <button type="button" key={item} aria-pressed={item === tone} className={item === tone ? styles.moodActive : ""} onClick={() => { interact(); setTone(item); }}>{item[0].toUpperCase() + item.slice(1)}</button>
          ))}
        </fieldset>
      </div>
      <div className={styles.wordingCard}>
        <pre aria-live="polite">{text}</pre>
        <div className={styles.wordingActions}>
          <button type="button" className={styles.toolGhostButton} onClick={copy}>{copied ? "Copied" : "Copy text"}</button>
          {/* FOLDÈ designs are wedding invitations: for pre-wedding parties, point to them honestly. */}
          {event === "shower" || event === "engagement"
            ? <Link className={styles.toolButton} href="/collections" onClick={() => trackBlog("blog_tool_click", { article, variant: `wording-${event}` })}>See our wedding invitation designs</Link>
            : <Link className={styles.toolButton} href={checkoutHref("rosas", a, b)} onClick={() => trackBlog("blog_tool_click", { article, variant: `wording-${event}` })}>Use it in my invitation</Link>}
        </div>
        <DesignStrip article={article} variant={`wording-${event}`} label={event === "shower" || event === "engagement" ? "FOLDÈ wedding invitation designs" : undefined} />
      </div>
    </section>
  );
}

export default function InvitationPreviewTool({ variant = "invitation", article, event, title, subtitle, locale = "en" }) {
  if (variant === "rsvp") return <RsvpVariant article={article} title={title} subtitle={subtitle} />;
  if (variant === "wording") return <WordingVariant article={article} event={event} title={title} subtitle={subtitle} />;
  return <InvitationVariant article={article} title={title} subtitle={subtitle} locale={locale} />;
}
