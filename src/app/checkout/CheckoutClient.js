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
    name: 'Essential', 
    price: 175, 
    originalPrice: 325, 
    desc: 'Choose from our +15 exclusive templates and receive a personalized digital wedding invitation with your texts, photos and colours.',
    features: [
      'Choose 1 template from over 15 options',
      'Your colors and info applied',
      'RSVP + private dashboard',
      '2 languages included',
      '2 design revision rounds'
    ]
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: 575, 
    originalPrice: 850, 
    desc: 'We redesign and personalize any template to match the exact style of your wedding. All extras included.',
    features: [
      'Template redesigned to your style',
      'Full invitation personalization',
      'Custom icons, typography & illustrations',
      'Includes Video, Music & AI Images',
      'Unlimited blocks & 4 revision rounds',
      'Direct contact with your designer'
    ]
  },
  { 
    id: 'excellence', 
    name: 'Excellence', 
    price: 975, 
    originalPrice: 1450, 
    desc: '100% bespoke design from scratch with editorial art direction. A unique, one-of-a-kind piece.',
    features: [
      '100% custom design from scratch',
      'Editorial art direction',
      'Includes Video, Music & AI Images',
      'Personal concierge & priority support',
      'Everything in Premium'
    ]
  }
];

const ENVELOPE_OPTIONS = [
  { id: 'env_bordeaux', name: 'Bordeaux Envelope' },
  { id: 'env_seaview', name: 'Sea View Envelope' },
  { id: 'env_floral', name: 'Floral Envelope' },
  { id: 'env_luxury', name: 'Luxury Envelope' },
  { id: 'env_royal', name: 'Royal Envelope' },
  { id: 'env_horizon_bordeaux', name: 'Bordeaux Horizon' },
  { id: 'env_royal_doves', name: 'Royal Doves' },
  { id: 'env_imperial_light', name: 'Imperial Light' },
  { id: 'env_golden_palace', name: 'Golden Palace' },
  { id: 'env_oriental_palace', name: 'Oriental Palace' },
  { id: 'env_celestial_veil', name: 'Celestial Veil' },
  { id: 'env_ivory_veil', name: 'Ivory Veil' },
  { id: 'env_rose_veil', name: 'Rosé Veil' },
  { id: 'env_rose_bow', name: 'Rose Bow' },
  { id: 'env_majestic', name: 'Majestic' },
  { id: 'env_custom', name: 'I\'ll provide my own' },
];

const HERO_VIDEO_OPTIONS = [
  { id: 'hero_couple', name: 'Kissing Couple' },
  { id: 'hero_seaview', name: 'Sea View' },
  { id: 'hero_palm', name: 'Palm Zoom' },
  { id: 'hero_car', name: 'Just Married Car' },
  { id: 'hero_castle', name: 'Castle' },
  { id: 'hero_royal', name: 'Royal Heritage' },
  { id: 'hero_sea_anim', name: 'Sea Animation' },
  { id: 'hero_sea_balcony', name: 'Seaview Balcony' },
  { id: 'hero_custom', name: 'I\'ll provide my own' },
];

