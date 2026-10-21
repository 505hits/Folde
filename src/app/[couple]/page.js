import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CoupleClient from "./CoupleClient";

// Any unknown top-level path lands here, so it must return a real 404 instead
// of a 200 "invitation not found" page (soft 404).
export const metadata = { robots: { index: false, follow: false } };

const SLUG = /^[a-z0-9][a-z0-9-]{1,80}$/i;

async function orderExists(slug) {
  if (!SLUG.test(slug)) return false;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return true; // local dev without a database: keep old behaviour
  try {
    const { data, error } = await supabase.from("orders").select("slug").eq("slug", slug).limit(1);
    if (error) return true; // fail open: never hide a real couple page because of a transient error
    return Boolean(data?.length);
  } catch {
    return true;
  }
}

export default async function CouplePage({ params }) {
  const { couple } = await params;
  if (!(await orderExists(couple))) notFound();
  return <CoupleClient couple={couple} />;
}
