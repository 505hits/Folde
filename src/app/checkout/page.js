import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | FOLDÈ Design",
  description: "Complete your order for a premium digital wedding invitation.",
  robots: { index: false, follow: false },
};

export default function Checkout({ locale = "en" }) {
  return (
    <Suspense fallback={<div>{locale === "fr" ? "Chargement…" : locale === "es" ? "Cargando…" : "Loading..."}</div>}>
      <CheckoutClient locale={locale} />
    </Suspense>
  );
}
