// Google Analytics 4 events for the whole conversion path. gtag.js is loaded in
// the root layout; events use GA4's recommended names (login, sign_up,
// select_item, view_item_list, begin_checkout, purchase, generate_lead, share)
// so they fill the standard reports, plus a few custom ones (funnel_step,
// publish_invitation, review_rating).
// Never pass names, emails, dates or anything else typed by the couple.

export const CURRENCY = "USD";
export const PLAN_ITEMS = {
  standard: { item_id: "standard", item_name: "Standard", price: 29.9 },
  expert: { item_id: "expert", item_name: "Expert", price: 149 },
};

// Stripe plan ids ("essential", "Custom"…) and display names map to one item.
export function planItem(plan) {
  const key = String(plan || "").toLowerCase();
  return key === "custom" || key === "expert" ? PLAN_ITEMS.expert : PLAN_ITEMS.standard;
}

export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
    window.dispatchEvent(new CustomEvent("folde:track", { detail: { event, ...params } }));
  } catch {
    // Measurement must never break the site.
  }
}

// Sends an event once per key on this browser (purchase, sign-up…), so a
// reload or a second tab does not count it twice.
export function trackOnce(key, event, params = {}) {
  if (typeof window === "undefined") return;
  try {
    const storageKey = `folde-ga-${key}`;
    if (window.localStorage.getItem(storageKey)) return;
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Without storage, still send it: GA4 also dedupes purchases by transaction_id.
  }
  track(event, params);
}

// Called on Supabase's SIGNED_IN. A fresh account (created at its first
// sign-in) is a sign_up; otherwise a login. Keyed on the sign-in time so the
// same session restored on another page is not counted again.
export function trackAuth(user) {
  if (!user?.id) return;
  const signedInAt = user.last_sign_in_at || "";
  const method = user.app_metadata?.provider === "google" ? "google" : "email";
  const created = Date.parse(user.created_at || "");
  const signedIn = Date.parse(signedInAt);
  const isNew = Number.isFinite(created) && Number.isFinite(signedIn) && Math.abs(signedIn - created) < 120000;
  trackOnce(`auth-${user.id}-${signedInAt}`, isNew ? "sign_up" : "login", { method });
}
