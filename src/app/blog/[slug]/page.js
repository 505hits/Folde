import Image from "next/image";
import Link from "next/link";
import { blogPosts, currentSources, getPost } from "@/lib/blog";
import { blogPostsEs, currentSourcesEs, getPostEs } from "@/lib/blog-es";
import { blogPostsFr, currentSourcesFr, getPostFr } from "@/lib/blog-fr";
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
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
      languages: { en: `${SITE_URL}/blog/${post.slug}`, es: `${SITE_URL}/es/blog/${post.slug}`, fr: `${SITE_URL}/fr/blog/${post.slug}`, "x-default": `${SITE_URL}/blog/${post.slug}` },
    },
    openGraph: { title: post.title, description: post.description, type: "article", url: `${SITE_URL}/blog/${post.slug}`, images: [post.heroImage] }
  };
}

export default async function BlogArticle({ params, locale = "en" }) {
  const { slug } = await params;
  const isSpanish = locale === "es";
  const isFrench = locale === "fr";
  const posts = isSpanish ? blogPostsEs : isFrench ? blogPostsFr : blogPosts;
  const sources = isSpanish ? currentSourcesEs : isFrench ? currentSourcesFr : currentSources;
  const root = locale === "en" ? "" : `/${locale}`;
  const post = isSpanish ? getPostEs(slug) : isFrench ? getPostFr(slug) : getPost(slug);
  if (!post) return null;
  const related = posts.filter((item) => item.slug !== post.slug);
  const hasLongGuide = Boolean(post.deepDive);
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", headline: post.title,
    description: post.description, datePublished: "2026-09-08", dateModified: "2026-09-08",
    mainEntityOfPage: `${SITE_URL}${root}/blog/${post.slug}`, image: `${SITE_URL}${post.heroImage}`,
    inLanguage: isSpanish ? "es-ES" : isFrench ? "fr-FR" : "en",
    author: { "@type": "Organization", name: "FOLDÈ Wedding" }, publisher: { "@type": "Organization", name: "FOLDÈ Wedding" }
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  const ui = isSpanish ? {
    home: 'Inicio', journal: 'Revista', breadcrumb: 'Migas de pan', eyebrow: 'TUTORIAL DE INVITACIONES DE BODA · ACTUALIZADO EL 8 DE SEPTIEMBRE DE 2026', byline: 'Por FOLDÈ Wedding · 7 minutos de lectura', quick: 'RESPUESTA RÁPIDA', discover: 'Descubrir cómo funciona FOLDÈ Wedding →', start: 'Cómo empezar en tres pasos bien planteados', firstAlt: 'Página de inicio de FOLDÈ Wedding con una invitación digital dentro de un móvil', firstCaption: 'Empezad explorando el estilo y la experiencia de la invitación.', secondAlt: 'Vista de personalización de FOLDÈ con opciones de animación para el sobre', secondCaption: 'Personalizad la animación del sobre, los nombres y los datos antes de continuar.', inspiration: 'Inspiración para invitaciones de FOLDÈ Wedding.', personal: 'Una experiencia personal y práctica', checklist: 'Lista de comprobación final', questions: 'preguntas frecuentes', context: 'CONTEXTO ACTUAL DEL SECTOR', reading: 'Para seguir leyendo', sourceText: 'La experiencia de los invitados y la personalización siguen ocupando un lugar central en los estudios recientes del sector. Estas fuentes independientes se incluyen como contexto y no suponen un respaldo a FOLDÈ.', continue: 'SEGUIR LEYENDO', more: 'Más guías sobre invitaciones de boda'
  } : isFrench ? {
    home: 'Accueil', journal: 'Journal', breadcrumb: 'Fil d’Ariane', eyebrow: 'GUIDE DES FAIRE-PART DE MARIAGE · MIS À JOUR LE 8 SEPTEMBRE 2026', byline: 'Par FOLDÈ Wedding · 7 min de lecture', quick: 'RÉPONSE EXPRESS', discover: 'Découvrir le fonctionnement de FOLDÈ Wedding →', start: 'Bien commencer en trois étapes', firstAlt: 'Page d’accueil de FOLDÈ Wedding avec un faire-part numérique affiché sur un téléphone', firstCaption: 'Commencez par explorer le style et l’expérience de l’invitation.', secondAlt: 'Écran de personnalisation FOLDÈ proposant plusieurs animations d’enveloppe', secondCaption: 'Personnalisez l’enveloppe, les noms et les informations avant de poursuivre.', inspiration: 'Inspiration de faire-part par FOLDÈ Wedding.', personal: 'Concilier émotion et simplicité', checklist: 'Liste de vérification finale', questions: 'questions fréquentes', context: 'ÉCLAIRAGE SUR LE SECTEUR DU MARIAGE', reading: 'Pour aller plus loin', sourceText: 'L’expérience des invités et la personnalisation restent au cœur des études récentes sur le mariage. Ces sources indépendantes sont citées à titre de contexte et ne constituent pas une recommandation de FOLDÈ.', continue: 'POURSUIVRE LA LECTURE', more: 'Plus de guides sur les faire-part de mariage'
  } : {
    home: 'Home', journal: 'Journal', breadcrumb: 'Breadcrumb', eyebrow: 'WEDDING INVITATION TUTORIAL · UPDATED SEPTEMBER 8, 2026', byline: 'By FOLDÈ Wedding · 7 minute read', quick: 'QUICK ANSWER', discover: 'See how FOLDÈ Wedding works →', start: 'How to get started in three considered steps', firstAlt: 'FOLDÈ Wedding homepage with a digital invitation preview displayed in a phone frame', firstCaption: 'Start by exploring the invitation style and experience.', secondAlt: 'FOLDÈ personalization preview with envelope animation choices', secondCaption: 'Personalize the envelope animation, names, and event details before continuing.', inspiration: 'Invitation inspiration by FOLDÈ Wedding.', personal: 'Keep the experience personal and practical', checklist: 'Final invitation checklist', questions: 'common questions', context: 'CURRENT WEDDING CONTEXT', reading: 'Further reading', sourceText: 'Guest experience and personalization remain central wedding-planning themes in recent industry research. These independent sources are included for context; they are not endorsements of FOLDÈ.', continue: 'CONTINUE READING', more: 'More wedding invitation guides'
  };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: ui.home, item: `${SITE_URL}${root || "/"}` }, { "@type": "ListItem", position: 2, name: ui.journal, item: `${SITE_URL}${root}/blog` }, { "@type": "ListItem", position: 3, name: post.keyword, item: `${SITE_URL}${root}/blog/${post.slug}` }] };

  return (
    <main className={styles.articlePage}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className={styles.breadcrumb} aria-label={ui.breadcrumb}><Link href={root || "/"}>{ui.home}</Link><span>/</span><Link href={`${root}/blog`}>{ui.journal}</Link><span>/</span><span>{post.keyword}</span></nav>
      <header className={styles.articleHero}>
        <div><p className={styles.eyebrow}>{ui.eyebrow}</p><h1>{post.title}</h1><p className={styles.lede}>{post.description}</p><p className={styles.byline}>{ui.byline}</p></div>
        <div className={styles.heroImage}><Image src={post.heroImage} alt={post.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>
      </header>
      <ArticleTemplateCatalog locale={locale} />

      <div className={styles.articleLayout}>
        <article className={styles.articleContent}>
          <section className={styles.quickAnswer}><p className={styles.label}>{ui.quick}</p><p>{post.quickAnswer}</p><Link href={root || "/"}>{ui.discover}</Link></section>
          {hasLongGuide && <section className={styles.extendedIntro}><p>{post.extendedIntro}</p></section>}
          <section className={styles.tutorial}><p className={styles.label}>TUTORIAL</p><h2>{ui.start}</h2><ol>{post.tutorial.map((step) => <li key={step}>{step}</li>)}</ol><div className={styles.tutorialScreenshots}><figure><div className={styles.tutorialImage}><Image src="/images/blog/folde-landing-preview.png" alt={ui.firstAlt} fill sizes="(max-width: 820px) 100vw, 360px" /></div><figcaption>{ui.firstCaption}</figcaption></figure><figure><div className={styles.tutorialImage}><Image src="/images/blog/folde-personalization-tutorial.png" alt={ui.secondAlt} fill sizes="(max-width: 820px) 100vw, 360px" /></div><figcaption>{ui.secondCaption}</figcaption></figure></div><p>{isSpanish ? <>Utilizad la <Link href="/es/collections">vista previa de las colecciones FOLDÈ</Link> para elegir una dirección y comprobad después la experiencia como invitado.</> : isFrench ? <>Utilisez l’<Link href="/fr/collections">aperçu des collections FOLDÈ</Link> pour choisir une direction, puis parcourez l’invitation comme le ferait un invité.</> : <>Use the <Link href="/collections">FOLDÈ collection preview</Link> to choose a direction, then open your live invitation preview to check the experience from a guest&apos;s perspective.</>}</p></section>
          {hasLongGuide ? <>{post.deepDive.map((section, index) => <section key={section.heading}><h2>{section.heading}</h2><p dangerouslySetInnerHTML={{ __html: section.body }} />{index < 8 && post.articleImages[index + 1] && <figure className={styles.inlineImage}><Image src={post.articleImages[index + 1][0]} alt={post.articleImages[index + 1][1]} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>{ui.inspiration}</figcaption></figure>}</section>)}<figure className={styles.inlineImage}><Image src={post.articleImages[9][0]} alt={post.articleImages[9][1]} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>{ui.inspiration}</figcaption></figure></> : <>{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p dangerouslySetInnerHTML={{ __html: section.body }} /></section>)}<figure className={styles.inlineImage}><Image src={post.secondaryImage} alt={`${post.keyword} inspiration`} fill sizes="(max-width: 820px) 100vw, 720px" /><figcaption>{ui.inspiration}</figcaption></figure></>}
          {hasLongGuide && <section><h2>{ui.personal}</h2><p>{post.planningNote}</p></section>}
          {hasLongGuide && <section><h2>{ui.checklist}</h2><p>{post.closingGuide}</p></section>}
          <section className={styles.faq}><p className={styles.label}>FAQ</p><h2>{post.keyword}: {ui.questions}</h2>{post.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          <section className={styles.sources}><p className={styles.label}>{ui.context}</p><h2>{ui.reading}</h2><p>{ui.sourceText}</p><ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a><span>{source.note}</span></li>)}</ul></section>
        </article>
        <ArticlePreviewAside locale={locale} />
      </div>
      <section className={styles.related}><p className={styles.eyebrow}>{ui.continue}</p><h2>{ui.more}</h2><div className={styles.relatedGrid}>{related.map((item) => <Link href={`${root}/blog/${item.slug}`} key={item.slug}><Image src={item.heroImage} alt="" width={400} height={250} /><span>{item.keyword}</span><strong>{item.title}</strong></Link>)}</div></section>
      <MobileArticleCta locale={locale} />
    </main>
  );
}
