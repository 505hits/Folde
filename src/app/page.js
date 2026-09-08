"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";

const carouselItems = [
  { name: 'Luxe Gold', desc: 'Opulent and golden.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: '/videos/golden-palace.mp4', partner1: 'Gabriel', partner2: 'Mathilde', date: 'MAY 27, 2026' },
  { name: 'Pearl', desc: 'Luminous and serene.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: '/videos/ivory-veil.mp4', partner1: 'Arthur', partner2: 'Chloé', date: 'MAY 27, 2026' },
  { name: 'Velvet Noir', desc: 'Bold and timeless.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: '/videos/bordeaux.mp4', partner1: 'Alexandre', partner2: 'Éléonore', date: 'MAY 27, 2026' },
  { name: 'Olive Grove', desc: 'Botanical and fresh.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Lucas', partner2: 'Margaux', date: 'MAY 27, 2026' },
  { name: 'Amber', desc: 'Earthy and radiant.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Hugo', partner2: 'Inès', date: 'MAY 27, 2026' },
  { name: 'Mocha', desc: 'Rich and soulful.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Louis', partner2: 'Camille', date: 'MAY 27, 2026' },
  { name: 'Crimson Royal', desc: 'Regal and distinguished.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: '/videos/horizon-bordeaux.mp4', partner1: 'Antoine', partner2: 'Victoire', date: 'MAY 27, 2026' },
  { name: 'Sapphire', desc: 'Oceanic and refined.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: '/videos/celestial-veil.mp4', partner1: 'Maxime', partner2: 'Charlotte', date: 'MAY 27, 2026' },
  { name: 'Blush Ribbon', desc: 'Romantic ribbon reveal.', video: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Paul', partner2: 'Juliette', date: 'MAY 27, 2026' },
  { name: 'Grand Heritage', desc: 'A grand ceremonial debut.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Charles', partner2: 'Valentine', date: 'MAY 27, 2026' },
  { name: 'The Lace Edit', desc: 'Delicate lace and timeless romance.', video: 'https://savethedate-thelaceedit.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', isImage: true, envelope: 'https://savethedate-thelaceedit.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Emma', partner2: 'Liam', date: 'MAY 27, 2026' },
  { name: 'Le Jardin', desc: 'A lush garden romance.', video: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/0d44b575-21a3-498b-856a-eaf9614d23c6/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/08254d3d-25f6-40e6-a54a-6bc01219ec3e/envelope-v2.jpg', partner1: 'Sophie', partner2: 'Lucas', date: 'MAY 27, 2026' },
  { name: 'Lace Photo Scratch', desc: 'Interactive elegant scratch reveal.', video: 'https://savethedate-lacephotoscratch.thedigitalyes.com/assets/hero-scratch-cover-reference-CIK32eF4.png', isImage: true, envelope: 'https://savethedate-lacephotoscratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Chloe', partner2: 'Noah', date: 'MAY 27, 2026' },
  { name: 'Oasis Royale', desc: 'A grand desert oasis celebration.', video: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-oasisroyale.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Mia', partner2: 'Leo', date: 'MAY 27, 2026' },
  { name: 'Tropical', desc: 'Vibrant tropical paradise.', video: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4', isImage: false, envelope: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4', partner1: 'Ava', partner2: 'Oliver', date: 'MAY 27, 2026' },
  { name: 'Photo Scratch', desc: 'Reveal your memory.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', isImage: false, envelope: 'https://savethedate-photo-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Elena', partner2: 'Mark', date: 'AUG 12, 2026' },
  { name: 'Soft Scratch', desc: 'A soft reveal.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', isImage: false, envelope: 'https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Anna', partner2: 'Tom', date: 'SEP 05, 2026' },
  { name: 'Cisnes', desc: 'Elegant swans romance.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', isImage: false, envelope: 'https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Clara', partner2: 'Hugo', date: 'OCT 18, 2026' },
  { name: 'Bloom', desc: 'Blossoming love.', video: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', isImage: false, envelope: 'https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Lily', partner2: 'James', date: 'JUN 21, 2026' },
  { name: 'Floral', desc: 'A bed of flowers.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', isImage: false, envelope: 'https://savethedate-floral.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Rose', partner2: 'Jack', date: 'MAY 15, 2026' },
  { name: 'Romantic Garden', desc: 'Enchanted floral garden romance.', video: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', isImage: false, envelope: 'https://eftesa.com/assets/themes/romantic-garden/Floral-garden-intro-video.mp4', partner1: 'Julien', partner2: 'Camille', date: 'JUN 18, 2026' },
  { name: 'Blossom Oud', desc: 'Sublime floral and oud aesthetic.', video: 'https://static.tildacdn.net/tild3332-3762-4233-a636-636233333133/Vector.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Youssef', partner2: 'Salma', date: 'JUL 12, 2026' },
  { name: 'Dolce Vita', desc: 'Italian coast & sun-drenched romance.', video: 'https://static.tildacdn.net/tild3733-3133-4232-b033-623736623262/romantic-moments-bea.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Matteo', partner2: 'Chiara', date: 'AUG 20, 2026' },
  { name: 'Velvet Garden', desc: 'Sleek modern luxury with botanical details.', video: 'https://static.tildacdn.net/tild3338-6332-4463-b639-623665353237/300592484d1f31590325.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Enzo', partner2: 'Manon', date: 'SEP 14, 2026' },
  { name: 'Noir Gold', desc: 'Minimalist dark luxury with gold accents.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', isImage: false, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Lucas', partner2: 'Inès', date: 'OCT 02, 2026' },
  { name: 'Como', desc: 'Lake Como villa elegance.', video: 'https://pressedlove.com/demo-media/como/hero-video.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/wax-seal-blue-e30ba1e0.mp4', partner1: 'Lorenzo', partner2: 'Sophia', date: 'JUN 05, 2026' },
  { name: 'Teatro', desc: 'Theatrical curtain reveal and opulent gold.', video: 'https://pressedlove.com/demo-media/template-teatro/curtain-video-BAKLj3Y5.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Dante', partner2: 'Beatrice', date: 'JUL 18, 2026' },
  { name: 'The Venue', desc: 'Destination villa & estate celebration.', video: 'https://pressedlove.com/demo-media/boda-mar-jaume/intro-video-BSNlV4m4.webm', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Jaume', partner2: 'Mar', date: 'AUG 28, 2026' },
  { name: 'Sweet Love', desc: 'Warm peach, cream & tender romance.', video: 'https://pressedlove.com/demo-media/boda-laura-javier/hero-video-new-G6oopIOA.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Javier', partner2: 'Laura', date: 'SEP 10, 2026' },
  { name: 'Botanical Floral', desc: 'Soft floral petals and garden blooming.', video: 'https://pressedlove.com/demo-media/boda-maria-carlos/hero-video-1230-C27srnl9.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Carlos', partner2: 'María', date: 'OCT 15, 2026' },
  { name: 'Big Entrance', desc: 'Cinematic debut and regal golden seal.', video: 'https://pressedlove.com/demo-media/theme-previews/theme-big-entrance.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/wax-seal-yellow-dc798fa1.mp4', partner1: 'Raphaël', partner2: 'Victoria', date: 'NOV 08, 2026' },
];

const FEATURED_TEMPLATE_NAMES = ['Cisnes', 'Bloom', 'Romantic Garden', 'Como', 'Tropical', 'Soft Scratch'];
const orderedCarouselItems = [...carouselItems].sort((a, b) => {
  const aIndex = FEATURED_TEMPLATE_NAMES.indexOf(a.name);
  const bIndex = FEATURED_TEMPLATE_NAMES.indexOf(b.name);
  return (aIndex === -1 ? FEATURED_TEMPLATE_NAMES.length : aIndex) - (bIndex === -1 ? FEATURED_TEMPLATE_NAMES.length : bIndex);
});

const testimonials = [
  { name: "Isabelle & Hugo", text: "FOLDÈ transformed our vision into a breathtaking digital experience. All of our guests were captivated the moment they opened it.", rating: 5 },
  { name: "Priya & Daniel", text: "The level of elegance and craftsmanship is extraordinary. Our invitation felt like a work of art, and the RSVP system made managing responses effortless.", rating: 5 },
  { name: "Camille & Antoine", text: "Working with FOLDÈ was an absolute joy. They captured our aesthetic perfectly to create an unforgettable keepsake.", rating: 5 },
  { name: "Nina & Rafael", text: "The real-time guest dashboard changed everything for us. No more tracking down guests — seamless and perfectly organized.", rating: 5 },
];

const faqs = [
  { q: "How long does it take for my invitation to be ready?", a: "Once your information is completed, your custom invitation is ready within 5 to 7 business days, revisions included." },
  { q: "Can I edit details after sending?", a: "Optionally. Your invitation is dynamic — update your schedule, location, or timings anytime without re-sending the link." },
  { q: "Is there a guest limit?", a: "No limits. All packages include unlimited guests with no extra fees." },
  { q: "Do you support multi-language invitations?", a: "Yes, our packages support multi-language invitations to welcome guests worldwide in their native language." },
  { q: "How does the RSVP system work?", a: "Each invitation includes an interactive RSVP form. Guests confirm attendance and dietary choices in one tap, synced directly to your private dashboard." },
];

export default function Home() {
  const carouselRef = useRef(null);
  const [showCta, setShowCta] = useState(false);
  const [hoveredCarouselItem, setHoveredCarouselItem] = useState(null);
  const [heroEnvelopeDismissed, setHeroEnvelopeDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowCta(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 310;
      carouselRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.main}>

      {/* ===================== HERO ===================== */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <div className={`${styles.heroRating} animate-fade-in-up`} aria-label="Rated 4.9 out of 5 by more than 500 happy couples">
              <div className={styles.ratingAvatars} aria-hidden="true">
                <img src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
                <img src="https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
                <img src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
                <img src="https://images.pexels.com/photos/3352398/pexels-photo-3352398.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
              </div>
              <div className={styles.ratingCopy}><div><span>★★★★★</span><strong>4.9/5</strong></div><small>Elegido por más de 500 parejas felices</small></div>
            </div>
            <h1 className="heading-xl animate-fade-in-up delay-1">
              Invitaciones digitales de boda premium y gestión de invitados en tiempo real
            </h1>
            <p className="text-lg animate-fade-in-up delay-2">
              FOLDÈ crea invitaciones digitales de boda personalizadas con RSVP integrado, galerías de fotos y gestión de invitados en tiempo real.
            </p>
            <div className={`${styles.heroCtas} animate-fade-in-up delay-3`}>
              <Link href="/checkout" className="btn-primary">Crea tu invitación</Link>
              <Link href="/collections" className="btn-secondary">Explorar colecciones</Link>
            </div>

            <div className={`${styles.heroFeatures} animate-fade-in-up delay-4`}>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Desde 49,90 €</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Seguimiento RSVP inteligente</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Invitados ilimitados</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Asistencia personal</span>
              </div>
            </div>
          </div>
          <div className={`${styles.heroPhone} animate-fade-in-up delay-2`}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneScreen}>
                <div className={`${styles.heroTemplateViewport} ${heroEnvelopeDismissed ? styles.heroTemplateReady : ''}`}>
                  <div className={styles.heroTemplateScale}>
                    <BordeauxTemplate
                      editMode={false}
                      autoPlaySimulation={false}
                      heroHeight="988px"
                      onEnvelopeDismissed={() => setHeroEnvelopeDismissed(true)}
                      data={{
                        themeId: "ivory",
                        partner1: "Anna",
                        partner2: "Tom",
                        date: "SEP 05, 2026",
                        ceremonyVenue: "Your Dream Venue",
                        receptionVenue: "",
                        videos: {
                          envelope: "https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4",
                          hero: "https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4"
                        },
                        sections: { showIntro: true, showVenue: true, showSchedule: true, showBoardingPass: false, showRSVP: true, showGallery: true }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CAROUSEL ===================== */}
      <section className={styles.universeSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Colecciones</span>
            <h2 className="heading-lg">Explora nuestros universos de diseño exclusivos</h2>
            <p className="text-lg">Cada colección es un universo estético único, creado para contar vuestra historia de amor.</p>
          </div>
        </div>
        <div className={styles.carouselContainer}>
          <button className={styles.carouselArrow} onClick={() => scrollCarousel(-1)} aria-label="Scroll left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="carousel-wrapper">
            <div className="carousel-track" ref={carouselRef}>
              {orderedCarouselItems.map((item, i) => (
                <Link href="/collections" key={i} style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}>
                  <div
                    className="carousel-card"
                    onMouseEnter={() => setHoveredCarouselItem(i)}
                    onMouseLeave={() => setHoveredCarouselItem(null)}
                    style={{ paddingBottom: '2rem', transition: 'transform 0.2s' }}
                  >
                    <div className={styles.phoneFrame} style={{ width: '240px', height: '490px', margin: '0 auto' }}>
                      <div className={styles.phoneNotch}></div>
                      <div className={styles.phoneScreen}>
                        <TemplateHeroPreview
                          partner1={item.partner1}
                          partner2={item.partner2}
                          date={item.date}
                          videoSrc={item.video}
                          envelopeSrc={item.envelope}
                          showEnvelope
                          isImage={item.isImage || false}
                          active={hoveredCarouselItem === i}
                          preloadEnvelopeFrame
                        />
                      </div>
                    </div>
                    <div className="carousel-card-content" style={{ marginTop: '1rem' }}>
                      <h4>{item.name}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <button className={styles.carouselArrow} onClick={() => scrollCarousel(1)} aria-label="Scroll right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/collections" className="btn-secondary">Ver todas las colecciones</Link>
        </div>
      </section>

      {/* ===================== METHOD ===================== */}
      <section className={styles.methodSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Nuestro proceso</span>
            <h2 className="heading-lg">De la visión a una pieza única, paso a paso</h2>
            <p className="text-lg">Un recorrido a medida en el que vuestras ideas se convierten en una experiencia inolvidable.</p>
          </div>
          <div className={styles.methodGrid}>
            {[
              { num: '01', title: 'Sesión de descubrimiento', desc: 'Una conversación dedicada a explorar vuestra visión, preferencias estéticas y los detalles de la celebración.' },
              { num: '02', title: 'Personaliza el contenido', desc: 'Comparte tus fotos, programa, lugar de celebración y preferencias de RSVP; te acompañamos en cada paso.' },
              { num: '03', title: 'Creación y diseño a medida', desc: 'Nuestro atelier crea tu invitación digital y cuida cada detalle.' },
              { num: '04', title: 'Lanzamiento y celebración', desc: 'Recibe el enlace de tu invitación personalizada y compártelo fácilmente con tus invitados.' },
            ].map((step, i) => (
              <div key={i} className={styles.methodCard}>
                <span className={styles.methodNum}>{step.num}</span>
                <h3 className="heading-sm">{step.title}</h3>
                <p className="text-sm" style={{ marginTop: '0.75rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section className={styles.pricingSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Planes</span>
            <h2 className="heading-lg">Elige el plan perfecto para vuestra boda</h2>
            <p className="text-lg">Planes a medida para elevar vuestra experiencia de invitación de boda.</p>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">Estándar</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem' }}>Todo lo necesario para una invitación elegante y personalizada.</p>
                <div className={styles.pricingPrice}>49.90 €</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Elige entre universos de diseño exclusivos</li>
                  <li><span className={styles.checkIcon}>✓</span> Personalizada con tus colores y detalles</li>
                  <li><span className={styles.checkIcon}>✓</span> Formulario RSVP interactivo</li>
                  <li><span className={styles.checkIcon}>✓</span> Panel de invitados en tiempo real</li>
                  <li><span className={styles.checkIcon}>✓</span> Invitados ilimitados incluidos</li>
                  <li><span className={styles.checkIcon}>✓</span> Directorio de invitados y plano de mesas</li>
                  <li><span className={styles.checkIcon}>✓</span> No incluye créditos de IA</li>
                </ul>
              </div>
              <Link href="/collections" className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>Elegir Standard</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingBadge}>Más elegido</div>
              <div>
                <h3 className="heading-md">Premium</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem', opacity: 0.7 }}>Un panel de invitación autónomo con créditos de IA y soporte prioritario.</p>
                <div className={styles.pricingPrice}>79.90 €</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Todo lo incluido en Estándar</li>
                  <li><span className={styles.checkIcon}>✓</span> <strong>5 créditos de imágenes con IA + 5 créditos de música con IA</strong></li>
                  <li><span className={styles.checkIcon}>✓</span> Soporte dedicado exprés en 24 h</li>
                  <li><span className={styles.checkIcon}>✓</span> Panel de autoservicio y soporte prioritario</li>
                  <li><span className={styles.checkIcon}>✓</span> Secciones personalizadas (tarjeta de embarque, RSVP)</li>
                  <li><span className={styles.checkIcon}>✓</span> Revisiones ilimitadas</li>
                </ul>
              </div>
              <Link href="/collections" className="btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem', backgroundColor: '#ffffff', color: '#5C3A1E', borderColor: '#ffffff', fontWeight: 700 }}>Elegir Premium</Link>
            </div>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">Expert</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem' }}>Cuestionario de inicio 100 % personalizado, revisión del equipo y validación del sitio.</p>
                <div className={styles.pricingPrice}>149.90 €</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Cuestionario de inicio 100 % personalizado</li>
                  <li><span className={styles.checkIcon}>✓</span> Dirección artística artesanal</li>
                  <li><span className={styles.checkIcon}>✓</span> Sobre, vídeo de portada, menú y fotos personalizados</li>
                  <li><span className={styles.checkIcon}>✓</span> Revisión y validación directa por nuestro equipo</li>
                  <li><span className={styles.checkIcon}>✓</span> El estudio crea y publica tu invitación tras la aprobación</li>
                  <li><span className={styles.checkIcon}>✓</span> Asistencia personal y soporte prioritario</li>
                  <li><span className={styles.checkIcon}>✓</span> <strong>5 créditos de imágenes con IA + 5 créditos de música con IA</strong></li>
                  <li><span className={styles.checkIcon}>✓</span> Todo lo incluido en Premium</li>
                </ul>
              </div>
              <Link href="/collections" className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>Elegir Expert</Link>
            </div>
          </div>
          <div className={styles.pricingAddons}>
            <p className="text-sm"><strong>Complementos opcionales:</strong> Portada de vídeo — 19 € · Música personalizada — 19 € · Idioma adicional — 19 € · Gestión de varios grupos — 29 €</p>
          </div>
        </div>
      </section>

      {/* ===================== RSVP DASHBOARD ===================== */}
      <section className={styles.dashboardSection}>
        <div className="container">
          <div className={styles.dashboardInner}>
            <div className={styles.dashboardText}>
              <span className="label">Panel</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>Tu panel privado de boda</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>Sigue cada respuesta RSVP, preferencia alimentaria y estado de invitado en tiempo real, con todo organizado elegantemente.</p>
              <div className={styles.dashboardStats}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>127</span>
                  <span className={styles.statLabel}>Asisten</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>14</span>
                  <span className={styles.statLabel}>No asisten</span>
                </div>
              </div>
              <ul className={styles.dashboardFeatures}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Real-time RSVP response tracking
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Clear organization at a glance
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  One-click data export
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Seamless on mobile & desktop
                </li>
              </ul>
            </div>
            <div className={styles.dashboardVisual}>
              <div className={styles.dashboardMockup}>
                <div className={styles.mockupBar}>
                  <span></span><span></span><span></span>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Sophie & James</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>Asiste</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Clara & Thomas</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>Asiste</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#EE9441' }}></div>
                    <span>Marie Dupont</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(238, 148, 65, 0.1)', color: '#EE9441' }}>Pendiente</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#e74c3c' }}></div>
                    <span>Paul Martin</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}>No asiste</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Emma Laurent</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>Asiste</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Historias de parejas</span>
            <h2 className="heading-lg">Elegido por nuestras parejas</h2>
            <p className="text-lg">Descubre las historias de parejas que confiaron en nosotros para su gran día.</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <p className={styles.testimonialName}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AUTONOMOUS OPTION ===================== */}
      <section className={styles.autonomousSection}>
        <div className="container">
          <div className={styles.autonomousInner}>
            <div className={styles.autonomousText}>
              <span className="label">Experiencia Studio</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>¿Prefieres personalizar a tu ritmo?</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                The FOLDÈ Studio gives you complete creative control — input your details, select your collection, and craft your invitation seamlessly.
              </p>
              <ul className={styles.autonomousFeatures}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Guided preparation — details, schedule, RSVP, accommodations
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  FOLDÈ Collections — select a visual direction from our gallery
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  RSVP tracking & dashboard — monitor confirmations in real time
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  At your own pace — update your content whenever you wish
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/checkout" className="btn-primary">Crear ahora</Link>
                <Link href="/checkout" className="btn-secondary">Iniciar vista previa</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Preguntas frecuentes</span>
            <h2 className="heading-lg">Preguntas frecuentes</h2>
            <p className="text-lg">Todo lo que necesitas saber antes de comenzar.</p>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{faq.q}</summary>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className={styles.finalCta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="heading-lg">Da vida a tu invitación</h2>
          <p className="text-lg" style={{ marginTop: '0.5rem' }}>Creaciones digitales a medida desde 49,90 €</p>
          <Link href="/checkout" className="btn-primary" style={{ marginTop: '2rem' }}>Crea tu invitación</Link>
        </div>
      </section>

      {/* ===================== CONTACT SECTION ===================== */}
      <section className={styles.contactSection}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div className={styles.contactIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h2 className="heading-lg" style={{ fontSize: '2rem' }}>¿Tienes preguntas? Escríbenos</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem', color: '#888', lineHeight: 1.7 }}>
            Whether you are exploring options or ready to begin, our team is here to assist you.
          </p>
          <a href="mailto:folde.wedding@gmail.com" className={styles.contactEmail}>
            folde.wedding@gmail.com
          </a>
          <div className={styles.contactDivider}>
            <div className={styles.contactDividerLine}></div>
            <span>or</span>
            <div className={styles.contactDividerLine}></div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Response within a few hours ✨
          </p>
        </div>
      </section>

      {/* ===================== STICKY SCROLL CTA ===================== */}
      <div style={{
        position: 'fixed', bottom: '2rem', left: '50%', zIndex: 999,
        transform: `translateX(-50%) ${showCta ? 'translateY(0) scale(1)' : 'translateY(150%) scale(0.9)'}`,
        opacity: showCta ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: showCta ? 'auto' : 'none'
      }}>
        <Link href="/collections" style={{
          backgroundColor: '#5C3A1E', color: '#fff',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 1.8rem', borderRadius: '40px',
          boxShadow: '0 8px 30px rgba(92, 58, 30, 0.35), 0 4px 10px rgba(0,0,0,0.1)',
          textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap', width: 'max-content'
        }}>
          Design your invitation →
        </Link>
      </div>
    </div>
  );
}
