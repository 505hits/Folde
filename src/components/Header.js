"use client";

import Link from "next/link";
import { useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useDatabase();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src="/images/logo.png" alt="FOLDÈ Design Logo" style={{ height: '75px', width: 'auto', objectFit: 'contain' }} />
          </Link>
        </div>
        <nav className="header-nav">
          <Link href="/">Home</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/approach">Our Process</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/story">About</Link>
        </nav>
        <div className="header-cta-desktop">
          {currentUser ? (
            <Link href="/dashboard" style={{
              textDecoration: 'none', color: '#5C3A1E', fontWeight: 600, fontSize: '0.88rem',
              letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3A1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              My Dashboard
            </Link>
          ) : (
            <Link href="/dashboard" style={{
              textDecoration: 'none', color: '#5C3A1E', fontWeight: 600, fontSize: '0.88rem',
              letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C3A1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Sign In / Register
            </Link>
          )}
          <Link href="/checkout" className="btn-primary header-cta">
            Order Now
          </Link>
        </div>
        <button
          className={`burger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav-overlay ${menuOpen ? "open" : ""}`}>
        <div className="mobile-nav-content">
          <nav className="mobile-nav-links">
            <Link href="/" onClick={closeMenu}>Home</Link>
            <Link href="/collections" onClick={closeMenu}>Collections</Link>
            <Link href="/approach" onClick={closeMenu}>Our Process</Link>
            <Link href="/packages" onClick={closeMenu}>Packages</Link>
            <Link href="/story" onClick={closeMenu}>About</Link>
          </nav>

          <div className="mobile-nav-divider"></div>

          <div className="mobile-nav-actions">
            {currentUser ? (
              <div className="mobile-user-row">
                <Link href="/dashboard" onClick={closeMenu} className="mobile-auth-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  My Dashboard
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/dashboard" onClick={closeMenu} className="mobile-auth-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In / Register
              </Link>
            )}

            <Link href="/checkout" className="btn-primary mobile-cta-btn" onClick={closeMenu}>
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
