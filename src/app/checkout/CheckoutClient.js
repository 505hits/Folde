"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDatabase } from "@/context/DatabaseContext";

const themes = [
  { id: 'bordeaux', name: 'Bordeaux' },
  { id: 'champagne', name: 'Champagne' },
  { id: 'ivory', name: 'Ivory' },
  { id: 'sage', name: 'Sage' },
  { id: 'terracotta', name: 'Terracotta' },
  { id: 'royalbordeaux', name: 'Royal Bordeaux' },
  { id: 'royalblue', name: 'Royal Blue' },
  { id: 'chocolate', name: 'Chocolate' },
];

const packages = [
  { 
    id: 'essential', 
    name: 'Standard', 
    price: 49.90, 
    originalPrice: 99.90, 
    desc: 'Choose from our +15 exclusive templates and receive a personalized digital wedding invitation with your texts, photos and colours.',
    features: [
      'Choose 1 template from over 15 options',
      'Your colors and info applied',
      'RSVP + private dashboard',
      'All languages supported',
      'Unlimited guests included',
      '2 design revision rounds'
    ]
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: 290, 
    originalPrice: 490, 
    desc: 'We redesign and personalize any template to match the exact style of your wedding. All extras included.',
    features: [
      'Template redesigned to your style',
      'Full invitation personalization',
      'Custom icons, typography & illustrations',
      'Includes Video, Music & AI Images',
      'Unlimited blocks & revisions',
      'Direct contact with your designer',
      'All languages supported',
      'Unlimited guests included'
    ]
  },
  { 
    id: 'Custom', 
    name: 'Custom', 
    price: 490, 
    originalPrice: 890, 
    desc: '100% bespoke design from scratch with editorial art direction. A unique, one-of-a-kind piece.',
    features: [
      '100% custom design from scratch',
      'Editorial art direction',
      'Includes Video, Music & AI Images',
      'Personal concierge & priority support',
      'All languages supported',
      'Unlimited guests included',
      'Everything in Premium'
    ]
  }
];

