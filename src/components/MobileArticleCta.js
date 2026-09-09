"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/blog/blog.module.css";

export default function MobileArticleCta({ locale = "en" }) {
  const isSpanish = locale === "es";
  const isFrench = locale === "fr";
  const label = isSpanish ? "Crear la invitación ahora" : isFrench ? "Créer mon invitation" : "Create your invitation card now";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 260);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <div className={`${styles.mobileArticleCta} ${visible ? styles.mobileArticleCtaVisible : ""}`}>
      <Link href={locale === 'en' ? "/" : `/${locale}`} aria-label={label}>
        {label} <span aria-hidden="true">👇</span>
      </Link>
    </div>
  );
}
