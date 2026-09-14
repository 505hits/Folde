import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { blogPostsEs } from "@/lib/blog-es";
import { blogPostsFr } from "@/lib/blog-fr";
import MobileArticleCta from "@/components/MobileArticleCta";
import styles from "./blog.module.css";

export const metadata = {
  title: "Wedding Invitation Ideas & Tutorials | FOLDÈ Wedding",
  description: "Wedding invitation tutorials, planning ideas, RSVP guidance, and premium digital invitation inspiration from FOLDÈ Wedding.",
  alternates: { canonical: "https://www.folde-wedding.com/blog", languages: { en: "https://www.folde-wedding.com/blog", es: "https://www.folde-wedding.com/es/blog", fr: "https://www.folde-wedding.com/fr/blog", "x-default": "https://www.folde-wedding.com/blog" } }
};

export default function BlogIndex({ locale = "en" }) {
  const isSpanish = locale === "es";
  const isFrench = locale === "fr";
  const posts = isSpanish ? blogPostsEs : isFrench ? blogPostsFr : blogPosts;
  const root = locale === "en" ? "" : `/${locale}`;
  const ui = isSpanish ? { eyebrow: 'REVISTA FOLDÈ · SEPTIEMBRE DE 2026', title: 'Ideas, tutoriales y guías para invitaciones de boda', intro: 'Consejos prácticos y de diseño para parejas que desean ofrecer una experiencia de invitación premium. Elegid un tema y cread después vuestra propia invitación en FOLDÈ Studio.', discover: 'Descubrir FOLDÈ Wedding', collections: 'Explorar colecciones', aria: 'Artículos sobre invitaciones de boda', read: 'Leer la guía' } : isFrench ? { eyebrow: 'JOURNAL FOLDÈ · SEPTEMBRE 2026', title: 'Idées, tutoriels et conseils pour vos faire-part de mariage', intro: 'Des conseils pratiques et créatifs pour offrir à vos invités une expérience haut de gamme. Choisissez un sujet, puis créez votre propre invitation dans le studio FOLDÈ.', discover: 'Découvrir FOLDÈ Wedding', collections: 'Explorer les collections', aria: 'Articles sur les faire-part de mariage', read: 'Lire le guide' } : { eyebrow: 'FOLDÈ JOURNAL · SEPTEMBER 2026', title: 'Wedding Invitation Ideas, Tutorials & Guest Planning Guides', intro: 'Practical, design-led guidance for couples planning a premium invitation experience. Start with a topic below, then build your own invitation in the FOLDÈ studio.', discover: 'Discover FOLDÈ Wedding', collections: 'Explore collections', aria: 'Wedding invitation articles', read: 'Read the guide' };
  return (
    <main className={styles.blogPage}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>{ui.eyebrow}</p>
        <h1>{ui.title}</h1>
        <p>{ui.intro}</p>
        <div className={styles.introActions}>
          <Link className={styles.primaryButton} href={root || "/"}>{ui.discover}</Link>
          <Link className={styles.secondaryButton} href={`${root}/collections`}>{ui.collections}</Link>
        </div>
      </section>
      <section className={styles.cardGrid} aria-label={ui.aria}>
        {posts.map((post) => (
          <article key={post.slug} className={styles.articleCard}>
            <Link href={`${root}/blog/${post.slug}`} className={styles.cardImage} aria-label={`${ui.read} : ${post.title}`}>
              <Image src={post.heroImage} alt={post.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
            </Link>
            <div className={styles.cardContent}>
              <p className={styles.keyword}>{post.keyword}</p>
              <h2><Link href={`${root}/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link className={styles.textLink} href={`${root}/blog/${post.slug}`}>{ui.read} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>
      <MobileArticleCta locale={locale} />
    </main>
  );
}
