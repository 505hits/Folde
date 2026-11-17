"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { REF_COOKIE, REF_MAX_AGE_DAYS, normalizeCode, readRefCookie } from "@/lib/affiliate.mjs";

// Turns ?ref=CODE into a first-party cookie (last click wins, 60 days), counts
// the visit once, then removes the parameter so shared URLs stay clean.
export default function AffiliateRefTracker() {
  const pathname = usePathname();
  useEffect(() => {
    let url;
    try { url = new URL(window.location.href); } catch { return; }
    const raw = url.searchParams.get("ref");
    if (raw == null) return;
    const code = normalizeCode(raw);
    if (code && readRefCookie(document.cookie) !== code) {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${REF_COOKIE}=${code}; Max-Age=${REF_MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
      fetch("/api/affiliate/click", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }), keepalive: true }).catch(() => {});
    }
    url.searchParams.delete("ref");
    window.history.replaceState(null, "",`${url.pathname}${url.search}${url.hash}`);
  }, [pathname]);
  return null;
}
