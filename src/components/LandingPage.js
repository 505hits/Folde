import Image from "next/image";
import Link from "next/link";
import { landingContent } from "@/lib/landing-content";
import { absolute, pagePath } from "@/lib/routes.mjs";
import { breadcrumbSchema, faqSchema, productSchema } from "@/lib/seo";
import ArticleCta from "@/components/ArticleCta";
import styles from "@/app/blog/blog.module.css";

export default function LandingPage({ locale }) {
  const c = landingContent[locale];
  const root = `/${locale}`;
  const path = pagePath(locale, "landing");
  const schemas = [
    productSchema({ name: c.productName, description: c.description, url: absolute(path), inLanguage: c.inLanguage }),
    faqSchema(c.faqs),
    breadcrumbSchema([[c.home, root], [c.breadcrumb, path]]),
  ];
  return (
    <main className={styles.articlePage}>
      {schemas.map((schema, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <nav className={styles.breadcrumb} aria-label={locale === "fr" ? "Fil d’Ariane" : "Migas de pan"}><Link href={root}>{c.home}</Link><span>/</span><span>{c.breadcrumb}</span></nav>
      <header className={styles.articleHero}>
        <div>
          <p className={styles.eyebrow}>{c.eyebrow}</p>
          <h1>{c.h1}</h1>
          <p className={styles.lede}>{c.lede}</p>
          <div className={styles.introActions}>
            <Link className={styles.primaryButton} href={`${root}/checkout`}>{c.primary}</Link>
            <Link className={styles.secondaryButton} href={pagePath(locale, "collections")}>{c.secondary}</Link>
          </div>
          <p className={styles.byline}>{c.reassurance}</p>
          <p className={styles.byline}>{c.byline}</p>
        </div>
        <div className={styles.heroImage}><Image src="/images/blog/pexels/29821866.jpg" alt={c.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </header>
      <div className={styles.articleContent} style={{ maxWidth: 760, margin: "3.5rem auto 0" }}>
        <nav className={styles.toc} aria-label={c.tocLabel}><p className={styles.label}>{c.tocLabel}</p><ol>{c.sections.map((section, index) => <li key={section.heading}><a href={`#s${index + 1}`}>{section.heading}</a></li>)}<li><a href="#faq">FAQ</a></li></ol></nav>
        {c.sections.map((section, index) => (
          <div key={section.heading}>
            <section id={`s${index + 1}`}>
              <h2>{section.heading}</h2>
              {section.list && (section.ordered ? <ol>{section.list.map((item) => <li key={item}>{item}</li>)}</ol> : <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>)}
              {section.body && <div dangerouslySetInnerHTML={{ __html: section.body }} />}
            </section>
            {index === c.ctaAfter && <ArticleCta locale={locale} variant="mid" />}
          </div>
        ))}
        <section className={styles.quickAnswer}>
          <h2>{c.pricingTitle}</h2>
          <p>{c.pricingText}</p>
          <Link href={pagePath(locale, "packages")}>{c.pricingLink} →</Link>
        </section>
        <p className={styles.byline}>{c.editorial}</p>
        <section className={styles.faq} id="faq">
          <p className={styles.label}>FAQ</p>
          <h2>{c.faqTitle}</h2>
          {c.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>
        <section className={styles.inlineCta}>
          <h2 className={styles.inlineCtaTitle}>{c.finalTitle}</h2>
          <p>{c.finalText}</p>
          <div className={styles.introActions}><Link className={styles.primaryButton} href={`${root}/checkout`}>{c.finalButton}</Link></div>
        </section>
      </div>
    </main>
  );
}
