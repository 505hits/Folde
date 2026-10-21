import Link from "next/link";
import { headers } from "next/headers";
import { pagePath } from "@/lib/routes.mjs";

export const metadata = {
  title: "Page introuvable · Page not found | FOLDÈ",
  robots: { index: false, follow: true },
};

const copy = {
  fr: { title: "Cette page n’existe pas (ou plus)", text: "Le lien est peut-être incomplet, ou la page a changé d’adresse.", home: "Retour à l’accueil", extra: "Voir le faire-part numérique", extraKey: "landing", blog: "Lire le blog" },
  es: { title: "Esta página no existe (o ya no)", text: "Puede que el enlace esté incompleto o que la página haya cambiado de dirección.", home: "Volver al inicio", extra: "Ver las invitaciones digitales", extraKey: "landing", blog: "Leer el blog" },
  en: { title: "This page doesn’t exist", text: "The link may be incomplete, or the page has moved.", home: "Back to the homepage", extra: "Browse templates", extraKey: "collections", blog: "Read the journal" },
};

export default async function NotFound() {
  const requested = (await headers()).get("x-folde-locale");
  const locale = requested === "fr" || requested === "es" ? requested : "en";
  const t = copy[locale];
  return (
    <section style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "6rem 1.5rem", textAlign: "center" }}>
      <div style={{ maxWidth: 560 }}>
        <p style={{ letterSpacing: ".14em", fontSize: ".75rem", fontWeight: 700, color: "#a97934" }}>404</p>
        <h1 className="heading-lg" style={{ margin: ".6rem 0 1rem" }}>{t.title}</h1>
        <p style={{ color: "rgba(45,35,27,.72)", marginBottom: "2rem" }}>{t.text}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn-primary" href={pagePath(locale, "home")}>{t.home}</Link>
          <Link className="btn-secondary" href={pagePath(locale, t.extraKey)}>{t.extra}</Link>
          <Link className="btn-secondary" href={pagePath(locale, "blog")}>{t.blog}</Link>
        </div>
      </div>
    </section>
  );
}
