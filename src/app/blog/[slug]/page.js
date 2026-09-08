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
  if (!post) return { title: "Guía de invitaciones de boda | FOLDÈ Wedding" };
  return {
    title: `${post.title} | FOLDÈ Wedding`,
    description: post.description,
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
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Revista", item: `${SITE_URL}/blog` }, { "@type": "ListItem", position: 3, name: post.keyword, item: `${SITE_URL}/blog/${post.slug}` }] };

  return (
    <main className={styles.articlePage}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>/</span><Link href="/blog">Revista</Link><span>/</span><span>{post.keyword}</span></nav>
      <header className={styles.articleHero}>
        <div><p className={styles.eyebrow}>TUTORIAL DE INVITACIONES DE BODA · ACTUALIZADO EL 8 DE SEPTIEMBRE DE 2026</p><h1>{post.title}</h1><p className={styles.lede}>{post.description}</p><p className={styles.byline}>Por FOLDÈ Wedding · Lectura de 7 minutos</p></div>
        <div className={styles.heroImage}><Image src={post.heroImage} alt={post.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </header>
      <ArticleTemplateCatalog />

      <div className={styles.articleLayout}>
        <article className={styles.articleContent}>
          <section className={styles.quickAnswer}><p className={styles.label}>RESPUESTA RÁPIDA</p><p>{post.quickAnswer}</p><Link href="/">Descubre cómo funciona FOLDÈ Wedding →</Link></section>
          {hasLongGuide && <section className={styles.extendedIntro}><p>{post.extendedIntro}</p></section>}
          <section className={styles.tutorial}><p className={styles.label}>TUTORIAL</p><h2>Cómo empezar en tres pasos bien pensados</h2><ol>{post.tutorial.map((step) => <li key={step}>{step}</li>)}</ol>{!hasLongGuide && <div className={styles.tutorialImage}><Image src="/images/blog/digital-invitation-tutorial.webp" alt="Ordenador y teléfono para planificar una invitación de boda digital" fill sizes="(max-width: 820px) 100vw, 720px" /></div>}<p>Usa la <Link href="/collections">vista previa de colecciones de FOLDÈ</Link> para elegir una dirección y abre tu previsualización en directo para revisar la experiencia como si fueras un invitado.</p></section>
          {hasLongGuide ? <>{post.deepDive.map((section, index) => <section key={section.heading}><h2>{section.heading}</h2><p dangerouslySetInnerHTML={{ __html: section.body }} />{index < 8 && post.articleImages[index + 1] && <figure className={styles.inlineImage}><Image src={post.articleImages[index + 1][0]} alt={post.articleImages[index + 1][1]} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>Inspiración para invitaciones de FOLDÈ Wedding.</figcaption></figure>}</section>)}<figure className={styles.inlineImage}><Image src={post.articleImages[9][0]} alt={post.articleImages[9][1]} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>Inspiración para invitaciones de FOLDÈ Wedding.</figcaption></figure></> : <>{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p dangerouslySetInnerHTML={{ __html: section.body }} /></section>)}<figure className={styles.inlineImage}><Image src={post.secondaryImage} alt={`${post.keyword} inspiración`} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>Inspiración para invitaciones de FOLDÈ Wedding.</figcaption></figure></>}
          {hasLongGuide && <section><h2>Mantén la experiencia personal y práctica</h2><p>{post.planningNote}</p></section>}
          {hasLongGuide && <section><h2>Lista final para revisar tu invitación</h2><p>{post.closingGuide}</p></section>}
          <section className={styles.faq}><p className={styles.label}>PREGUNTAS FRECUENTES</p><h2>{post.keyword}: preguntas habituales</h2>{post.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          <section className={styles.sources}><p className={styles.label}>CONTEXTO ACTUAL DE LAS BODAS</p><h2>Para seguir leyendo</h2><p>La experiencia de los invitados y la personalización siguen siendo temas centrales en la investigación reciente sobre bodas. Estas fuentes independientes se incluyen como contexto y no constituyen una recomendación de FOLDÈ.</p><ul>{currentSources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a><span>{source.note}</span></li>)}</ul></section>
        </article>
        <ArticlePreviewAside />
      </div>
      <section className={styles.related}><p className={styles.eyebrow}>SIGUE LEYENDO</p><h2>Más guías de invitaciones de boda</h2><div className={styles.relatedGrid}>{related.map((item) => <Link href={`/blog/${item.slug}`} key={item.slug}><Image src={item.heroImage} alt="" width={400} height={250} /><span>{item.keyword}</span><strong>{item.title}</strong></Link>)}</div></section>
      <MobileArticleCta />
    </main>
  );
}
