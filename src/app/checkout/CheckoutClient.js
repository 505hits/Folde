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

export default function CheckoutClient() {
  const router = useRouter();
  const { currentUser, register, login, createOrder } = useDatabase();

  const [step, setStep] = useState(1);
  // Step 1: Package, Step 2: Details, Step 3: Upsells, Step 4: Summary

  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

  // Form Details
  const [account, setAccount] = useState({ name: '', partnerName: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

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

  const calculateTotal = () => {
    return selectedPackage.price;
  };

  const calculateOriginalTotal = () => {
    return selectedPackage.originalPrice;
  };

  const total = calculateTotal();
  const originalTotal = calculateOriginalTotal();

  const handleNextStep = async () => {
    setAuthError('');
    if (step === 1 && currentUser) {
      setStep(3); // Skip Details -> go to Summary
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
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (step === 3 && currentUser) {
      setStep(1); // Back from Summary to Package
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/templates');
    }
  };

  const handlePayment = () => {
    createOrder(account.email, account.name, account.partnerName, selectedTheme, selectedPackage.name, total);
    router.push('/success');
  };

  const themeName = themes.find(t => t.id === selectedTheme)?.name || 'Editorial';

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#1a1a1a', position: 'relative' }}>
      <style>{`
        @media (max-width: 600px) {
          .mobile-hide { display: none !important; }
          .checkout-bottom-bar { padding: 0 1.5rem 1rem !important; }
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

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
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

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#6b363e' }}>Your details</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Just the essentials to start</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Your name" value={account.name} onChange={e => setAccount({...account, name: e.target.value})} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }} />
              <input type="text" placeholder="Your partner's name" value={account.partnerName} onChange={e => setAccount({...account, partnerName: e.target.value})} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <input type="email" placeholder="Your email" value={account.email} onChange={e => setAccount({...account, email: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', marginBottom: '1rem' }} />
            <input type="password" placeholder="Create a password" value={account.password} onChange={e => setAccount({...account, password: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }} />
            {authError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>{authError}</div>}
          </div>
        )}

        {/* STEP 3: SUMMARY */}
        {step === 3 && (
          <div>
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
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
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>TOTAL</span>
                <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: '#6b363e' }}>{total}$</span>
              </div>

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
            <button onClick={step === 3 ? handlePayment : handleNextStep} style={{ flex: 1, height: '60px', borderRadius: '16px', border: 'none', backgroundColor: '#6b363e', color: '#fff', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.2rem', transition: 'transform 0.15s', letterSpacing: '1px' }}>
              <span>{step === 3 ? 'PAY & START' : 'CONTINUE'}</span>
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

    </div>
  );
}
