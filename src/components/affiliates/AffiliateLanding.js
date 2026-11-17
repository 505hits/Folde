import Link from "next/link";
import styles from "./affiliates.module.css";
import ReelPlayer from "./ReelPlayer";
import EarningsCalculator from "./EarningsCalculator";
import { AFFILIATE_INSTAGRAM, AFFILIATE_REELS, affiliateLandingCopy } from "@/lib/affiliate-copy";
import { localeRoot } from "@/lib/routes.mjs";

export default function AffiliateLanding({ locale = "en" }) {
  const t = affiliateLandingCopy[locale] || affiliateLandingCopy.en;
  const dashboard = `${localeRoot(locale)}/affiliate-dashboard`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <span className="label animate-fade-in-up">{t.label}</span>
            <h1 className="heading-xl animate-fade-in-up delay-1">{t.title}</h1>
            <p className="text-lg animate-fade-in-up delay-2">{t.intro}</p>
            <div className={`${styles.actions} animate-fade-in-up delay-3`}>
              <Link href={dashboard} className="btn-primary">{t.join}</Link>
              <a href="#examples" className="btn-secondary">{t.seeExamples}</a>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.heroBadge}><strong>30%</strong><span>{t.stats[0].label}</span></div>
            <div className={`${styles.phone} ${styles.phoneBack}`}><ReelPlayer reel={AFFILIATE_REELS[2]} decorative /></div>
            <div className={`${styles.phone} ${styles.phoneFront}`}><ReelPlayer reel={AFFILIATE_REELS[0]} decorative /></div>
          </div>
        </div>
      </section>

      <section className={styles.statsBand}>
        <div className={`container ${styles.stats}`}>
          {t.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}><strong>{stat.value}</strong><span>{stat.label}</span></div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}><span className="label">{t.steps.label}</span><h2 className="heading-lg">{t.steps.title}</h2></div>
          <ol className={styles.steps}>
            {t.steps.items.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="heading-sm">{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`}>
        <div className="container">
          <EarningsCalculator copy={t.calc} locale={locale} />
        </div>
      </section>

      <section id="examples" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label">{t.examples.label}</span>
            <h2 className="heading-lg">{t.examples.title}</h2>
            <p className="text-lg">{t.examples.intro}</p>
          </div>
          <div className={styles.reels}>
            {AFFILIATE_REELS.map((reel, index) => (
              <figure key={reel.id} className={styles.reelCard}>
                <div className={styles.reelFrame}><ReelPlayer reel={reel} /></div>
                <figcaption>
                  <strong>“{reel.hook}”</strong>
                  <p>{t.examples.why[index]}</p>
                  <a href={`https://www.instagram.com/folde.design/reel/${reel.id}/`} target="_blank" rel="noopener noreferrer">{t.examples.watch} ↗</a>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className={styles.instagramLink}><a href={AFFILIATE_INSTAGRAM} target="_blank" rel="noopener noreferrer">@folde.design ↗</a></p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`}>
        <div className="container">
          <div className={styles.sectionHeader}><span className="label">{t.playbook.label}</span><h2 className="heading-lg">{t.playbook.title}</h2></div>
          <div className={styles.playbook}>
            {t.playbook.items.map((item) => (
              <div key={item.title} className={styles.playCard}><h3 className="heading-sm">{item.title}</h3><p>{item.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.faqWrap}`}>
          <div className={styles.sectionHeader}><span className="label">{t.faq.label}</span><h2 className="heading-lg">{t.faq.title}</h2></div>
          <div className={styles.faq}>
            {t.faq.items.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.final}>
        <div className="container">
          <h2 className="heading-lg">{t.final.title}</h2>
          <p className="text-lg">{t.final.text}</p>
          <Link href={dashboard} className={styles.finalButton}>{t.join} →</Link>
        </div>
      </section>
    </div>
  );
}
