// Blog conversion events. The site loads Google Analytics 4 (gtag.js) in the
// root layout: events are sent with gtag('event', …) so GA4 records them, and are
// also dispatched as a DOM event so any other integration can listen.
// Never pass names, dates or other details typed by readers.
export function trackBlog(event, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
    window.dispatchEvent(new CustomEvent("folde:track", { detail: { event, ...params } }));
  } catch {
    // Measurement must never break reading.
  }
}
