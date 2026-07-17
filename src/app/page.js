"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";

const carouselItems = [
  { name: 'Velvet Noir', desc: 'Bold and timeless.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', partner1: 'Gregory', partner2: 'Isabelle', date: 'MAY 27, 2026' },
  { name: 'Pearl', desc: 'Luminous and serene.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Olivia', partner2: 'Noah', date: 'MAY 27, 2026' },
  { name: 'Luxe Gold', desc: 'Opulent and golden.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1774273219231.mp4', partner1: 'Ava', partner2: 'William', date: 'MAY 27, 2026' },
  { name: 'Amber', desc: 'Earthy and radiant.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1774273219231.mp4', partner1: 'Sophia', partner2: 'James', date: 'MAY 27, 2026' },
  { name: 'Crimson Royal', desc: 'Regal and distinguished.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', partner1: 'Isabella', partner2: 'Oliver', date: 'MAY 27, 2026' },
  { name: 'Sapphire', desc: 'Oceanic and refined.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Mia', partner2: 'Benjamin', date: 'MAY 27, 2026' },
  { name: 'Olive Grove', desc: 'Botanical and fresh.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Charlotte', partner2: 'Elijah', date: 'MAY 27, 2026' },
  { name: 'Mocha', desc: 'Rich and soulful.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Amelia', partner2: 'Lucas', date: 'MAY 27, 2026' },
  { name: 'Blush Ribbon', desc: 'Romantic ribbon reveal.', video: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Chloe', partner2: 'Sam', date: 'MAY 27, 2026' },
  { name: 'Grand Heritage', desc: 'A grand ceremonial debut.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Victoria', partner2: 'Arthur', date: 'MAY 27, 2026' },
];

const testimonials = [
  { name: "Isabelle & Hugo", text: "FOLDÈ turned our vision into a breathtaking digital experience. Every guest was amazed — the invitation set the tone for the entire celebration.", rating: 5 },
  { name: "Priya & Daniel", text: "The level of craftsmanship is extraordinary. Our invitation felt like a work of art, and the RSVP system made planning effortless.", rating: 5 },
  { name: "Camille & Antoine", text: "Working with FOLDÈ was a dream. They captured our personality perfectly and delivered something we'll treasure forever.", rating: 5 },
  { name: "Nina & Rafael", text: "The real-time guest dashboard changed everything for us. No more chasing RSVPs — just pure, elegant organization.", rating: 5 },
];

const faqs = [
  { q: "How quickly will my invitation be ready?", a: "Once we finalize your details during our creative session, your bespoke invitation is typically delivered within 5 to 7 business days, revisions included." },
  { q: "Can I update details after sending?", a: "Absolutely. Your invitation lives as a dynamic link — update the schedule, venue, or any detail anytime without needing to resend." },
  { q: "Is there a cap on the number of guests?", a: "Not at all. Both our Standard and Premium formulas include unlimited guest access at no extra charge." },
  { q: "Do you support multiple languages?", a: "Our Premium formula includes full multilingual support. For the Standard formula, additional languages are available as an add-on." },
  { q: "How does the RSVP system work?", a: "Each invitation features a built-in response form. Guests simply tap to confirm, decline, or share preferences like dietary needs — all tracked in your dashboard." },
];

export default function Home() {
  const carouselRef = useRef(null);
  const heroMockupRef = useRef(null);
  const [showCta, setShowCta] = useState(false);

  const handleSimulationScroll = () => {
    if (heroMockupRef.current) {
      setTimeout(() => {
        heroMockupRef.current.scrollTo({ top: 600, behavior: 'smooth' });
      }, 1500);
    }
  };

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
            <span className="label animate-fade-in-up">Bespoke Digital Invitations</span>
            <h1 className="heading-xl animate-fade-in-up delay-1">
              Premium Digital Wedding Invitations & Guest Tracking
            </h1>
            <p className="text-lg animate-fade-in-up delay-2">
              We design fully personalized, interactive digital invitations with integrated RSVP, custom photo galleries, and real-time guest management — tailored to tell your story and simplify your planning.
            </p>
            <div className={`${styles.heroCtas} animate-fade-in-up delay-3`}>
              <Link href="/collections" className="btn-primary">Begin Your Story</Link>
              <Link href="/collections" className="btn-secondary">View Collections</Link>
            </div>
            <div className={`${styles.heroFeatures} animate-fade-in-up delay-4`}>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Starting at $49.90</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Smart RSVP Tracking</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>No Guest Limits</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Dedicated Concierge</span>
              </div>
            </div>
          </div>
          <div className={`${styles.heroPhone} animate-fade-in-up delay-2`}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneScreen}>
                <div ref={heroMockupRef} className="hide-scrollbar" style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                  <div className={styles.mockupContent}>
                    <BordeauxTemplate 
                      autoPlaySimulation={true} 
                      onEnvelopeDismissed={handleSimulationScroll}
                      editMode={false}
                      heroHeight="820px"
                      data={{
                        partner1: "Léa",
                        partner2: "Max",
                        videos: {
                          envelope: "https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8",
                          hero: "https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4"
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
            <span className="label">Collections</span>
            <h2 className="heading-lg">Explore Our Curated Design Universes</h2>
            <p className="text-lg">Each collection is a world of its own — crafted to express your unique love story.</p>
          </div>
        </div>
        <div className={styles.carouselContainer}>
          <button className={styles.carouselArrow} onClick={() => scrollCarousel(-1)} aria-label="Scroll left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="carousel-wrapper">
            <div className="carousel-track" ref={carouselRef}>
              {carouselItems.map((item, i) => (
                <Link href="/collections" key={i} style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}>
                  <div className="carousel-card" style={{ paddingBottom: '2rem', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                    <div className={styles.phoneFrame} style={{ width: '240px', height: '490px', margin: '0 auto' }}>
                      <div className={styles.phoneNotch}></div>
                      <div className={styles.phoneScreen}>
                        <TemplateHeroPreview 
                          partner1={item.partner1} 
                          partner2={item.partner2} 
                          date={item.date}
                          videoSrc={item.video} 
                          envelopeSrc={item.envelope}
                          showEnvelope={i % 3 === 0}
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
          <Link href="/collections" className="btn-secondary">Browse All Collections</Link>
        </div>
      </section>

      {/* ===================== METHOD ===================== */}
      <section className={styles.methodSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Our Approach</span>
            <h2 className="heading-lg">From Vision to Masterpiece, Step by Step</h2>
            <p className="text-lg">A thoughtful journey where your ideas become an unforgettable experience.</p>
          </div>
          <div className={styles.methodGrid}>
            {[
              { num: '01', title: 'Discovery Session', desc: 'An in-depth conversation to explore your vision, aesthetic preferences, and every question on your mind.' },
              { num: '02', title: 'Curate Your Content', desc: 'Share your photos, schedule, venue details, and RSVP preferences — we walk you through it all.' },
              { num: '03', title: 'We Design Your Experience', desc: 'Our team brings your invitation to life, iterating on every detail until it feels perfect.' },
              { num: '04', title: 'Launch & Celebrate', desc: 'Receive your polished invitation link and share it effortlessly with every guest on your list.' },
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
            <span className="label">Formulas</span>
            <h2 className="heading-lg">Select the Perfect Formula for Your Day</h2>
            <p className="text-lg">Handcrafted packages tailored to bring your wedding story to life digitally.</p>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">Standard</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem' }}>Everything you need for an elegant, expertly guided invitation.</p>
                <div className={styles.pricingPrice}>$49.90</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Choice of design universe</li>
                  <li><span className={styles.checkIcon}>✓</span> Your colors & info applied</li>
                  <li><span className={styles.checkIcon}>✓</span> Integrated RSVP</li>
                  <li><span className={styles.checkIcon}>✓</span> Live guest dashboard</li>
                  <li><span className={styles.checkIcon}>✓</span> Unlimited guests</li>
                  <li><span className={styles.checkIcon}>✓</span> 2 design revisions</li>
                </ul>
              </div>
              <Link href="/collections" className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>Choose This Formula</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingBadge}>Editor's Choice</div>
              <div>
                <h3 className="heading-md">Premium</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem', opacity: 0.7 }}>The ultimate bespoke experience with premium customization.</p>
                <div className={styles.pricingPrice}>$290</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Template redesigned to your style</li>
                  <li><span className={styles.checkIcon}>✓</span> Custom icons & typography</li>
                  <li><span className={styles.checkIcon}>✓</span> Includes Video & Music</li>
                  <li><span className={styles.checkIcon}>✓</span> Integrated photo gallery</li>
                  <li><span className={styles.checkIcon}>✓</span> Unlimited blocks & revisions</li>
                  <li><span className={styles.checkIcon}>✓</span> Direct contact with designer</li>
                </ul>
              </div>
              <Link href="/collections" className="btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem', backgroundColor: 'var(--color-foreground)', color: 'var(--color-background)', borderColor: 'var(--color-foreground)' }}>Choose This Formula</Link>
            </div>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">Custom</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem' }}>100% bespoke design from scratch with editorial art direction.</p>
                <div className={styles.pricingPrice}>$490</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> 100% custom layout design</li>
                  <li><span className={styles.checkIcon}>✓</span> Editorial art direction</li>
                  <li><span className={styles.checkIcon}>✓</span> Advanced custom interactions</li>
                  <li><span className={styles.checkIcon}>✓</span> Dedicated concierge manager</li>
                  <li><span className={styles.checkIcon}>✓</span> All languages supported</li>
                  <li><span className={styles.checkIcon}>✓</span> Everything in Premium</li>
                </ul>
              </div>
              <Link href="/collections" className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>Choose This Formula</Link>
            </div>
          </div>
          <div className={styles.pricingAddons}>
            <p className="text-sm"><strong>Essential add-ons:</strong> Video cover — $19 · Custom music — $19 · Extra language — $19 · Multi-group management — $29</p>
          </div>
        </div>
      </section>

      {/* ===================== RSVP DASHBOARD ===================== */}
      <section className={styles.dashboardSection}>
        <div className="container">
          <div className={styles.dashboardInner}>
            <div className={styles.dashboardText}>
              <span className="label">Live Dashboard</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>Your Wedding Command Center</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>Track every RSVP, dietary preference, and guest status in real time — beautifully organized and always at your fingertips.</p>
              <div className={styles.dashboardStats}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>127</span>
                  <span className={styles.statLabel}>Attending</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>14</span>
                  <span className={styles.statLabel}>Declined</span>
                </div>
              </div>
              <ul className={styles.dashboardFeatures}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Live response tracking
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Organized by status at a glance
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  One-click data export
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Mobile-optimized access
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
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>Confirmed</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Clara & Thomas</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>Confirmed</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#EE9441' }}></div>
                    <span>Marie Dupont</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(238, 148, 65, 0.1)', color: '#EE9441' }}>Pending</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#e74c3c' }}></div>
                    <span>Paul Martin</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}>Declined</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Emma Laurent</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>Confirmed</span>
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
            <span className="label">Love Letters</span>
            <h2 className="heading-lg">Cherished by Couples Worldwide</h2>
            <p className="text-lg">Hear from the couples who trusted us with their most important day.</p>
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
              <span className="label">Studio Access</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>Want to Build Your Invitation Independently?</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                The FOLDÈ Studio gives you full creative control — fill in details, pick your collection, and shape your invitation at your own rhythm.
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
                  Smart RSVP & live dashboard — track confirmations from your space
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  At your own pace — come back and edit whenever you like
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link href="/collections" className="btn-primary">Order Now</Link>
                <Link href="/studio" className="btn-secondary">Enter the Studio</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">FAQ</span>
            <h2 className="heading-lg">Common Questions, Clear Answers</h2>
            <p className="text-lg">Everything you need to know before we begin.</p>
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
          <h2 className="heading-lg">Let's Bring Your Vision to Life</h2>
          <p className="text-lg" style={{ marginTop: '0.5rem' }}>Bespoke experiences from $49.90</p>
          <Link href="/collections" className="btn-primary" style={{ marginTop: '2rem' }}>Begin Your Journey</Link>
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
          <h2 className="heading-lg" style={{ fontSize: '2rem' }}>Let's Start a Conversation</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem', color: '#888', lineHeight: 1.7 }}>
            Whether you're exploring ideas or ready to begin, our creative team is here to guide you every step of the way.
          </p>
          <a href="mailto:contact@foldedesign.com" className={styles.contactEmail}>
            contact@foldedesign.com
          </a>
          <div className={styles.contactDivider}>
            <div className={styles.contactDividerLine}></div>
            <span>or</span>
            <div className={styles.contactDividerLine}></div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Responses within a few hours ✨
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
          Begin your story →
        </Link>
      </div>
    </div>
  );
}
