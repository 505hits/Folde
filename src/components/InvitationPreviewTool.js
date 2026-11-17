"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackBlog } from "@/lib/blog-track";
import styles from "./article-tools.module.css";

// Four real FOLDÈ designs. Images are the actual first frames of each design's
// opening screen and envelope, so the preview never shows a style we don't sell.
export const TOOL_STYLES = [
  { id: "rosas", mood: "Romantic", name: "Rosas", hero: "/images/hero-posters/kissing-couple.webp", envelope: "/images/envelope-posters/bordeaux.webp" },
  { id: "ivory", mood: "Minimal", name: "Pearl", hero: "/images/hero-posters/sea-view.webp", envelope: "/images/envelope-posters/ivory-veil.webp" },
  { id: "bloom", mood: "Floral", name: "Bloom", hero: "/images/dashboard-posters/df5ba466a21660e4.webp", envelope: "/images/envelope-posters/bloom.webp" },
  { id: "royalblue", mood: "Modern", name: "Sapphire", hero: "/images/hero-posters/royal-heritage.webp", envelope: "/images/envelope-posters/royal-blue.webp" },
];

const clean = (value) => value.replace(/[<>]/g, "").slice(0, 40);

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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

function InvitationVariant({ article, title, subtitle }) {
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [date, setDate] = useState("");
  const [styleId, setStyleId] = useState(TOOL_STYLES[0].id);
  const style = TOOL_STYLES.find((item) => item.id === styleId) || TOOL_STYLES[0];
  const { ref, interact } = useToolTracking(article, "invitation");
  const shownDate = formatDate(date) || "Your wedding date";

  return (
    <section id="folde-tool" ref={ref} className={styles.tool} aria-labelledby="folde-tool-title">
      <div className={styles.toolForm}>
        <p className={styles.toolLabel}>TRY IT WITH YOUR NAMES</p>
        <h2 id="folde-tool-title" className={styles.toolTitle}>{title || "What could your invitation look like?"}</h2>
        <p className={styles.toolSubtitle}>{subtitle || "Type your names and pick a mood. The preview uses the real opening screen of each FOLDÈ design."}</p>
        <div className={styles.nameRow}>
          <label>First partner<input value={partner1} maxLength={40} placeholder="Emma" onChange={(e) => { interact(); setPartner1(clean(e.target.value)); }} /></label>
          <label>Second partner<input value={partner2} maxLength={40} placeholder="Lucas" onChange={(e) => { interact(); setPartner2(clean(e.target.value)); }} /></label>
        </div>
        <label className={styles.dateField}>Wedding date <span>(optional)</span><input type="date" value={date} onChange={(e) => { interact(); setDate(e.target.value); }} /></label>
        <fieldset className={styles.moods}>
          <legend>Mood</legend>
          {TOOL_STYLES.map((item) => (
            <button type="button" key={item.id} aria-pressed={item.id === styleId} className={item.id === styleId ? styles.moodActive : ""} onClick={() => { interact(); setStyleId(item.id); }}>
              <span className={styles.moodSwatch}><Image src={item.envelope} alt="" width={44} height={44} /></span>
              {item.mood}
            </button>
          ))}
        </fieldset>
        <Link className={styles.toolButton} href={checkoutHref(style.id, partner1, partner2)} onClick={() => trackBlog("blog_tool_click", { article, variant: "invitation", template: style.id })}>
          Create my invitation
        </Link>
        <p className={styles.toolNote}>Free to preview. Your names carry over to the editor; nothing is saved from this page.</p>
      </div>
      <figure className={styles.toolPreview} aria-live="polite">
        <div className={styles.phone}>
          <Image key={style.hero} src={style.hero} alt={`${style.name} design opening screen`} fill sizes="240px" className={styles.phoneImage} />
          <div className={styles.phoneOverlay}>
            <strong>{partner1.trim() || "Emma"}</strong>
            <span className={styles.amp}>&amp;</span>
            <strong>{partner2.trim() || "Lucas"}</strong>
            <small>SAVE THE DATE</small>
            <em>{shownDate}</em>
          </div>
        </div>
        <figcaption>{style.name} · {style.mood.toLowerCase()} design. Guests first open an animated envelope, then land on this screen.</figcaption>
      </figure>
    </section>
  );
}

