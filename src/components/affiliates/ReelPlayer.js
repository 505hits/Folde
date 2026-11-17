"use client";

import { useEffect, useRef } from "react";
import styles from "./affiliates.module.css";

// Plays a muted reel only while it is on screen; nothing is downloaded until then.
export default function ReelPlayer({ reel, decorative = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={styles.video}
      src={reel.src}
      poster={reel.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : reel.hook}
    />
  );
}
