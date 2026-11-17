"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./affiliates.module.css";
import { supabase } from "@/lib/supabase";
import { useDatabase } from "@/context/DatabaseContext";
import { affiliateDashboardCopy } from "@/lib/affiliate-copy";
import { formatMoney, normalizeCode, referralState, suggestCode, summarizeReferrals } from "@/lib/affiliate.mjs";
import { pagePath, localeRoot } from "@/lib/routes.mjs";

const SITE = "https://folde-wedding.com";

async function api(method = "GET", body) {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch("/api/affiliate", {
    method,
    headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || "Request failed"), { status: response.status });
  return data;
}

export default function AffiliateDashboard({ locale = "en" }) {
  const t = affiliateDashboardCopy[locale] || affiliateDashboardCopy.en;
  const { loginWithGoogle, loginWithMagicLink, logout } = useDatabase();
  const [user, setUser] = useState(undefined);
  const [state, setState] = useState({ loading: true, affiliate: null, referrals: [] });
  const [error, setError] = useState("");
  const returnPath = `${localeRoot(locale)}/affiliate-dashboard`;

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setUser(data.session?.user || null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => { active = false; subscription?.unsubscribe(); };
  }, []);

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await api();
      setState({ loading: false, affiliate: data.affiliate, referrals: data.referrals || [] });
    } catch (err) {
      setError(err.message || t.error);
      setState((current) => ({ ...current, loading: false }));
    }
  }, [t.error]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [user, load]);

  return (
    <div className={styles.dashPage}>
      <div className={styles.dashInner}>
        <div className={styles.dashTop}>
          <div><span className="label">{t.label}</span></div>
          <Link href={pagePath(locale, "affiliates")} className={styles.textLink}>← {t.back}</Link>
        </div>
        {user === undefined || (user && state.loading) ? <p className={styles.muted}>{t.loading}</p>
          : !user ? <SignIn t={t} returnPath={returnPath} loginWithGoogle={loginWithGoogle} loginWithMagicLink={loginWithMagicLink} />
          : !state.affiliate ? <JoinForm t={t} user={user} locale={locale} serverError={error} onJoined={(data) => setState({ loading: false, affiliate: data.affiliate, referrals: data.referrals || [] })} />
          : <Overview t={t} locale={locale} user={user} affiliate={state.affiliate} referrals={state.referrals} onSaved={(affiliate) => setState((current) => ({ ...current, affiliate }))} onSignOut={async () => { await logout(); setUser(null); setState({ loading: true, affiliate: null, referrals: [] }); }} />}
      </div>
    </div>
  );
}

function SignIn({ t, returnPath, loginWithGoogle, loginWithMagicLink }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const sendLink = async (event) => {
    event.preventDefault();
    setBusy(true); setStatus("");
    const result = await loginWithMagicLink(email, returnPath);
    setBusy(false);
    setStatus(result.success ? t.linkSent : result.error || t.error);
  };
  return (
    <section className={styles.card}>
      <h1 className="heading-md">{t.signInTitle}</h1>
      <p className={styles.muted}>{t.signInText}</p>
      <button type="button" className={styles.googleButton} onClick={() => loginWithGoogle(returnPath)}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        {t.google}
      </button>
      <form onSubmit={sendLink} className={styles.inlineForm}>
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.emailPlaceholder} autoComplete="email" className={styles.input} />
        <button type="submit" disabled={busy} className="btn-primary">{t.sendLink}</button>
      </form>
      {status && <p className={styles.notice} role="status">{status}</p>}
    </section>
  );
}

