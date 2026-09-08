"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";
import styles from "@/app/blog/blog.module.css";

export default function ArticlePreviewAside() {
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
          />
        </div>
        <p>PLANIFICA TU INVITACIÓN</p>
        <h2>Un enlace elegante para cada detalle de tus invitados.</h2>
        <Link className={styles.primaryButton} href="/">Crea tu invitación ahora <span className={styles.ctaPointer} aria-hidden="true">👇</span></Link>
        <Link className={styles.asideLink} href="/collections">Explorar plantillas →</Link>
      </aside>
    </div>
  );
}