const ENVELOPE_OPTIONS = [
  { id: 'env_bordeaux', name: 'Bordeaux Envelope', url: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/downloads/default.mp4', color: '#4a1523' },
  { id: 'env_seaview', name: 'Sea View Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', color: '#d4c5b9' },
  { id: 'env_floral', name: 'Floral Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', color: '#f5e3d7' },
  { id: 'env_luxury', name: 'Luxury Envelope', url: '/videos/champagne.mp4', color: '#e6caa6' },
  { id: 'env_royal', name: 'Royal Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', color: '#33403a' },
  { id: 'env_horizon_bordeaux', name: 'Bordeaux Horizon', url: '/videos/horizon-bordeaux.mp4', color: '#5C3A1E' },
  { id: 'env_royal_doves', name: 'Royal Doves', url: '/videos/royal-doves.mp4', color: '#e5dcd3' },
  { id: 'env_imperial_light', name: 'Imperial Light', url: '/videos/imperial-light.mp4', color: '#f3e5d8' },
  { id: 'env_golden_palace', name: 'Golden Palace', url: '/videos/golden-palace.mp4', color: '#d4af37' },
  { id: 'env_oriental_palace', name: 'Oriental Palace', url: '/videos/oriental-palace.mp4', color: '#c7b299' },
  { id: 'env_celestial_veil', name: 'Celestial Veil', url: '/videos/celestial-veil.mp4', color: '#e0e5ec' },
  { id: 'env_ivory_veil', name: 'Ivory Veil', url: '/videos/ivory-veil.mp4', color: '#f8f5f0' },
  { id: 'env_rose_veil', name: 'Rosé Veil', url: '/videos/rose-veil.mp4', color: '#f4e1e1' },
  { id: 'env_rose_bow', name: 'Rose Bow', url: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', color: '#f3d9d7' },
  { id: 'env_majestic', name: 'Majestic', url: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', color: '#7a5e42' },
  { id: 'env_custom', name: "I'll provide my own", color: '#888' },
];

const HERO_VIDEO_OPTIONS = [
  { id: 'hero_couple', name: 'Kissing Couple', url: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4' },
  { id: 'hero_seaview', name: 'Sea View', url: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4' },
  { id: 'hero_palm', name: 'Palm Zoom', url: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4' },
  { id: 'hero_car', name: 'Just Married Car', url: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4' },
  { id: 'hero_castle', name: 'Castle', url: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4' },
  { id: 'hero_royal', name: 'Royal Heritage', url: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4' },
  { id: 'hero_sea_anim', name: 'Sea Animation', url: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4' },
  { id: 'hero_sea_balcony', name: 'Seaview Balcony', url: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4' },
  { id: 'hero_custom', name: "I'll provide my own" },
];

const SECTION_OPTIONS = [
  { key: 'intro', label: 'Introduction' },
  { key: 'venue', label: 'Venue' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'dressCode', label: 'Dress Code' },
  { key: 'rsvp', label: 'RSVP' },
  { key: 'gallery', label: 'Photo Gallery' },
  { key: 'gifts', label: 'Gift Registry' },
];

const inputStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #e0dcd7',
  backgroundColor: '#faf8f5',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
};

const labelStyle = {
  fontSize: '0.8rem',
  color: '#888',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
  display: 'block',
};

export default function CheckoutClient() {
  const router = useRouter();
  const { currentUser, register, login, createOrder } = useDatabase();

  // Essential flow: 1=Package, 2=Details, 3=Summary → pay → /success
  // Premium/Custom: 1=Package, 2=Details, 3=Summary → pay → 4=Wedding form → send email → done
  const [step, setStep] = useState(1);

  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

  // Account details (shared by all)
  const [account, setAccount] = useState({ name: '', partnerName: '', email: '', password: 'welcome123' });
  const [authError, setAuthError] = useState('');

  // Premium/Custom wedding form (shown AFTER payment)
  const [premiumForm, setPremiumForm] = useState({
    phone: '',
    weddingDate: '',
    weddingVenue: '',
    weddingCity: '',
    guestCount: '',
    envelopeChoice: '',
    heroVideoChoice: '',
    languages: '',
    colorPreferences: '',
    specialRequests: '',
    inspirationLinks: '',
    sectionsWanted: ['intro', 'venue', 'schedule', 'rsvp', 'gallery'],
    menuDetails: '',
    menuFile: null,        // { name, content (base64) }
    galleryPhotos: [],     // Array of { name, content (base64) }
    customHeroVideo: null, // { name, content (base64) }
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (field === 'galleryPhotos') {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              content: reader.result.split(',')[1] // Strip prefix
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(newPhotos => {
        setPremiumForm(prev => ({
          ...prev,
          galleryPhotos: [...prev.galleryPhotos, ...newPhotos]
        }));
      });
    } else if (field === 'customHeroVideo' || field === 'menuFile') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPremiumForm(prev => ({
          ...prev,
          [field]: {
            name: file.name,
            size: file.size,
            type: file.type,
            content: reader.result.split(',')[1] // Strip prefix
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isPremiumOrCustom = selectedPackage.id === 'premium' || selectedPackage.id === 'Custom';

  useEffect(() => {
    if (currentUser) {
      setAccount({
        name: currentUser.name || '',
        partnerName: currentUser.partnerName || '',
        email: currentUser.email || '',
        password: currentUser.password || ''
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('selectedTemplate');
    if (saved && themes.find(t => t.id === saved)) {
      setSelectedTheme(saved);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get('plan');
      if (plan) {
        const found = packages.find(p => p.id === plan);
        if (found) setSelectedPackage(found);
      }
    }
  }, []);

  const total = selectedPackage.price;
  const originalTotal = selectedPackage.originalPrice;
  const themeName = themes.find(t => t.id === selectedTheme)?.name || 'Editorial';

  const handleNextStep = async () => {
    setAuthError('');
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    if (step === 2) {
      if (!account.name || !account.partnerName || !account.email) {
        setAuthError('Please fill in all fields.');
        return;
      }
      if (!currentUser) {
        const result = register(account.email, account.password, account.name, account.partnerName);
        if (!result.success) {
          if (result.error === 'Email already exists' || result.error === 'Un compte existe déjà avec cet email.') {
            const loginRes = login(account.email, account.password);
            if (!loginRes.success) { setAuthError('Email exists. Incorrect password to login.'); return; }
          } else {
            setAuthError(result.error); return;
          }
        }
      }
      if (isPremiumOrCustom) {
        setStep(3); // Go to Customization Form
      } else {
        setStep(4); // Go to Summary (Standard flows skip customization)
      }
      window.scrollTo(0, 0);
      return;
    }
    if (step === 3) {
      setStep(4); // Go to Summary
      window.scrollTo(0, 0);
      return;
    }
  };

  const handleBack = () => {
    if (step === 4) {
      if (isPremiumOrCustom) {
        setStep(3); // Back to Customization Form
      } else {
        setStep(2); // Back to details
      }
    } else if (step === 3) {
      setStep(2); // Back to details
    } else if (step === 2) {
      setStep(1); // Back to package selection
    } else {
      router.push('/collections');
    }
    window.scrollTo(0, 0);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    // Create order record in mock DB
    createOrder(account.email, account.name, account.partnerName, selectedTheme, selectedPackage.name, total);

    // If Premium or Custom, send the Resend customization details email
    if (isPremiumOrCustom) {
      try {
        await handleSendOrder();
      } catch (err) {
        console.error('Error sending order details email:', err);
      }
    }

    // Simulate payment completion
    setTimeout(() => {
      setPaymentProcessing(false);
      router.push('/success');
    }, 2000);
  };

  const handleSendOrder = async () => {
    setSending(true);
    try {
      const envName = ENVELOPE_OPTIONS.find(e => e.id === premiumForm.envelopeChoice)?.name || premiumForm.envelopeChoice || 'Not specified';
      const heroName = HERO_VIDEO_OPTIONS.find(h => h.id === premiumForm.heroVideoChoice)?.name || premiumForm.heroVideoChoice || 'Not specified';

      const attachments = [];
      if (premiumForm.menuFile) {
        attachments.push({
          filename: premiumForm.menuFile.name,
          content: premiumForm.menuFile.content,
        });
      }
      if (premiumForm.customHeroVideo) {
        attachments.push({
          filename: premiumForm.customHeroVideo.name,
          content: premiumForm.customHeroVideo.content,
        });
      }
      if (premiumForm.galleryPhotos && premiumForm.galleryPhotos.length > 0) {
        premiumForm.galleryPhotos.forEach(p => {
          attachments.push({
            filename: p.name,
            content: p.content,
          });
        });
      }

      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          price: total,
          name: account.name,
          partnerName: account.partnerName,
          email: account.email,
          phone: premiumForm.phone,
          weddingDate: premiumForm.weddingDate,
          weddingVenue: premiumForm.weddingVenue,
          weddingCity: premiumForm.weddingCity,
          guestCount: premiumForm.guestCount,
          selectedTheme: themeName,
          envelopeChoice: envName,
          heroVideoChoice: heroName,
          languages: premiumForm.languages,
          colorPreferences: premiumForm.colorPreferences,
          specialRequests: premiumForm.specialRequests,
          inspirationLinks: premiumForm.inspirationLinks,
          sectionsWanted: premiumForm.sectionsWanted.map(
            k => SECTION_OPTIONS.find(s => s.key === k)?.label || k
          ),
          menuDetails: premiumForm.menuDetails,
          attachments,
        }),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      setSent(true); // Still mark as sent
    } finally {
      setSending(false);
    }
  };

  const toggleSection = (key) => {
    setPremiumForm(prev => ({
      ...prev,
      sectionsWanted: prev.sectionsWanted.includes(key)
        ? prev.sectionsWanted.filter(k => k !== key)
        : [...prev.sectionsWanted, key]
    }));
  };

  // ─── STEP 4: Payment processing overlay ───
  if (paymentProcessing) {
    return (
      <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #f0ede9', borderTopColor: '#5C3A1E', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.5rem' }}>Processing Payment</h1>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>Please wait while we secure your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#1a1a1a', position: 'relative' }}>
      <style>{`
        @media (max-width: 600px) {
          .mobile-hide { display: none !important; }
          .checkout-bottom-bar { padding: 0 1.5rem 1rem !important; }
          .checkout-box { padding: 2rem 1.5rem !important; }
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-container { padding-bottom: 90px !important; }
          input, select, textarea { width: 100% !important; box-sizing: border-box; }
        }
      `}</style>

      {/* ─── Top Header ─── */}
      {step <= 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, backgroundColor: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
          <button onClick={handleBack} style={{ background: '#fff', border: '1px solid #e0dcd7', padding: '0.45rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#555', fontSize: '0.85rem', fontFamily: 'inherit' }}>
            ← {step === 1 ? 'Templates' : 'Back'}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ✨ {selectedPackage.name}
            </div>
            {step > 1 && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {(isPremiumOrCustom ? [2, 3, 4] : [2, 4]).map(s => (
                  <div key={s} style={{ width: '32px', height: '3px', borderRadius: '2px', backgroundColor: step >= s ? '#5C3A1E' : '#e0dcd7' }}></div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: '1rem' }}>
            <span style={{ textDecoration: 'line-through', opacity: 0.4, marginRight: '0.4rem', fontSize: '0.85rem' }}>{originalTotal}$</span>
            <span style={{ fontWeight: 700 }}>{total}$</span>
          </div>
        </div>
      )}

      <div className="checkout-container" style={{ maxWidth: '600px', margin: '0 auto', padding: step === 4 ? '0' : '3rem 1.5rem 120px' }}>
        
        {/* ═══ STEP 1: PACKAGE ═══ */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>Choose your package</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Select the level of service you need.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map(p => (
                <div key={p.id} onClick={() => setSelectedPackage(p)}
                  style={{
                    backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', cursor: 'pointer',
                    border: selectedPackage.id === p.id ? '2px solid #5C3A1E' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: selectedPackage.id === p.id ? '0 8px 24px rgba(107,54,62,0.08)' : 'none',
                    transition: 'all 0.2s ease', position: 'relative'
                  }}>
                  {selectedPackage.id === p.id && (
                    <div style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                  )}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your plan</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>{p.name}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#aaa' }}>{p.originalPrice}$</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#5C3A1E' }}>{p.price}$</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.75rem', lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                  <div style={{ borderTop: '1px solid #f0ede9', paddingTop: '1.5rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {p.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: '#444' }}>
                          <span style={{ color: '#b08968', marginTop: '2px' }}>✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {(p.id === 'premium' || p.id === 'Custom') && selectedPackage.id === p.id && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#faf5f0', borderRadius: '10px', border: '1px solid #e8ddd4', fontSize: '0.8rem', color: '#8b6e5a', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1rem' }}>🎨</span>
                      <span>We handle everything for you! After payment, you'll fill in your wedding details and our design team will craft your invitation.</span>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ backgroundColor: '#faf8f5', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', marginTop: '1rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.2rem', color: '#5C3A1E' }}>🤍</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#555', marginBottom: '0.25rem' }}>YOU'LL-LOVE-IT PROMISE</div>
                  <div style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>We work with you, revision after revision, until your invitation moves you. You won't share it with the world until every detail feels exactly the way you dreamed it.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: ACCOUNT ═══ */}
        {step === 2 && (
          <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#5C3A1E' }}>Your Wedding Space</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Enter your details to automatically create your private dashboard to track RSVPs and customize your invitation.</p>
            </div>
            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Your first name" value={account.name} onChange={e => setAccount({...account, name: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="Your partner's first name" value={account.partnerName} onChange={e => setAccount({...account, partnerName: e.target.value})} style={inputStyle} />
            </div>
            <input type="email" placeholder="Your email address" value={account.email} onChange={e => setAccount({...account, email: e.target.value})} style={inputStyle} />
            {authError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>{authError}</div>}
          </div>
        )}

        {/* ═══ STEP 4: SUMMARY ═══ */}
        {step === 4 && (
          <div>
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>YOUR INVITATION</div>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#5C3A1E', fontStyle: 'italic' }}>{selectedPackage.name}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: '1px solid #e0dcd7', paddingBottom: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>PLAN</span>
                  <div style={{ flex: 1, borderBottom: '1px dotted #ccc', margin: '0 1rem' }}></div>
                  <span style={{ fontWeight: 600 }}>{selectedPackage.name}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>TOTAL</span>
                <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#5C3A1E' }}>{total}$</span>
              </div>
              {isPremiumOrCustom ? (
                <div style={{ backgroundColor: '#faf5f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem', border: '1px solid #e8ddd4' }}>
                  <div style={{ fontSize: '1.25rem' }}>🎨</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#8b6e5a', marginBottom: '0.25rem', textTransform: 'uppercase' }}>What happens next?</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
                      1. You complete the payment.<br/>
                      2. Our design team immediately begins crafting your custom invitation using the details you provided.<br/>
                      3. We collaborate and refine the invitation together until it is absolutely perfect.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#faf5f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem', border: '1px solid #e8ddd4' }}>
                  <div style={{ fontSize: '1.25rem' }}>✨</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#8b6e5a', marginBottom: '0.25rem', textTransform: 'uppercase' }}>What happens next?</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
                      1. You complete the payment.<br/>
                      2. You gain instant access to your private dashboard.<br/>
                      3. Choose your template and enter your wedding details.<br/>
                      4. Publish your invitation and start receiving RSVPs!
                    </div>
                  </div>
                </div>
              )}
              <div style={{ backgroundColor: '#faf8f5', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ fontSize: '1.2rem', color: '#5C3A1E' }}>🤍</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#555', marginBottom: '0.25rem' }}>YOU'LL-LOVE-IT PROMISE</div>
                  <div style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>We revise with you until every detail moves you. You won't share it until it feels exactly the way you dreamed.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: WEDDING FORM (after payment, Premium/Custom only) ═══ */}
        {step === 4 && (
          <div style={{ padding: '2rem 1.5rem 3rem' }}>

            {/* Success banner */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '2rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(107,54,62,0.2)' }}>✓</div>
              <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.5rem' }}>Payment Confirmed!</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Now tell us about your wedding so we can start crafting your invitation.
              </p>
            </div>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2d8a4e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem', boxShadow: '0 4px 16px rgba(45,138,78,0.2)' }}>✓</div>
                <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '1rem' }}>Details Sent!</h2>
                <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Thank you! Our design team has received your wedding details. We'll get in touch within 24 hours to start bringing your vision to life.
                </p>
                <button onClick={() => router.push('/')} style={{ backgroundColor: '#5C3A1E', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px' }}>
                  BACK TO HOME
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Wedding Details */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>💒 Wedding Details</div>
                  <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Wedding date</label>
                      <input type="date" value={premiumForm.weddingDate} onChange={e => setPremiumForm({...premiumForm, weddingDate: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Guest count</label>
                      <input type="text" placeholder="e.g. 120" value={premiumForm.guestCount} onChange={e => setPremiumForm({...premiumForm, guestCount: e.target.value})} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Venue name</label>
                    <input type="text" placeholder="e.g. Château de Versailles" value={premiumForm.weddingVenue} onChange={e => setPremiumForm({...premiumForm, weddingVenue: e.target.value})} style={inputStyle} />
                  </div>
                  <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>City / Country</label>
                      <input type="text" placeholder="e.g. Paris, France" value={premiumForm.weddingCity} onChange={e => setPremiumForm({...premiumForm, weddingCity: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Languages</label>
                      <input type="text" placeholder="e.g. French, English" value={premiumForm.languages} onChange={e => setPremiumForm({...premiumForm, languages: e.target.value})} style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>📱 Contact</div>
                  <label style={labelStyle}>Phone number (for WhatsApp or call)</label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" value={premiumForm.phone} onChange={e => setPremiumForm({...premiumForm, phone: e.target.value})} style={inputStyle} />
                </div>

                {/* Design Preferences (Visual selectors) */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>🎨 Envelope Choice</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {ENVELOPE_OPTIONS.map(e => {
                      const isSelected = premiumForm.envelopeChoice === e.id;
                      return (
                        <div key={e.id} onClick={() => setPremiumForm({...premiumForm, envelopeChoice: e.id})}
                          style={{
                            border: isSelected ? '2.5px solid #5C3A1E' : '1px solid #e0dcd7',
                            borderRadius: '12px', padding: '0.5rem', cursor: 'pointer',
                            backgroundColor: isSelected ? '#faf5f6' : '#fff',
                            transition: 'all 0.2s', textAlign: 'center'
                          }}>
                          <div style={{ height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: e.color || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {e.url && !e.url.endsWith('.m3u8') && e.id !== 'env_custom' ? (
                              <video src={e.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : e.id === 'env_custom' ? (
                              <span style={{ fontSize: '1.5rem' }}>📤</span>
                            ) : (
                              <div style={{ width: '100%', height: '100%', backgroundColor: e.color }} />
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', color: isSelected ? '#5C3A1E' : '#333', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {e.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Envelope File Upload */}
                  {premiumForm.envelopeChoice === 'env_custom' && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', border: '2px dashed #e0dcd7', borderRadius: '12px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>✉️</span>
                        <span style={{ fontSize: '0.85rem', color: '#5C3A1E', fontWeight: 600 }}>Click to upload envelope video (.mp4)</span>
                        <input type="file" accept="video/mp4" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPremiumForm(prev => ({
                                ...prev,
                                envelopeChoice: `Custom Uploaded: ${file.name}`
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}

                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>🎬 Hero Video Choice</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {HERO_VIDEO_OPTIONS.map(h => {
                      const isSelected = premiumForm.heroVideoChoice === h.id;
                      return (
                        <div key={h.id} onClick={() => setPremiumForm({...premiumForm, heroVideoChoice: h.id})}
                          style={{
                            border: isSelected ? '2.5px solid #5C3A1E' : '1px solid #e0dcd7',
                            borderRadius: '12px', padding: '0.5rem', cursor: 'pointer',
                            backgroundColor: isSelected ? '#faf5f6' : '#fff',
                            transition: 'all 0.2s', textAlign: 'center'
                          }}>
                          <div style={{ height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {h.url && h.id !== 'hero_custom' ? (
                              <video src={h.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '1.5rem' }}>📤</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', color: isSelected ? '#5C3A1E' : '#333', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {h.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Hero Video File Upload */}
                  {premiumForm.heroVideoChoice === 'hero_custom' && (
                    <div style={{ marginBottom: '2rem', padding: '1.2rem', border: '2px dashed #e0dcd7', borderRadius: '12px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>🎥</span>
                        <span style={{ fontSize: '0.85rem', color: '#5C3A1E', fontWeight: 600 }}>Click to upload custom hero video (.mp4)</span>
                        <input type="file" accept="video/mp4" onChange={(e) => handleFileChange(e, 'customHeroVideo')} style={{ display: 'none' }} />
                      </label>
                      {premiumForm.customHeroVideo && (
                        <div style={{ fontSize: '0.8rem', color: '#2d8a4e', marginTop: '0.5rem', fontWeight: 600 }}>
                          Selected: {premiumForm.customHeroVideo.name} ({(premiumForm.customHeroVideo.size / (1024*1024)).toFixed(2)} MB)
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label style={labelStyle}>Color preferences</label>
                    <input type="text" placeholder="e.g. Blush pink, gold, ivory" value={premiumForm.colorPreferences} onChange={e => setPremiumForm({...premiumForm, colorPreferences: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                {/* Photo Gallery Upload */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>📸 Photo Gallery</div>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Upload photos you want us to include in your gallery (Max 10 photos)</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {premiumForm.galleryPhotos.map((photo, index) => (
                      <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0dcd7' }}>
                        <img src={`data:${photo.type};base64,${photo.content}`} alt="Gallery preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => {
                          setPremiumForm(prev => ({
                            ...prev,
                            galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index)
                          }));
                        }} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', cursor: 'pointer' }}>
                          ✕
                        </button>
                      </div>
                    ))}
                    {premiumForm.galleryPhotos.length < 10 && (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', minHeight: '60px' }}>
                        <span style={{ fontSize: '1.2rem', color: '#888' }}>+</span>
                        <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'galleryPhotos')} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Menu Details & Upload */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>🍽️ Menu & Reception details</div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Write your menu courses / details</label>
                    <textarea placeholder="Appetizers, main courses, desserts, dietary options..." value={premiumForm.menuDetails} onChange={e => setPremiumForm({...premiumForm, menuDetails: e.target.value})} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div style={{ padding: '1rem', border: '2px dashed #e0dcd7', borderRadius: '12px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                      <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
                      <span style={{ fontSize: '0.85rem', color: '#5C3A1E', fontWeight: 600 }}>Upload menu file (PDF, Image)</span>
                      <input type="file" accept="application/pdf,image/*" onChange={(e) => handleFileChange(e, 'menuFile')} style={{ display: 'none' }} />
                    </label>
                    {premiumForm.menuFile && (
                      <div style={{ fontSize: '0.8rem', color: '#2d8a4e', marginTop: '0.5rem', fontWeight: 600 }}>
                        Selected: {premiumForm.menuFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sections */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>📋 Invitation Sections</div>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Select the sections you want</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {SECTION_OPTIONS.map(s => (
                      <div key={s.key} onClick={() => toggleSection(s.key)}
                        style={{
                          padding: '0.85rem 1rem', borderRadius: '12px',
                          border: premiumForm.sectionsWanted.includes(s.key) ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                          backgroundColor: premiumForm.sectionsWanted.includes(s.key) ? '#fbf5f6' : '#faf8f5',
                          cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.15s ease',
                        }}>
                        <span style={{ color: premiumForm.sectionsWanted.includes(s.key) ? '#5C3A1E' : '#ccc', fontSize: '0.9rem' }}>
                          {premiumForm.sectionsWanted.includes(s.key) ? '✓' : '○'}
                        </span>
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra Notes */}
                <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>💬 Additional Details & Notes</div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Inspiration links</label>
                    <textarea placeholder="Share any Pinterest boards, Instagram posts, or websites you love..." value={premiumForm.inspirationLinks} onChange={e => setPremiumForm({...premiumForm, inspirationLinks: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Details / requests to add</label>
                    <textarea placeholder="Write down any text blocks, timeline events, or special layout requests you want us to add..." value={premiumForm.specialRequests} onChange={e => setPremiumForm({...premiumForm, specialRequests: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSendOrder}
                  disabled={sending}
                  style={{
                    width: '100%', padding: '1.2rem', borderRadius: '16px', border: 'none',
                    backgroundColor: '#5C3A1E', color: '#fff', fontSize: '1.1rem', fontWeight: 600,
                    cursor: sending ? 'wait' : 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                    opacity: sending ? 0.7 : 1, transition: 'all 0.3s',
                  }}>
                  {sending ? 'SENDING...' : 'SEND MY DETAILS →'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                  Our team will contact you within 24 hours ✨
                </p>
              </div>
            )}
          </div>
        )}

        {/* Trust Badges */}
        {step <= 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', paddingBottom: '6rem' }}>
            <div className="mobile-hide" style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <span>✓ Secure payment</span><span>·</span><span>✓ Instant confirmation</span><span>·</span><span>✓ Designer-made</span>
            </div>
            <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#e0dcd7' }}></div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5C3A1E', letterSpacing: '2px', textTransform: 'uppercase' }}>✨ SPECIAL OFFER · You save {originalTotal - total}$</span>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#e0dcd7' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Bar (steps 1-4 only) ─── */}
      {step <= 4 && (
        <div className="checkout-bottom-bar" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100 }}>
          <div style={{ height: '30px', background: 'linear-gradient(to top, #faf8f5, transparent)' }}></div>
          <div style={{ backgroundColor: '#faf8f5', padding: '0 1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '600px' }}>
              <button onClick={handleBack} style={{ width: '60px', height: '60px', borderRadius: '16px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#555' }}>←</button>
              <button onClick={step === 4 ? handlePayment : handleNextStep} style={{ flex: 1, height: '60px', borderRadius: '16px', border: 'none', backgroundColor: '#5C3A1E', color: '#fff', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.2rem', transition: 'transform 0.15s', letterSpacing: '1px' }}>
                <span>{step === 4 ? 'PAY & START' : 'CONTINUE'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.9rem' }}>{originalTotal}$</span>
                  <span>{total}$ →</span>
                </div>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#888' }}>
              1 tap with
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ background: '#000', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>Pay</span>
                <span style={{ background: '#fff', color: '#555', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>G Pay</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
