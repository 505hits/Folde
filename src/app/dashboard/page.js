"use client";

import { useState, useRef, useEffect } from "react";

import Link from "next/link";
import StyledFileInput from '@/components/StyledFileInput';
import Hls from 'hls.js';
import Image from "next/image";
import { useDatabase } from "@/context/DatabaseContext";
import InteractiveVideo from "@/components/InteractiveVideo";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";

const HoverVideoThumbnail = ({ url, fallbackColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rectRef = useRef(null);

  const getPoster = () => {
    if (url && url.includes('cloudflarestream')) {
      return url.replace('manifest/video.m3u8', 'thumbnails/thumbnail.jpg?time=0s');
    }
    return undefined;
  };

  return (
    <div 
      style={{ width: '50px', height: '90px', borderRadius: '8px', backgroundColor: fallbackColor, flexShrink: 0, position: 'relative' }}
      onMouseEnter={(e) => {
        rectRef.current = e.currentTarget.getBoundingClientRect();
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail static view */}
      {url !== 'custom' && (
         url.match(/\.(jpeg|jpg|gif|png)$/) ? (
           <img 
             src={url}
             alt="Thumbnail"
             style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
           />
         ) : (
           <video 
             src={url && url.endsWith('.m3u8') ? undefined : url}
             poster={getPoster()}
             muted playsInline
             style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
           />
         )
      )}

      {/* Expanded hover view */}
      {isHovered && url !== 'custom' && (
        <div style={{
          position: 'fixed',
          top: rectRef.current ? rectRef.current.top - 80 : 0,
          left: rectRef.current ? rectRef.current.left : 0,
          width: '150px',
          height: '270px',
          zIndex: 9999,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          transform: 'scale(1)',
          transformOrigin: 'bottom left',
          animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <img src={url} alt="Expanded preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : url.endsWith('.m3u8') ? (
             <iframe 
               src={url.replace('manifest/video.m3u8', 'iframe?muted=true&autoplay=true&loop=true&controls=false')} 
               style={{ border: 'none', width: '100%', height: '100%' }} 
               allow="autoplay">
             </iframe>
          ) : (
             <video src={url} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { currentUser, login, register, loginWithGoogle, logout, guests, orders, eventInfo, setEventInfo, fetchGuests, revisions = {}, addRevision } = useDatabase();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '', partnerName: '' });
  const [loginError, setLoginError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('invitation');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Revision Request State
  const [revisionComment, setRevisionComment] = useState('');
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState('');
  const [revisionError, setRevisionError] = useState('');

  // Compute userOrder securely before hooks with case-insensitive email match
  const userOrder = currentUser ? orders.find(o => o.email?.toLowerCase() === currentUser.email?.toLowerCase() && o.paid) : null;
  const [selectedTheme, setSelectedTheme] = useState(userOrder?.theme || 'bordeaux');

  // Fetch guests from Supabase when dashboard loads
  useEffect(() => {
    if (userOrder?.slug) {
      fetchGuests(userOrder.slug);
    }
  }, [userOrder?.slug]);

  const handleRevisionSubmit = async (e) => {
    e.preventDefault();
    if (!revisionComment.trim()) {
      setRevisionError('Please describe the modifications you would like to request.');
      return;
    }

    const clientSlug = userOrder?.slug || '';
    const currentRevisions = revisions[clientSlug] || [];
    if (currentRevisions.length >= 2) {
      setRevisionError('You have reached the maximum of 2 revision rounds included in your plan.');
      return;
    }

    setRevisionSubmitting(true);
    setRevisionError('');
    setRevisionMessage('');

    const nextNumber = currentRevisions.length + 1;

    try {
      const res = await fetch('/api/send-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          coupleName: userOrder.couple,
          slug: clientSlug,
          revisionNumber: nextNumber,
          comment: revisionComment.trim(),
          origin: typeof window !== 'undefined' ? window.location.origin : 'https://foldedesign.com'
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRevisionError(data.error || 'Failed to send request. Please try again.');
        setRevisionSubmitting(false);
        return;
      }

      if (addRevision) addRevision(clientSlug, revisionComment.trim());
      setRevisionComment('');
      setRevisionMessage(`Revision Request #${nextNumber} sent! Our studio team will review your comments and update your invitation within 24h.`);
    } catch (err) {
      console.error(err);
      setRevisionError('An error occurred. Please try again.');
    } finally {
      setRevisionSubmitting(false);
    }
  };

  // ========== LOGIN GATE ==========
  if (!currentUser) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoginError('');
      setAuthSuccessMsg('');
      setIsSubmitting(true);

      try {
        if (authMode === 'login') {
          const result = await login(loginForm.email, loginForm.password);
          if (!result.success) {
            setLoginError(result.error || 'Erreur lors de la connexion.');
          }
        } else {
          if (!loginForm.email || !loginForm.password) {
            setLoginError('Veuillez remplir tous les champs obligatoires.');
            setIsSubmitting(false);
            return;
          }
          const result = await register(loginForm.email, loginForm.password, loginForm.name, loginForm.partnerName);
          if (!result.success) {
            setLoginError(result.error || 'Erreur lors de l’inscription.');
          } else {
            setAuthSuccessMsg('Compte créé avec succès !');
          }
        }
      } catch (err) {
        setLoginError('Une erreur inattendue est survenue.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleGoogleAuth = async () => {
      setLoginError('');
      const result = await loginWithGoogle();
      if (!result.success) {
        setLoginError(result.error || 'Erreur avec la connexion Google.');
      }
    };

    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        backgroundColor: '#faf8f5',
        fontFamily: 'var(--font-body)',
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem 2rem',
          maxWidth: '430px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(92, 58, 30, 0.08), 0 2px 10px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(224, 220, 215, 0.7)',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: '#b08968', marginBottom: '0.6rem' }}>
              FOLDÈ DESIGN
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              {authMode === 'login' ? 'Bienvenue' : 'Créer votre compte'}
            </h1>
            <p style={{ color: '#777', fontSize: '0.88rem' }}>
              {authMode === 'login' ? 'Connectez-vous pour accéder à votre espace' : 'Inscrivez-vous pour personnaliser vos faire-part'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f4f1ec',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLoginError(''); setAuthSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '9px',
                border: 'none',
                backgroundColor: authMode === 'login' ? '#ffffff' : 'transparent',
                color: authMode === 'login' ? '#1a1a1a' : '#777',
                boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setLoginError(''); setAuthSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '9px',
                border: 'none',
                backgroundColor: authMode === 'signup' ? '#ffffff' : 'transparent',
                color: authMode === 'signup' ? '#1a1a1a' : '#777',
                boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              S'inscrire
            </button>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              padding: '0.8rem', borderRadius: '12px', border: '1px solid #e0dcd7', backgroundColor: '#fff',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit',
              transition: 'background-color 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continuer avec Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e5e1' }}></div>
            <span style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>ou avec votre e-mail</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e5e1' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {authMode === 'signup' && (
              <>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Votre prénom</label>
                    <input
                      type="text"
                      placeholder="Emma"
                      value={loginForm.name}
                      onChange={e => setLoginForm({...loginForm, name: e.target.value})}
                      style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #e0dcd7', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Prénom conjoint</label>
                    <input
                      type="text"
                      placeholder="Lucas"
                      value={loginForm.partnerName}
                      onChange={e => setLoginForm({...loginForm, partnerName: e.target.value})}
                      style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #e0dcd7', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Email</label>
              <input
                type="email"
                required
                placeholder="vous@exemple.com"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #e0dcd7', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Mot de passe</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #e0dcd7', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {loginError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.84rem', border: '1px solid #fecaca' }}>
                {loginError}
              </div>
            )}

            {authSuccessMsg && (
              <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.84rem', border: '1px solid #bbf7d0' }}>
                {authSuccessMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none', backgroundColor: '#5C3A1E',
                color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: isSubmitting ? 0.7 : 1, transition: 'opacity 0.2s', marginTop: '0.25rem'
              }}
            >
              {isSubmitting ? 'Chargement...' : authMode === 'login' ? 'Se connecter →' : 'S\'inscrire →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.1rem', borderTop: '1px solid #f0ede9' }}>
            <Link href="/checkout" style={{ color: '#b08968', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none' }}>
              Vous n'avez pas encore commandé ? Découvrir les collections →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========== CHECK IF USER HAS PAID ==========
  
  if (!userOrder) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf8f5', fontFamily: 'var(--font-body)' }}>
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', maxWidth: '440px', width: '100%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', textAlign: 'center'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1.25rem' }}>⏳</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>No order found</h1>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>Your dashboard will become available once your payment is confirmed.</p>
          <Link href="/checkout" style={{ display: 'inline-block', backgroundColor: '#5C3A1E', color: '#fff', padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            Order now →
          </Link>
          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== PREMIUM DASHBOARD ==========
  const isPremiumOrCustom = userOrder.plan === 'Premium' || userOrder.plan === 'Custom';
  const clientSlug = userOrder.slug;
  const clientGuests = guests[clientSlug] || [];

  if (isPremiumOrCustom) {
    return (
      <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#1a1a1a', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#5C3A1E', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>FOLDÈ</div>
                <span style={{ backgroundColor: '#faf5f0', color: '#8b6e5a', border: '1px solid #e8ddd4', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {userOrder.plan} Studio Space
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#555', marginTop: '0.25rem', fontWeight: 500 }}>
                {userOrder.couple}
              </div>
            </div>
            <button onClick={logout} style={{ background: '#fff', border: '1px solid #e0dcd7', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', color: '#555', fontFamily: 'inherit', fontWeight: 500, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              Sign out
            </button>
          </header>

          {/* Status Indicator */}
          {userOrder.status === 'Live' ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #dcfce7', marginBottom: '2.5rem', textAlign: 'center', backgroundImage: 'linear-gradient(to bottom, #f8fafc, #fff)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(22, 101, 52, 0.15)' }}>
                ✨
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.75rem' }}>
                Your invitation is live!
              </h1>
              <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2rem' }}>
                Our design studio has finalized your bespoke wedding invitation. You can now view it live and share your link with guests.
              </p>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', backgroundColor: '#f1f5f9', padding: '0.85rem 1.75rem', borderRadius: '14px', border: '1px solid #e2e8f0', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href={`/invite/${clientSlug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  View my website →
                </a>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/invite/${clientSlug}`);
                    alert("Link copied to clipboard!");
                  }}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>🔗</span> Copy link
                </button>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #fef3c7', marginBottom: '2.5rem', textAlign: 'center', backgroundImage: 'linear-gradient(to bottom, #fffdfa, #fff)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', position: 'relative' }}>
                <span style={{ position: 'absolute', inset: 0, border: '3px solid #fef3c7', borderTopColor: '#d97706', borderRadius: '50%', animation: 'spin 2s linear infinite' }}></span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                ✨
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: '#5C3A1E', marginBottom: '0.75rem' }}>
                Creation in Progress...
              </h1>
              <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto 1.5rem' }}>
                Our Paris design studio is currently handcrafting your bespoke wedding invitation using all the details, photos, and preferences you provided.
              </p>
              <div style={{ display: 'inline-block', backgroundColor: '#faf5f0', border: '1px solid #e8ddd4', padding: '0.75rem 1.5rem', borderRadius: '14px', color: '#8b6e5a', fontSize: '0.95rem', fontWeight: 600 }}>
                ⏳ Estimated delivery: <strong>3 Days (72 hours)</strong>
              </div>
              <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '1.25rem' }}>
                You will receive a notification email at <strong>{currentUser?.email}</strong> as soon as your custom website is published.
              </p>
            </div>
          )}

          {/* ================= REVISION REQUESTS SECTION ================= */}
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e8ddd4', marginBottom: '2.5rem', backgroundImage: 'linear-gradient(to bottom, #fffdfa, #fff)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>PARIS STUDIO SUPPORT</div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: '#1a1a1a', margin: 0 }}>Request a Design Modification</h2>
              </div>
              <div style={{ backgroundColor: (revisions[clientSlug] || []).length >= 2 ? '#fef2f2' : '#faf5f0', color: (revisions[clientSlug] || []).length >= 2 ? '#991b1b' : '#8b6e5a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #e8ddd4' }}>
                {(revisions[clientSlug] || []).length} / 2 Revisions Used
              </div>
            </div>

            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your plan includes <strong>2 full revision rounds</strong> with our design team. Need adjustments to your text, photos, timeline, or color scheme? Submit your request below!
            </p>

            {/* Display Previous Revisions */}
            {(revisions[clientSlug] || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {(revisions[clientSlug] || []).map((rev, idx) => (
                  <div key={idx} style={{ backgroundColor: '#faf8f5', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e0dcd7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5C3A1E' }}>✂️ Revision Request #{rev.number}</span>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(rev.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#333', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{rev.comment}</p>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#2d8a4e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>✓</span> Sent to studio (folde.wedding@gmail.com) · Processing
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form to submit new revision */}
            {(revisions[clientSlug] || []).length < 2 ? (
              <form onSubmit={handleRevisionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>
                    Requested Modifications (Revision #{(revisions[clientSlug] || []).length + 1} of 2)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe any text updates, photo changes, dress code tweaks, or timeline adjustments you would like us to make..."
                    value={revisionComment}
                    onChange={(e) => setRevisionComment(e.target.value)}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {revisionError && (
                  <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>{revisionError}</div>
                )}
                {revisionMessage && (
                  <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500, border: '1px solid #bbf7d0' }}>
                    ✓ {revisionMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={revisionSubmitting}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#5C3A1E',
                    color: '#fff',
                    border: 'none',
                    padding: '0.9rem 2rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: revisionSubmitting ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '0.5px',
                    opacity: revisionSubmitting ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(92,58,30,0.15)'
                  }}>
                  {revisionSubmitting ? 'Sending Request...' : `SUBMIT REVISION #${(revisions[clientSlug] || []).length + 1} →`}
                </button>
              </form>
            ) : (
              <div style={{ backgroundColor: '#faf8f5', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e0dcd7', color: '#666', fontSize: '0.9rem', lineHeight: 1.5, textAlign: 'center' }}>
                ✨ You have used all <strong>2 revision rounds</strong> included in your package. Our team has finalized your design. If you require additional custom changes, reach out to us directly at <a href="mailto:folde.wedding@gmail.com" style={{ color: '#5C3A1E', fontWeight: 600 }}>folde.wedding@gmail.com</a>.
              </div>
            )}
          </div>

          {/* RSVPs List */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.25rem' }}>Guest List (RSVP)</h2>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Track your guests' responses in real-time.</p>
              </div>
              <div style={{ backgroundColor: '#eefcf1', color: '#2e7d32', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                {clientGuests.filter(g => g.status === 'Attending').length} Attending
              </div>
            </div>

            {clientGuests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888', backgroundColor: '#faf8f5', borderRadius: '12px' }}>
                No responses yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {clientGuests.map((guest, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e0dcd7', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: guest.status === 'Attending' ? '#fdfdfd' : '#faf8f5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {guest.name}
                          {guest.status === 'Attending' ? (
                            <span style={{ fontSize: '0.7rem', backgroundColor: '#eefcf1', color: '#2e7d32', padding: '0.15rem 0.4rem', borderRadius: '8px', fontWeight: 700 }}>Attending</span>
                          ) : (
                            <span style={{ fontSize: '0.7rem', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '0.15rem 0.4rem', borderRadius: '8px', fontWeight: 700 }}>Pending</span>
                          )}
                        </div>
                        {guest.status === 'Attending' && guest.hasPlusOne && (
                          <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ color: '#b08968' }}>+1</span> {guest.plusOneName}
                          </div>
                        )}
                      </div>
                      
                      {guest.status === 'Attending' && guest.meal && guest.meal !== '-' && (
                        <div style={{ fontSize: '0.85rem', color: '#666', backgroundColor: '#f9f5f0', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e8ddd4' }}>
                          🍽 {guest.meal}
                        </div>
                      )}
                    </div>
                    
                    {guest.message && (
                      <div style={{ marginTop: '0.5rem', padding: '0.8rem', backgroundColor: '#fdfbf9', borderRadius: '8px', borderLeft: '3px solid #d4c5b9', fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>
                        "{guest.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== DASHBOARD (STANDARD) ==========
  const defaultEventInfo = { 
    date: 'May 27, 2026', 
    time: '14:00', 
    ceremonyVenue: 'Ocean front beach House', 
    receptionVenue: 'South Dixie Highway, Homestead', 
    partner1: currentUser.name || '', 
    partner2: currentUser.partnerName || '',
    timeline: [
      { time: "14:00", title: "Lunch" },
      { time: "18:00", title: "Ceremony" },
      { time: "20:00", title: "Dinner" },
      { time: "22:00", title: "Party" },
      { time: "04:00", title: "End" }
    ],
    accommodations: [
      { name: "Hotel Costa", price: "410$" },
      { name: "Hotel Love", price: "120$" }
    ],
    menu: [
      { course: "Starter", dish: "Caviar" },
      { course: "Main", dish: "Steak friete" },
      { course: "Dessert", dish: "Dame blanche" }
    ],
    sections: {
      showIntro: true,
      showVenue: true,
      showSchedule: true,
      showBoardingPass: false,
      showRSVP: true
    },
    images: {}
  };
  const clientEventInfo = eventInfo[clientSlug] || defaultEventInfo;

  const tabs = [
    { id: 'invitation', label: 'My Invitation', icon: '✎' },
    { id: 'guests', label: 'Guest List', icon: '👥', upgrade: true },
    { id: 'rsvps', label: 'RSVPs', icon: '☑', upgrade: true },
    { id: 'share', label: 'Share', icon: '↗' },
  ];

  const bottomTabs = [
    { id: 'knowledge', label: 'Knowledge', icon: '📊', upgrade: true },
    { id: 'settings', label: 'RSVP Settings', icon: '⚙', upgrade: true },
    { id: 'download', label: 'Download Data', icon: '⬇', upgrade: true },
    { id: 'billing', label: 'Plan & Billing', icon: '💳' },
  ];

  return (
    <div className="dashboard-layout" style={{ backgroundColor: '#faf8f5', fontFamily: 'var(--font-body)', color: '#1a1a1a' }}>
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
        }
        .dashboard-sidebar {
          width: 260px;
          background-color: #fff;
          border-right: 1px solid rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
        }
        .dashboard-preview {
          width: 400px;
          background-color: #f5f1ea;
          border-left: 1px solid rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #1a1a1a;
        }
        .mobile-close-btn {
          display: none;
        }
        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: block;
          }
          .dashboard-layout {
            flex-direction: column;
          }
          .dashboard-sidebar {
            display: none;
          }
          .dashboard-sidebar.mobile-open {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 100;
          }
          .mobile-close-btn {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            position: absolute;
            top: 1.25rem;
            right: 1.5rem;
            color: #1a1a1a;
          }
          .dashboard-main {
            height: auto;
            overflow-y: visible;
          }
          .dashboard-preview {
            width: 100%;
            height: auto;
            border-left: none;
            border-top: 1px solid rgba(0,0,0,0.06);
            position: relative;
            padding-bottom: 3rem;
          }
        }
      `}</style>
      
      {/* 1. Left Sidebar */}
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#5C3A1E', fontFamily: 'var(--font-heading)' }}>FOLDÈ</div>
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        
        <div style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.5rem',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? 600 : 500,
                  backgroundColor: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                  color: activeTab === tab.id ? '#1a1a1a' : '#555',
                  textAlign: 'left', fontFamily: 'inherit', borderLeft: activeTab === tab.id ? '3px solid #5C3A1E' : '3px solid transparent'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', opacity: 0.7 }}>{tab.icon}</span> {tab.label}
                </div>
                {tab.upgrade && userOrder.plan === 'Essential' && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Upgrade</span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ margin: '1.5rem 1.5rem', height: '1px', backgroundColor: '#f0ede9' }}></div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {bottomTabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.5rem',
                  border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                  backgroundColor: 'transparent', color: '#666', textAlign: 'left', fontFamily: 'inherit'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', opacity: 0.6 }}>{tab.icon}</span> {tab.label}
                </div>
                {tab.upgrade && userOrder.plan === 'Essential' && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Upgrade</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        <div style={{ padding: '1.25rem', backgroundColor: '#faf8f5', borderTop: '1px solid rgba(0,0,0,0.04)', margin: '1rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.25rem' }}>Your Wedding</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.25rem' }}>{clientEventInfo.partner1 || 'Partner 1'} & {clientEventInfo.partner2 || 'Partner 2'}</div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.75rem' }}>{clientEventInfo.date || 'TBD'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#2e7d32', backgroundColor: '#eefcf1', padding: '0.3rem 0.6rem', borderRadius: '20px', width: 'fit-content' }}>
            <span>🕒</span> 180 days until wedding
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#b08968', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> {userOrder.plan} · Draft
          </div>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="dashboard-main">
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a' }}>My Invitation</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a href={`/invite/${clientSlug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '30px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', color: '#555', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              <span>📱</span> Voir en plein écran
            </a>
            <button 
              onClick={() => {
                setIsPublishing(true);
                setTimeout(() => {
                  setIsPublishing(false);
                  setShowPublishModal(true);
                }, 1500); // Simulate publish delay
              }}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', border: 'none', backgroundColor: '#7b906f', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isPublishing ? (
                <>⏳ Publication...</>
              ) : (
                <>🔒 Publier mon site</>
              )}
            </button>
          </div>
        </header>

        <div style={{ padding: '1.5rem', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          
          <div style={{ backgroundColor: '#f8fdf8', border: '1px solid #e2f2e5', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#7b906f' }}>🕒</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#2e5b32', marginBottom: '0.2rem' }}>Start sharing early</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>Hosts who publish more than 4 months in advance get the best response rates.</div>
            </div>
          </div>

          {activeTab === 'invitation' ? <InvitationTab eventInfo={clientEventInfo} slug={clientSlug} setEventInfo={setEventInfo} allEventInfo={eventInfo} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} plan={userOrder.plan} orderId={userOrder.id} /> : (
             <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
               Section in development
             </div>
          )}

        </div>
      </main>

      {/* 3. Right Preview Panel */}
      <aside className="dashboard-preview">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden' }}>
          {/* Phone Mockup */}
          <div style={{ width: '300px', height: '620px', backgroundColor: '#111', borderRadius: '40px', padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
              {/* Live rendering of the template with correct overflow handling */}
              <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ width: '450px', zoom: 0.6133 }}>
                  <BordeauxTemplate data={clientEventInfo} editMode={true} />
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </aside>

      {/* PUBLISH MODAL */}
      {showPublishModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '24px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', color: '#1a1a1a', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Bravo !</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Votre site de mariage est maintenant public et prêt à être partagé avec vos invités.</p>
            
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.9rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {typeof window !== 'undefined' ? window.location.origin : ''}/invite/{clientSlug}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/invite/${clientSlug}`);
                  alert("Lien copié dans le presse-papier !");
                }}
                style={{ background: 'none', border: 'none', color: '#7b906f', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Copier
              </button>
            </div>

            <button 
              onClick={() => setShowPublishModal(false)}
              style={{ width: '100%', padding: '1rem', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
              Continuer à modifier
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function InvitationTab({ eventInfo, slug, setEventInfo, allEventInfo, selectedTheme, setSelectedTheme, plan, orderId }) {
  const [local, setLocal] = useState(eventInfo);

  const handleChange = (field, value) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    setEventInfo({ ...allEventInfo, [slug]: updated });
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...(local.timeline || [])];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    handleChange('timeline', newTimeline);
  };

  const handleMenuChange = (index, field, value) => {
    const newMenu = [...(local.menu || [])];
    newMenu[index] = { ...newMenu[index], [field]: value };
    handleChange('menu', newMenu);
  };

  const handleAccommodationsChange = (index, field, value) => {
    const newAcc = [...(local.accommodations || [])];
    newAcc[index] = { ...newAcc[index], [field]: value };
    handleChange('accommodations', newAcc);
  };

  const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e0dcd7', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', backgroundColor: '#faf8f5', color: '#1a1a1a' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' };
  const sectionStyle = { backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '1.5rem' };
  
  const AVAILABLE_TEMPLATES = [
    { id: 'bordeaux', name: 'Bordeaux Elegant', desc: 'Une célébration moderne, dramatique et élégante' },
    { id: 'champagne', name: 'Champagne', desc: 'Sophistication royale avec une chaleur dorée' },
    { id: 'ivory', name: 'Ivory', desc: 'Pur et délicat, un classique intemporel' },
    { id: 'sage', name: 'Sage', desc: 'Organique et raffiné avec une touche botanique' },
    { id: 'terracotta', name: 'Terracotta', desc: 'Chaleur ensoleillée pour une ambiance méditerranéenne' },
    { id: 'chocolate', name: 'Chocolate', desc: 'Chaleur riche et caractère pour une ambiance chaleureuse' },
    { id: 'thelaceedit', name: 'The Lace Edit', desc: 'Delicate lace and timeless romance.' },
    { id: 'lejardin', name: 'Le Jardin', desc: 'A lush garden romance.' },
    { id: 'lacephotoscratch', name: 'Lace Photo Scratch', desc: 'Interactive elegant scratch reveal.' },
    { id: 'oasisroyale', name: 'Oasis Royale', desc: 'A grand desert oasis celebration.' },
    { id: 'tropical', name: 'Tropical', desc: 'Vibrant tropical paradise.' },
  ];

  const AVAILABLE_ENVELOPE_VIDEOS = [
    { id: 'env_bordeaux', name: 'Bordeaux Envelope', url: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', color: '#4a1523', desc: 'Classic dramatic burgundy opening' },
    { id: 'env_seaview', name: 'Sea View Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', color: '#d4c5b9', desc: 'Elegant wax seal opening' },
    { id: 'env_floral', name: 'Floral Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', color: '#f5e3d7', desc: 'Beautiful floral wax seal opening' },
    { id: 'env_luxury', name: 'Luxury Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', color: '#d4c5b9', desc: 'Luxury Ivory wax seal opening' },
    { id: 'env_royal', name: 'Royal Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', color: '#33403a', desc: 'Regal wax seal opening' },
    { id: 'env_horizon_bordeaux', name: 'Bordeaux Horizon', url: '/videos/horizon-bordeaux.mp4', color: '#5C3A1E', desc: 'A deep entrance, between warmth and refinement.' },
    { id: 'env_royal_doves', name: 'Royal Doves', url: '/videos/royal-doves.mp4', color: '#e5dcd3', desc: 'A gentle entrance, carried by grace.' },
    { id: 'env_imperial_light', name: 'Imperial Light', url: '/videos/imperial-light.mp4', color: '#f3e5d8', desc: 'An opening sculpted by light.' },
    { id: 'env_golden_palace', name: 'Golden Palace', url: '/videos/golden-palace.mp4', color: '#d4af37', desc: 'A precious glow, like a promise.' },
    { id: 'env_oriental_palace', name: 'Oriental Palace', url: '/videos/oriental-palace.mp4', color: '#c7b299', desc: 'An entrance sculpted from heritage and light.' },
    { id: 'env_celestial_veil', name: 'Celestial Veil', url: '/videos/celestial-veil.mp4', color: '#e0e5ec', desc: 'A veil of air… and the world calms.' },
    { id: 'env_ivory_veil', name: 'Ivory Veil', url: '/videos/ivory-veil.mp4', color: '#f8f5f0', desc: 'A caress of light, in silence.' },
    { id: 'env_rose_veil', name: 'Rosé Veil', url: '/videos/rose-veil.mp4', color: '#f4e1e1', desc: 'A rosy whisper, like the start of a dream.' },
    { id: 'env_rose_bow', name: 'Rose Bow', url: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', color: '#f3d9d7', desc: 'A delicate ribbon opening.' },
    { id: 'env_majestic', name: 'Majestic', url: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', color: '#7a5e42', desc: 'A regal and majestic entrance.' },
    { id: 'env_thelaceedit', name: 'The Lace Edit', url: 'https://savethedate-thelaceedit.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'The Lace Edit envelope' },
    { id: 'env_lejardin', name: 'Le Jardin', url: 'https://savethedate-lejardin.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Le Jardin envelope' },
    { id: 'env_lacephotoscratch', name: 'Lace Photo Scratch', url: 'https://savethedate-lacephotoscratch.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Lace Photo Scratch envelope' },
    { id: 'env_oasisroyale', name: 'Oasis Royale', url: 'https://savethedate-oasisroyale.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Oasis Royale envelope' },
    { id: 'env_tropical', name: 'Tropical', url: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4', color: '#f3e5d8', desc: 'Tropical envelope' },
    { id: 'env_photoscratch', name: 'Photo Scratch', url: 'https://savethedate-photo-scratch.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Photo Scratch envelope' },
    { id: 'env_softscratch', name: 'Soft Scratch', url: 'https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Soft Scratch envelope' },
    { id: 'env_cisnes', name: 'Cisnes', url: 'https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Cisnes envelope' },
    { id: 'env_bloom', name: 'Bloom', url: 'https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Bloom envelope' },
    { id: 'env_floral_new', name: 'Floral New', url: 'https://savethedate-floral.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8', desc: 'Floral envelope' },
    { id: 'env_custom', name: 'Custom Upload', url: 'custom', color: '#888', desc: 'Upload your own envelope video' },
  ];

  const AVAILABLE_HERO_VIDEOS = [
    { id: 'hero_couple', name: 'Kissing Couple', url: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', color: '#1a1a1a', desc: 'Romantic couple embrace' },
    { id: 'hero_seaview', name: 'Sea View', url: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', color: '#8fb1cc', desc: 'Beautiful ocean balcony view' },
    { id: 'hero_palm', name: 'Palm Zoom', url: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', color: '#7ba08a', desc: 'Tropical palm leaves zoom' },
    { id: 'hero_car', name: 'Just Married Car', url: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', color: '#a08b76', desc: 'Classic vintage getaway car' },
    { id: 'hero_castle', name: 'Castle', url: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', color: '#8b8b83', desc: 'Majestic castle reveal' },
    { id: 'hero_royal', name: 'Royal Heritage', url: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', color: '#3d4742', desc: 'Elegant palace archway' },
    { id: 'hero_sea_anim', name: 'Sea Animation', url: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', color: '#567c9c', desc: 'Animated ocean waves' },
    { id: 'hero_sea_balcony', name: 'Seaview Balcony', url: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', color: '#a9b7c2', desc: 'Coastal balcony view' },
    { id: 'hero_thelaceedit', name: 'The Lace Edit', url: 'https://savethedate-thelaceedit.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', color: '#f3e5d8', desc: 'The Lace Edit hero' },
    { id: 'hero_lejardin', name: 'Le Jardin', url: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/0d44b575-21a3-498b-856a-eaf9614d23c6/hero-video-compressed.mp4', color: '#f3e5d8', desc: 'Le Jardin hero' },
    { id: 'hero_lacephotoscratch', name: 'Lace Photo Scratch', url: 'https://savethedate-lacephotoscratch.thedigitalyes.com/assets/hero-scratch-cover-reference-CIK32eF4.png', color: '#f3e5d8', desc: 'Lace Photo Scratch hero' },
    { id: 'hero_oasisroyale', name: 'Oasis Royale', url: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4', color: '#f3e5d8', desc: 'Oasis Royale hero' },
    { id: 'hero_tropical', name: 'Tropical', url: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4', color: '#f3e5d8', desc: 'Tropical hero' },
    { id: 'hero_bloom', name: 'Bloom', url: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', color: '#f3e5d8', desc: 'Bloom hero' },
    { id: 'hero_custom', name: 'Custom Upload', url: 'custom', color: '#888', desc: 'Upload your own hero video' },
  ];

  const AVAILABLE_SOUNDS = [
    { id: 'sound_none', name: 'No Music', url: '', desc: 'Silent experience' },
    { id: 'sound_autumn', name: 'Autumn Wind', url: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/cbc31a31-f746-4167-a1a1-800f6bfbe346/autumn-wind.mp3', desc: 'Gentle acoustic guitar' },
    { id: 'sound_lace', name: 'Lace Romance', url: 'https://savethedate-lacephotoscratch.thedigitalyes.com/__l5e/assets-v1/7fabed49-0b68-47b7-b210-0dcc4eae3cb9/background-music.mp3', desc: 'Soft romantic piano' },
    { id: 'sound_tropical', name: 'Tropical Vibes', url: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/3d842fb0-cf11-4a32-adb8-a961c95045ac/background-music.mp3', desc: 'Upbeat tropical rhythm' },
    { id: 'sound_bloom', name: 'Bloom Wind', url: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/cbc31a31-f746-4167-a1a1-800f6bfbe346/autumn-wind.mp3', desc: 'Bloom acoustic wind' },
    { id: 'sound_custom', name: 'Custom Upload', url: 'custom', desc: 'Upload your own audio file' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      

      {/* Visible Sections */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Visible Sections</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'showIntro', label: 'Introduction' },
            { key: 'showVenue', label: 'Venue' },
            { key: 'showSchedule', label: 'Schedule' },
            { key: 'showDressCode', label: 'Dress Code' },
            { key: 'showGallery', label: 'Photo Gallery' },
            { key: 'showRSVP', label: 'RSVP Form' }
          ].map(sec => {
            const isVisible = local.sections?.[sec.key] !== false;
            return (
              <label key={sec.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isVisible}
                  onChange={(e) => {
                    const newSections = { ...(local.sections || {}) };
                    newSections[sec.key] = e.target.checked;
                    handleChange('sections', newSections);
                  }}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: '#5C3A1E' }}
                />
                <span style={{ fontSize: '0.95rem', color: '#1a1a1a' }}>{sec.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Media & Videos */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Envelope Video Selection */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span>🎨</span> Envelope Design Template
            </h2>
            <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {AVAILABLE_ENVELOPE_VIDEOS.map(env => (
                <div 
                  key={env.id}
                  onClick={() => {
                    const newState = { ...(local.videos || {}) };
                    if (env.url === 'custom') {
                      newState.envelope = 'custom';
                    } else {
                      newState.envelope = env.url;
                    }
                    handleChange('videos', newState);
                  }}
                  style={{
                    minWidth: '280px',
                    border: local.videos?.envelope === env.url || (local.videos?.envelope && !AVAILABLE_ENVELOPE_VIDEOS.find(v => v.url === local.videos.envelope) && env.id === 'env_custom') || (local.videos?.envelope === 'custom' && env.id === 'env_custom') ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    backgroundColor: local.videos?.envelope === env.url ? '#fbf8f9' : '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <HoverVideoThumbnail url={env.url} fallbackColor={env.color} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>{env.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.3 }}>{env.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {local.videos?.envelope === 'custom' || (!AVAILABLE_ENVELOPE_VIDEOS.find(v => v.url === local.videos?.envelope) && local.videos?.envelope && local.videos?.envelope !== 'custom') ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StyledFileInput accept="video/*" label="Upload Envelope Video" onChange={e => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newState = { ...(local.videos || {}) };
                      newState.envelope = reader.result;
                      handleChange('videos', newState);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
              </div>
            ) : null}
          </div>

          {/* Hero Video Selection */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span>🎨</span> Hero Design Template
            </h2>
            <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {AVAILABLE_HERO_VIDEOS.map(hero => (
                <div 
                  key={hero.id}
                  onClick={() => {
                    const newState = { ...(local.videos || {}) };
                    if (hero.url === 'custom') {
                      newState.hero = 'custom';
                    } else {
                      newState.hero = hero.url;
                    }
                    handleChange('videos', newState);
                  }}
                  style={{
                    minWidth: '280px',
                    border: local.videos?.hero === hero.url || (local.videos?.hero && !AVAILABLE_HERO_VIDEOS.find(v => v.url === local.videos.hero) && hero.id === 'hero_custom') || (local.videos?.hero === 'custom' && hero.id === 'hero_custom') ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    backgroundColor: local.videos?.hero === hero.url ? '#fbf8f9' : '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <HoverVideoThumbnail url={hero.url} fallbackColor={hero.color} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>{hero.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.3 }}>{hero.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {local.videos?.hero === 'custom' || (!AVAILABLE_HERO_VIDEOS.find(v => v.url === local.videos?.hero) && local.videos?.hero && local.videos?.hero !== 'custom') ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StyledFileInput accept="video/*" label="Upload Hero Video" onChange={e => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newState = { ...(local.videos || {}) };
                      newState.hero = reader.result;
                      handleChange('videos', newState);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
              </div>
            ) : null}
          </div>

          {/* Background Music Selection */}
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span>🎵</span> Background Music
            </h2>
            <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {AVAILABLE_SOUNDS.map(sound => (
                <div 
                  key={sound.id}
                  onClick={() => {
                    const newState = { ...(local.sounds || {}) };
                    if (sound.url === 'custom') {
                      newState.bgMusic = 'custom';
                    } else {
                      newState.bgMusic = sound.url;
                    }
                    handleChange('sounds', newState);
                  }}
                  style={{
                    minWidth: '220px',
                    border: local.sounds?.bgMusic === sound.url || (!local.sounds?.bgMusic && sound.url === '') || (local.sounds?.bgMusic && !AVAILABLE_SOUNDS.find(v => v.url === local.sounds.bgMusic) && sound.id === 'sound_custom') || (local.sounds?.bgMusic === 'custom' && sound.id === 'sound_custom') ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    backgroundColor: local.sounds?.bgMusic === sound.url || (!local.sounds?.bgMusic && sound.url === '') ? '#fbf8f9' : '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a' }}>{sound.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.3 }}>{sound.desc}</div>
                </div>
              ))}
            </div>
            {local.sounds?.bgMusic === 'custom' || (!AVAILABLE_SOUNDS.find(v => v.url === local.sounds?.bgMusic) && local.sounds?.bgMusic && local.sounds?.bgMusic !== 'custom') ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StyledFileInput accept="audio/*" label="Upload Audio Track" onChange={e => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newState = { ...(local.sounds || {}) };
                      newState.bgMusic = reader.result;
                      handleChange('sounds', newState);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
              </div>
            ) : null}
          </div>

          {/* Venue Image Upload */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span>🎨</span> Venue Design Template (Replaces Map)
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {local.images?.venue && (
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eee' }}>
                  <img src={local.images.venue} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <StyledFileInput 
                accept="image/*"
                label="Upload Venue Image"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newState = { ...(local.images || {}) };
                      newState.venue = reader.result;
                      handleChange('images', newState);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {local.images?.venue && (
                <button 
                  onClick={() => {
                    const newState = { ...(local.images || {}) };
                    delete newState.venue;
                    handleChange('images', newState);
                  }}
                  style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dress Code */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>👔 Dress Code</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Description du Dress Code</label>
            <input 
              type="text" 
              value={local.dressCode?.text || ''}
              onChange={(e) => handleChange('dressCode', { ...local.dressCode, text: e.target.value })}
              placeholder="Ex: Tenue de soirée, tons pastels..."
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e0dcd7', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Illustration (Image)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {(local.dressCode?.image || "/images/dress_code_floral.png") && (
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0dcd7', flexShrink: 0 }}>
                  <img src={local.dressCode?.image || "/images/dress_code_floral.png"} alt="Dress Code" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <StyledFileInput 
                accept="image/*"
                label="Upload Image"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => handleChange('dressCode', { ...local.dressCode, image: reader.result });
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              {local.dressCode?.image && (
                <button 
                  onClick={() => {
                    const newState = { ...(local.dressCode || {}) };
                    delete newState.image;
                    handleChange('dressCode', newState);
                  }}
                  style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Memories Gallery */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Memories (Slider)</h2>
        <div style={{ marginBottom: '1rem' }}>
          <StyledFileInput 
            accept="image/*"
            multiple
            label="Upload Photos"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const currentGallery = local.gallery || [];
                  handleChange('gallery', [...currentGallery, reader.result]);
                };
                reader.readAsDataURL(file);
              });
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {(local.gallery || []).map((img, idx) => (
            <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              <button 
                onClick={() => {
                  const newGallery = [...local.gallery];
                  newGallery.splice(idx, 1);
                  handleChange('gallery', newGallery);
                }}
                style={{ position: 'absolute', top: -5, right: -5, background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem' }}
              >✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Gallery */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Guest Photo Gallery</h2>
        <div style={{ marginBottom: '1rem' }}>
          <StyledFileInput 
            accept="image/*"
            multiple
            label="Upload Photos"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const currentGuestGallery = local.guestGallery || [];
                  handleChange('guestGallery', [...currentGuestGallery, reader.result]);
                };
                reader.readAsDataURL(file);
              });
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {(local.guestGallery || []).map((img, idx) => (
            <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <img src={img} alt={`Guest Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              <button 
                onClick={() => {
                  const newGallery = [...local.guestGallery];
                  newGallery.splice(idx, 1);
                  handleChange('guestGallery', newGallery);
                }}
                style={{ position: 'absolute', top: -5, right: -5, background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem' }}
              >✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Magic Section (Signature Only) */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)' }}>✨ AI Magic</h2>
          {plan !== 'Signature' && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
              Signature Exclusive
            </span>
          )}
        </div>
        
        {plan !== 'Signature' ? (
          <div style={{ backgroundColor: '#fff8f6', border: '1px solid #fce8e6', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>🔒</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>Unlock AI Features</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>Create custom AI videos, images, and ambient sounds.</p>
              </div>
            </div>
            <button style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', border: 'none', backgroundColor: '#5C3A1E', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Upgrade Plan
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Seedance Remix Mock */}
            <div style={{ border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>🎬 AI Video Remix (Seedance)</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Upload two clear face photos to remix yourselves into the Hero Video.</p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Partner 1 Face</label>
                  <StyledFileInput accept="image/*" label="Upload Face 1" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Partner 2 Face</label>
                  <StyledFileInput accept="image/*" label="Upload Face 2" />
                </div>
              </div>
              <button onClick={() => alert("Simulating Seedance AI Video Remix... this would replace data.videos.hero")} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>✨ Remix Video</button>
            </div>

            {/* Nano Banana Image Gen Mock */}
            <div style={{ border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>🎨 AI Image Generator (Max 10)</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="e.g. Elegant watercolor glasses of champagne..." style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => alert("Simulating AI Image Gen... Image would be added to the gallery array.")} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Generate</button>
              </div>
            </div>

            {/* Suno Audio Gen Mock */}
            <div style={{ border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>🎵 AI Sound Generator (Max 5)</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="e.g. Soft romantic acoustic guitar..." style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => alert("Simulating AI Sound Gen... Audio would be set to data.sounds.intro")} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Generate</button>
              </div>
              {local.sounds?.intro && (
                <div style={{ fontSize: '0.85rem', color: '#2e7d32' }}>✅ Custom AI intro sound is active.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Wedding Details */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Basic Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Partner 1</label>
              <input type="text" value={local.partner1 || ''} onChange={e => handleChange('partner1', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Partner 2</label>
              <input type="text" value={local.partner2 || ''} onChange={e => handleChange('partner2', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Displayed Date</label>
            <input type="text" value={local.date || ''} onChange={e => handleChange('date', e.target.value)} style={inputStyle} placeholder="MAY 27, 2026" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Venue Name</label>
              <input type="text" value={local.ceremonyVenue || ''} onChange={e => handleChange('ceremonyVenue', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input type="text" value={local.receptionVenue || ''} onChange={e => handleChange('receptionVenue', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule / Timeline */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(local.timeline || []).map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <input type="text" value={item.time} onChange={e => handleTimelineChange(idx, 'time', e.target.value)} style={inputStyle} placeholder="Time" />
              <input type="text" value={item.title} onChange={e => handleTimelineChange(idx, 'title', e.target.value)} style={inputStyle} placeholder="Event" />
            </div>
          ))}
        </div>
      </div>

      {/* Accommodations */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Accommodations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(local.accommodations || []).map((acc, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <input type="text" value={acc.name} onChange={e => handleAccommodationsChange(idx, 'name', e.target.value)} style={inputStyle} placeholder="Hotel Name" />
              <input type="text" value={acc.price} onChange={e => handleAccommodationsChange(idx, 'price', e.target.value)} style={inputStyle} placeholder="Price" />
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Menu</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(local.menu || []).map((m, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <input type="text" value={m.course} onChange={e => handleMenuChange(idx, 'course', e.target.value)} style={inputStyle} placeholder="Course (Starter...)" />
              <input type="text" value={m.dish} onChange={e => handleMenuChange(idx, 'dish', e.target.value)} style={inputStyle} placeholder="Dish Name" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
