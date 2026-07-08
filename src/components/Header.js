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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'inherit' }}>
            <img src="/images/logo.png" alt="Our Day Studio Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <span>Our Day Studio</span>
          </Link>
        </div>
        <nav className="header-nav">
          <Link href="/">Home</Link>
          <Link href="/templates">Gallery</Link>
          <Link href="/process">Process</Link>
          <Link href="/packages">Packages</Link>
          <Link href="/story">Our Story</Link>
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
        <Link href="/templates" onClick={closeMenu}>Gallery</Link>
        <Link href="/process" onClick={closeMenu}>Process</Link>
        <Link href="/packages" onClick={closeMenu}>Packages</Link>
        <Link href="/story" onClick={closeMenu}>Our Story</Link>
        <Link href="/checkout" className="btn-primary" onClick={closeMenu} style={{ marginTop: '1rem' }}>
          Order Now
        </Link>
      </div>
    </>
  );
}
