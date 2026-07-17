import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="FOLDÈ Design" style={{ height: '62px', margin: '0 auto 1.5rem', display: 'block', objectFit: 'contain' }} />
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/creations">Collections</Link>
          <Link href="/method">Approach</Link>
          <Link href="/offers">Formulas</Link>
          <Link href="/vision">About Us</Link>
        </div>
        <div className="footer-links" style={{ marginTop: '1rem' }}>
          <Link href="mailto:contact@foldedesign.com">contact@foldedesign.com</Link>
        </div>
        <div className="footer-links" style={{ marginTop: '0.5rem' }}>
          <Link href="/legal">Legal Notice</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Sale</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} FOLDÈ Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
