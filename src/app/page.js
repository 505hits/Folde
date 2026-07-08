"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";

const carouselItems = [
  { name: 'Bordeaux', desc: 'Deep and majestic.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', partner1: 'Emma', partner2: 'Liam' },
  { name: 'Ivory', desc: 'Pure and delicate.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Olivia', partner2: 'Noah' },
  { name: 'Champagne', desc: 'Royal and sophisticated.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Ava', partner2: 'William' },
  { name: 'Terracotta', desc: 'Warm and timeless.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1774273219231.mp4', partner1: 'Sophia', partner2: 'James' },
  { name: 'Royal Bordeaux', desc: 'Intense and noble.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', partner1: 'Isabella', partner2: 'Oliver' },
  { name: 'Royal Blue', desc: 'Elegant and deep.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Mia', partner2: 'Benjamin' },
  { name: 'Sage', desc: 'Natural and refined.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Charlotte', partner2: 'Elijah' },
  { name: 'Chocolate', desc: 'Warmth and character.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Amelia', partner2: 'Lucas' },
];

const testimonials = [
  { name: "Sophie & James", text: "Our Day created something truly magical for our wedding. The digital invitation was beyond anything we imagined — elegant, immersive, and so easy for our guests.", rating: 5 },
  { name: "Amara & Ethan", text: "We received countless compliments on our invitation. The attention to detail and the personalized experience made it feel incredibly special.", rating: 5 },
  { name: "Clara & Thomas", text: "From start to finish, the process was seamless. The team understood our vision perfectly and delivered an invitation that felt authentically us.", rating: 5 },
  { name: "Léa & Marc", text: "The RSVP dashboard alone was worth it. We could track everything in real-time without chasing anyone. Absolute game-changer.", rating: 5 },
];

