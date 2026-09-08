import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import MobileArticleCta from "@/components/MobileArticleCta";
import styles from "./blog.module.css";

export const metadata = {
  title: "Wedding Invitation Ideas & Tutorials | FOLDÈ Wedding",
  description: "Wedding invitation tutorials, planning ideas, RSVP guidance, and premium digital invitation inspiration from FOLDÈ Wedding.",
  alternates: { canonical: "https://www.folde-wedding.com/blog", languages: { en: "https://www.folde-wedding.com/blog", es: "https://www.folde-wedding.com/es/blog", "x-default": "https://www.folde-wedding.com/blog" } }
};

export default function BlogIndex() {
  return (
    <main className={styles.blogPage}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>FOLDÈ JOURNAL · SEPTEMBER 2026</p>
        <h1>Wedding Invitation Ideas, Tutorials &amp; Guest Planning Guides</h1>
        <p>Practical, design-led guidance for couples planning a premium invitation experience. Start with a topic below, then build your own invitation in the FOLDÈ studio.</p>
        <div className={styles.introActions}>
          <Link className={styles.primaryButton} href="/">Discover FOLDÈ Wedding</Link>
          <Link className={styles.secondaryButton} href="/collections">Explore collections</Link>
        </div>
      </section>
      <section className={styles.cardGrid} aria-label="Wedding invitation articles">
        {blogPosts.map((post) => (
          <article key={post.slug} className={styles.articleCard}>
            <Link href={`/blog/${post.slug}`} className={styles.cardImage} aria-label={`Read ${post.title}`}>
              <Image src={post.heroImage} alt={post.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
            </Link>
            <div className={styles.cardContent}>
              <p className={styles.keyword}>{post.keyword}</p>
              <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <Link className={styles.textLink} href={`/blog/${post.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>
      <MobileArticleCta />
    </main>
  );
}
