"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackBlog } from "@/lib/blog-track";
import styles from "./article-tools.module.css";

const DISMISS_KEY = "folde-sticky-cta-closed";

// Shows once the in-article tool has scrolled away, hides while the final CTA
// is on screen, and stays closed for the session once dismissed.
export default function StickyArticleCta({ article, href = "/checkout", text = "Imagine your wedding invitation", button = "Create my invitation" }) {
  const [toolGone, setToolGone] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  // Reading sessionStorage lazily is hydration-safe: the bar is hidden on the
  // first render anyway (toolGone starts false).
  const [closed, setClosed] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
  });
  const reported = useRef(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const tool = document.getElementById("folde-tool");
    const end = document.getElementById("folde-final-cta");
    const observers = [];
    if (tool) {
      const o = new IntersectionObserver(([entry]) => setToolGone(!entry.isIntersecting && entry.boundingClientRect.top < 0));
      o.observe(tool); observers.push(o);
    } else {
      const frame = requestAnimationFrame(() => setToolGone(true));
      observers.push({ disconnect: () => cancelAnimationFrame(frame) });
    }
    if (end) {
      const o = new IntersectionObserver(([entry]) => setFinalVisible(entry.isIntersecting), { rootMargin: "0px 0px 80px 0px" });
      o.observe(end); observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = toolGone && !finalVisible && !closed;

  useEffect(() => {
    if (visible && !reported.current) { reported.current = true; trackBlog("blog_sticky_view", { article }); }
  }, [visible, article]);

  const close = () => {
    setClosed(true);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* private mode */ }
    trackBlog("blog_sticky_close", { article });
  };

  return (
    <div className={`${styles.sticky} ${visible ? styles.stickyVisible : ""}`} aria-hidden={!visible} inert={!visible ? true : undefined}>
      <div className={styles.stickyInner}>
        <span className={styles.stickyThumb}><Image src="/images/envelope-posters/bordeaux.webp" alt="" width={40} height={52} /></span>
        <p>{text}</p>
        <Link href={href} className={styles.stickyButton} onClick={() => trackBlog("blog_sticky_click", { article })}>{button}</Link>
        <button type="button" className={styles.stickyClose} onClick={close} aria-label="Close this suggestion">×</button>
      </div>
    </div>
  );
}
