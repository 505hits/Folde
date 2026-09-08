"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";
import styles from "@/app/blog/blog.module.css";

const featuredTemplates = [
  { id: "cisnes", name: "Cisnes", tag: "ELEGANT", description: "Elegant swans romance.", video: "https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4", envelope: "https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4", partner1: "Clara", partner2: "Hugo", date: "OCT 18, 2026" },
  { id: "bloom", name: "Bloom", tag: "NATURAL", description: "Blossoming love.", video: "https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4", envelope: "https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4", partner1: "Lily", partner2: "James", date: "JUN 21, 2026" },
  { id: "romanticgarden", name: "Romantic Garden", tag: "ROMANTIC", description: "Enchanted floral garden romance.", video: "https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4", envelope: "https://eftesa.com/assets/themes/romantic-garden/Floral-garden-intro-video.mp4", partner1: "Julien", partner2: "Camille", date: "JUN 18, 2026" },
  { id: "pressedlovecomo", name: "Como", tag: "ELEGANT", description: "Lake Como villa elegance.", video: "https://pressedlove.com/demo-media/como/hero-video.mp4", envelope: "https://pressedlove.com/demo-media/shared/wax-seal-blue-e30ba1e0.mp4", partner1: "Lorenzo", partner2: "Sophia", date: "JUN 05, 2026" },
  { id: "tropical", name: "Tropical", tag: "NATURAL", description: "Vibrant tropical paradise.", video: "https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4", envelope: "https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4", partner1: "Ava", partner2: "Oliver", date: "MAY 27, 2026" },
  { id: "softscratch", name: "Soft Scratch", tag: "MINIMAL", description: "A soft reveal.", video: "https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4", envelope: "https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4", partner1: "Anna", partner2: "Tom", date: "SEP 05, 2026" }
];

export default function ArticleTemplateCatalog() {
  const trackRef = useRef(null);
  const [activeTemplate, setActiveTemplate] = useState(null);

  const scrollCatalog = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 250, behavior: "smooth" });
  };

  const chooseTemplate = (templateId) => {
    window.localStorage.setItem("selectedTemplate", templateId);
    window.location.assign("/checkout");
  };

  return (
    <section className={styles.templateCatalog} aria-labelledby="article-template-catalog-title">
      <div className={styles.catalogHeading}>
        <div>
          <p className={styles.label}>START WITH A DESIGN</p>
          <h2 id="article-template-catalog-title">Choose an invitation template</h2>
          <p>Browse the collection, open a preview, then personalise the design that feels most like your celebration.</p>
        </div>
        <div className={styles.catalogActions}>
          <button type="button" onClick={() => scrollCatalog(-1)} aria-label="Show previous templates">←</button>
          <button type="button" onClick={() => scrollCatalog(1)} aria-label="Show more templates">→</button>
          <Link href="/collections">View all</Link>
        </div>
      </div>
      <div className={styles.catalogTrack} ref={trackRef}>
        {featuredTemplates.map((template) => (
          <article className={styles.catalogCard} key={template.id} onMouseEnter={() => setActiveTemplate(template.id)} onMouseLeave={() => setActiveTemplate(null)}>
            <Link className={styles.catalogPreview} href={`/collections/${template.id}`} aria-label={`Open ${template.name} template preview`}>
              <div className={styles.catalogPhone}>
                <div className={styles.catalogNotch} />
                <TemplateHeroPreview
                  partner1={template.partner1}
                  partner2={template.partner2}
                  date={template.date}
                  videoSrc={template.video}
                  envelopeSrc={template.envelope}
                  showEnvelope
                  active={activeTemplate === template.id}
                  preloadEnvelopeFrame
                />
              </div>
            </Link>
            <div className={styles.catalogCardCopy}>
              <div><h3>{template.name}</h3><span>{template.tag}</span></div>
              <p>{template.description}</p>
              <button type="button" onClick={() => chooseTemplate(template.id)}>Choose this design <span aria-hidden="true">→</span></button>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.catalogHint}>Swipe or use the arrows to discover more designs. You can refine the content after choosing a template.</p>
    </section>
  );
}