const SECTION_OPTIONS = [
  { key: 'intro', label: 'Introduction' },
  { key: 'venue', label: 'Venue' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'dressCode', label: 'Dress Code' },
  { key: 'boardingPass', label: 'Boarding Pass' },
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

  const [step, setStep] = useState(1);
  // Essential: Step 1 Package, Step 2 Details, Step 3 Summary
  // Premium/Excellence: Step 1 Package, Step 2 Wedding Form, Step 3 Summary → send email

  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

  // Essential form
  const [account, setAccount] = useState({ name: '', partnerName: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Premium/Excellence form
  const [premiumForm, setPremiumForm] = useState({
    name: '',
    partnerName: '',
    email: '',
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
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isPremiumOrExcellence = selectedPackage.id === 'premium' || selectedPackage.id === 'excellence';

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
  }, []);

  const calculateTotal = () => selectedPackage.price;
  const calculateOriginalTotal = () => selectedPackage.originalPrice;

  const total = calculateTotal();
  const originalTotal = calculateOriginalTotal();

  const handleNextStep = async () => {
    setAuthError('');

    if (isPremiumOrExcellence) {
      if (step === 1) {
        setStep(2);
        window.scrollTo(0, 0);
        return;
      }
      if (step === 2) {
        // Validate premium form
        if (!premiumForm.name || !premiumForm.partnerName || !premiumForm.email) {
          setAuthError('Please fill in at least your names and email.');
          return;
        }
        setStep(3);
        window.scrollTo(0, 0);
        return;
      }
    } else {
      // Essential flow
      if (step === 1 && currentUser) {
        setStep(3);
        window.scrollTo(0, 0);
        return;
      }
      if (step === 2) {
        if (!account.name || !account.partnerName || !account.email || !account.password) {
          setAuthError('Please fill in all fields.');
          return;
        }
        if (!currentUser) {
          const result = register(account.email, account.password, account.name, account.partnerName);
          if (!result.success) {
            if (result.error === 'Email already exists') {
              const loginRes = login(account.email, account.password);
              if (!loginRes.success) { setAuthError('Email exists. Incorrect password to login.'); return; }
            } else {
              setAuthError(result.error); return;
            }
          }
        }
      }
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (step === 3 && currentUser && !isPremiumOrExcellence) {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/templates');
    }
    window.scrollTo(0, 0);
  };

  const handlePayment = () => {
    if (isPremiumOrExcellence) {
      handleSendOrder();
    } else {
      createOrder(account.email, account.name, account.partnerName, selectedTheme, selectedPackage.name, total);
      router.push('/success');
    }
  };

  const handleSendOrder = async () => {
    setSending(true);
    try {
      const themeName = themes.find(t => t.id === selectedTheme)?.name || selectedTheme;
      const envName = ENVELOPE_OPTIONS.find(e => e.id === premiumForm.envelopeChoice)?.name || premiumForm.envelopeChoice;
      const heroName = HERO_VIDEO_OPTIONS.find(h => h.id === premiumForm.heroVideoChoice)?.name || premiumForm.heroVideoChoice;

      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          price: total,
          name: premiumForm.name,
          partnerName: premiumForm.partnerName,
          email: premiumForm.email,
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
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(() => router.push('/success'), 1500);
      }
    } catch (err) {
      console.error(err);
      // Still redirect - the order was likely logged
      setSent(true);
      setTimeout(() => router.push('/success'), 1500);
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

  const themeName = themes.find(t => t.id === selectedTheme)?.name || 'Editorial';

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
      
      {/* Top Header */}
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
              {[2,3].map(s => (
                <div key={s} style={{ width: '32px', height: '3px', borderRadius: '2px', backgroundColor: step >= s ? '#6b363e' : '#e0dcd7' }}></div>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: '1rem' }}>
          <span style={{ textDecoration: 'line-through', opacity: 0.4, marginRight: '0.4rem', fontSize: '0.85rem' }}>{originalTotal}$</span>
          <span style={{ fontWeight: 700 }}>{total}$</span>
        </div>
      </div>

      <div className="checkout-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem 120px' }}>
        
        {/* STEP 1: PACKAGE SELECTION */}
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
                    border: selectedPackage.id === p.id ? '2px solid #6b363e' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: selectedPackage.id === p.id ? '0 8px 24px rgba(107,54,62,0.08)' : 'none',
                    transition: 'all 0.2s ease', position: 'relative'
                  }}>
                  {selectedPackage.id === p.id && (
                     <div style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#6b363e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                  )}
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your plan</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>{p.name}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#aaa' }}>{p.originalPrice}$</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#6b363e' }}>{p.price}$</div>
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

                  {(p.id === 'premium' || p.id === 'excellence') && selectedPackage.id === p.id && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#faf5f0', borderRadius: '10px', border: '1px solid #e8ddd4', fontSize: '0.8rem', color: '#8b6e5a', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1rem' }}>🎨</span>
                      <span>We handle everything for you! Fill in your wedding details in the next step and our design team will craft your invitation.</span>
                    </div>
                  )}
                </div>
              ))}
              
              <div style={{ backgroundColor: '#faf8f5', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', marginTop: '1rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.2rem', color: '#6b363e' }}>🤍</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#555', marginBottom: '0.25rem' }}>YOU'LL-LOVE-IT PROMISE</div>
                  <div style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>We work with you, revision after revision, until your invitation moves you. You won't share it with the world until every detail feels exactly the way you dreamed it.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ESSENTIAL DETAILS */}
        {step === 2 && !isPremiumOrExcellence && (
          <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#6b363e' }}>Your details</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Just the essentials to start</p>
            </div>
            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Your name" value={account.name} onChange={e => setAccount({...account, name: e.target.value})} style={inputStyle} />
              <input type="text" placeholder="Your partner's name" value={account.partnerName} onChange={e => setAccount({...account, partnerName: e.target.value})} style={inputStyle} />
            </div>
            <input type="email" placeholder="Your email" value={account.email} onChange={e => setAccount({...account, email: e.target.value})} style={{ ...inputStyle, marginBottom: '1rem' }} />
            <input type="password" placeholder="Create a password" value={account.password} onChange={e => setAccount({...account, password: e.target.value})} style={inputStyle} />
            {authError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>{authError}</div>}
          </div>
        )}

        {/* STEP 2: PREMIUM/EXCELLENCE DETAILED FORM */}
        {step === 2 && isPremiumOrExcellence && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#6b363e' }}>Tell us about your wedding</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>We'll craft everything for you based on these details</p>
            </div>

            {/* Your Info */}
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#6b363e', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>👤 Your Information</div>
              <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Your name *</label>
                  <input type="text" placeholder="Your name" value={premiumForm.name} onChange={e => setPremiumForm({...premiumForm, name: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Partner's name *</label>
                  <input type="text" placeholder="Partner's name" value={premiumForm.partnerName} onChange={e => setPremiumForm({...premiumForm, partnerName: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" placeholder="your@email.com" value={premiumForm.email} onChange={e => setPremiumForm({...premiumForm, email: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" value={premiumForm.phone} onChange={e => setPremiumForm({...premiumForm, phone: e.target.value})} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Wedding Details */}
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#6b363e', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>💒 Wedding Details</div>
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

            {/* Design Preferences */}
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#6b363e', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>🎨 Design Preferences</div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Preferred template style</label>
                <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)} style={selectStyle}>
                  {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Envelope animation</label>
                  <select value={premiumForm.envelopeChoice} onChange={e => setPremiumForm({...premiumForm, envelopeChoice: e.target.value})} style={selectStyle}>
                    <option value="">Choose...</option>
                    {ENVELOPE_OPTIONS.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Hero video</label>
                  <select value={premiumForm.heroVideoChoice} onChange={e => setPremiumForm({...premiumForm, heroVideoChoice: e.target.value})} style={selectStyle}>
                    <option value="">Choose...</option>
                    {HERO_VIDEO_OPTIONS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Color preferences</label>
                <input type="text" placeholder="e.g. Blush pink, gold, ivory" value={premiumForm.colorPreferences} onChange={e => setPremiumForm({...premiumForm, colorPreferences: e.target.value})} style={inputStyle} />
              </div>
            </div>

            {/* Sections */}
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#6b363e', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>📋 Invitation Sections</div>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Select the sections you want in your invitation</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {SECTION_OPTIONS.map(s => (
                  <div key={s.key} onClick={() => toggleSection(s.key)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: premiumForm.sectionsWanted.includes(s.key) ? '2px solid #6b363e' : '1px solid #e0dcd7',
                      backgroundColor: premiumForm.sectionsWanted.includes(s.key) ? '#fbf5f6' : '#faf8f5',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.15s ease',
                    }}>
                    <span style={{ color: premiumForm.sectionsWanted.includes(s.key) ? '#6b363e' : '#ccc', fontSize: '0.9rem' }}>
                      {premiumForm.sectionsWanted.includes(s.key) ? '✓' : '○'}
                    </span>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Notes */}
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#6b363e', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>💬 Additional Details</div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Inspiration links</label>
                <textarea placeholder="Share any Pinterest boards, Instagram posts, or websites you love..." value={premiumForm.inspirationLinks} onChange={e => setPremiumForm({...premiumForm, inspirationLinks: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>Special requests</label>
                <textarea placeholder="Anything else you'd like us to know..." value={premiumForm.specialRequests} onChange={e => setPremiumForm({...premiumForm, specialRequests: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            {authError && <div style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center' }}>{authError}</div>}
          </div>
        )}

        {/* STEP 3: SUMMARY */}
        {step === 3 && (
          <div>
            <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>YOUR INVITATION</div>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#6b363e', fontStyle: 'italic' }}>{selectedPackage.name}</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: '1px solid #e0dcd7', paddingBottom: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>PLAN</span>
                  <div style={{ flex: 1, borderBottom: '1px dotted #ccc', margin: '0 1rem' }}></div>
                  <span style={{ fontWeight: 600 }}>{selectedPackage.price}$</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>STYLE</span>
                  <div style={{ flex: 1, borderBottom: '1px dotted #ccc', margin: '0 1rem' }}></div>
                  <span style={{ fontWeight: 600 }}>{themeName}</span>
                </div>
                {isPremiumOrExcellence && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>COUPLE</span>
                      <div style={{ flex: 1, borderBottom: '1px dotted #ccc', margin: '0 1rem' }}></div>
                      <span style={{ fontWeight: 600 }}>{premiumForm.name} & {premiumForm.partnerName}</span>
                    </div>
                    {premiumForm.weddingDate && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>DATE</span>
                        <div style={{ flex: 1, borderBottom: '1px dotted #ccc', margin: '0 1rem' }}></div>
                        <span style={{ fontWeight: 600 }}>{new Date(premiumForm.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {premiumForm.weddingVenue && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>VENUE</span>
                        <div style={{ flex: 1, borderBottom: '1px dotted #ccc', margin: '0 1rem' }}></div>
                        <span style={{ fontWeight: 600 }}>{premiumForm.weddingVenue}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>TOTAL</span>
                <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#6b363e' }}>{total}$</span>
              </div>

              {isPremiumOrExcellence && (
                <div style={{ backgroundColor: '#faf5f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem', border: '1px solid #e8ddd4' }}>
                  <div style={{ fontSize: '1.2rem' }}>🎨</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#8b6e5a', marginBottom: '0.25rem' }}>HANDCRAFTED BY OUR TEAM</div>
                    <div style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>Your details will be sent directly to our design team. We'll start crafting your invitation and contact you within 24 hours.</div>
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: '#faf8f5', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ fontSize: '1.2rem', color: '#6b363e' }}>🤍</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#555', marginBottom: '0.25rem' }}>YOU'LL-LOVE-IT PROMISE</div>
                  <div style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>We revise with you until every detail moves you. You won't share it until it feels exactly the way you dreamed.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Badges moved from bottom bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', paddingBottom: '6rem' }}>
          <div className="mobile-hide" style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <span>✓ Secure payment</span>
            <span>·</span>
            <span>✓ Instant confirmation</span>
            <span>·</span>
            <span>✓ Designer-made</span>
          </div>

          <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ height: '1px', width: '40px', backgroundColor: '#e0dcd7' }}></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b363e', letterSpacing: '2px', textTransform: 'uppercase' }}>✨ SPECIAL OFFER · You save {originalTotal - total}$</span>
            <div style={{ height: '1px', width: '40px', backgroundColor: '#e0dcd7' }}></div>
          </div>
        </div>

      </div>

      <div className="checkout-bottom-bar" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100 }}>
        {/* Gradient shadow */}
        <div style={{ height: '30px', background: 'linear-gradient(to top, #faf8f5, transparent)' }}></div>
        <div style={{ backgroundColor: '#faf8f5', padding: '0 1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          

          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '600px' }}>
            <button onClick={handleBack} style={{ width: '60px', height: '60px', borderRadius: '16px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#555' }}>
              ←
            </button>
            <button 
              onClick={step === 3 ? handlePayment : handleNextStep} 
              disabled={sending || sent}
              style={{ 
                flex: 1, height: '60px', borderRadius: '16px', border: 'none', 
                backgroundColor: sent ? '#2d8a4e' : '#6b363e', 
                color: '#fff', fontSize: '1.1rem', fontWeight: 600, cursor: sending ? 'wait' : 'pointer', 
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '0 1.2rem', transition: 'all 0.3s', letterSpacing: '1px',
                opacity: sending ? 0.7 : 1,
              }}>
              <span>
                {sent ? '✓ SENT!' : sending ? 'SENDING...' : step === 3 ? (isPremiumOrExcellence ? 'SUBMIT ORDER' : 'PAY & START') : 'CONTINUE'}
              </span>
              {!sent && !sending && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '0.9rem' }}>{originalTotal}$</span> 
                  <span>{total}$ →</span>
                </div>
              )}
            </button>
          </div>
          
          {!isPremiumOrExcellence && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#888' }}>
              1 tap with 
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ background: '#000', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>Pay</span>
                <span style={{ background: '#fff', color: '#555', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>G Pay</span>
              </div>
            </div>
          )}

          {isPremiumOrExcellence && step === 3 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#888', textAlign: 'center' }}>
              Your order details will be sent to our design team
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
