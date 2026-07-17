import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | FOLDÈ Design",
  description: "Complete your order for a premium digital wedding invitation.",
};

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
