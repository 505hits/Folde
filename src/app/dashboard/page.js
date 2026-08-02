"use client";

import { useState, useRef, useEffect } from "react";

import Link from "next/link";
import StyledFileInput from '@/components/StyledFileInput';
import Hls from 'hls.js';
import Image from "next/image";
import { useDatabase } from "@/context/DatabaseContext";
import { supabase } from "@/lib/supabase";
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
  const { currentUser, login, register, loginWithGoogle, loginWithMagicLink, logout, guests, orders, eventInfo, setEventInfo, fetchGuests, revisions = {}, addRevision, publishOrderDetails } = useDatabase();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '', partnerName: '' });
  const [loginError, setLoginError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkSending, setIsMagicLinkSending] = useState(false);
  const [activeTab, setActiveTab] = useState('invitation');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [envelopeKey, setEnvelopeKey] = useState(0);

  // Revision Request State
  const [revisionComment, setRevisionComment] = useState('');
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState('');
  const [revisionError, setRevisionError] = useState('');

  // Compute userOrder securely before hooks with case-insensitive email match and safe fallback
  const fallbackOrder = {
    id: 'ORD-DEMO',
    couple: `${currentUser?.name || 'Partner 1'} et ${currentUser?.partnerName || 'Partner 2'}`,
    slug: currentUser?.name ? `${currentUser.name.toLowerCase()}-et-${(currentUser.partnerName || 'partner').toLowerCase()}` : 'emma-et-lucas',
    email: currentUser?.email || '',
    plan: 'Standard',
    price: 0,
    status: 'Live',
    paid: true,
    date: new Date().toISOString().split('T')[0],
    theme: 'bordeaux'
  };

  const userOrder = (currentUser ? orders.find(o => o.email?.toLowerCase() === currentUser.email?.toLowerCase() && o.paid) : null) || fallbackOrder;
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
          origin: typeof window !== 'undefined' ? window.location.origin : 'https://folde-wedding.com'
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
            setLoginError(result.error || 'An error occurred while signing in.');
          }
        } else {
          if (!loginForm.email || !loginForm.password) {
            setLoginError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
          }
          const result = await register(loginForm.email, loginForm.password, loginForm.name, loginForm.partnerName);
          if (!result.success) {
            setLoginError(result.error || 'An error occurred during registration.');
          } else {
            setAuthSuccessMsg('Account created successfully!');
          }
        }
      } catch (err) {
        setLoginError('An unexpected error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleGoogleAuth = async () => {
      setLoginError('');
      const result = await loginWithGoogle();
      if (!result.success) {
        setLoginError(result.error || 'Google sign-in failed.');
      }
    };

    const handleMagicLink = async () => {
      if (!loginForm.email) {
        setLoginError('Please enter your email address first.');
        return;
      }
      setLoginError('');
      setAuthSuccessMsg('');
      setIsMagicLinkSending(true);
      try {
        const result = await loginWithMagicLink(loginForm.email);
        if (!result.success) {
          setLoginError(result.error || 'Failed to send magic link.');
        } else {
          setAuthSuccessMsg('A magic sign-in link has been sent to your email!');
        }
      } catch (err) {
        setLoginError('Failed to send magic link.');
      } finally {
        setIsMagicLinkSending(false);
      }
    };

    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          boxSizing: 'border-box',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: '#b08968', marginBottom: '0.6rem' }}>
              FOLDÈ DESIGN
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
              {authMode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ color: '#777', fontSize: '0.88rem' }}>
              {authMode === 'login' ? 'Sign in to access your personal space' : 'Sign up to start customizing your invitation'}
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
                flex: 1, padding: '0.6rem', fontSize: '0.85rem', fontWeight: 600,
                borderRadius: '9px', border: 'none',
                backgroundColor: authMode === 'login' ? '#ffffff' : 'transparent',
                color: authMode === 'login' ? '#1a1a1a' : '#777',
                boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setLoginError(''); setAuthSuccessMsg(''); }}
              style={{
                flex: 1, padding: '0.6rem', fontSize: '0.85rem', fontWeight: 600,
                borderRadius: '9px', border: 'none',
                backgroundColor: authMode === 'signup' ? '#ffffff' : 'transparent',
                color: authMode === 'signup' ? '#1a1a1a' : '#777',
                boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Sign Up
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
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e5e1' }}></div>
            <span style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>or with your email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e5e1' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {authMode === 'signup' && (
              <>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Your first name</label>
                    <input
                      type="text"
                      placeholder="Emma"
                      value={loginForm.name}
                      onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #e0dcd7', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Partner's name</label>
                    <input
                      type="text"
                      placeholder="Lucas"
                      value={loginForm.partnerName}
                      onChange={e => setLoginForm({ ...loginForm, partnerName: e.target.value })}
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
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #e0dcd7', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '0.35rem' }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
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
              {isSubmitting ? 'Loading...' : authMode === 'login' ? 'Sign in →' : 'Create account →'}
            </button>

            {authMode === 'login' && (
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={isMagicLinkSending}
                style={{
                  width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e0dcd7',
                  backgroundColor: '#faf8f5', color: '#5C3A1E', fontSize: '0.84rem', fontWeight: 600,
                  cursor: isMagicLinkSending ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  transition: 'background-color 0.2s', marginTop: '0.1rem'
                }}
              >
                {isMagicLinkSending ? 'Sending...' : '✨ Send me a magic link (passwordless)'}
              </button>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.1rem', borderTop: '1px solid #f0ede9' }}>
            <Link href="/collections" style={{ color: '#b08968', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none' }}>
              Don't have an account yet? Explore collections →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========== NO ACTIVE ORDER ==========

  if (!userOrder) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf8f5', fontFamily: 'var(--font-body)', padding: '1rem', boxSizing: 'border-box' }}>
        <div style={{
          backgroundColor: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', maxWidth: '460px', width: '100%',
          boxShadow: '0 20px 50px rgba(92, 58, 30, 0.08), 0 2px 10px rgba(0, 0, 0, 0.02)', border: '1px solid rgba(224, 220, 215, 0.7)', textAlign: 'center', boxSizing: 'border-box'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1.25rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b08968" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>No active order</h1>
          <p style={{ color: '#888', marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Your personal wedding studio will become available once you choose a package and complete your order.
          </p>
          <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Signed in as <strong style={{ color: '#666' }}>{currentUser?.email}</strong>
          </p>
          <Link href="/packages" style={{ display: 'inline-block', backgroundColor: '#5C3A1E', color: '#fff', padding: '0.85rem 2.5rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
            Explore packages →
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

  // ========== CUSTOM / SUR MESURE STUDIO DASHBOARD ==========
  const isCustomOnly = userOrder.plan === 'Custom' || userOrder.plan === 'custom';
  const clientSlug = userOrder.slug;
  const clientGuests = guests[clientSlug] || [];

  if (isCustomOnly) {
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
    { id: 'aistudio', label: 'AI Studio', icon: '🎨' },
    { id: 'guests', label: 'Guest List', icon: '👥' },
    { id: 'rsvps', label: 'RSVP Responses', icon: '☑' },
    { id: 'tables', label: 'Table Management', icon: '🪑' },
    { id: 'share', label: 'Share My Site', icon: '↗' },
  ];

  const bottomTabs = [
    { id: 'contact', label: '24/7 Customer Support', icon: '✉️' },
  ];

  return (
    <div className="dashboard-layout">
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: #FAF8F6;
          font-family: var(--font-body), 'Outfit', 'Inter', sans-serif;
          color: #1a1a1a;
        }
        .dashboard-sidebar {
          width: 280px;
          background: linear-gradient(180deg, #FDFCFC 0%, #F5F2EE 100%);
          border-right: 1px solid rgba(176,137,104,0.12);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
          background-color: #FAF8F6;
        }
        .dashboard-preview {
          width: 440px;
          background-color: #F3EFE7;
          border-left: 1px solid rgba(176,137,104,0.12);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
        }
        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          margin: 0.25rem 1rem;
          border: none;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 500;
          border-radius: 12px;
          background-color: transparent;
          color: #5C4A3C;
          text-align: left;
          font-family: inherit;
          transition: all 0.2s ease-in-out;
        }
        .sidebar-nav-btn:hover {
          color: #1A120B;
          background-color: rgba(176, 137, 104, 0.08);
          transform: translateX(3px);
        }
        .sidebar-nav-btn.active {
          font-weight: 600;
          background-color: #5C3A1E;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(92, 58, 30, 0.12);
        }
        .sidebar-nav-btn.active:hover {
          transform: none;
          color: #ffffff;
          background-color: #5C3A1E;
        }
        .sidebar-card-bottom {
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid rgba(176, 137, 104, 0.16);
          margin: 1rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(92, 58, 30, 0.03);
          transition: all 0.3s ease;
        }
        .sidebar-card-bottom:hover {
          box-shadow: 0 12px 30px rgba(92, 58, 30, 0.06);
          border-color: rgba(176, 137, 104, 0.25);
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
        .premium-grad-button {
          background: linear-gradient(135deg, #b08968 0%, #8b6e5a 100%);
          transition: all 0.25s ease;
          border: none;
          box-shadow: 0 4px 14px rgba(176,137,104,0.3);
        }
        .premium-grad-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(176,137,104,0.4);
          opacity: 0.95;
        }
        .glass-header {
          background: rgba(254, 253, 252, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(176,137,104,0.08);
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
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                className={`sidebar-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.15rem', opacity: activeTab === tab.id ? 1 : 0.75 }}>{tab.icon}</span> {tab.label}
                </div>
                {tab.upgrade && userOrder?.plan === 'Essential' && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Upgrade</span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ margin: '1.25rem 1.5rem', height: '1px', backgroundColor: 'rgba(176,137,104,0.08)' }}></div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {bottomTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                className={`sidebar-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', opacity: 0.75 }}>{tab.icon}</span> {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Floating Wedding Profile Card */}
        <div className="sidebar-card-bottom">
          <div style={{ fontSize: '0.72rem', color: '#b08968', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Wedding Space</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2C1B10', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
            {clientEventInfo.partner1 || 'Partner #1'} & {clientEventInfo.partner2 || 'Partner #2'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#7E6B5C', marginBottom: '0.85rem' }}>{clientEventInfo.date || 'Upcoming Date'}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#2e7d32', backgroundColor: '#eefcf1', padding: '0.35rem 0.65rem', borderRadius: '20px', width: 'fit-content', fontWeight: 600, border: '1px solid #d1fae5', marginBottom: '0.65rem' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }}></span>
            Live Invite Link
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5C3A1E', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            👔 Premium Plan
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              marginTop: '1.1rem',
              padding: '0.55rem 0.8rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 38, 38, 0.15)',
              backgroundColor: 'rgba(254, 242, 242, 0.5)',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.borderColor = '#f87171';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(254, 242, 242, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.15)';
            }}
          >
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="dashboard-main">
        <header className="glass-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#2C1B10', fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>
              {activeTab === 'invitation' && 'Wedding Details'}
              {activeTab === 'aistudio' && 'AI Personalization Studio'}
              {activeTab === 'guests' && 'Guest List Organizer'}
              {activeTab === 'rsvps' && 'Real-Time RSVP Responses'}
              {activeTab === 'tables' && 'Table & Seating Plan'}
              {activeTab === 'share' && 'Share Digital Invitation'}
              {activeTab === 'contact' && 'Concierge Support'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={`/invite/${clientSlug}?preview=true`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.35rem', borderRadius: '30px', border: '1px solid rgba(176,137,104,0.25)', backgroundColor: '#fff', color: '#5C4A3C', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(92,58,30,0.02)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f5'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
              <span>📱</span> Live Preview Website
            </a>
            <button
              onClick={async () => {
                setIsPublishing(true);
                if (publishOrderDetails && clientSlug) {
                  await publishOrderDetails(clientSlug);
                }
                setTimeout(() => {
                  setIsPublishing(false);
                  setShowPublishModal(true);
                }, 1000);
              }}
              className="premium-grad-button"
              style={{ padding: '0.65rem 1.6rem', borderRadius: '30px', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isPublishing ? (
                <>⏳ Publishing...</>
              ) : (
                <>🔒 Publish Invite Site</>
              )}
            </button>
          </div>
        </header>

        <div style={{ padding: '1.5rem', maxWidth: '850px', width: '100%', margin: '0 auto' }}>

          <div style={{ backgroundColor: '#faf8f5', border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ fontSize: '1.3rem', color: '#5C3A1E' }}>💡</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#5C3A1E', marginBottom: '0.15rem' }}>Pro Tip for Your Guests</div>
              <div style={{ fontSize: '0.82rem', color: '#666' }}>Couples who customize their background music and photos several months in advance see the highest guest engagement and RSVP response rates.</div>
            </div>
          </div>

          {activeTab === 'invitation' && (
            <InvitationTab
              eventInfo={clientEventInfo}
              slug={clientSlug}
              setEventInfo={setEventInfo}
              allEventInfo={eventInfo}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              plan={userOrder?.plan || 'Standard'}
              orderId={userOrder?.id || ''}
              triggerReplayEnvelope={() => setEnvelopeKey(prev => prev + 1)}
            />
          )}
          {activeTab === 'aistudio' && (
            <AiStudioTab
              plan={userOrder?.plan}
              eventInfo={clientEventInfo}
              slug={clientSlug}
              setEventInfo={setEventInfo}
            />
          )}
          {activeTab === 'guests' && (
            <GuestListTab slug={clientSlug} />
          )}
          {activeTab === 'rsvps' && (
            <RsvpsTab slug={clientSlug} />
          )}
          {activeTab === 'tables' && (
            <TablesTab slug={clientSlug} />
          )}
          {activeTab === 'share' && (
            <ShareTab slug={clientSlug} />
          )}
          {activeTab === 'contact' && (
            <ContactUsTab currentUser={currentUser} />
          )}

        </div>
      </main>

      {/* 3. Right Preview Panel */}
      <aside className="dashboard-preview">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden', position: 'relative' }}>

          {/* Subtle Ambient Background Glow */}
          <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', backgroundColor: 'rgba(176,137,104,0.06)', filter: 'blur(60px)', top: '15%', left: '15%', zIndex: 0, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: '280px', height: '280px', borderRadius: '50%', backgroundColor: 'rgba(92,58,30,0.04)', filter: 'blur(80px)', bottom: '15%', right: '10%', zIndex: 0, pointerEvents: 'none' }}></div>

          <button
            onClick={() => setEnvelopeKey(prev => prev + 1)}
            style={{
              marginBottom: '1.5rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '30px',
              border: '1px solid rgba(176, 137, 104, 0.22)',
              backgroundColor: '#fff',
              color: '#5C3A1E',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 15px rgba(92, 58, 30, 0.05)',
              transition: 'all 0.2s ease',
              zIndex: 1,
              fontFamily: 'inherit',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5C3A1E';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#5C3A1E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#5C3A1E';
              e.currentTarget.style.borderColor = 'rgba(176, 137, 104, 0.22)';
            }}
          >
            <span>✉️</span> Replay Envelope Opening
          </button>

          {/* Premium Smartphone Mockup (2026 thin bezel) */}
          <div style={{
            width: '310px',
            height: '630px',
            backgroundColor: '#000000',
            borderRadius: '46px',
            padding: '10px',
            boxShadow: '0 25px 60px rgba(92, 58, 30, 0.12), 0 5px 15px rgba(0,0,0,0.08), inset 0 0 2px 2px rgba(255,255,255,0.15)',
            position: 'relative',
            zIndex: 1,
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {/* Glossy Bezel shine overlay */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              bottom: '12px',
              borderRadius: '35px',
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.03)',
              pointerEvents: 'none',
              zIndex: 10
            }}></div>

            {/* Dynamic Island Screen notch */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '85px',
              height: '24px',
              backgroundColor: '#000000',
              borderRadius: '15px',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)'
            }}>
              {/* Camera reflex */}
              <div style={{ width: '6.5px', height: '6.5px', borderRadius: '50%', backgroundColor: '#1a1f38', opacity: 0.8, marginRight: '30px' }}></div>
            </div>

            {/* Phone Screen Canvas */}
            <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: '36px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ width: '450px', zoom: 0.644, minHeight: '946px', height: '946px' }}>
                  <BordeauxTemplate key={envelopeKey} data={{ ...clientEventInfo, slug: clientSlug }} editMode={true} heroHeight="946px" />
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

function InvitationTab({ eventInfo, slug, setEventInfo, allEventInfo, selectedTheme, setSelectedTheme, plan, orderId, triggerReplayEnvelope }) {
  const { saveOrderDetails } = useDatabase();

  const defaultTabInfo = {
    date: 'May 27, 2026',
    time: '14:00',
    ceremonyVenue: 'Ocean front beach House',
    receptionVenue: 'South Dixie Highway, Homestead',
    partner1: 'Partner 1',
    partner2: 'Partner 2',
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
      showRSVP: true,
      showDressCode: true,
      showAccommodations: true,
      showMenu: true,
      showGallery: true
    },
    images: {}
  };

  const [local, setLocal] = useState(() => ({
    ...defaultTabInfo,
    ...(eventInfo || {})
  }));

  // Client-side Canvas Image Compression helper to avoid LocalStorage quota & payload limits
  const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.6) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Upload image to Supabase Storage 'media' bucket, or fallback to ultra-light compression (~12KB)
  const uploadImage = async (file) => {
    if (!file) return null;
    try {
      const fileExt = file.name ? file.name.split('.').pop().toLowerCase() : 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn("Supabase Storage bucket upload attempt failed, falling back to compression:", err);
    }

    return await compressImage(file, 500, 500, 0.6);
  };

  // Address Autocomplete State (OpenStreetMap Nominatim API - 100% free)
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const fetchAddressSuggestions = async (query) => {
    if (!query || query.trim().length < 3) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
      return;
    }
    setIsSearchingAddress(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`, {
        headers: { 'Accept-Language': 'en,fr' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAddressSuggestions(data);
        setShowAddressDropdown(data.length > 0);
      }
    } catch (e) {
      console.warn("Address search error:", e);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Debounced auto-save timeout ref to prevent network flooding and React re-render crashes while typing
  const saveTimeoutRef = useRef(null);

  const initialSlugRef = useRef(null);

  useEffect(() => {
    if (initialSlugRef.current !== slug) {
      initialSlugRef.current = slug;
      setLocal({
        ...defaultTabInfo,
        ...(eventInfo || {})
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleChange = (field, value) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setEventInfo(prev => ({ ...prev, [slug]: updated }));
      if (saveOrderDetails) {
        try {
          saveOrderDetails(slug, updated);
        } catch (e) {
          console.warn("Auto-save error:", e);
        }
      }
    }, 400);

    if (field === 'receptionVenue') {
      fetchAddressSuggestions(value);
    }
  };

  function HoverVideoThumbnail({ url, fallbackColor = '#5C3A1E' }) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    const isVideo = url && (url.endsWith('.mp4') || url.endsWith('.m3u8') || url.includes('/video/') || url.includes('/videos/') || url.includes('cloudflarestream'));
    const isImage = url && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.webp') || url.startsWith('data:image'));

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => { });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: fallbackColor,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
      >
        {/* Static Fallback / Image / Poster */}
        {isImage || !isHovered ? (
          isImage ? (
            <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : url && url.includes('cloudflarestream') ? (
            <img
              src={url.replace('manifest/video.m3u8', 'thumbnails/thumbnail.jpg?time=0s')}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : isVideo ? (
            <video
              src={url.includes('#t=') ? url : `${url}#t=0.001`}
              preload="metadata"
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: fallbackColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <span style={{ fontSize: '1.2rem' }}>🎬</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.85, textTransform: 'uppercase', marginTop: '0.1rem', fontWeight: 600 }}>Hover</span>
            </div>
          )
        ) : null}

        {/* Video element plays ONLY when hovered */}
        {isVideo && isHovered && (
          <video
            ref={videoRef}
            src={url}
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        )}
      </div>
    );
  }

  const handleTimelineChange = (index, field, value) => {
    const current = local.timeline || [
      { time: "2:00 PM", title: "Welcome Cocktail" },
      { time: "4:30 PM", title: "Wedding Ceremony" },
      { time: "7:00 PM", title: "Gala Dinner" }
    ];
    const newTimeline = [...current];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    handleChange('timeline', newTimeline);
  };

  const addTimelineItem = () => {
    const current = local.timeline || [
      { time: "2:00 PM", title: "Welcome Cocktail" },
      { time: "4:30 PM", title: "Wedding Ceremony" },
      { time: "7:00 PM", title: "Gala Dinner" }
    ];
    handleChange('timeline', [...current, { time: "8:00 PM", title: "New Event" }]);
  };

  const removeTimelineItem = (index) => {
    const current = local.timeline || [];
    const newTimeline = current.filter((_, i) => i !== index);
    handleChange('timeline', newTimeline);
  };

  const handleMenuChange = (index, field, value) => {
    const current = local.menu || [
      { course: "Starter", dish: "Seared Foie Gras or Scallop Tartare" },
      { course: "Main", dish: "Beef Tenderloin with Morel Sauce & Truffle Mash" },
      { course: "Dessert", dish: "Wedding Cake & Gourmet Dessert Buffet" }
    ];
    const newMenu = [...current];
    newMenu[index] = { ...newMenu[index], [field]: value };
    handleChange('menu', newMenu);
  };

  const addMenuItem = () => {
    const current = local.menu || [
      { course: "Starter", dish: "Seared Foie Gras or Scallop Tartare" },
      { course: "Main", dish: "Beef Tenderloin with Morel Sauce & Truffle Mash" },
      { course: "Dessert", dish: "Wedding Cake & Gourmet Dessert Buffet" }
    ];
    handleChange('menu', [...current, { course: "Course", dish: "Dish Description" }]);
  };

  const removeMenuItem = (index) => {
    const current = local.menu || [];
    const newMenu = current.filter((_, i) => i !== index);
    handleChange('menu', newMenu);
  };

  const handleAccommodationsChange = (index, field, value) => {
    const current = local.accommodations || [
      { name: "Grand Hotel", price: "$150 / night" },
      { name: "Rose Cottage Guesthouse", price: "$95 / night" }
    ];
    const newAcc = [...current];
    newAcc[index] = { ...newAcc[index], [field]: value };
    handleChange('accommodations', newAcc);
  };

  const addAccommodationItem = () => {
    const current = local.accommodations || [
      { name: "Grand Hotel", price: "$150 / night" },
      { name: "Rose Cottage Guesthouse", price: "$95 / night" }
    ];
    handleChange('accommodations', [...current, { name: "Hotel Name", price: "$100 / night" }]);
  };

  const removeAccommodationItem = (index) => {
    const current = local.accommodations || [];
    const newAcc = current.filter((_, i) => i !== index);
    handleChange('accommodations', newAcc);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1.15rem',
    borderRadius: '12px',
    border: '1px solid rgba(176,137,104,0.22)',
    fontSize: '0.92rem',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#FAF9F6',
    color: '#2C1B10',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
  };
  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5C4A3C',
    marginBottom: '0.45rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };
  const sectionStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '2.5rem 2.25rem',
    border: '1px solid rgba(176,137,104,0.15)',
    boxShadow: '0 12px 40px rgba(92, 58, 30, 0.03), 0 2px 10px rgba(0, 0, 0, 0.01)',
    marginBottom: '2.25rem',
    transition: 'all 0.3s ease'
  };

  const AVAILABLE_TEMPLATES = [
    { id: 'bordeaux', name: 'Bordeaux Elegant', desc: 'Une célébration moderne, dramatique et élégante' },
    { id: 'champagne', name: 'Champagne / Luxe Gold', desc: 'Sophistication royale avec une chaleur dorée' },
    { id: 'ivory', name: 'Ivory / Pearl', desc: 'Pur et délicat, un classique intemporel' },
    { id: 'sage', name: 'Sage / Olive Grove', desc: 'Organique et raffiné avec une touche botanique' },
    { id: 'terracotta', name: 'Terracotta / Amber', desc: 'Chaleur ensoleillée pour une ambiance méditerranéenne' },
    { id: 'chocolate', name: 'Chocolate / Mocha', desc: 'Chaleur riche et caractère chaleureux' },
    { id: 'royalbordeaux', name: 'Crimson Royal', desc: 'Bordeaux impérial dramatique et prestigieux' },
    { id: 'royalblue', name: 'Sapphire / Royal Blue', desc: 'Bleu océanique et raffiné' },
    { id: 'rosebow', name: 'Blush Ribbon', desc: 'Révélation romantique avec ruban de soie' },
    { id: 'majestic', name: 'Grand Heritage', desc: 'Une entrée cérémonielle majestueuse' },
    { id: 'thelaceedit', name: 'The Lace Edit', desc: 'Dentelle délicate et romance intemporelle' },
    { id: 'lejardin', name: 'Le Jardin', desc: 'Une célébration dans un jardin verdoyant' },
    { id: 'lacephotoscratch', name: 'Lace Photo Scratch', desc: 'Révélation à gratter élégante' },
    { id: 'oasisroyale', name: 'Oasis Royale', desc: 'Célébration grandiose dans une oasis du désert' },
    { id: 'tropical', name: 'Tropical', desc: 'Paradis tropical vibrant et naturel' },
    { id: 'photoscratch', name: 'Photo Scratch', desc: 'Révélation photo interactive' },
    { id: 'softscratch', name: 'Soft Scratch', desc: 'Effet grattage doux et élégant' },
    { id: 'cisnes', name: 'Cisnes', desc: 'Romance des cygnes élégants' },
    { id: 'bloom', name: 'Bloom', desc: 'Éclosion florale romantique' },
    { id: 'floral', name: 'Floral', desc: 'Un lit de fleurs raffiné' },
    { id: 'romanticgarden', name: 'Romantic Garden', desc: 'Jardin floral enchanté et poétique' },
    { id: 'blossomoud', name: 'Blossom Oud', desc: 'Esthétique orientale florale & oud d\'exception' },
    { id: 'dolcevita', name: 'Dolce Vita', desc: 'Romance ensoleillée sur la côte italienne' },
    { id: 'webgencytemplate5', name: 'Velvet Garden', desc: 'Luxe moderne avec détails botaniques' },
    { id: 'tildatemplate2', name: 'Noir Gold', desc: 'Luxe sombre minimaliste aux détails dorés' },
    { id: 'pressedlovecomo', name: 'Como', desc: 'Élégance de la villa du lac de Côme' },
    { id: 'pressedloveteatro', name: 'Teatro', desc: 'Début théâtral avec rideau et dorures' },
    { id: 'pressedlovethevenue', name: 'The Venue', desc: 'Célébration dans un domaine d\'exception' },
    { id: 'pressedlovesweetlove', name: 'Sweet Love', desc: 'Tons doux pêche & crème et romance délicate' },
    { id: 'pressedlovefloral', name: 'Botanical Floral', desc: 'Pétales floraux et éclosion romantique' },
    { id: 'pressedlovebigentrance', name: 'Big Entrance', desc: 'Entrée majestueuse et sceau de cire doré' },
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
    { id: 'env_romanticgarden', name: 'Romantic Garden', url: 'https://eftesa.com/assets/themes/romantic-garden/Floral-garden-intro-video.mp4', color: '#e8f0e8', desc: 'Romantic garden floral envelope' },
    { id: 'env_pressedlovecomo', name: 'Como Blue Seal', url: 'https://pressedlove.com/demo-media/shared/wax-seal-blue-e30ba1e0.mp4', color: '#0c2340', desc: 'Como wax seal blue opening' },
    { id: 'env_pressedloveenvelope', name: 'Pressed Love Envelope', url: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', color: '#221810', desc: 'Classic Pressed Love envelope opening' },
    { id: 'env_pressedlovegold', name: 'Big Entrance Gold Seal', url: 'https://pressedlove.com/demo-media/shared/wax-seal-yellow-dc798fa1.mp4', color: '#1a2744', desc: 'Regal golden wax seal opening' },
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
    { id: 'hero_romanticgarden', name: 'Romantic Garden', url: 'https://eftesa.com/assets/themes/romantic-garden/cover-video.mp4', color: '#3d4d3d', desc: 'Enchanted floral garden hero' },
    { id: 'hero_blossomoud', name: 'Blossom Oud', url: 'https://static.tildacdn.net/tild3332-3762-4233-a636-636233333133/Vector.png', color: '#4a3b32', desc: 'Blossom oud floral hero' },
    { id: 'hero_dolcevita', name: 'Dolce Vita', url: 'https://static.tildacdn.net/tild3733-3133-4232-b033-623736623262/romantic-moments-bea.png', color: '#d4af37', desc: 'Dolce Vita coastal hero' },
    { id: 'hero_webgencytemplate5', name: 'Velvet Garden', url: 'https://static.tildacdn.net/tild3338-6332-4463-b639-623665353237/300592484d1f31590325.png', color: '#2a3a2a', desc: 'Velvet botanical hero' },
    { id: 'hero_pressedlovecomo', name: 'Como Villa', url: 'https://pressedlove.com/demo-media/como/hero-video.mp4', color: '#0c2340', desc: 'Lake Como villa hero video' },
    { id: 'hero_pressedloveteatro', name: 'Teatro Curtain', url: 'https://pressedlove.com/demo-media/template-teatro/curtain-video-BAKLj3Y5.mp4', color: '#221810', desc: 'Teatro curtain reveal video' },
    { id: 'hero_pressedlovethevenue', name: 'The Venue Estate', url: 'https://pressedlove.com/demo-media/boda-mar-jaume/intro-video-BSNlV4m4.webm', color: '#f5f0e8', desc: 'Destination venue estate hero video' },
    { id: 'hero_pressedlovesweetlove', name: 'Sweet Love', url: 'https://pressedlove.com/demo-media/boda-laura-javier/hero-video-new-G6oopIOA.mp4', color: '#f5f5f0', desc: 'Sweet Love romantic hero video' },
    { id: 'hero_pressedlovefloral', name: 'Botanical Floral', url: 'https://pressedlove.com/demo-media/boda-maria-carlos/hero-video-1230-C27srnl9.mp4', color: '#f8f4f0', desc: 'Botanical floral video' },
    { id: 'hero_pressedlovebigentrance', name: 'Big Entrance', url: 'https://pressedlove.com/demo-media/theme-previews/theme-big-entrance.mp4', color: '#1a2744', desc: 'Big Entrance cinematic video' },
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

      {/* Unlock AI Features Banner for Non-Premium Users */}
      {plan !== 'Premium' && (
        <div style={{ backgroundColor: '#fffdfa', border: '1px solid #e8ddd4', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#c5975b', marginBottom: '0.3rem' }}>Signature Exclusive</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 0.3rem 0', fontFamily: 'var(--font-heading)' }}>Unlock AI Features</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Create custom AI photos, illustrations, and ambient soundtrack.</p>
          </div>
          <button
            type="button"
            style={{ backgroundColor: '#5C3A1E', color: '#fff', border: 'none', padding: '0.75rem 1.6rem', borderRadius: '30px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(92,58,30,0.2)' }}
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Visible Sections */}
      <div style={sectionStyle}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#5C3A1E', margin: 0, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👁️</span> Website Sections & Visibility
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.25rem' }}>
            Toggle sections on or off to customize what appears on your wedding invitation site.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {[
            { key: 'showIntro', label: 'Introduction' },
            { key: 'showVenue', label: 'Venue & Map' },
            { key: 'showSchedule', label: 'Schedule & Timeline' },
            { key: 'showAccommodations', label: 'Accommodations & Hotels' },
            { key: 'showMenu', label: 'Wedding Menu' },
            { key: 'showDressCode', label: 'Dress Code' },
            { key: 'showGallery', label: 'Memories (Photo Slider)' },
            { key: 'showRSVP', label: 'RSVP Form' },
            { key: 'showGuestGallery', label: 'Guest Photo Gallery' }
          ].map(sec => {
            const isVisible = local.sections?.[sec.key] !== false;
            return (
              <label
                key={sec.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: isVisible ? '#f4f7f4' : '#fafafa',
                  border: isVisible ? '1px solid #7b906f' : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: isVisible ? '#2e5b32' : '#777' }}>{sec.label}</span>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => {
                    const newSections = { ...(local.sections || {}) };
                    newSections[sec.key] = e.target.checked;
                    handleChange('sections', newSections);
                  }}
                  style={{ width: '1.15rem', height: '1.15rem', accentColor: '#7b906f', cursor: 'pointer' }}
                />
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
                    if (triggerReplayEnvelope) triggerReplayEnvelope();
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span>🎨</span> Hero Design Template
            </h2>

            {/* Custom AI Hero Active Banner with Remove Button */}
            {eventInfo?.customHeroImage && (
              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#c2410c', fontWeight: 600 }}>
                  🖼️ Une illustration d'art personnalisée est actuellement appliquée en arrière-plan Hero.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof setEventInfo === 'function') {
                      setEventInfo(prev => {
                        const currentSlugData = (prev && prev[slug]) ? prev[slug] : {};
                        return {
                          ...prev,
                          [slug]: {
                            ...currentSlugData,
                            customHeroImage: null,
                            images: { ...(currentSlugData.images || {}), hero: null }
                          }
                        };
                      });
                    }
                  }}
                  style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  ❌ Retirer la Photo IA
                </button>
              </div>
            )}

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
              {eventInfo?.bgMusicUrl && (
                <div
                  onClick={() => {
                    const newState = { ...(local.sounds || {}) };
                    newState.bgMusic = eventInfo.bgMusicUrl;
                    handleChange('sounds', newState);
                  }}
                  style={{
                    minWidth: '260px',
                    border: local.sounds?.bgMusic === eventInfo.bgMusicUrl ? '2px solid #5C3A1E' : '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    backgroundColor: local.sounds?.bgMusic === eventInfo.bgMusicUrl ? '#fbf8f9' : '#f0fdf4',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#166534' }}>🎶 Custom AI Soundtrack</div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>Active AI</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#166534' }}>Custom music track created in AI Studio</div>
                  <audio controls src={eventInfo.bgMusicUrl} style={{ width: '100%', height: '32px', marginTop: '0.2rem' }} onClick={e => e.stopPropagation()} />
                </div>
              )}
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
                    minWidth: '260px',
                    border: local.sounds?.bgMusic === sound.url || (!local.sounds?.bgMusic && sound.url === '') || (local.sounds?.bgMusic && !AVAILABLE_SOUNDS.find(v => v.url === local.sounds.bgMusic) && sound.id === 'sound_custom') || (local.sounds?.bgMusic === 'custom' && sound.id === 'sound_custom') ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    backgroundColor: local.sounds?.bgMusic === sound.url || (!local.sounds?.bgMusic && sound.url === '') ? '#fbf8f9' : '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a' }}>{sound.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.3 }}>{sound.desc}</div>
                  {sound.url && sound.url !== 'custom' && (
                    <audio controls src={sound.url} style={{ width: '100%', height: '32px', marginTop: '0.2rem' }} onClick={e => e.stopPropagation()} />
                  )}
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
                onChange={async (e) => {
                  if (e.target.files[0]) {
                    const imgUrl = await uploadImage(e.target.files[0]);
                    if (imgUrl) {
                      handleChange('dressCode', { ...local.dressCode, image: imgUrl });
                    }
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
            onChange={async (e) => {
              const files = Array.from(e.target.files);
              const uploadedUrls = await Promise.all(files.map(file => uploadImage(file)));
              const validUrls = uploadedUrls.filter(Boolean);
              if (validUrls.length > 0) {
                const currentGallery = local.gallery || [];
                handleChange('gallery', [...currentGallery, ...validUrls]);
              }
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
            onChange={async (e) => {
              const files = Array.from(e.target.files);
              const uploadedUrls = await Promise.all(files.map(file => uploadImage(file)));
              const validUrls = uploadedUrls.filter(Boolean);
              if (validUrls.length > 0) {
                const currentGuestGallery = local.guestGallery || [];
                handleChange('guestGallery', [...currentGuestGallery, ...validUrls]);
              }
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

      {/* AI Magic Section (Only for non-Premium / non-Signature users) */}
      {plan !== 'Premium' && plan !== 'Signature' && (
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)' }}>✨ AI Magic</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
              Signature Exclusive
            </span>
          </div>

          <div style={{ backgroundColor: '#fff8f6', border: '1px solid #fce8e6', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>🔒</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>Unlock AI Features</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>Create custom AI photos, illustrations, and ambient sounds.</p>
              </div>
            </div>
            <button style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', border: 'none', backgroundColor: '#5C3A1E', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
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
        </div>
      </div>

      {/* Wedding Details */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Basic Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Partner 1 First Name</label>
              <input type="text" value={local.partner1 || ''} onChange={e => handleChange('partner1', e.target.value)} style={inputStyle} placeholder="Partner 1 Name" />
            </div>
            <div>
              <label style={labelStyle}>Partner 2 First Name</label>
              <input type="text" value={local.partner2 || ''} onChange={e => handleChange('partner2', e.target.value)} style={inputStyle} placeholder="Partner 2 Name" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Displayed Wedding Date</label>
              <input type="text" value={local.date || ''} onChange={e => handleChange('date', e.target.value)} style={inputStyle} placeholder="MAY 27, 2026" />
            </div>
            <div>
              <label style={labelStyle}>RSVP Deadline Date (Date limite de réponse)</label>
              <input type="text" value={local.rsvpDeadline || ''} onChange={e => handleChange('rsvpDeadline', e.target.value)} style={inputStyle} placeholder="e.g. March 30th, 2026" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>🌍 Wedding Invitation Language (Langue de l'invitation)</label>
              <select
                value={local.language || 'en'}
                onChange={e => handleChange('language', e.target.value)}
                style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer', fontWeight: 500 }}
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="pt">🇵🇹 Português</option>
                <option value="ar">🇦🇪 العربية (Arabic)</option>
                <option value="ru">🇷🇺 Русский (Russian)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Venue / Estate Name</label>
              <input type="text" value={local.ceremonyVenue || ''} onChange={e => handleChange('ceremonyVenue', e.target.value)} style={inputStyle} placeholder="e.g. Château de Chantilly, Paris" />
            </div>
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Reception Address (Live Address Assistance)</label>
              <input
                type="text"
                value={local.receptionVenue || ''}
                onChange={e => handleChange('receptionVenue', e.target.value)}
                onFocus={() => { if (addressSuggestions.length > 0) setShowAddressDropdown(true); }}
                style={inputStyle}
                placeholder="e.g. 5 Rue de la Taulière, 13008 Marseille, France"
              />
              {isSearchingAddress && (
                <div style={{ position: 'absolute', right: '1rem', top: '2.4rem', fontSize: '0.8rem', color: '#888' }}>🔍 Searching...</div>
              )}

              {/* Address Autocomplete Suggestions Dropdown */}
              {showAddressDropdown && addressSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0dcd7',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 99,
                  marginTop: '0.25rem',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {addressSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        handleChange('receptionVenue', item.display_name);
                        setShowAddressDropdown(false);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.85rem',
                        color: '#333',
                        cursor: 'pointer',
                        borderBottom: idx < addressSuggestions.length - 1 ? '1px solid #f0ede9' : 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf5f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      📍 {item.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Map Live Preview using combined query */}
          {(() => {
            const mapCombinedQuery = [local.receptionVenue, local.ceremonyVenue].filter(Boolean).join(', ');
            return mapCombinedQuery ? (
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>📍</span> Interactive Location Map
                </label>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0dcd7', height: '220px', backgroundColor: '#f5f5f5' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapCombinedQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {/* Schedule / Timeline */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)' }}>⏰ Schedule & Timeline</h2>
          <button
            onClick={addTimelineItem}
            style={{ padding: '0.4rem 0.9rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add Event
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {((local.timeline && local.timeline.length > 0) ? local.timeline : [
            { time: "2:00 PM", title: "Welcome Cocktail" },
            { time: "4:30 PM", title: "Wedding Ceremony" },
            { time: "7:00 PM", title: "Gala Dinner" }
          ]).map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center' }}>
              <input type="text" value={item.time || ''} onChange={e => handleTimelineChange(idx, 'time', e.target.value)} style={inputStyle} placeholder="Time (e.g., 2:00 PM)" />
              <input type="text" value={item.title || ''} onChange={e => handleTimelineChange(idx, 'title', e.target.value)} style={inputStyle} placeholder="Event Name (e.g., Ceremony)" />
              <button
                onClick={() => removeTimelineItem(idx)}
                style={{ padding: '0.6rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Accommodations */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)' }}>🏨 Accommodations & Hotels</h2>
          <button
            onClick={addAccommodationItem}
            style={{ padding: '0.4rem 0.9rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add Hotel
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {((local.accommodations && local.accommodations.length > 0) ? local.accommodations : [
            { name: "Grand Hotel", price: "$150 / night" },
            { name: "Rose Cottage Guesthouse", price: "$95 / night" }
          ]).map((acc, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
              <input type="text" value={acc.name || ''} onChange={e => handleAccommodationsChange(idx, 'name', e.target.value)} style={inputStyle} placeholder="Hotel Name" />
              <input type="text" value={acc.price || ''} onChange={e => handleAccommodationsChange(idx, 'price', e.target.value)} style={inputStyle} placeholder="Rate / Info" />
              <button
                onClick={() => removeAccommodationItem(idx)}
                style={{ padding: '0.6rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#5C3A1E', fontFamily: 'var(--font-heading)' }}>🍽️ Wedding Menu</h2>
          <button
            onClick={addMenuItem}
            style={{ padding: '0.4rem 0.9rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add Dish
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {((local.menu && local.menu.length > 0) ? local.menu : [
            { course: "Starter", dish: "Seared Foie Gras or Scallop Tartare" },
            { course: "Main", dish: "Beef Tenderloin with Morel Sauce & Truffle Mash" },
            { course: "Dessert", dish: "Wedding Cake & Gourmet Dessert Buffet" }
          ]).map((m, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center' }}>
              <input type="text" value={m.course || ''} onChange={e => handleMenuChange(idx, 'course', e.target.value)} style={inputStyle} placeholder="Course (e.g., Starter)" />
              <input type="text" value={m.dish || ''} onChange={e => handleMenuChange(idx, 'dish', e.target.value)} style={inputStyle} placeholder="Dish Description" />
              <button
                onClick={() => removeMenuItem(idx)}
                style={{ padding: '0.6rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}

function GuestListTab({ slug }) {
  const { guests, addGuest, fetchGuests, deleteGuest } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sideFilter, setSideFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', side: 'Bride', status: 'Pending', hasPlusOne: false, plusOneName: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGuests(slug);
    const interval = setInterval(() => {
      fetchGuests(slug);
    }, 4000);
    return () => clearInterval(interval);
  }, [slug]);

  const guestList = guests[slug] || [];

  const filtered = guestList.filter(g => {
    const matchesSearch = (g.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (g.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (g.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesSide = sideFilter === 'all' || (g.side || '').toLowerCase() === sideFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSide;
  });

  const totalCount = guestList.length;
  const attendingCount = guestList.filter(g => (g.status || '').toLowerCase() === 'attending').length;
  const pendingCount = guestList.filter(g => (g.status || '').toLowerCase() === 'pending' || !g.status).length;
  const declinedCount = guestList.filter(g => (g.status || '').toLowerCase() === 'declined').length;

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;
    setLoading(true);
    await addGuest(slug, newGuest);
    setNewGuest({ name: '', email: '', side: 'Bride', status: 'Pending', hasPlusOne: false, plusOneName: '' });
    setShowAddModal(false);
    setLoading(false);
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '2rem 1.75rem',
    border: '1px solid rgba(176,137,104,0.15)',
    boxShadow: '0 12px 40px rgba(92, 58, 30, 0.03), 0 2px 10px rgba(0, 0, 0, 0.01)',
  };

  const inputStyle = {
    padding: '0.65rem 1.1rem',
    borderRadius: '12px',
    border: '1px solid rgba(176,137,104,0.22)',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#FAF9F6',
    color: '#2C1B10',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '0.75rem', color: '#7E6B5C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Invited</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2C1B10', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{totalCount}</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirmed Attending</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#166534', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{attendingCount}</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: '#fffbeb', border: '1px solid #fef3c7' }}>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Response</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#b45309', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{pendingCount}</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Declined</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#dc2626', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{declinedCount}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#2C1B10', margin: 0, fontFamily: 'var(--font-heading)' }}>👥 Guest Directory</h2>
            <p style={{ fontSize: '0.85rem', color: '#7E6B5C', marginTop: '0.25rem' }}>Manage your invitees and track who is attending your wedding.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '0.65rem 1.35rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 12px rgba(92,58,30,0.15)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.95}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            <span>+</span> Add Guest
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="attending">Attending</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e0dcd7', fontSize: '0.88rem', backgroundColor: '#fff' }}
          >
            <option value="all">All Sides</option>
            <option value="bride">Bride's Guest</option>
            <option value="groom">Groom's Guest</option>
            <option value="both">Mutual Friends</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0ede9', color: '#888' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Guest Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Side</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Plus One</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Meal</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                    No guests found. Click <strong>+ Add Guest</strong> to add one!
                  </td>
                </tr>
              ) : (
                filtered.map((g, idx) => (
                  <tr key={g.id || idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{g.name}</div>
                      {g.email && <div style={{ fontSize: '0.78rem', color: '#888' }}>{g.email}</div>}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '12px', backgroundColor: '#faf8f5', color: '#5C3A1E', border: '1px solid #e0dcd7' }}>
                        {g.side || 'Both'}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '20px',
                        backgroundColor: (g.status || '').toLowerCase() === 'attending' ? '#eefcf1' : (g.status || '').toLowerCase() === 'declined' ? '#fef2f2' : '#fffbeb',
                        color: (g.status || '').toLowerCase() === 'attending' ? '#2e7d32' : (g.status || '').toLowerCase() === 'declined' ? '#dc2626' : '#b45309'
                      }}>
                        {(g.status || 'Pending').charAt(0).toUpperCase() + (g.status || 'Pending').slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#666' }}>
                      {g.hasPlusOne || g.plusOneName ? (
                        <span>Yes ({g.plusOneName || '+1'})</span>
                      ) : 'No'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#555' }}>
                      {g.meal || '-'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete ${g.name} from guest list?`)) {
                            await deleteGuest(slug, g.id || g.name);
                          }
                        }}
                        style={{ border: 'none', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.6rem', borderRadius: '6px' }}
                        title="Delete guest"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', maxWidth: '420px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Add New Guest</h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Guest Full Name *</label>
                <input type="text" required value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} placeholder="e.g. Jean Dupont" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Email Address</label>
                <input type="email" value={newGuest.email} onChange={e => setNewGuest({ ...newGuest, email: e.target.value })} placeholder="jean@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Side</label>
                  <select value={newGuest.side} onChange={e => setNewGuest({ ...newGuest, side: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', backgroundColor: '#fff' }}>
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Status</label>
                  <select value={newGuest.status} onChange={e => setNewGuest({ ...newGuest, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', backgroundColor: '#fff' }}>
                    <option value="Pending">Pending</option>
                    <option value="Attending">Attending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid #e0dcd7', borderRadius: '8px', backgroundColor: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', backgroundColor: '#5C3A1E', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Adding...' : 'Save Guest'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RsvpsTab({ slug }) {
  const { guests, fetchGuests } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchGuests(slug);
    const interval = setInterval(() => {
      fetchGuests(slug);
    }, 4000);
    return () => clearInterval(interval);
  }, [slug]);

  const guestList = guests[slug] || [];

  // Filter items that have actual RSVP responses
  const rsvpResponses = guestList.filter(g => g.status && g.status.toLowerCase() !== 'pending');

  const filtered = rsvpResponses.filter(g => {
    const matchesSearch = (g.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (g.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (g.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalResponses = rsvpResponses.length;
  const totalAttending = rsvpResponses.filter(g => (g.status || '').toLowerCase() === 'attending').length;
  const totalDeclined = rsvpResponses.filter(g => (g.status || '').toLowerCase() === 'declined').length;

  // Compute Meal Preference Counts
  const mealCounts = {};
  rsvpResponses.forEach(g => {
    if ((g.status || '').toLowerCase() === 'attending' && g.meal && g.meal !== '-') {
      mealCounts[g.meal] = (mealCounts[g.meal] || 0) + 1;
    }
  });

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '2rem 1.75rem',
    border: '1px solid rgba(176,137,104,0.15)',
    boxShadow: '0 12px 40px rgba(92, 58, 30, 0.03), 0 2px 10px rgba(0, 0, 0, 0.01)',
  };

  const inputStyle = {
    padding: '0.55rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(176,137,104,0.22)',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#FAF9F6',
    color: '#2C1B10',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Info Banner */}
      <div style={{ backgroundColor: '#f4f7f4', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '1.4rem' }}>📱</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#2e5b32' }}>Live RSVP Response Sync</div>
          <div style={{ fontSize: '0.83rem', color: '#444' }}>These are real-time responses submitted by your guests through your published online wedding invitation.</div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={{ ...cardStyle, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎉 Confirmed Attending</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#166534', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{totalAttending}</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🤍 Regretfully Declined</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#dc2626', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{totalDeclined}</div>
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: '0.75rem', color: '#7E6B5C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>✉️ Total Responses</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2C1B10', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{totalResponses}</div>
        </div>
      </div>

      {/* Meal Breakdown Widget */}
      {Object.keys(mealCounts).length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2C1B10', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>🍽️ Meal Preference Breakdown</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            {Object.entries(mealCounts).map(([dish, count]) => (
              <div key={dish} style={{ backgroundColor: '#FAF9F6', border: '1px solid rgba(176,137,104,0.18)', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 2px 8px rgba(92,58,30,0.02)' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#5C3A1E' }}>{count}×</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2C1B10' }}>{dish}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RSVP Table */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#2C1B10', margin: 0, fontFamily: 'var(--font-heading)' }}>✉️ Submitted RSVPs</h2>
            <p style={{ fontSize: '0.85rem', color: '#7E6B5C', marginTop: '0.25rem' }}>Detailed list of all guest responses submitted via the web form.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search guest name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="all">All Responses</option>
              <option value="attending">Attending Only</option>
              <option value="declined">Declined Only</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0ede9', color: '#888' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Guest Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Response</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Dish Preference</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Accompanied / +1</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                    No submitted RSVPs found yet. Responses submitted by guests via your online invitation link will automatically appear here!
                  </td>
                </tr>
              ) : (
                filtered.map((g, idx) => (
                  <tr key={g.id || idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{g.name}</div>
                      {g.email && <div style={{ fontSize: '0.78rem', color: '#888' }}>{g.email}</div>}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '20px',
                        backgroundColor: (g.status || '').toLowerCase() === 'attending' ? '#eefcf1' : '#fef2f2',
                        color: (g.status || '').toLowerCase() === 'attending' ? '#2e7d32' : '#dc2626'
                      }}>
                        {(g.status || '').toLowerCase() === 'attending' ? 'Attending 🎉' : 'Declined 🤍'}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#333', fontWeight: 500 }}>
                      {g.meal && g.meal !== '-' ? g.meal : 'N/A'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#666' }}>
                      {g.hasPlusOne || g.plusOneName || g.accompaniedStatus !== 'alone' ? (
                        <span style={{ backgroundColor: '#faf8f5', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e0dcd7', fontSize: '0.8rem' }}>
                          {g.plusOneName ? `+1 (${g.plusOneName})` : g.accompaniedStatus === 'family' ? 'Family' : '+1'}
                        </span>
                      ) : 'Single'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#555', fontStyle: g.message ? 'italic' : 'normal' }}>
                      {g.message || 'No message'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TablesTab({ slug }) {
  const dbContext = useDatabase();
  const guestsMap = dbContext?.guests || {};
  const guestList = guestsMap[slug] || [];
  const attendingGuests = guestList.filter(g => (g.status || '').toLowerCase() === 'attending');

  const [tables, setTables] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`tables_${slug}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return [
      { id: 't1', name: 'Table 1 - Famille', capacity: 10, assignedGuestNames: [] },
      { id: 't2', name: 'Table 2 - Amis', capacity: 10, assignedGuestNames: [] },
      { id: 't3', name: 'Table 3 - VIP & Honneur', capacity: 8, assignedGuestNames: [] }
    ];
  });

  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(10);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`tables_${slug}`, JSON.stringify(tables));
    }
  }, [tables, slug]);

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const newTable = {
      id: `table_${Date.now()}`,
      name: newTableName.trim(),
      capacity: parseInt(newTableCapacity) || 10,
      assignedGuestNames: []
    };
    setTables(prev => [...prev, newTable]);
    setNewTableName('');
    setNewTableCapacity(10);
    setShowAddTableModal(false);
  };

  const handleRemoveTable = (tableId) => {
    if (confirm('Delete this table?')) {
      setTables(prev => prev.filter(t => t.id !== tableId));
    }
  };

  const handleAssignGuest = (tableId, guestName) => {
    setTables(prev => prev.map(t => {
      const cleaned = t.assignedGuestNames.filter(n => n !== guestName);
      if (t.id === tableId && guestName) {
        return { ...t, assignedGuestNames: [...cleaned, guestName] };
      }
      return { ...t, assignedGuestNames: cleaned };
    }));
  };

  const handleUnassignGuest = (guestName) => {
    setTables(prev => prev.map(t => ({
      ...t,
      assignedGuestNames: t.assignedGuestNames.filter(n => n !== guestName)
    })));
  };

  const assignedSet = new Set(tables.flatMap(t => t.assignedGuestNames));
  const unassignedGuests = attendingGuests.filter(g => !assignedSet.has(g.name));

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '2rem 1.75rem',
    border: '1px solid rgba(176,137,104,0.15)',
    boxShadow: '0 12px 40px rgba(92, 58, 30, 0.03), 0 2px 10px rgba(0, 0, 0, 0.01)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '0.75rem', color: '#7E6B5C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attending Guests</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#2C1B10', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{attendingGuests.length}</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seated Guests</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#166534', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{assignedSet.size}</div>
        </div>
        <div style={{ ...cardStyle, backgroundColor: '#fffbeb', border: '1px solid #fef3c7' }}>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unassigned Guests</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#b45309', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>{unassignedGuests.length}</div>
        </div>
      </div>

      {/* Main Seating Plan */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#2C1B10', margin: 0, fontFamily: 'var(--font-heading)' }}>🪑 Table Seating Planner</h2>
            <p style={{ fontSize: '0.85rem', color: '#7E6B5C', marginTop: '0.25rem' }}>Organize your wedding tables and assign your confirmed guests.</p>
          </div>
          <button
            onClick={() => setShowAddTableModal(true)}
            style={{ padding: '0.65rem 1.35rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 12px rgba(92,58,30,0.15)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.95}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            <span>+</span> Add Table
          </button>
        </div>

        {/* Unassigned Guests Quick Bar */}
        {unassignedGuests.length > 0 && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#b45309', fontWeight: 600 }}>Unseated Attending Guests ({unassignedGuests.length})</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {unassignedGuests.map(g => (
                <div key={g.id || g.name} style={{ backgroundColor: '#fff', border: '1px solid #fcd34d', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{g.name}</span>
                  <select
                    onChange={(e) => handleAssignGuest(e.target.value, g.name)}
                    defaultValue=""
                    style={{ fontSize: '0.75rem', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid #d97706', outline: 'none' }}
                  >
                    <option value="" disabled>Assign to table...</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.assignedGuestNames.length}/{t.capacity})</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {tables.map(table => {
            const currentCount = table.assignedGuestNames.length;
            const isFull = currentCount >= table.capacity;
            return (
              <div key={table.id} style={{ border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#faf8f5', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>{table.name}</h3>
                  <button onClick={() => handleRemoveTable(table.id)} style={{ border: 'none', background: 'none', color: '#999', cursor: 'pointer', fontSize: '0.9rem' }} title="Delete table">✕</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.78rem', color: isFull ? '#dc2626' : '#555', fontWeight: 600 }}>
                  <span>{currentCount} / {table.capacity} seats</span>
                  <span style={{ backgroundColor: isFull ? '#fef2f2' : '#eefcf1', color: isFull ? '#dc2626' : '#2e7d32', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                    {isFull ? 'Full' : 'Available'}
                  </span>
                </div>

                {/* Assigned Guests List */}
                <div style={{ minHeight: '80px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {table.assignedGuestNames.length === 0 ? (
                    <span style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', margin: 'auto' }}>No guests assigned yet</span>
                  ) : (
                    table.assignedGuestNames.map((name, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '0.25rem 0.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        <span>👤 {name}</span>
                        <button onClick={() => handleUnassignGuest(name)} style={{ border: 'none', background: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', maxWidth: '380px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Add New Table</h3>
            <form onSubmit={handleAddTable} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Table Name *</label>
                <input type="text" required value={newTableName} onChange={e => setNewTableName(e.target.value)} placeholder="e.g. Table 4 - Collègues" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Capacity (Seats)</label>
                <input type="number" min="1" max="30" value={newTableCapacity} onChange={e => setNewTableCapacity(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddTableModal(false)} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#f0ede9', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Create Table</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareTab({ slug }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/invite/${slug}` : `https://folde-wedding.com/invite/${slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) { }
  };

  const cardStyle = { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: '#faf8f5', border: '1px solid #e0dcd7', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#5C3A1E', margin: '0 0 0.4rem 0', fontFamily: 'var(--font-heading)' }}>↗️ Share Your Wedding Site</h2>
        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
          Share your online wedding invitation with your friends, family, and loved ones. Send your unique link or print your customized QR code for your physical invitations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Direct Link Sharing */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>🔗 Invitation Link</h3>
          <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '1rem' }}>Copy and send this direct web address to your guests:</p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', fontSize: '0.85rem', color: '#333', outline: 'none' }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                padding: '0.75rem 1.2rem',
                backgroundColor: copied ? '#2e7d32' : '#5C3A1E',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {copied ? 'Copied! 📋' : 'Copy Link 📋'}
            </button>
          </div>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: '0.75rem' }}>Quick Share Options</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('You are warmly invited to our wedding! View details and RSVP online here: ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0.6rem 1rem', backgroundColor: '#25D366', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              💬 WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent('Wedding Invitation')}&body=${encodeURIComponent('We would love for you to join us on our special day! View details & RSVP here: ' + shareUrl)}`}
              style={{ padding: '0.6rem 1rem', backgroundColor: '#4285F4', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              ✉️ Email
            </a>
            <a
              href={`sms:?&body=${encodeURIComponent('Check out our wedding website and RSVP here: ' + shareUrl)}`}
              style={{ padding: '0.6rem 1rem', backgroundColor: '#34A853', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              📱 SMS
            </a>
          </div>
        </div>

        {/* Card 2: QR Code Card */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', width: '100%', textAlign: 'left' }}>📱 Printable QR Code</h3>
          <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '1.25rem', width: '100%', textAlign: 'left' }}>Guests can scan this QR code with their mobile phone to open your wedding site instantly:</p>

          <div style={{ padding: '1rem', backgroundColor: '#fff', border: '2px solid #5C3A1E', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '1.25rem' }}>
            <img
              src={qrCodeUrl}
              alt="Wedding Invitation QR Code"
              style={{ width: '160px', height: '160px', display: 'block' }}
            />
          </div>

          <a
            href={qrCodeUrl}
            download={`wedding-qr-code-${slug}.png`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.65rem 1.4rem',
              backgroundColor: '#faf8f5',
              border: '1px solid #e0dcd7',
              color: '#5C3A1E',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            📥 Download QR Code PNG
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactUsTab({ currentUser }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser?.name || 'Wedding Host',
          email: currentUser?.email || 'host@foldedesign.com',
          subject: subject || 'General Inquiry',
          message: message
        })
      });
    } catch (err) { }
    setSending(false);
    setSentSuccess(true);
    setMessage('');
    setSubject('');
  };

  const cardStyle = { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ backgroundColor: '#faf8f5', border: '1px solid #e0dcd7', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#5C3A1E', margin: '0 0 0.4rem 0', fontFamily: 'var(--font-heading)' }}>✉️ Contact Us & Support</h2>
        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
          Have a question about your wedding invitation, need a custom design adjustment, or technical assistance? Send us a message directly below and our team will get back to you within 24 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📧</div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1a1a1a' }}>Direct Support</div>
          <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.2rem' }}>contact@folde-wedding.com</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1a1a1a' }}>Fast Assistance</div>
          <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.2rem' }}>Response under 24h</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1a1a1a' }}>Custom Revisions</div>
          <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.2rem' }}>Colors, fonts & music</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>Send Us a Message</h3>

        {sentSuccess ? (
          <div style={{ backgroundColor: '#f4fbf4', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32', fontSize: '1.1rem' }}>Message Sent Successfully!</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>Thank you for reaching out. Our team has received your message and will reply shortly.</p>
            <button onClick={() => setSentSuccess(false)} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>Send Another Message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Your Name</label>
                <input type="text" readOnly value={currentUser?.name || 'Wedding Host'} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Your Email</label>
                <input type="email" readOnly value={currentUser?.email || 'host@foldedesign.com'} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', backgroundColor: '#faf8f5', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Subject / Topic *</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none', backgroundColor: '#fff' }}>
                <option value="" disabled hidden>Select a topic...</option>
                <option value="Design Customization">🎨 Custom Design / Font Request</option>
                <option value="Technical Question">⚙️ Technical Assistance</option>
                <option value="General Inquiry">💬 General Question</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.3rem' }}>Your Message *</label>
              <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="How can we help with your wedding invitation?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none', resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={sending} style={{ alignSelf: 'flex-end', padding: '0.75rem 1.8rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
              {sending ? 'Sending...' : 'Send Message ✉️'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AiStudioTab({ plan, eventInfo, slug, setEventInfo }) {
  // Always unlocked for users inside the dashboard
  const isPremium = true;
  const [activeSubTab, setActiveSubTab] = useState('photo'); // 'photo' | 'music'

  // Photo state
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [couplePhoto1, setCouplePhoto1] = useState('');
  const [couplePhoto2, setCouplePhoto2] = useState('');
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const [photoRatio, setPhotoRatio] = useState('1:1');
  const [photoGenerating, setPhotoGenerating] = useState(false);
  const [photoTaskId, setPhotoTaskId] = useState(null);
  const [photoStatus, setPhotoStatus] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [generatedPhotos, setGeneratedPhotos] = useState(() => {
    if (typeof window !== 'undefined' && slug) {
      try {
        const saved = localStorage.getItem(`generated_photos_${slug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) { }
    }
    const eventPhotos = eventInfo?.aiPhotos || eventInfo?.generatedPhotos || [];
    return Array.isArray(eventPhotos) ? eventPhotos : [];
  });

  const saveGeneratedPhotos = (newPhotos) => {
    setGeneratedPhotos(newPhotos);
    if (typeof window !== 'undefined' && slug) {
      try { localStorage.setItem(`generated_photos_${slug}`, JSON.stringify(newPhotos)); } catch (e) { }
    }
    saveMediaToDatabase(undefined, undefined, newPhotos);
  };

  // 5 Credits Limit Tracking
  const [photoCreditsUsed, setPhotoCreditsUsed] = useState(() => {
    if (typeof window !== 'undefined' && slug) {
      const saved = localStorage.getItem(`photo_credits_${slug}`);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [musicCreditsUsed, setMusicCreditsUsed] = useState(() => {
    if (typeof window !== 'undefined' && slug) {
      const saved = localStorage.getItem(`music_credits_${slug}`);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Music state
  const [musicPrompt, setMusicPrompt] = useState('');
  const [isInstrumental, setIsInstrumental] = useState(true);
  const [musicGenerating, setMusicGenerating] = useState(false);
  const [musicTaskId, setMusicTaskId] = useState(null);
  const [musicStatus, setMusicStatus] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [musicError, setMusicError] = useState('');

  // File Upload Helper to upload images directly to Supabase Storage
  const handleFileUpload = async (e, setPhotoUrl, setUploadingState) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingState(true);
    setPhotoError('');

    try {
      const fileExt = file.name ? file.name.split('.').pop().toLowerCase() : 'jpg';
      const fileName = `couple_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
      const filePath = `couple_photos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          setPhotoUrl(publicUrlData.publicUrl);
          setUploadingState(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Supabase Storage upload error, using local compressed fallback:", err);
    }

    // Canvas Compression Fallback
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUrl(dataUrl);
        setUploadingState(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Save custom media directly to Supabase DB orders table
  const saveMediaToDatabase = async (heroUrl, musicUrl, aiPhotosArray) => {
    if (!slug) return;
    try {
      const payload = {};
      if (heroUrl !== undefined) payload.custom_hero_image = heroUrl;
      if (musicUrl !== undefined) payload.bg_music_url = musicUrl;
      if (aiPhotosArray !== undefined) payload.ai_photos = aiPhotosArray;
      await supabase.from('orders').update(payload).eq('slug', slug);
    } catch (err) {
      console.warn("Supabase order update notice:", err);
    }
  };

  // Actions for applying images / music to eventInfo
  const handleApplyHeroImage = (url) => {
    if (typeof setEventInfo === 'function') {
      setEventInfo(prev => {
        const currentSlugData = (prev && prev[slug]) ? prev[slug] : {};
        return {
          ...prev,
          [slug]: {
            ...currentSlugData,
            customHeroImage: url,
            images: { ...(currentSlugData.images || {}), hero: url }
          }
        };
      });
      saveMediaToDatabase(url, undefined);
      alert('✨ Photo IA appliquée comme image principale (Hero) de votre invitation !');
    }
  };

  const handleRemoveHeroImage = () => {
    if (typeof setEventInfo === 'function') {
      setEventInfo(prev => {
        const currentSlugData = (prev && prev[slug]) ? prev[slug] : {};
        return {
          ...prev,
          [slug]: {
            ...currentSlugData,
            customHeroImage: null,
            images: { ...(currentSlugData.images || {}), hero: null }
          }
        };
      });
      saveMediaToDatabase(null, undefined);
      alert('❌ Image principale IA retirée du site.');
    }
  };

  const handleAddToGallery = (url) => {
    if (typeof setEventInfo === 'function') {
      setEventInfo(prev => {
        const currentSlugData = (prev && prev[slug]) ? prev[slug] : {};
        const existingGuestGallery = currentSlugData.guestGallery || [];
        const existingMemories = currentSlugData.galleryPhotos || currentSlugData.gallery || currentSlugData.memories || [];
        const updatedGuestGallery = Array.from(new Set([url, ...existingGuestGallery]));
        const updatedMemories = Array.from(new Set([url, ...existingMemories]));
        return {
          ...prev,
          [slug]: {
            ...currentSlugData,
            guestGallery: updatedGuestGallery,
            galleryPhotos: updatedMemories,
            gallery: updatedMemories,
            memories: updatedMemories
          }
        };
      });
      saveMediaToDatabase(undefined, undefined);
      alert('🖼️ Photo IA ajoutée dans la section Souvenirs (Memories) et Galerie de votre site !');
    }
  };

  const handleApplyMusic = (audioUrl) => {
    if (typeof setEventInfo === 'function') {
      setEventInfo(prev => {
        const currentSlugData = (prev && prev[slug]) ? prev[slug] : {};
        return {
          ...prev,
          [slug]: {
            ...currentSlugData,
            bgMusicUrl: audioUrl,
            musicEnabled: true
          }
        };
      });
      saveMediaToDatabase(undefined, audioUrl);
      if (typeof setLocalData === 'function') {
        setLocalData(prev => ({
          ...prev,
          sounds: { ...(prev?.sounds || {}), bgMusic: audioUrl }
        }));
      }
      alert('🎶 AI Music applied as website background music!');
    }
  };

  const handleRemoveMusic = () => {
    if (typeof setEventInfo === 'function') {
      setEventInfo(prev => {
        const currentSlugData = (prev && prev[slug]) ? prev[slug] : {};
        return {
          ...prev,
          [slug]: {
            ...currentSlugData,
            bgMusicUrl: '',
            musicEnabled: false
          }
        };
      });
      saveMediaToDatabase(undefined, '');
      if (typeof setLocalData === 'function') {
        setLocalData(prev => ({
          ...prev,
          sounds: { ...(prev?.sounds || {}), bgMusic: '' }
        }));
      }
      alert('🔇 Background music removed from website.');
    }
  };

  const PHOTO_PRESETS = [
    {
      title: "🎨 Aquarelle Romantique",
      desc: "Jardin de roses au pastel doux",
      prompt: "Cute romantic watercolor painting of couple in a blooming rose garden for a wedding website, soft pastel lighting, whimsical dreamy atmosphere"
    },
    {
      title: "🌟 Style Pixar 3D",
      desc: "Personnages animés 3D mignons sous une arche florale",
      prompt: "Charming Pixar-style 3D animated couple standing under a floral arch in wedding attire, cute face details, happy joyful expressions"
    },
    {
      title: "🌅 Aventure Studio Ghibli",
      desc: "Illustration sous un coucher de soleil doré",
      prompt: "Dreamy Studio Ghibli style illustration of couple under golden sunset, elegant wedding dress and tuxedo, gentle breeze, anime aesthetic"
    },
    {
      title: "🏛️ Tableau d'Art Vintage",
      desc: "Portrait classique à la peinture à l'huile",
      prompt: "Elegant vintage oil painting portrait of couple smiling warmly, artistic brush strokes, fairytale romantic vibe, warm golden tones"
    }
  ];

  const MUSIC_PRESETS = [
    {
      title: "🎹 Piano & Violoncelle Calme",
      desc: "Mélodie douce et inspirante pour fond d'invitation",
      prompt: "A calm and inspiring acoustic piano and cello melody, romantic ambient background music for wedding invitation, peaceful emotional composition"
    },
    {
      title: "🎸 Guitare Acoustique Douce",
      desc: "Thème d'amour apaisant avec cordes légères",
      prompt: "Gentle acoustic guitar with soft emotional strings, peaceful love theme for wedding site, warm intimate acoustic track"
    },
    {
      title: "🥁 Pop Acoustique Joyeuse",
      desc: "Morceau dynamique et chaleureux de célébration",
      prompt: "Joyful upbeat indie acoustic pop song with happy acoustic strumming, romantic wedding celebration background music"
    },
    {
      title: "🎻 Harpe & Orchestre Féérique",
      desc: "Symphonie féérique pour un mariage de rêve",
      prompt: "Dreamy fairytale orchestral harp and violin romantic melody for wedding website, elegant cinematic score"
    }
  ];

  useEffect(() => {
    if (!photoTaskId || !photoGenerating) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai-photo?taskId=${encodeURIComponent(photoTaskId)}`);
        const data = await res.json();
        if (data.state === 'success') {
          setPhotoGenerating(false);
          setPhotoStatus('Illustration successfully generated!');
          setPhotoCreditsUsed(prev => {
            const next = prev + 1;
            if (typeof window !== 'undefined' && slug) {
              try { localStorage.setItem(`photo_credits_${slug}`, next.toString()); } catch (e) { }
            }
            return next;
          });
          if (data.resultUrls && data.resultUrls.length > 0) {
            saveGeneratedPhotos([...data.resultUrls, ...generatedPhotos]);
          }
          clearInterval(interval);
        } else if (data.state === 'fail') {
          setPhotoGenerating(false);
          setPhotoError(data.failMsg || 'Generation failed. Please try again.');
          clearInterval(interval);
        } else {
          setPhotoStatus('Generating your illustration (10-25 sec)...');
        }
      } catch (err) { }
    }, 3000);
    return () => clearInterval(interval);
  }, [photoTaskId, photoGenerating, slug]);

  useEffect(() => {
    if (!musicTaskId || !musicGenerating) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai-music?taskId=${encodeURIComponent(musicTaskId)}`);
        const data = await res.json();
        if (data.state === 'success') {
          setMusicGenerating(false);
          setMusicStatus('Music successfully composed!');
          setMusicCreditsUsed(prev => {
            const next = prev + 1;
            if (typeof window !== 'undefined' && slug) {
              try { localStorage.setItem(`music_credits_${slug}`, next.toString()); } catch (e) { }
            }
            return next;
          });
          if (data.audioUrl) {
            setGeneratedAudio(data.audioUrl);
          }
          clearInterval(interval);
        } else if (data.state === 'fail') {
          setMusicGenerating(false);
          setMusicError(data.failMsg || 'Music generation failed. Please try again.');
          clearInterval(interval);
        } else {
          setMusicStatus('Composing your wedding soundtrack (20-40 sec)...');
        }
      } catch (err) { }
    }, 4000);
    return () => clearInterval(interval);
  }, [musicTaskId, musicGenerating, slug]);

  const handleGeneratePhoto = async () => {
    if (photoCreditsUsed >= 5) {
      setPhotoError('Vous avez atteint la limite maximale de 5 illustrations IA (5/5).');
      return;
    }
    if (!photoPrompt.trim()) {
      setPhotoError('Veuillez saisir un prompt ou en sélectionner un parmi nos suggestions.');
      return;
    }
    setPhotoError('');
    setPhotoGenerating(true);
    setPhotoStatus('Initialisation de Qwen 2 Image Edit...');
    try {
      const urls = [couplePhoto1, couplePhoto2].filter(u => u && u.trim());
      const res = await fetch('/api/ai-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: photoPrompt,
          imageUrls: urls.length > 0 ? urls : undefined,
          imageSize: photoRatio
        })
      });
      const data = await res.json();
      if (!res.ok || !data.taskId) {
        setPhotoGenerating(false);
        setPhotoError(data.error || 'Erreur lors de la création de la tâche');
        return;
      }
      setPhotoTaskId(data.taskId);
    } catch (err) {
      setPhotoGenerating(false);
      setPhotoError('Erreur réseau. Veuillez réessayer.');
    }
  };

  const handleGenerateMusic = async () => {
    if (musicCreditsUsed >= 5) {
      setMusicError('Vous avez atteint la limite maximale de 5 musiques IA (5/5).');
      return;
    }
    if (!musicPrompt.trim()) {
      setMusicError('Veuillez saisir ou sélectionner un style de musique.');
      return;
    }
    setMusicError('');
    setMusicGenerating(true);
    setMusicStatus('Initialisation de Suno AI...');
    try {
      const res = await fetch('/api/ai-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          instrumental: isInstrumental,
          model: 'V4'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.taskId) {
        setMusicGenerating(false);
        setMusicError(data.error || 'Erreur lors de la génération de la musique');
        return;
      }
      setMusicTaskId(data.taskId);
    } catch (err) {
      setMusicGenerating(false);
      setMusicError('Erreur réseau. Veuillez réessayer.');
    }
  };

  const cardStyle = { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E8DDD4', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8DDD4', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 500, color: '#5C3A1E', margin: '0 0 0.4rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>Bespoke AI Studio</h2>
        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0, lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          Elevate your invitation with custom artwork illustrations and bespoke background music for an unforgettable guest experience.
        </p>
      </div>

      {/* Active Website Media Summary Banner */}
      {(eventInfo?.customHeroImage || eventInfo?.bgMusicUrl) && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
              Active custom elements on your website:
            </div>
            <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {eventInfo?.customHeroImage && <span>🖼️ Hero Illustration: <strong>Active</strong></span>}
              {eventInfo?.bgMusicUrl && <span>🎶 Musical Ambiance: <strong>Active</strong></span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {eventInfo?.customHeroImage && (
              <button onClick={handleRemoveHeroImage} style={{ background: '#fff', border: '1px solid #bbf7d0', color: '#dc2626', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                Remove Illustration
              </button>
            )}
            {eventInfo?.bgMusicUrl && (
              <button onClick={handleRemoveMusic} style={{ background: '#fff', border: '1px solid #bbf7d0', color: '#dc2626', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                Remove Music
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab Switcher with Credit Badges */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #E8DDD4', paddingBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setActiveSubTab('photo')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: activeSubTab === 'photo' ? '#5C3A1E' : '#f0ede9',
            color: activeSubTab === 'photo' ? '#fff' : '#555',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🎨 Photo & Illustration Studio</span>
          <span style={{ backgroundColor: activeSubTab === 'photo' ? 'rgba(255,255,255,0.2)' : '#e2ddd5', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>
            {Math.max(0, 5 - photoCreditsUsed)} / 5 creations
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('music')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: activeSubTab === 'music' ? '#5C3A1E' : '#f0ede9',
            color: activeSubTab === 'music' ? '#fff' : '#555',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🎵 Musical Ambiance</span>
          <span style={{ backgroundColor: activeSubTab === 'music' ? 'rgba(255,255,255,0.2)' : '#e2ddd5', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>
            {Math.max(0, 5 - musicCreditsUsed)} / 5 creations
          </span>
        </button>
      </div>

      {/* TAB 1: PHOTO IA */}
      {activeSubTab === 'photo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: '#3E2723', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>1. Select an illustration style</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {PHOTO_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setPhotoPrompt(preset.prompt)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: photoPrompt === preset.prompt ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                    backgroundColor: photoPrompt === preset.prompt ? '#FAF7F2' : '#faf8f5',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>{preset.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>{preset.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' }}>Description de l'illustration *</label>
              <textarea
                rows={3}
                value={photoPrompt}
                onChange={e => setPhotoPrompt(e.target.value)}
                placeholder="Décrivez l'illustration ou le style souhaité..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none', resize: 'vertical' }}
              />
            </div>

            {/* Reference Photos via URL */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                🔗 Links / URLs de photos de référence (Optionnel)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Photo #1 */}
                <div style={{ border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1rem', backgroundColor: '#faf8f5', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5C3A1E', marginBottom: '0.2rem' }}>Photo de référence #1</div>

                  {couplePhoto1 ? (
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0dcd7', backgroundColor: '#eee' }}>
                      <img src={couplePhoto1} alt="Reference 1" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => setCouplePhoto1('')} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#5C3A1E', color: '#fff', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: uploading1 ? 'wait' : 'pointer', transition: 'all 0.2s', opacity: uploading1 ? 0.7 : 1 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        {uploading1 ? 'Upload...' : 'Uploader image'}
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setCouplePhoto1, setUploading1)} style={{ display: 'none' }} disabled={uploading1} />
                      </label>
                      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888', margin: '0.25rem 0' }}>OU</div>
                      <input
                        type="url"
                        value={couplePhoto1}
                        onChange={e => setCouplePhoto1(e.target.value)}
                        placeholder="Coller URL"
                        style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' }}
                      />
                    </div>
                  )}
                </div>

                {/* Photo #2 */}
                <div style={{ border: '1px solid #e0dcd7', borderRadius: '12px', padding: '1rem', backgroundColor: '#faf8f5', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5C3A1E', marginBottom: '0.2rem' }}>Photo de référence #2</div>

                  {couplePhoto2 ? (
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0dcd7', backgroundColor: '#eee' }}>
                      <img src={couplePhoto2} alt="Reference 2" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => setCouplePhoto2('')} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#5C3A1E', color: '#fff', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: uploading2 ? 'wait' : 'pointer', transition: 'all 0.2s', opacity: uploading2 ? 0.7 : 1 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        {uploading2 ? 'Upload...' : 'Uploader image'}
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setCouplePhoto2, setUploading2)} style={{ display: 'none' }} disabled={uploading2} />
                      </label>
                      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888', margin: '0.25rem 0' }}>OU</div>
                      <input
                        type="url"
                        value={couplePhoto2}
                        onChange={e => setCouplePhoto2(e.target.value)}
                        placeholder="Coller URL"
                        style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', marginRight: '0.5rem' }}>Format :</label>
                <select value={photoRatio} onChange={e => setPhotoRatio(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #e0dcd7' }}>
                  <option value="1:1">1:1 (Carré)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="16:9">16:9 (Paysage)</option>
                  <option value="9:16">9:16 (Story)</option>
                </select>
              </div>

              <button
                onClick={handleGeneratePhoto}
                disabled={photoGenerating || photoCreditsUsed >= 5}
                style={{
                  padding: '0.75rem 1.8rem',
                  backgroundColor: photoCreditsUsed >= 5 ? '#a3a3a3' : '#5C3A1E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: photoCreditsUsed >= 5 ? 'not-allowed' : 'pointer'
                }}
              >
                {photoGenerating ? '🎨 Génération en cours...' : photoCreditsUsed >= 5 ? '🚫 Limite atteinte (5/5)' : 'Générer l\'Illustration'}
              </button>
            </div>

            {photoStatus && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#eefcf1', color: '#2e7d32', borderRadius: '8px', fontSize: '0.85rem' }}>
                ⏳ {photoStatus}
              </div>
            )}

            {photoError && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.85rem' }}>
                ⚠️ {photoError}
              </div>
            )}
          </div>

          {/* Generated Photos Gallery with Fixed Aspect Ratio */}
          {generatedPhotos.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: '#3E2723', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>Vos Illustrations Générées</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {generatedPhotos.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e0dcd7', backgroundColor: '#FAF7F2', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '100%', maxHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2', padding: '0.5rem 0' }}>
                      <img src={url} alt={`Illustration ${idx}`} style={{ maxWidth: '100%', maxHeight: '460px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto', borderRadius: '8px' }} />
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <button
                        onClick={() => handleApplyHeroImage(url)}
                        style={{
                          width: '100%',
                          backgroundColor: '#5C3A1E',
                          color: '#fff',
                          border: 'none',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(92,58,30,0.15)'
                        }}
                      >
                        Appliquer comme Photo Principale du site
                      </button>
                      <button
                        onClick={() => handleAddToGallery(url)}
                        style={{
                          width: '100%',
                          backgroundColor: '#fff',
                          color: '#5C3A1E',
                          border: '1px solid #5C3A1E',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Ajouter à la Galerie Photo du site
                      </button>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textAlign: 'center', fontSize: '0.78rem', color: '#666', textDecoration: 'none', marginTop: '0.2rem' }}>
                        📥 Télécharger HD
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MUSIQUE IA */}
      {activeSubTab === 'music' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: '#3E2723', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>1. Select a musical ambiance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {MUSIC_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setMusicPrompt(preset.prompt)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: musicPrompt === preset.prompt ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                    backgroundColor: musicPrompt === preset.prompt ? '#FAF7F2' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>{preset.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>{preset.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' }}>Style or musical theme *</label>
              <textarea
                rows={3}
                value={musicPrompt}
                onChange={e => setMusicPrompt(e.target.value)}
                placeholder="Describe instruments, tempo, or desired mood..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0dcd7', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isInstrumental}
                  onChange={e => setIsInstrumental(e.target.checked)}
                />
                Instrumental music only (no vocals)
              </label>

              <button
                onClick={handleGenerateMusic}
                disabled={musicGenerating || musicCreditsUsed >= 5}
                style={{
                  padding: '0.75rem 1.8rem',
                  backgroundColor: musicCreditsUsed >= 5 ? '#a3a3a3' : '#5C3A1E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: musicCreditsUsed >= 5 ? 'not-allowed' : 'pointer'
                }}
              >
                {musicGenerating ? '🎵 Composing music...' : musicCreditsUsed >= 5 ? '🚫 Limit reached (5/5)' : 'Compose Music'}
              </button>
            </div>

            {musicStatus && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#eefcf1', color: '#2e7d32', borderRadius: '8px', fontSize: '0.85rem' }}>
                ⏳ {musicStatus}
              </div>
            )}

            {musicError && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.85rem' }}>
                ⚠️ {musicError}
              </div>
            )}
          </div>

          {/* Generated Music Player */}
          {generatedAudio && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 1rem 0' }}>Your Generated Wedding Music</h3>
              <audio controls src={generatedAudio} style={{ width: '100%', marginBottom: '1.25rem' }} />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleApplyMusic(generatedAudio)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#5C3A1E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Set as Main Background Music
                </button>
                <a
                  href={generatedAudio}
                  download="wedding-background-music.mp3"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#7b906f',
                    color: '#fff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  📥 Download MP3
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
