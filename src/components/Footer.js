"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/es") ? "es" : pathname?.startsWith("/fr") ? "fr" : "en";
  const link = (path) => locale === "en" ? path : (path === "/" ? `/${locale}` : `/${locale}${path}`);
  const translations = { es: {
    home: "Inicio",
    collections: "Colecciones",
    process: "Nuestro proceso",
    packages: "Planes",
    about: "Sobre FOLDÈ",
    dashboard: "Panel de boda",
    legal: "Aviso legal",
    privacy: "Política de privacidad",
    terms: "Términos y condiciones",
    rights: "Todos los derechos reservados.",
  }, fr: {
    home: "Accueil", collections: "Collections", process: "Notre méthode", packages: "Formules", about: "À propos de FOLDÈ",
    dashboard: "Tableau de bord", legal: "Mentions légales", privacy: "Politique de confidentialité", terms: "Conditions générales", rights: "Tous droits réservés.",
  }, en: {
    home: "Home",
    collections: "Collections",
    process: "Our Process",
    packages: "Packages",
    about: "About",
    dashboard: "Wedding Dashboard",
    legal: "Legal Notice",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    rights: "All rights reserved.",
  }};
  const t = translations[locale];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="FOLDÈ Design" style={{ height: '62px', margin: '0 auto 1.5rem', display: 'block', objectFit: 'contain' }} />
        </div>
        <div className="footer-links">
          <Link href={link("/")}>{t.home}</Link>
          <Link href={link("/collections")}>{t.collections}</Link>
          <Link href={link("/approach")}>{t.process}</Link>
          <Link href={link("/packages")}>{t.packages}</Link>
          <Link href={link("/story")}>{t.about}</Link>
          <Link href={link("/dashboard")}>{t.dashboard}</Link>
        </div>
        <div className="footer-links" style={{ marginTop: '1rem' }}>
          <Link href="mailto:folde.wedding@gmail.com">folde.wedding@gmail.com</Link>
        </div>
        <div className="footer-links" style={{ marginTop: '0.5rem' }}>
          <Link href="/legal">{t.legal}</Link>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/terms">{t.terms}</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} FOLDÈ Design. {t.rights}
        </p>
      </div>
    </footer>
  );
}