function JoinForm({ t, user, locale, serverError, onJoined }) {
  const initialName = user.user_metadata?.full_name || user.user_metadata?.name || "";
  const [form, setForm] = useState({ name: initialName, code: suggestCode(initialName || user.email), channel: "", payoutMethod: "paypal", payoutEmail: user.email || "", acceptTerms: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  const code = normalizeCode(form.code);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError("");
    try { onJoined(await api("POST", { ...form, locale })); }
    catch (err) { setError(err.message || t.error); }
    finally { setBusy(false); }
  };
  return (
    <section className={styles.card}>
      <h1 className="heading-md">{t.joinTitle}</h1>
      <p className={styles.muted}>{t.joinText}</p>
      <form onSubmit={submit} className={styles.form}>
        <label>{t.name}<input className={styles.input} required maxLength={80} value={form.name} onChange={set("name")} /></label>
        <label>{t.code}
          <input className={styles.input} required minLength={3} maxLength={24} pattern="[a-zA-Z0-9][a-zA-Z0-9\-]{1,22}[a-zA-Z0-9]" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
          <small className={styles.muted}>{t.codeHint} <code>{SITE.replace("https://", "")}/?ref={code || "…"}</code></small>
        </label>
        <label>{t.channel}<input className={styles.input} maxLength={200} value={form.channel} onChange={set("channel")} placeholder={t.channelPlaceholder} /></label>
        <fieldset className={styles.choice}>
          <legend>{t.payoutMethod}</legend>
          {["paypal", "wise"].map((method) => (
            <label key={method} className={form.payoutMethod === method ? styles.choiceActive : undefined}>
              <input type="radio" name="payoutMethod" value={method} checked={form.payoutMethod === method} onChange={set("payoutMethod")} />
              {method === "paypal" ? "PayPal" : "Wise"}
            </label>
          ))}
        </fieldset>
        <label>{t.payoutEmail}<input className={styles.input} type="email" required maxLength={200} value={form.payoutEmail} onChange={set("payoutEmail")} /></label>
        <label className={styles.checkbox}><input type="checkbox" checked={form.acceptTerms} onChange={set("acceptTerms")} required /> <span>{t.terms}</span></label>
        {(error || serverError) && <p className={styles.errorBox} role="alert">{error || serverError}</p>}
        <button type="submit" className="btn-primary" disabled={busy || !code}>{busy ? t.loading : t.create}</button>
      </form>
    </section>
  );
}

function Overview({ t, locale, user, affiliate, referrals, onSaved, onSignOut }) {
  const [copied, setCopied] = useState(false);
  const link = `${SITE}/?ref=${affiliate.code}`;
  const totals = useMemo(() => summarizeReferrals(referrals), [referrals]);
  const money = (cents) => formatMoney(cents, locale);
  const tag = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
  const conversion = affiliate.clicks ? new Intl.NumberFormat(tag, { style: "percent", maximumFractionDigits: 1 }).format(totals.sales / affiliate.clicks) : "—";
  const dateFormat = new Intl.DateTimeFormat(tag, { dateStyle: "medium" });
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <>
      {affiliate.status === "paused" && <p className={styles.errorBox}>{t.paused}</p>}
      <section className={`${styles.card} ${styles.linkCard}`}>
        <span className={styles.cardLabel}>{t.yourLink}</span>
        <div className={styles.linkRow}>
          <code className={styles.linkValue}>{link}</code>
          <button type="button" className="btn-primary" onClick={copy}>{copied ? t.copied : t.copy}</button>
        </div>
        <p className={styles.muted}>{t.signedInAs} {user.email} · <button type="button" className={styles.linkButton} onClick={onSignOut}>{t.signOut}</button></p>
      </section>

      <section className={styles.kpis}>
        {[[t.clicks, affiliate.clicks ?? 0], [t.sales, totals.sales], [t.conversion, conversion], [t.earned, money(totals.earnedCents)], [t.pending, money(totals.pendingCents)], [t.payable, money(totals.payableCents)], [t.paid, money(totals.paidCents)]].map(([label, value]) => (
          <div key={label} className={styles.kpi}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </section>

      <section className={styles.card}>
        <h2 className="heading-sm">{t.history}</h2>
        {!referrals.length ? <p className={styles.muted}>{t.empty}</p> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>{t.date}</th><th>{t.plan}</th><th>{t.sale}</th><th>{t.commission}</th><th>{t.status}</th></tr></thead>
              <tbody>
                {referrals.map((row) => {
                  const status = referralState(row);
                  return (
                    <tr key={row.id}>
                      <td>{dateFormat.format(new Date(row.created_at))}</td>
                      <td>{/custom|expert/i.test(row.plan || "") ? "Expert" : "Standard"}</td>
                      <td>{formatMoney(row.amount_cents, locale, row.currency)}</td>
                      <td><strong>{formatMoney(row.commission_cents, locale, row.currency)}</strong></td>
                      <td><span className={`${styles.badge} ${styles[`badge_${status}`]}`}>{t.states[status]}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p><Link href={`${pagePath(locale, "affiliates")}#examples`} className={styles.textLink}>{t.kit} →</Link></p>
      </section>

      <PayoutSettings t={t} affiliate={affiliate} onSaved={onSaved} />
    </>
  );
}

function PayoutSettings({ t, affiliate, onSaved }) {
  const [form, setForm] = useState({ name: affiliate.name, channel: affiliate.channel || "", payoutMethod: affiliate.payout_method, payoutEmail: affiliate.payout_email });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    setBusy(true); setStatus("");
    try { const data = await api("PATCH", form); onSaved(data.affiliate); setStatus(t.saved); }
    catch (err) { setStatus(err.message || t.error); }
    finally { setBusy(false); }
  };
  return (
    <section className={styles.card}>
      <h2 className="heading-sm">{t.payoutTitle}</h2>
      <form onSubmit={save} className={`${styles.form} ${styles.formGrid}`}>
        <label>{t.name}<input className={styles.input} required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>{t.channel}<input className={styles.input} maxLength={200} value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })} /></label>
        <label>{t.payoutMethod}
          <select className={styles.input} value={form.payoutMethod} onChange={(event) => setForm({ ...form, payoutMethod: event.target.value })}>
            <option value="paypal">PayPal</option><option value="wise">Wise</option>
          </select>
        </label>
        <label>{t.payoutEmail}<input className={styles.input} type="email" required maxLength={200} value={form.payoutEmail} onChange={(event) => setForm({ ...form, payoutEmail: event.target.value })} /></label>
        <div className={styles.formActions}>
          <button type="submit" className="btn-secondary" disabled={busy}>{busy ? t.loading : t.save}</button>
          {status && <span className={styles.muted} role="status">{status}</span>}
        </div>
      </form>
    </section>
  );
}
