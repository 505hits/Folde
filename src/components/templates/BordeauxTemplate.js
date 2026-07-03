"use client";

import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import styles from './BordeauxTemplate.module.css';

// Hook for scroll animations
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isVisible];
}

const AnimatedSection = ({ children, className = '', type = 'fade', style = {} }) => {
  const [ref, isVisible] = useScrollAnimation();
  const animClass = type === 'zoom' ? styles.animateZoom : styles.animateText;
  return (
    <div ref={ref} className={`${animClass} ${isVisible ? styles.visible : ''} ${className}`} style={style}>
      {typeof children === 'function' ? children(isVisible) : children}
    </div>
  );
};

// 3D Coverflow Gallery Component
const GalleryCoverflow = ({ images }) => {
  const trackRef = useRef(null);
  const [stylesList, setStylesList] = useState([]);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    
    const newStyles = Array.from(track.children).map(child => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(trackCenter - childCenter);
      const maxDist = track.clientWidth / 1.5;
      const ratio = Math.max(0, 1 - distance / maxDist);
      
      const scale = 0.85 + (ratio * 0.15);
      const opacity = 0.4 + (ratio * 0.6);
      const rotateY = ((childCenter - trackCenter) / maxDist) * -30;
      const zIndex = Math.round(ratio * 100);
      
      return {
        transform: `perspective(1200px) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        zIndex,
        /* Removing transition for raw 60fps tracking */
      };
    });
    setStylesList(newStyles);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [images]);

  return (
    <div 
      ref={trackRef}
      className={styles.galleryTrack} 
      onScroll={handleScroll}
      style={{ perspective: '1200px' }}
    >
      {images.map((img, i) => (
        <div key={i} className={styles.galleryItem} style={stylesList[i] || {}}>
          <img src={img} alt={`Memory ${i}`} />
        </div>
      ))}
    </div>
  );
};

export default function BordeauxTemplate({ data, editMode = false, autoPlaySimulation = false, onEnvelopeDismissed, heroHeight = '100vh' }) {
  const [isMuted, setIsMuted] = useState(true);
  const [accompaniedStatus, setAccompaniedStatus] = useState("");
  
  // Envelope State
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeDismissed, setEnvelopeDismissed] = useState(false);
  const envelopeVideoRef = useRef(null);

  useEffect(() => {
    // Setup HLS for the envelope video
    const video = envelopeVideoRef.current;
    if (!video) return;

    const src = data?.videos?.envelope || "https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8";

    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1, // Use auto quality
        capLevelToPlayerSize: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else {
      // Fallback for Safari which natively supports HLS, or direct mp4/webm links
      video.src = src;
    }
  }, [data?.videos?.envelope]);

  useEffect(() => {
    if (autoPlaySimulation) {
      const timer = setTimeout(() => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);
        if (envelopeVideoRef.current) {
          envelopeVideoRef.current.play().catch(e => console.log("Video play failed", e));
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlaySimulation, envelopeOpen]);

  // Valeurs par défaut si `data` est vide
  const t = data || {};
  const partner1 = t.partner1 || "Gregory";
  const partner2 = t.partner2 || "Isabelle";
  const showPartner2 = t.showPartner2 !== false;
  const dateStr = t.date || "MAY 27, 2026";
  const ceremonyVenue = t.ceremonyVenue || "Ocean front beach House";
  const receptionVenue = t.receptionVenue || "South Dixie Highway, Homestead, Miami-Dade County, Florida, 33030, United States";
  
  // Default structure for complex fields
  const timeline = t.timeline || [
    { time: "14:00", title: "Lunch" },
    { time: "18:00", title: "Ceremony" },
    { time: "20:00", title: "Dinner" },
    { time: "22:00", title: "Party" },
    { time: "04:00", title: "End" }
  ];

  const accommodations = t.accommodations || [
    { name: "Hotel Costa", price: "410$" },
    { name: "Hotel Love", price: "120$" }
  ];

  const menu = t.menu || [
    { course: "Starter", dish: "Caviar" },
    { course: "Main", dish: "Steak friete" },
    { course: "Dessert", dish: "Dame blanche" }
  ];

  const sections = t.sections || {
    showIntro: true,
    showVenue: true,
    showSchedule: true,
    showBoardingPass: true,
    showRSVP: true,
    showGallery: true
  };

  const images = t.images || {};
  const videos = t.videos || {};
  const sounds = t.sounds || {};
  const gallery = t.gallery || [];
  const guestGallery = t.guestGallery && t.guestGallery.length > 0 ? t.guestGallery : [
    "/images/couple_beach_sunset_1782995185709.png",
    "/images/couple_elegant_dinner_1782995195329.png",
    "/images/couple_forest_walk_1782995203954.png",
    "/images/couple_cafe_smile_1782995212728.png"
  ];

  const ChevronIcon = () => (
    <svg className={styles.selectChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const handleEnvelopeClick = () => {
    if (envelopeOpen) return; // Prevent double clicks
    
    setEnvelopeOpen(true);
    if (envelopeVideoRef.current) {
      envelopeVideoRef.current.play().catch(e => console.log("Video play failed", e));
    }
  };

  const handleVideoEnded = () => {
    setEnvelopeDismissed(true);
    if (onEnvelopeDismissed) onEnvelopeDismissed();
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        
        {/* ================= HERO SECTION ================= */}
        <section className={styles.hero} style={{ height: heroHeight, minHeight: heroHeight }}>
          {/* ================= ENVELOPE OVERLAY ================= */}
          {!editMode && !envelopeDismissed && (
            <div 
              className={`${styles.envelopeOverlay} ${envelopeOpen ? styles.opening : ''} ${envelopeDismissed ? styles.dismissed : ''}`} 
              onClick={handleEnvelopeClick}
            >
              <video 
                ref={envelopeVideoRef}
                className={styles.envelopeVideo}
                muted
                playsInline
                onEnded={handleVideoEnded}
              />
            </div>
          )}

          {images.hero ? (
            <img src={images.hero} alt="Hero" className={styles.heroVideo} style={{ objectFit: 'cover' }} />
          ) : (
            <video
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className={styles.heroVideo}
              src={videos.hero || "https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4"}
            />
          )}
          {sounds.intro && !isMuted && (
            <audio src={sounds.intro} autoPlay loop />
          )}
          <div className={styles.heroOverlay}></div>
          
          <div className={styles.heroContent}>
            <AnimatedSection type="zoom">
              <h1 className={styles.heroNames}>
                {partner1.toUpperCase()} <br/>
                {showPartner2 && (
                  <>
                    <span className={styles.heroAmpersand}>&amp;</span> <br/>
                    {partner2.toUpperCase()}
                  </>
                )}
              </h1>
            </AnimatedSection>
            
            <div className={styles.heroSubInfo}>
              <AnimatedSection type="fade" style={{ animationDelay: '0.2s' }}>
                <h2 className={styles.heroTitle}>Wedding Day</h2>
              </AnimatedSection>
              
              <AnimatedSection type="fade" style={{ animationDelay: '0.4s' }}>
                <div className={styles.heroDivider}>
                  <div className={styles.heroLine}></div>
                  <div className={styles.heroDiamond}></div>
                  <div className={styles.heroLine}></div>
                </div>
              </AnimatedSection>

              <AnimatedSection type="fade" style={{ animationDelay: '0.6s' }}>
                <p className={styles.heroDate}>{dateStr.toUpperCase()}</p>
              </AnimatedSection>
            </div>
          </div>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={styles.muteBtn}
          >
            {isMuted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
          </button>
        </section>

        {/* ================= INTRO SECTION ================= */}
        {sections.showIntro !== false && (
          <section className={styles.intro}>
          <AnimatedSection type="fade">
            <h2 className={styles.introTitle}>The Day Has Arrived!</h2>
          </AnimatedSection>
          <AnimatedSection type="fade" style={{ animationDelay: '0.2s' }}>
            <p className={styles.introSubtitle}>we can't wait to celebrate with you</p>
          </AnimatedSection>
          </section>
        )}

        {/* ================= VENUE SECTION ================= */}
        {sections.showVenue !== false && (
          <section className={styles.venue}>
          <AnimatedSection type="fade">
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5a2 2 0 012-2h2a2 2 0 012 2v5M12 11v.01"></path></svg>
          </AnimatedSection>
          
          <AnimatedSection type="fade">
            <h2 className={styles.venueTitle}>Venue</h2>
          </AnimatedSection>

          <AnimatedSection type="zoom" className={styles.mapContainer}>
             {images.venue ? (
               <img src={images.venue} alt="Venue" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px' }} />
             ) : (
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114562.59371060975!2d-80.5218764024827!3d25.467471960244793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9e666a7b73cc3%3A0x600989f66fc108b3!2sHomestead%2C%20FL%2C%20USA!5e0!3m2!1sen!2sfr!4v1700000000000!5m2!1sen!2sfr" 
                 width="100%" 
                 height="250" 
                 style={{border:0, display:'block'}} 
                 allowFullScreen="" 
                 loading="lazy">
               </iframe>
             )}
          </AnimatedSection>

          <AnimatedSection type="fade">
            <h3 className={styles.venueName}>{ceremonyVenue}</h3>
          </AnimatedSection>

          <AnimatedSection type="fade">
            <p className={styles.venueAddress}>{receptionVenue}</p>
          </AnimatedSection>

          <AnimatedSection type="fade">
            <a href="https://maps.google.com/?q=South+Dixie+Highway,+Homestead" target="_blank" rel="noopener noreferrer" className={styles.btnDirections}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              Get directions
            </a>
          </AnimatedSection>
          </section>
        )}

        {/* ================= SCHEDULE SECTION ================= */}
        {sections.showSchedule !== false && (
          <section className={styles.schedule}>
          <AnimatedSection type="fade">
            <h2 className={styles.marbella}>Marbella</h2>
          </AnimatedSection>
          
          <AnimatedSection type="fade">
            <h3 className={styles.scheduleTitle}>Schedule</h3>
          </AnimatedSection>
          
          <AnimatedSection type="fade">
            <p className={styles.scheduleSubtitle}>What we have planned for you</p>
          </AnimatedSection>

          <AnimatedSection type="fade">
            {(isVisible) => (
              <div className={styles.timeline}>
                <div className={`${styles.timelineLine} ${isVisible ? styles.visible : ''}`}></div>
                
                {/* Airplane flying down the timeline */}
                <svg className={`${styles.timelinePlane} ${isVisible ? styles.visible : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>

                {timeline.map((item, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineLeft}>
                      <h4 className={styles.timelineEvent}>{item.title}</h4>
                    </div>
                    <div className={`${styles.timelineDot} ${isVisible ? styles.visible : ''}`} style={{ animationDelay: `${idx * 0.2 + 0.5}s` }}></div>
                    <div className={styles.timelineRight}>
                      <p className={styles.timelineTime}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>
          </section>
        )}

        {/* ================= DRESS CODE SECTION ================= */}
        {sections.showDressCode !== false && (
          <section className={styles.dressCodeSection}>
            <AnimatedSection type="zoom">
              <div className={styles.dressCodeContainer} style={{ textAlign: 'center', margin: '4rem 0', padding: '0 2rem' }}>
                <h2 className={styles.dressCodeTitle} style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Dress Code</h2>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                  <img src={t.dressCode?.image || "/images/dress_code_floral.png"} alt="Dress Code Inspiration" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  {t.dressCode?.text && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '3rem 1.5rem 1.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center'
                    }}>
                      <p style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '2.5rem', 
                        color: '#ffffff', 
                        margin: 0,
                        textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        lineHeight: 1.1
                      }}>
                        {t.dressCode.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </section>
        )}

        {/* ================= BOARDING PASS ================= */}
        {sections.showBoardingPass !== false && (
          <section className={styles.boardingPassSection}>
          <AnimatedSection type="zoom">
            <div className={styles.boardingCard}>
              <div className={styles.bcHeader}>
                <span className={styles.bcTitle}>Boarding Pass</span>
                <svg width="16" height="16" className="rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </div>
              
              {/* Cutouts on the border between header and body */}
              <div className={styles.bcCutouts}></div>

              <div className={styles.bcBody}>
                <p className={styles.bcLabel}>Destination</p>
                <h3 className={styles.bcDest}>Miami</h3>
                
                <div className={styles.bcGrid}>
                  <div>
                    <p className={styles.bcLabel}>Gate</p>
                    <p className={styles.bcValue}>L♡V</p>
                  </div>
                  <div>
                    <p className={styles.bcLabel}>Seat</p>
                    <p className={styles.bcValue}>27.05</p>
                  </div>
                  <div>
                    <p className={styles.bcLabel}>Row</p>
                    <p className={styles.bcValue}>2026</p>
                  </div>
                  <div>
                    <p className={styles.bcLabel}>Flight</p>
                    <p className={styles.bcValue}>WED01</p>
                  </div>
                </div>

                <div className={styles.bcFooter}>
                  <div className={styles.barcode}></div>
                  <p className={styles.bcCode}>MIA27052026</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          </section>
        )}

        {/* ================= MEMORIES SECTION ================= */}
        {sections.showGallery !== false && (
          <section id="gallery" className={styles.gallery}>
            <AnimatedSection type="fade">
              <h2 className={styles.galleryTitle}>Memories</h2>
              <p className={styles.gallerySubtitle}>A glimpse into our story</p>
            </AnimatedSection>
            
            <GalleryCoverflow images={gallery && gallery.length > 0 ? gallery : [
                 "/images/couple_beach_sunset_1782995185709.png",
                 "/images/couple_elegant_dinner_1782995195329.png",
                 "/images/couple_forest_walk_1782995203954.png",
                 "/images/couple_cafe_smile_1782995212728.png"
               ]} />
          </section>
        )}

        {/* ================= RSVP SECTION ================= */}
        {sections.showRSVP !== false && (
          <section id="rsvp" className={styles.rsvp}>
          <AnimatedSection type="fade">
            <h2 className={styles.rsvpTitle}>RSVP</h2>
          </AnimatedSection>
          
          <AnimatedSection type="fade">
            <p className={styles.rsvpSubtitle}>We hope to count on you</p>
          </AnimatedSection>
          
          <AnimatedSection type="fade">
            <p className={styles.rsvpDate}>Please reply by March 30th, 2026</p>
          </AnimatedSection>

          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatedSection type="fade">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full name *</label>
                <input type="text" placeholder="Your name" className={styles.formInput} />
              </div>
            </AnimatedSection>

            <AnimatedSection type="fade">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input type="email" placeholder="your@email.com" className={styles.formInput} />
              </div>
            </AnimatedSection>

            {/* STYLIZED SELECT QUESTIONS */}
            <AnimatedSection type="fade">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Will you attend? *</label>
                <div className={styles.selectWrapper}>
                  <select className={styles.formSelect} defaultValue="">
                    <option value="" disabled hidden>Please select</option>
                    <option value="yes">Joyfully Accept</option>
                    <option value="no">Regretfully Decline</option>
                  </select>
                  <ChevronIcon />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection type="fade">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Will you be accompanied? *</label>
                <div className={styles.selectWrapper}>
                  <select 
                    className={styles.formSelect} 
                    value={accompaniedStatus}
                    onChange={(e) => setAccompaniedStatus(e.target.value)}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="alone">No, coming alone</option>
                    <option value="plusOne">Yes, with a plus one</option>
                    <option value="family">Yes, with family</option>
                  </select>
                  <ChevronIcon />
                </div>
              </div>
            </AnimatedSection>

            {(accompaniedStatus === "plusOne" || accompaniedStatus === "family") && (
              <AnimatedSection type="fade">
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {accompaniedStatus === "plusOne" ? "Name of your +1 *" : "Names of your family members *"}
                  </label>
                  <input type="text" placeholder="First names" className={styles.formInput} />
                </div>
              </AnimatedSection>
            )}

            <AnimatedSection type="fade">
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Which dish do you prefer? *</label>
                <div className={styles.selectWrapper}>
                  <select className={styles.formSelect} defaultValue="">
                    <option value="" disabled hidden>Please select</option>
                    <option value="meat">Meat (Steak friete)</option>
                    <option value="fish">Fish</option>
                    <option value="vegetarian">Vegetarian</option>
                  </select>
                  <ChevronIcon />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection type="zoom">
              <button type="submit" className={styles.btnSubmit}>
                Send RSVP
              </button>
            </AnimatedSection>
          </form>

          <AnimatedSection type="fade">
            <div className={styles.footerCredit}>
              <p>Made with Love ❤ With Our Day Studio</p>
            </div>
          </AnimatedSection>
        </section>
        )}

        {/* ================= PHOTO UPLOAD CTA (Galerie Photos) ================= */}
        {sections.showGallery !== false && (
          <section style={{ width: '100%', maxWidth: '900px', margin: '0 auto', backgroundColor: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-foreground)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '4rem 0' }}>
            <AnimatedSection type="fade" style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-foreground)' }}>Galerie Photos</h1>
                  <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', maxWidth: '400px', color: 'var(--color-muted)', padding: '0 1rem' }}>
                    Partagez vos photos et vidéos du mariage �$� avant, pendant et après la fête.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <button type="button" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '9999px', backgroundColor: 'var(--color-foreground)', color: 'var(--color-background)', padding: '0.8rem 1.5rem', fontSize: '1.1rem', cursor: 'pointer', border: 'none', transition: 'opacity 0.2s ease' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
                      <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                    Ajouter vos photos & vidéos
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginTop: '1rem', width: '280px' }}>
                    {guestGallery.map((img, idx) => (
                      <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <img src={img} alt={`Guest Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </section>
        )}

        {/* ================= VIRAL BADGE ================= */}
        {!editMode && (
          <div style={{ padding: '3rem 2rem 4rem', textAlign: 'center', backgroundColor: '#FAF9F6', display: 'flex', justifyContent: 'center' }}>
            <a href="https://ourdaystudio.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: '#888', transition: 'color 0.3s ease' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              <span style={{ height: '1px', width: '20px', backgroundColor: 'currentColor', opacity: 0.5 }}></span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontStyle: 'italic', letterSpacing: '1px' }}>
                Our Day Studio
              </span>
              <span style={{ height: '1px', width: '20px', backgroundColor: 'currentColor', opacity: 0.5 }}></span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
