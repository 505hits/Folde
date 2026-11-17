"use client";

import { useState } from "react";
import styles from "./affiliates.module.css";
import { PLAN_PRICES, commissionCents, formatMoney } from "@/lib/affiliate.mjs";

export default function EarningsCalculator({ copy, locale = "en" }) {
  const [orders, setOrders] = useState(10);
  const [expertShare, setExpertShare] = useState(20);
  const expert = Math.round(orders * expertShare / 100);
  const monthly = (orders - expert) * commissionCents(PLAN_PRICES.standard) + expert * commissionCents(PLAN_PRICES.expert);
  return (
    <div className={styles.calc}>
      <div className={styles.calcInputs}>
        <span className="label">{copy.label}</span>
        <h2 className="heading-lg">{copy.title}</h2>
        <label className={styles.range}>
          <span>{copy.sales}<output>{orders}</output></span>
          <input type="range" min="1" max="60" value={orders} onChange={(event) => setOrders(Number(event.target.value))} />
        </label>
        <label className={styles.range}>
          <span>{copy.mix}<output>{expertShare}%</output></span>
          <input type="range" min="0" max="100" step="5" value={expertShare} onChange={(event) => setExpertShare(Number(event.target.value))} />
        </label>
        <p className={styles.calcNote}>{copy.note}</p>
      </div>
      <div className={styles.calcResult} aria-live="polite">
        <strong>{formatMoney(monthly, locale)}</strong>
        <span>{copy.month}</span>
        <em>{formatMoney(monthly * 12, locale)} {copy.year}</em>
      </div>
    </div>
  );
}
