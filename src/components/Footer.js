import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="FOLDÈ Design" style={{ height: '62px', margin: '0 auto 1.5rem', display: 'block', objectFit: 'contain' }} />
        </div>
        <div className="footer-links">
          <Link href="/">Inicio</Link>
          <Link href="/collections">Colecciones</Link>
          <Link href="/approach">Nuestro proceso</Link>
          <Link href="/packages">Planes</Link>
          <Link href="/story">Nosotros</Link>
          <Link href="/dashboard">Panel de boda</Link>
        </div>
        <div className="footer-links" style={{ marginTop: '1rem' }}>
          <Link href="mailto:folde.wedding@gmail.com">folde.wedding@gmail.com</Link>
        </div>
        <div className="footer-links" style={{ marginTop: '0.5rem' }}>
          <Link href="/legal">Aviso legal</Link>
          <Link href="/privacy">Política de privacidad</Link>
          <Link href="/terms">Términos y condiciones</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} FOLDÈ Design. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
