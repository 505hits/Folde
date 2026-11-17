// Blog conversion events. No analytics tool is wired yet: events go to
// window.dataLayer when a consent-aware tag manager provides it, and are also
// dispatched as a DOM event so any future integration can listen.
// Never pass names, dates or other details typed by readers.
export function trackBlog(event, params = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...params };
  try {
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("folde:track", { detail: payload }));
  } catch {
    // Measurement must never break reading.
  }
}