const faqs = [
  { q: "How long does it take to receive my invitation?", a: "After our initial consultation and once you provide all your details, your invitation is typically ready within 5 to 7 business days, including revisions." },
  { q: "Can I modify the invitation after it's been sent?", a: "Absolutely. Your invitation is a living link — you can update details like schedule, venue, or accommodations anytime without resending it." },
  { q: "Is there a limit to the number of guests?", a: "No. Both our Essential and Signature packages include unlimited guests at no additional cost." },
  { q: "What if I need the invitation in multiple languages?", a: "Our Signature package includes multilingual support. For the Essential package, additional languages can be added as an option." },
  { q: "How do guests RSVP?", a: "Each invitation includes an integrated RSVP form. Guests simply tap a button to confirm, decline, or provide additional details like dietary preferences." },
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
            <span className="label animate-fade-in-up">Your bespoke wedding invitation</span>
            <h1 className="heading-xl animate-fade-in-up delay-1">
              A Digital Invitation Crafted with Elegance
            </h1>
            <p className="text-lg animate-fade-in-up delay-2">
              We design with you an elegant, personalized, and unforgettable digital invitation — crafted to simplify your event planning and delight every guest.
            </p>
            <div className={`${styles.heroCtas} animate-fade-in-up delay-3`}>
              <Link href="/templates" className="btn-primary">Start My Project</Link>
              <Link href="/templates" className="btn-secondary">Browse Gallery</Link>
            </div>
            <div className={`${styles.heroFeatures} animate-fade-in-up delay-4`}>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>From $189</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Integrated RSVP</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Unlimited Guests</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Personal Guidance</span>
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
                        sections: { showIntro: true, showVenue: true, showSchedule: true, showBoardingPass: true, showRSVP: true, showGallery: true }
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
            <span className="label">Universe</span>
            <h2 className="heading-lg">An Elegant Preview of Our Signature Creations</h2>
            <p className="text-lg">Each design crafted to reveal your invitation with character and grace.</p>
          </div>
        </div>
        <div className={styles.carouselContainer}>
          <button className={styles.carouselArrow} onClick={() => scrollCarousel(-1)} aria-label="Scroll left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="carousel-wrapper">
            <div className="carousel-track" ref={carouselRef}>
              {carouselItems.map((item, i) => (
                <Link href="/templates" key={i} style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}>
                  <div className="carousel-card" style={{ paddingBottom: '2rem', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                    <div className={styles.phoneFrame} style={{ width: '240px', height: '490px', margin: '0 auto' }}>
                      <div className={styles.phoneNotch}></div>
                      <div className={styles.phoneScreen}>
                        <TemplateHeroPreview 
                          partner1={item.partner1} 
                          partner2={item.partner2} 
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
          <Link href="/creations" className="btn-secondary">Discover All Creations</Link>
        </div>
      </section>

      {/* ===================== METHOD ===================== */}
      <section className={styles.methodSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">How It Works</span>
            <h2 className="heading-lg">A Guided Experience, Simple and Seamless</h2>
            <p className="text-lg">Crafted to assist you at every stage of the process.</p>
          </div>
          <div className={styles.methodGrid}>
            {[
              { num: '01', title: 'Schedule a Consultation', desc: 'A discovery session to understand your vision, your style, and answer all your questions.' },
              { num: '02', title: 'Share Your Details', desc: 'Dates, schedule, photos, accommodations, RSVP — we guide you through each step.' },
              { num: '03', title: 'We Craft Your Invitation', desc: 'We design your invitation and refine every detail based on your feedback.' },
              { num: '04', title: 'Share Your Link', desc: 'Receive your finalized invitation, ready to be effortlessly shared with all your guests.' },
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
            <span className="label">Pricing</span>
            <h2 className="heading-lg">Curated Packages for Every Celebration</h2>
            <p className="text-lg">Two guided formulas to create an elegant, personalized invitation ready to share.</p>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">Essential</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem' }}>The essentials for an elegant, fully supported invitation.</p>
                <div className={styles.pricingPrice}>$189</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Guided preparation</li>
                  <li><span className={styles.checkIcon}>✓</span> Choice of design universe</li>
                  <li><span className={styles.checkIcon}>✓</span> Cover photo</li>
                  <li><span className={styles.checkIcon}>✓</span> Music from our library</li>
                  <li><span className={styles.checkIcon}>✓</span> Up to 6 custom sections</li>
                  <li><span className={styles.checkIcon}>✓</span> Integrated RSVP</li>
                  <li><span className={styles.checkIcon}>✓</span> Unlimited guests</li>
                  <li><span className={styles.checkIcon}>✓</span> Unlimited revisions</li>
                </ul>
              </div>
              <Link href="/templates" className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>Order Now</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingBadge}>Most Popular</div>
              <div>
                <h3 className="heading-md">Signature</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem', opacity: 0.7 }}>A comprehensive experience with advanced customization.</p>
                <div className={styles.pricingPrice}>$349</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> Everything in Essential</li>
                  <li><span className={styles.checkIcon}>✓</span> Custom video cover</li>
                  <li><span className={styles.checkIcon}>✓</span> Custom music track</li>
                  <li><span className={styles.checkIcon}>✓</span> Integrated photo gallery</li>
                  <li><span className={styles.checkIcon}>✓</span> Multilingual invitation</li>
                  <li><span className={styles.checkIcon}>✓</span> Multiple guest groups</li>
                  <li><span className={styles.checkIcon}>✓</span> Unlimited revisions</li>
                </ul>
              </div>
              <Link href="/templates" className="btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderColor: 'var(--color-background)' }}>Order Now</Link>
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
              <span className="label">RSVP Management</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>A Dashboard to Track Your Guest Responses</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>Visualize confirmations, declines, and pending responses from a clean interface — no endless follow-ups or messy spreadsheets.</p>
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
                  Real-time dashboard
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Confirmations, declines & pending sorted
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Export to Excel
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Accessible from your phone
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
            <span className="label">Testimonials</span>
            <h2 className="heading-lg">Trusted by Hundreds of Couples</h2>
            <p className="text-lg">Discover what our clients have to say.</p>
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
              <span className="label">Self-Service Option</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>Prefer to Prepare Your Invitation at Your Own Pace?</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                The Our Day Studio lets you fill in your details, choose your universe, and prepare your project independently — before or after a call with our team.
              </p>
              <ul className={styles.autonomousFeatures}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Guided preparation — details, schedule, RSVP, accommodations
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Our Day Universes — select a visual direction from our gallery
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  RSVP & dashboard — track confirmations from your space
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  At your own pace — come back and edit whenever you like
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link href="/templates" className="btn-primary">Order Now</Link>
                <Link href="/studio" className="btn-secondary">Access the Studio</Link>
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
            <h2 className="heading-lg">Frequently Asked Questions</h2>
            <p className="text-lg">The essentials, answered — before you get started.</p>
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
          <h2 className="heading-lg">Create Your Invitation</h2>
          <p className="text-lg" style={{ marginTop: '0.5rem' }}>Starting from $189</p>
          <Link href="/templates" className="btn-primary" style={{ marginTop: '2rem' }}>Start Your Project</Link>
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
        <Link href="/templates" style={{
          backgroundColor: '#6b363e', color: '#fff',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 1.8rem', borderRadius: '40px',
          boxShadow: '0 8px 30px rgba(107, 54, 62, 0.35), 0 4px 10px rgba(0,0,0,0.1)',
          textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap', width: 'max-content'
        }}>
          Start your invitation →
        </Link>
      </div>
    </div>
  );
}
