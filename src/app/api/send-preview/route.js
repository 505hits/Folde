import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const getFromAddress = () => {
  const configured = String(process.env.RESEND_FROM_EMAIL || "").trim();
  const address = configured.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  return address ? `FOLDÈ Wedding <${address}>` : "FOLDÈ Wedding <onboarding@resend.dev>";
};

export async function POST(request) {
  try {
    const { email, locale = "en", name = "", partnerName = "", resumeToken = "", draft = {} } = await request.json();
    if (!/^\S+@\S+\.\S+$/.test(email || "") || !resumeToken) {
      return NextResponse.json({ success: false, error: "Invalid preview request." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return NextResponse.json({ success: false, saved: false, error: "Preview storage is not configured." }, { status: 503 });
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error: saveError } = await supabase.from("preview_drafts").upsert({
      email: String(email).trim().toLowerCase(), name, partner_name: partnerName, locale,
      selected_theme: draft.selectedTheme || null,
      selected_envelope: draft.selectedEnvelope || null,
      selected_hero: draft.selectedHeroVideo || null,
      wedding_date: draft.previewDate || null,
      resume_token: resumeToken,
      draft,
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });
    if (saveError) return NextResponse.json({ success: false, saved: false, error: saveError.message }, { status: 500 });

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: true, saved: true, delivered: false });
    }

    const origin = request.headers.get("origin") || "https://www.folde-wedding.com";
    const localePrefix = ["fr", "es"].includes(locale) ? `/${locale}` : "";
    const previewUrl = `${origin}${localePrefix}/checkout?resume=${encodeURIComponent(resumeToken)}`;
    const safeNames = `${escapeHtml(name)} &amp; ${escapeHtml(partnerName)}`;
    const copy = locale === "fr"
      ? { subject: "Votre aperçu FOLDÈ est prêt", title: "Votre invitation prend vie", text: "Vos choix ont bien été enregistrés. Reprenez votre aperçu quand vous le souhaitez.", button: "VOIR MON APERÇU" }
      : locale === "es"
        ? { subject: "Vuestra vista previa FOLDÈ está lista", title: "Vuestra invitación cobra vida", text: "Hemos guardado vuestras opciones. Podéis retomar la vista previa cuando queráis.", button: "VER MI VISTA PREVIA" }
        : { subject: "Your FOLDÈ preview is ready", title: "Your invitation is taking shape", text: "Your choices are saved. Return to your preview whenever you are ready.", button: "VIEW MY PREVIEW" };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [email],
        subject: copy.subject,
        html: `<!doctype html><html><body style="margin:0;background:#f6f0e8;color:#3d2b1f;font-family:Arial,sans-serif"><div style="padding:32px 16px"><div style="max-width:560px;margin:auto;padding:42px 30px;border:1px solid #e2d5c6;border-radius:24px;background:#fffdf9;text-align:center"><div style="font-family:Georgia,serif;font-size:24px;letter-spacing:5px">FOLDÈ</div><p style="margin:28px 0 8px;color:#a1744d;font-size:12px;letter-spacing:2px">${safeNames}</p><h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:34px;font-weight:400">${copy.title}</h1><p style="margin:0 auto 28px;max-width:430px;color:#75665b;line-height:1.6">${copy.text}</p><a href="${previewUrl}" style="display:inline-block;padding:16px 26px;border-radius:999px;background:#4b2f20;color:#fff;text-decoration:none;font-weight:700">${copy.button} →</a><p style="margin:28px 0 0;color:#9b8d81;font-size:12px">FOLDÈ Wedding · Premium digital invitations</p></div></div></body></html>`,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json({ success: true, saved: true, delivered: false, warning: error.message || "Email delivery failed." });
    }
    return NextResponse.json({ success: true, saved: true, delivered: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Unable to send preview." }, { status: 500 });
  }
}
