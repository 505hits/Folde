import Link from "next/link";
import styles from "./method.module.css";

export const metadata = {
  title: "Nuestro proceso | FOLDÈ Design — Cómo creamos tu invitación digital de boda",
  description: "Descubre nuestro proceso de 4 pasos para diseñar tu invitación digital de boda premium.",
};

const steps = [
  {
    num: '01',
    title: 'Reserva tu llamada inicial',
    desc: 'Todo comienza con una conversación. Nos tomamos el tiempo para comprender vuestro evento, vuestras preferencias estéticas y todo lo que hace única vuestra celebración. Esta primera llamada es gratuita y sin compromiso.',
    details: [
      'Entender el tema y la visión de vuestra boda',
      'Hablar de calendario, invitados y fechas clave',
      'Resolver vuestras preguntas sobre invitaciones digitales',
      'Recomendar el plan ideal para vuestras necesidades',
    ],
  },
  {
    num: '02',
    title: 'Comparte los detalles del evento',
    desc: 'Una vez definida la dirección, nos compartís la información esencial. Os guiamos para que no se pase nada por alto, desde el horario de ceremonia hasta las opciones de alojamiento.',
    details: [
      'Fecha, lugar y horario de la ceremonia',
      'Fotos de la pareja para la portada',
      'Alojamiento y detalles de viaje de los invitados',
      'Preferencias RSVP y opciones alimentarias',
    ],
  },
  {
    num: '03',
    title: 'Diseñamos vuestra invitación',
    desc: 'Nuestro equipo da vida a vuestra visión. Creamos una invitación digital a medida con el universo de diseño elegido, integrando contenido, fotos y detalles personales. Refinamos cada elemento con vuestro feedback.',
    details: [
      'Diseño a medida basado en vuestro universo elegido',
      'Integración de foto o vídeo de portada',
      'Selección musical y apertura inmersiva',
      'Revisiones ilimitadas hasta que os encante',
    ],
  },
  {
    num: '04',
    title: 'Compártela con tus invitados',
    desc: 'Recibiréis vuestra invitación final en un enlace elegante. Compartidla por WhatsApp, email o cualquier plataforma de mensajería. Los invitados solo tienen que tocar para abrirla y responder al RSVP desde su móvil.',
    details: [
      'Un enlace para todos los invitados, sin aplicación',
      'Comparte por WhatsApp, iMessage, email o redes sociales',
      'Seguimiento RSVP en tiempo real desde tu panel',
      'Actualiza detalles en cualquier momento sin reenviar',
    ],
  },
];

export default function Method() {
  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero */}
        <section className={styles.hero}>
          <span className="label animate-fade-in-up">Nuestro método</span>
          <h1 className="heading-xl animate-fade-in-up delay-1">
            Una experiencia guiada, diseñada a vuestro alrededor
          </h1>
          <p className="text-lg animate-fade-in-up delay-2">
            Crear vuestra invitación digital de boda debe sentirse sencillo. Nuestro proceso cuida cada detalle para que podáis centraros en lo que realmente importa.
          </p>
        </section>

        {/* Steps */}
        <section className={styles.stepsSection}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepRow}>
              <div className={styles.stepLeft}>
                <span className={styles.stepNum}>{step.num}</span>
                <h2 className="heading-lg">{step.title}</h2>
                <p className="text-lg" style={{ marginTop: '1rem' }}>{step.desc}</p>
              </div>
              <div className={styles.stepRight}>
                <ul className={styles.stepDetails}>
                  {step.details.map((d, j) => (
                    <li key={j}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom promise */}
        <section className={styles.promiseSection}>
          <div className={styles.promiseGrid}>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>⏱</div>
              <h3 className="heading-sm">Lista en 5–7 días</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>De la primera llamada al enlace final, vuestra invitación se entrega en una semana con todas las revisiones incluidas.</p>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>♾️</div>
              <h3 className="heading-sm">Revisiones ilimitadas</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>Perfeccionamos cada detalle hasta que estéis totalmente satisfechos. Sin costes ocultos ni límite de revisiones.</p>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>🤝</div>
              <h3 className="heading-sm">Soporte dedicado</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>Un único contacto durante todo el proceso. Tus preguntas siempre reciben una respuesta rápida.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className="heading-lg">¿Listos para empezar?</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem' }}>Elige tu universo y completa el pedido.</p>
          <Link href="/checkout" className="btn-primary" style={{ marginTop: '2rem' }}>Crear ahora</Link>
        </section>

      </div>
    </div>
  );
}
