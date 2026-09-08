import Link from "next/link";
import Image from "next/image";
import styles from "./vision.module.css";

export const metadata = {
  title: "Nuestra visión | FOLDÈ Design — Redefinimos la invitación de boda digital",
  description: "Descubre la filosofía de FOLDÈ Design. Creemos que vuestra invitación de boda debe ser tan significativa y memorable como el día de la celebración.",
};

export default function Vision() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="label animate-fade-in-up">Nuestra visión</span>
          <h1 className="heading-xl animate-fade-in-up delay-1">
            Vuestra invitación debe ser tan memorable como vuestro día
          </h1>
          <p className="text-lg animate-fade-in-up delay-2" style={{ maxWidth: '650px' }}>
            Fundamos FOLDÈ Design con una convicción sencilla: una invitación de boda es más que logística; es el primer capítulo de vuestra celebración. Merece belleza, intención y alma.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImageWrapper}>
              <Image
                src="/images/champagne.png"
                alt="Invitación de boda elegante en tonos champagne"
                width={500}
                height={600}
                className={styles.storyImage}
              />
            </div>
            <div className={styles.storyText}>
              <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>Por qué existimos</span>
              <h2 className="heading-lg">Nacimos del deseo de elevar cada detalle</h2>
              <p className="text-lg" style={{ marginTop: '1.5rem' }}>
                Las invitaciones de papel tradicionales son bonitas, pero a menudo se pierden, llegan tarde o no tienen la profundidad interactiva que necesitan las celebraciones actuales. Las alternativas digitales masivas, en cambio, suelen sentirse impersonales y efímeras.
              </p>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                FOLDÈ nació entre esos dos mundos. Combinamos la elegancia atemporal de la papelería clásica con la potencia y comodidad de la tecnología digital para crear experiencias inmersivas e interactivas que vuestros invitados recordarán mucho después del último baile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Nuestros valores</span>
            <h2 className="heading-lg">Los principios que guían cada creación</h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>✦</div>
              <h3 className="heading-sm">La elegancia ante todo</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                Cada elemento visual, animación y elección tipográfica tiene una intención. Creemos que el verdadero lujo está en los detalles y cuidamos cada uno de ellos.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤲</div>
              <h3 className="heading-sm">Personal, no automático</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                Tu invitación no nace de un generador de plantillas. Nuestro equipo la crea en diálogo con vosotros. Cada proyecto es único porque cada pareja lo es.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌿</div>
              <h3 className="heading-sm">Sostenible por naturaleza</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                Una invitación totalmente digital evita residuos de papel, impresión y emisiones de envío. La elegancia y la responsabilidad no se excluyen: se refuerzan.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💡</div>
              <h3 className="heading-sm">Innovación con alma</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                Usamos tecnologías web de vanguardia —animaciones inmersivas, RSVP interactivos y paneles en tiempo real— siempre al servicio de la emoción, nunca solo del espectáculo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Difference */}
      <section className={styles.differenceSection}>
        <div className="container">
          <div className={styles.differenceInner}>
            <div className={styles.differenceText}>
              <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>Lo que nos diferencia</span>
              <h2 className="heading-lg">Más que un enlace: una experiencia</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                Cuando tus invitados tocan ese enlace, no ven solo información. Viven una revelación inmersiva: una elegante animación de apertura, música seleccionada y un recorrido por cada detalle de la celebración. Desde el programa de la ceremonia hasta las sugerencias de alojamiento, la galería de fotos y el RSVP, todo se presenta con intención.
              </p>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                Eso es lo que hace diferente a una invitación FOLDÈ. No es una página web. Es un momento.
              </p>
            </div>
            <div className={styles.differenceStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>500+</span>
                <span className={styles.statLabel}>Parejas atendidas</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>12,000+</span>
                <span className={styles.statLabel}>Invitados invitados</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>98%</span>
                <span className={styles.statLabel}>Índice de satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className={styles.commitmentSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">Nuestro compromiso</span>
            <h2 className="heading-lg">La promesa FOLDÈ</h2>
          </div>
          <div className={styles.commitGrid}>
            {[
              { title: 'Precios transparentes', desc: 'Sin costes ocultos ni sorpresas. Sabes exactamente qué pagas y qué recibes desde la primera conversación.' },
              { title: 'Revisiones ilimitadas', desc: 'Afinamos y ajustamos hasta que quedéis realmente encantados. No hay límite de iteraciones ni cargos extra por cambios.' },
              { title: 'Acceso duradero', desc: 'El enlace de vuestra invitación permanece activo el tiempo que necesitéis. Incluso después de la boda, se convierte en un precioso recuerdo digital.' },
            ].map((item, i) => (
              <div key={i} className={styles.commitCard}>
                <h4 className="heading-sm">{item.title}</h4>
                <p className="text-sm" style={{ marginTop: '0.75rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="heading-lg">Creemos algo bonito juntos</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem' }}>Vuestra historia merece una invitación a su altura.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout" className="btn-primary" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderColor: 'var(--color-background)' }}>
              Crear invitación
            </Link>
            <Link href="/collections" className="btn-secondary" style={{ borderColor: 'rgba(250,249,246,0.3)', color: 'var(--color-background)' }}>
              Explorar colecciones
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
