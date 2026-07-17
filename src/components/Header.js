"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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
          <Link href="/approach">Approach</Link>
          <Link href="/packages">Formulas</Link>
          <Link href="/story">About Us</Link>
        </nav>
        <div className="header-cta-desktop">
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
        <Link href="/" onClick={closeMenu}>Home</Link>
        <Link href="/collections" onClick={closeMenu}>Collections</Link>
        <Link href="/approach" onClick={closeMenu}>Approach</Link>
        <Link href="/packages" onClick={closeMenu}>Formulas</Link>
        <Link href="/story" onClick={closeMenu}>About Us</Link>
        <Link href="/checkout" className="btn-primary" onClick={closeMenu} style={{ marginTop: '1rem' }}>
          Order Now
        </Link>
      </div>
    </>
  );
}
