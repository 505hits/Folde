"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useDatabase } from "@/context/DatabaseContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useDatabase();
  const pathname = usePathname();
  const locale = pathname?.startsWith('/es') ? 'es' : pathname?.startsWith('/fr') ? 'fr' : 'en';
  const localizedPath = (pathname || '/').replace(/^\/(es|fr)(?=\/|$)/, '') || '/';
  const localePath = (target) => target === 'en' ? localizedPath : (localizedPath === '/' ? `/${target}` : `/${target}${localizedPath}`);
  const copy = {
    es: {
    home: 'Inicio', collections: 'Colecciones', process: 'Nuestro proceso', packages: 'Planes', journal: 'Revista', about: 'Nosotros',
    dashboard: 'Mi panel', signIn: 'Iniciar sesión / Registrarse', order: 'Crear invitación', logout: 'Cerrar sesión', menu: 'Abrir o cerrar el menú'
    },
    fr: {
      home: 'Accueil', collections: 'Collections', process: 'Notre méthode', packages: 'Formules', journal: 'Journal', about: 'À propos',
      dashboard: 'Mon tableau de bord', signIn: 'Se connecter / S’inscrire', order: 'Créer mon invitation', logout: 'Se déconnecter', menu: 'Ouvrir ou fermer le menu'
    },
    en: {
    home: 'Home', collections: 'Collections', process: 'Our Process', packages: 'Packages', journal: 'Journal', about: 'About',
    dashboard: 'My Dashboard', signIn: 'Sign In / Register', order: 'Order Now', logout: 'Log Out', menu: 'Toggle menu'
    }
  };
  const t = copy[locale];
  const link = (path) => locale === 'en' ? path : (path === '/' ? `/${locale}` : `/${locale}${path}`);

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
          <Link href={link('/')} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src="/images/logo.png" alt={locale === 'es' ? "Logotipo de FOLDÈ Design" : locale === 'fr' ? "Logo FOLDÈ Design" : "FOLDÈ Design Logo"} style={{ height: '75px', width: 'auto', objectFit: 'contain' }} />
          </Link>
        </div>
        <nav className="header-nav">
          <Link href={link('/')}>{t.home}</Link>
          <Link href={link('/collections')}>{t.collections}</Link>
          <Link href={link('/approach')}>{t.process}</Link>
          <Link href={link('/packages')}>{t.packages}</Link>
          <Link href={link('/blog')}>{t.journal}</Link>
          <Link href={link('/story')}>{t.about}</Link>
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
              {t.dashboard}
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
              {t.signIn}
            </Link>
          )}
          <Link href="/checkout" className="btn-primary header-cta">
            {t.order}
          </Link>
          {['en', 'es', 'fr'].filter((item) => item !== locale).map((item) => <Link key={item} href={localePath(item)} hrefLang={item} lang={item} style={{ fontSize: '.75rem', fontWeight: 700, color: '#5C3A1E', textDecoration: 'none', letterSpacing: '.05em' }}>{item.toUpperCase()}</Link>)}
        </div>
        <button
          className={`burger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={t.menu}
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
            <Link href={link('/')} onClick={closeMenu}>{t.home}</Link>
            <Link href={link('/collections')} onClick={closeMenu}>{t.collections}</Link>
            <Link href={link('/approach')} onClick={closeMenu}>{t.process}</Link>
            <Link href={link('/packages')} onClick={closeMenu}>{t.packages}</Link>
            <Link href={link('/blog')} onClick={closeMenu}>{t.journal}</Link>
            <Link href={link('/story')} onClick={closeMenu}>{t.about}</Link>
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
                  {t.dashboard}
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  {t.logout}
                </button>
              </div>
            ) : (
              <Link href="/dashboard" onClick={closeMenu} className="mobile-auth-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                {t.signIn}
              </Link>
            )}

            <Link href="/checkout" className="btn-primary mobile-cta-btn" onClick={closeMenu}>
              {t.order}
            </Link>
            {['en', 'es', 'fr'].filter((item) => item !== locale).map((item) => <Link key={item} href={localePath(item)} hrefLang={item} lang={item} onClick={closeMenu} className="mobile-auth-btn">{{ en: 'English', es: 'Español', fr: 'Français' }[item]}</Link>)}
          </div>
        </div>
      </div>
    </>
  );
}
