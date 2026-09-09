import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { blogPostsEs } from "@/lib/blog-es";
import MobileArticleCta from "@/components/MobileArticleCta";
import styles from "./blog.module.css";

export const metadata = {
  title: "Wedding Invitation Ideas & Tutorials | FOLDÈ Wedding",
  description: "Wedding invitation tutorials, planning ideas, RSVP guidance, and premium digital invitation inspiration from FOLDÈ Wedding.",
  alternates: { canonical: "https://www.folde-wedding.com/blog", languages: { en: "https://www.folde-wedding.com/blog", es: "https://www.folde-wedding.com/es/blog", "x-default": "https://www.folde-wedding.com/blog" } }
};

export default function BlogIndex({ locale = "en" }) {
  const isSpanish = locale === "es";
  const posts = isSpanish ? blogPostsEs : blogPosts;
  const root = isSpanish ? "/es" : "";
  return (
    <main className={styles.blogPage}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>{isSpanish ? "REVISTA FOLDÈ · SEPTIEMBRE DE 2026" : "FOLDÈ JOURNAL · SEPTEMBER 2026"}</p>
        <h1>{isSpanish ? "Ideas, tutoriales y guías para invitaciones de boda" : "Wedding Invitation Ideas, Tutorials & Guest Planning Guides"}</h1>
        <p>{isSpanish ? "Consejos prácticos y de diseño para parejas que desean ofrecer una experiencia de invitación premium. Elegid un tema y cread después vuestra propia invitación en FOLDÈ Studio." : "Practical, design-led guidance for couples planning a premium invitation experience. Start with a topic below, then build your own invitation in the FOLDÈ studio."}</p>
        <div className={styles.introActions}>
          <Link className={styles.primaryButton} href={root || "/"}>{isSpanish ? "Descubrir FOLDÈ Wedding" : "Discover FOLDÈ Wedding"}</Link>
          <Link className={styles.secondaryButton} href={`${root}/collections`}>{isSpanish ? "Explorar colecciones" : "Explore collections"}</Link>
        </div>
      </section>
      <section className={styles.cardGrid} aria-label={isSpanish ? "Artículos sobre invitaciones de boda" : "Wedding invitation articles"}>
        {posts.map((post) => (
          <article key={post.slug} className={styles.articleCard}>
            <Link href={`${root}/blog/${post.slug}`} className={styles.cardImage} aria-label={isSpanish ? `Leer ${post.title}` : `Read ${post.title}`}>
              <Image src={post.heroImage} alt={post.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
            </Link>
            <div className={styles.cardContent}>
              <p className={styles.keyword}>{post.keyword}</p>
              <h2><Link href={`${root}/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link className={styles.textLink} href={`${root}/blog/${post.slug}`}>{isSpanish ? "Leer la guía" : "Read the guide"} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>
      <MobileArticleCta locale={locale} />
    </main>
  );
}
