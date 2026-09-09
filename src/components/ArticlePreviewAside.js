"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";
import styles from "@/app/blog/blog.module.css";

export default function ArticlePreviewAside({ locale = "en" }) {
  const isSpanish = locale === "es";
  const slotRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let frame;
    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!slotRef.current || window.innerWidth <= 900) {
          setIsPinned(false);
          return;
        }
        setIsPinned(slotRef.current.getBoundingClientRect().top <= 126);
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <div className={styles.articleAsideSlot} ref={slotRef}>
      <aside className={`${styles.articleAside} ${isPinned ? styles.articleAsidePinned : ""}`}>
        <div className={styles.asidePhone}>
          <div className={styles.asideNotch} />
          <TemplateHeroPreview
            partner1="Anna"
            partner2="Tom"
            date="SEP 05, 2026"
            videoSrc="https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4"
            envelopeSrc="https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4"
            showEnvelope
            preloadEnvelopeFrame
            language={isSpanish ? "es" : "en"}
          />
        </div>
        <p>{isSpanish ? "CREAD VUESTRA INVITACIÓN" : "PLAN YOUR INVITATION"}</p>
        <h2>{isSpanish ? "Un enlace elegante para todos los detalles." : "One elegant link for every guest detail."}</h2>
        <Link className={styles.primaryButton} href={isSpanish ? "/es" : "/"}>{isSpanish ? "Crear la invitación ahora" : "Create your invitation card now"} <span className={styles.ctaPointer} aria-hidden="true">👇</span></Link>
        <Link className={styles.asideLink} href={isSpanish ? "/es/collections" : "/collections"}>{isSpanish ? "Explorar las plantillas →" : "Explore the templates →"}</Link>
      </aside>
    </div>
  );
}
