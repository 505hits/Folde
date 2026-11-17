"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/affiliate.mjs";

async function request(method = "GET", body) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch("/api/admin/affiliates", { method, headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || "Something went wrong."), { status: res.status });
  return data;
}

// Monthly payout list. The administrator sends the money in PayPal or Wise,
// then clicks "Mark as paid" here to record it. This page never moves money.
export default function AffiliatePayouts() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(0);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setError("");
    try { setData(await request()); } catch (err) { setError(err.message); setStatus(err.status || 0); }
  }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);

  const markPaid = async (affiliate) => {
    const amount = formatMoney(affiliate.payableCents);
    if (!window.confirm(`Have you already sent ${amount} to ${affiliate.payout_email} by ${affiliate.payout_method === "wise" ? "Wise" : "PayPal"}? This only records the payout.`)) return;
    setBusy(affiliate.id);
    try { await request("POST", { affiliateId: affiliate.id, action: "mark-paid" }); await load(); } catch (err) { setError(err.message); } finally { setBusy(""); }
  };
  const toggle = async (affiliate) => {
    setBusy(affiliate.id);
    try { await request("POST", { affiliateId: affiliate.id, action: "status", status: affiliate.status === "active" ? "paused" : "active" }); await load(); } catch (err) { setError(err.message); } finally { setBusy(""); }
  };

  const affiliates = data?.affiliates || [];
  const owed = affiliates.reduce((sum, item) => sum + item.payableCents, 0);
  return <main style={{ minHeight: "100vh", background: "#f7f4ef", color: "#2d211b", fontFamily: "var(--font-body)", padding: "2rem clamp(1rem, 4vw, 4rem)" }}>
    <header style={{ maxWidth: "1400px", margin: "0 auto 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
      <div><div style={{ letterSpacing: ".16em", color: "#9a765e", fontWeight: 800, fontSize: ".7rem" }}>FOLDÈ STUDIO</div><h1 style={{ fontFamily: "var(--font-heading)", margin: ".35rem 0 0", fontSize: "2rem" }}>Affiliate payouts</h1></div>
      <Link href="/admin" style={buttonSecondary}>← Orders</Link>
    </header>
    {error && <div style={{ maxWidth: "1400px", margin: "0 auto 1rem", padding: "1rem", borderRadius: "12px", background: "#fff2f2", color: "#b42318" }}>{error}{[401, 403].includes(status) && <> <Link href="/admin">Sign in to the studio</Link>, then come back.</>}</div>}
    {data && <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <section style={{ ...panel, display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <Stat label="Affiliates" value={affiliates.length} />
        <Stat label="Payable now" value={formatMoney(owed)} />
        <Stat label="Payable = pending sales before" value={new Date(data.cutoff).toLocaleDateString()} />
      </section>
      <section style={panel}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".86rem", minWidth: "900px" }}>
            <thead><tr>{["Affiliate", "Code", "Channel", "Clicks", "Sales", "Earned", "On hold", "Payable", "Pay to", ""].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{affiliates.map(item => <tr key={item.id} style={{ opacity: item.status === "paused" ? .55 : 1 }}>
              <td style={td}><strong>{item.name}</strong><div style={{ color: "#8a7b70" }}>{item.email}</div></td>
              <td style={td}>{item.code}</td>
              <td style={{ ...td, maxWidth: "180px", wordBreak: "break-word" }}>{item.channel || "—"}</td>
              <td style={td}>{item.clicks}</td>
              <td style={td}>{item.sales_count}</td>
              <td style={td}>{formatMoney(item.total_commission_cents)}</td>
              <td style={td}>{formatMoney(item.holdCents)}</td>
              <td style={td}><strong>{formatMoney(item.payableCents)}</strong></td>
              <td style={td}>{item.payout_method === "wise" ? "Wise" : "PayPal"}<div style={{ color: "#8a7b70" }}>{item.payout_email}</div></td>
              <td style={{ ...td, whiteSpace: "nowrap" }}>
                <button disabled={!item.payableCents || busy === item.id} onClick={() => markPaid(item)} style={{ ...buttonPrimary, opacity: item.payableCents ? 1 : .4 }}>Mark as paid</button>{" "}
                <button disabled={busy === item.id} onClick={() => toggle(item)} style={buttonSecondary}>{item.status === "active" ? "Pause" : "Resume"}</button>
              </td>
            </tr>)}</tbody>
          </table>
          {!affiliates.length && <p style={{ color: "#766b62" }}>No affiliates yet.</p>}
        </div>
      </section>
      <section style={panel}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", margin: "0 0 1rem" }}>Recorded payouts</h2>
        {!data.payouts.length ? <p style={{ color: "#766b62" }}>No payouts recorded yet.</p> : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".86rem" }}>
          <thead><tr>{["Date", "Affiliate", "Amount", "Sales", "Sent to"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{data.payouts.map(p => <tr key={p.id}><td style={td}>{new Date(p.created_at).toLocaleDateString()}</td><td style={td}>{affiliates.find(a => a.id === p.affiliate_id)?.code || "—"}</td><td style={td}>{formatMoney(p.amount_cents)}</td><td style={td}>{p.referral_count}</td><td style={td}>{p.method} · {p.payout_email}</td></tr>)}</tbody>
        </table>}
      </section>
    </div>}
  </main>;
}

function Stat({ label, value }) { return <div><div style={{ fontSize: ".72rem", color: "#8a7b70", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div><div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }}>{value}</div></div>; }
const panel = { background: "#fff", border: "1px solid #eadfd5", borderRadius: "22px", padding: "1.3rem", boxShadow: "0 10px 30px rgba(81, 54, 36, .05)" };
const th = { textAlign: "left", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".06em", color: "#8a7b70", padding: ".6rem .5rem", borderBottom: "1px solid #eadfd5" };
const td = { padding: ".75rem .5rem", borderBottom: "1px solid #f1e8df", verticalAlign: "top" };
const buttonSecondary = { border: "1px solid #dacabb", background: "#fff", color: "#5c3a1e", borderRadius: "9px", padding: ".55rem .8rem", fontFamily: "inherit", fontWeight: 700, fontSize: ".78rem", cursor: "pointer", textDecoration: "none" };
const buttonPrimary = { ...buttonSecondary, background: "#5c3a1e", color: "#fff", borderColor: "#5c3a1e" };
