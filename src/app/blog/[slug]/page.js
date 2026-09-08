import Image from "next/image";
import Link from "next/link";
import { blogPosts, currentSources, getPost } from "@/lib/blog";
import ArticlePreviewAside from "@/components/ArticlePreviewAside";
import ArticleTemplateCatalog from "@/components/ArticleTemplateCatalog";
import MobileArticleCta from "@/components/MobileArticleCta";
import styles from "../blog.module.css";

const SITE_URL = "https://www.folde-wedding.com";

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Wedding Invitation Guide | FOLDÈ Wedding" };
  return {
    title: `${post.title} | FOLDÈ Wedding`,
    description: post.description,
    // Spanish article URLs are added here only once a complete, editorially
    // reviewed Spanish equivalent exists. hreflang must never point to a thin
    // or generic translation.
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", url: `${SITE_URL}/blog/${post.slug}`, images: [post.heroImage] }
  };
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return null;
  const related = blogPosts.filter((item) => item.slug !== post.slug);
  const hasLongGuide = Boolean(post.deepDive);
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", headline: post.title,
    description: post.description, datePublished: "2026-09-08", dateModified: "2026-09-08",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`, image: `${SITE_URL}${post.heroImage}`,
    author: { "@type": "Organization", name: "FOLDÈ Wedding" }, publisher: { "@type": "Organization", name: "FOLDÈ Wedding" }
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` }, { "@type": "ListItem", position: 3, name: post.keyword, item: `${SITE_URL}/blog/${post.slug}` }] };

  return (
    <main className={styles.articlePage}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Journal</Link><span>/</span><span>{post.keyword}</span></nav>
      <header className={styles.articleHero}>
        <div><p className={styles.eyebrow}>WEDDING INVITATION TUTORIAL · UPDATED SEPTEMBER 8, 2026</p><h1>{post.title}</h1><p className={styles.lede}>{post.description}</p><p className={styles.byline}>By FOLDÈ Wedding · 7 minute read</p></div>
        <div className={styles.heroImage}><Image src={post.heroImage} alt={post.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </header>
      <ArticleTemplateCatalog />

      <div className={styles.articleLayout}>
        <article className={styles.articleContent}>
          <section className={styles.quickAnswer}><p className={styles.label}>QUICK ANSWER</p><p>{post.quickAnswer}</p><Link href="/">See how FOLDÈ Wedding works →</Link></section>
          {hasLongGuide && <section className={styles.extendedIntro}><p>{post.extendedIntro}</p></section>}
          <section className={styles.tutorial}><p className={styles.label}>TUTORIAL</p><h2>How to get started in three considered steps</h2><ol>{post.tutorial.map((step) => <li key={step}>{step}</li>)}</ol><div className={styles.tutorialScreenshots}><figure><div className={styles.tutorialImage}><Image src="/images/blog/folde-landing-preview.png" alt="FOLDÈ Wedding homepage with a digital invitation preview displayed in a phone frame" fill sizes="(max-width: 820px) 100vw, 360px" /></div><figcaption>Start by exploring the invitation style and experience.</figcaption></figure><figure><div className={styles.tutorialImage}><Image src="/images/blog/folde-personalization-tutorial.png" alt="FOLDÈ personalization preview with envelope animation choices" fill sizes="(max-width: 820px) 100vw, 360px" /></div><figcaption>Personalize the envelope animation, names, and event details before continuing.</figcaption></figure></div><p>Use the <Link href="/collections">FOLDÈ collection preview</Link> to choose a direction, then open your live invitation preview to check the experience from a guest&apos;s perspective.</p></section>
          {hasLongGuide ? <>{post.deepDive.map((section, index) => <section key={section.heading}><h2>{section.heading}</h2><p dangerouslySetInnerHTML={{ __html: section.body }} />{index < 8 && post.articleImages[index + 1] && <figure className={styles.inlineImage}><Image src={post.articleImages[index + 1][0]} alt={post.articleImages[index + 1][1]} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>Invitation inspiration by FOLDÈ Wedding.</figcaption></figure>}</section>)}<figure className={styles.inlineImage}><Image src={post.articleImages[9][0]} alt={post.articleImages[9][1]} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>Invitation inspiration by FOLDÈ Wedding.</figcaption></figure></> : <>{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p dangerouslySetInnerHTML={{ __html: section.body }} /></section>)}<figure className={styles.inlineImage}><Image src={post.secondaryImage} alt={`${post.keyword} inspiration`} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>Invitation inspiration by FOLDÈ Wedding.</figcaption></figure></>}
          {hasLongGuide && <section><h2>Keep the experience personal and practical</h2><p>{post.planningNote}</p></section>}
          {hasLongGuide && <section><h2>Final invitation checklist</h2><p>{post.closingGuide}</p></section>}
          <section className={styles.faq}><p className={styles.label}>FAQ</p><h2>{post.keyword}: common questions</h2>{post.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          <section className={styles.sources}><p className={styles.label}>CURRENT WEDDING CONTEXT</p><h2>Further reading</h2><p>Guest experience and personalization remain central wedding-planning themes in recent industry research. These independent sources are included for context; they are not endorsements of FOLDÈ.</p><ul>{currentSources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a><span>{source.note}</span></li>)}</ul></section>
        </article>
        <ArticlePreviewAside />
      </div>
      <section className={styles.related}><p className={styles.eyebrow}>CONTINUE READING</p><h2>More wedding invitation guides</h2><div className={styles.relatedGrid}>{related.map((item) => <Link href={`/blog/${item.slug}`} key={item.slug}><Image src={item.heroImage} alt="" width={400} height={250} /><span>{item.keyword}</span><strong>{item.title}</strong></Link>)}</div></section>
      <MobileArticleCta />
    </main>
  );
}
