import { notFound } from "next/navigation";
import { database } from "@/lib/server-database";
import CoupleClient from "./CoupleClient";

// Any unknown top-level path lands here, so it must return a real 404 instead
// of a 200 "invitation not found" page (soft 404).
export const metadata = { robots: { index: false, follow: false } };

// Generated slugs can reach ~140 characters (two names + a 16-character suffix).
const SLUG = /^[a-z0-9][a-z0-9-]{1,200}$/i;

async function orderExists(slug) {
  if (!SLUG.test(slug)) return false;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return true; // local dev without a database: keep old behaviour
  try {
    // Server-side lookup: the orders table is not readable with the public key.
    const { data, error } = await database().from("orders").select("slug").eq("slug", slug).limit(1);
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