function RsvpVariant({ article, title, subtitle }) {
  const [attend, setAttend] = useState("");
  const [company, setCompany] = useState("");
  const [diet, setDiet] = useState("");
  const [sent, setSent] = useState(false);
  const { ref, interact } = useToolTracking(article, "rsvp");
  const summary = useMemo(() => {
    if (!attend) return "Waiting for an answer";
    if (attend === "no") return "Declined · the couple sees it instantly";
    const party = { alone: "1 guest", guest: "2 guests (with a guest)", family: "Family (names listed)" }[company] || "Party size not chosen yet";
    return `Attending · ${party}${diet ? ` · Dietary note: ${diet}` : ""}`;
  }, [attend, company, diet]);

  return (
    <section id="folde-tool" ref={ref} className={styles.tool} aria-labelledby="folde-tool-title">
      <div className={styles.toolForm}>
        <p className={styles.toolLabel}>DEMO · WHAT YOUR GUESTS FILL IN</p>
        <h2 id="folde-tool-title" className={styles.toolTitle}>{title || "Try a digital RSVP in 20 seconds"}</h2>
        <p className={styles.toolSubtitle}>{subtitle || "These are the same questions a FOLDÈ invitation asks. This demo sends nothing."}</p>
        <form className={styles.rsvpForm} onSubmit={(e) => { e.preventDefault(); interact(); setSent(true); }}>
          <label>Will you attend?
            <select value={attend} onChange={(e) => { interact(); setAttend(e.target.value); setSent(false); }} required>
              <option value="">Please select</option>
              <option value="yes">Yes, with pleasure!</option>
              <option value="no">Regretfully decline</option>
            </select>
          </label>
          {attend === "yes" && (
            <label>Will you be accompanied?
              <select value={company} onChange={(e) => { interact(); setCompany(e.target.value); setSent(false); }} required>
                <option value="">Please select</option>
                <option value="alone">I&apos;m coming alone</option>
                <option value="guest">With a guest</option>
                <option value="family">With family</option>
              </select>
            </label>
          )}
          {attend === "yes" && (
            <label>Allergies and dietary needs
              <input value={diet} maxLength={60} placeholder="e.g. vegetarian" onChange={(e) => { interact(); setDiet(clean(e.target.value)); setSent(false); }} />
            </label>
          )}
          <button type="submit" className={styles.toolGhostButton}>Submit demo RSVP</button>
        </form>
      </div>
      <div className={styles.dashboardCard} aria-live="polite">
        <p className={styles.toolLabel}>WHAT THE COUPLE SEES</p>
        <p className={styles.dashboardLine}><span className={sent ? styles.dotLive : styles.dot} />{sent ? summary : "No demo response yet"}</p>
        <p className={styles.toolNote}>In a real invitation, each answer lands in the couple&apos;s private dashboard with the guest&apos;s name and email.</p>
        <Link className={styles.toolButton} href="/checkout" onClick={() => trackBlog("blog_tool_click", { article, variant: "rsvp" })}>Create my invitation with RSVP</Link>
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
};

function WordingVariant({ article, event = "wedding", title, subtitle }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [date, setDate] = useState("");
  const [tone, setTone] = useState("formal");
  const [copied, setCopied] = useState(false);
  const { ref, interact } = useToolTracking(article, `wording-${event}`);
  const fallbackDate = event === "rehearsal" ? "Friday, the eleventh of September" : "Saturday, the twelfth of September";
  const text = (WORDING[event] || WORDING.wedding)[tone](a.trim() || "Emma", b.trim() || "Lucas", formatDate(date) || fallbackDate);
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
          <label>First partner<input value={a} maxLength={40} placeholder="Emma" onChange={(e) => { interact(); setA(clean(e.target.value)); }} /></label>
          <label>Second partner<input value={b} maxLength={40} placeholder="Lucas" onChange={(e) => { interact(); setB(clean(e.target.value)); }} /></label>
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
          <Link className={styles.toolButton} href={checkoutHref("rosas", a, b)} onClick={() => trackBlog("blog_tool_click", { article, variant: `wording-${event}` })}>Use it in my invitation</Link>
        </div>
      </div>
    </section>
  );
}

export default function InvitationPreviewTool({ variant = "invitation", article, event, title, subtitle }) {
  if (variant === "rsvp") return <RsvpVariant article={article} title={title} subtitle={subtitle} />;
  if (variant === "wording") return <WordingVariant article={article} event={event} title={title} subtitle={subtitle} />;
  return <InvitationVariant article={article} title={title} subtitle={subtitle} />;
}
