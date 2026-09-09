import Link from "next/link";
import Image from "next/image";
import styles from "./vision.module.css";

export const metadata = {
  title: "Our Vision | FOLDÈ Design — Redefining the Digital Wedding Invitation",
  description: "Discover the philosophy behind FOLDÈ Design. We believe your wedding invitation deserves to be as meaningful and memorable as the day itself.",
  alternates: { canonical: "https://www.folde-wedding.com/story", languages: { en: "https://www.folde-wedding.com/story", es: "https://www.folde-wedding.com/es/story", "x-default": "https://www.folde-wedding.com/story" } },
};

export default function Vision({ locale = 'en' }) {
  const t = (english, spanish) => locale === 'es' ? spanish : english;
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="label animate-fade-in-up">{t('Our Vision', 'Nuestra visión')}</span>
          <h1 className="heading-xl animate-fade-in-up delay-1">
            {t('Your Invitation Should Be as Memorable as Your Day', 'Vuestra invitación debe ser tan memorable como el gran día')}
          </h1>
          <p className="text-lg animate-fade-in-up delay-2" style={{ maxWidth: '650px' }}>
            {t(
              'We founded FOLDÈ Design with a simple conviction: a wedding invitation is more than logistics — it is the very first chapter of your celebration. It deserves beauty, intention, and soul.',
              'Fundamos FOLDÈ Design con una convicción sencilla: una invitación de boda es mucho más que información práctica; es el primer capítulo de vuestra celebración. Merece belleza, intención y alma.'
            )}
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
                alt={t('Elegant champagne wedding invitation', 'Invitación de boda elegante en tonos champán')}
                width={500}
                height={600}
                className={styles.storyImage}
              />
            </div>
            <div className={styles.storyText}>
              <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>{t('Why We Exist', 'Por qué existimos')}</span>
              <h2 className="heading-lg">{t('Born from a Desire to Elevate', 'Nacimos para elevar cada detalle')}</h2>
              <p className="text-lg" style={{ marginTop: '1.5rem' }}>
                {t(
                  'Traditional paper invitations are beautiful — but they often get lost, arrive late, or lack the interactive depth that modern celebrations demand. Mass-produced digital alternatives, meanwhile, feel impersonal and disposable.',
                  'Las invitaciones tradicionales de papel son bonitas, pero pueden perderse, llegar tarde o no ofrecer la profundidad interactiva que requieren las celebraciones actuales. Las alternativas digitales producidas en serie, por su parte, suelen resultar impersonales y efímeras.'
                )}
              </p>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                {t(
                  'FOLDÈ was born in the space between these two worlds. We combine the timeless elegance of classic stationery with the power and convenience of digital technology — creating immersive, interactive experiences that your guests will remember long after the last dance.',
                  'FOLDÈ nació entre esos dos mundos. Unimos la elegancia atemporal de la papelería clásica con la comodidad y las posibilidades de la tecnología digital para crear experiencias inmersivas que vuestros invitados recordarán mucho después del último baile.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{t('Our Values', 'Nuestros valores')}</span>
            <h2 className="heading-lg">{t('The Principles That Guide Every Creation', 'Los principios que guían cada creación')}</h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>✦</div>
              <h3 className="heading-sm">{t('Elegance Above All', 'La elegancia ante todo')}</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                {t('Every visual element, every animation, every typographic choice is deliberate. We believe that true luxury lies in the details — and we obsess over each one.', 'Cada elemento visual, cada animación y cada elección tipográfica responde a una intención. Creemos que el verdadero lujo reside en los detalles y cuidamos cada uno de ellos.')}
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤲</div>
              <h3 className="heading-sm">{t('Personal, Not Automated', 'Personal, no automatizado')}</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                {t('Your invitation is not generated by a template engine. It is crafted by our team, in dialogue with you. Every project is unique because every couple is unique.', 'Vuestra invitación no sale de un generador automático. Nuestro equipo la crea en diálogo con vosotros. Cada proyecto es único porque cada pareja también lo es.')}
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌿</div>
              <h3 className="heading-sm">{t('Sustainable by Nature', 'Sostenible por naturaleza')}</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                {t('A fully digital invitation means zero paper waste, no printing, and no shipping emissions. Elegance and responsibility are not mutually exclusive — they enhance each other.', 'Una invitación completamente digital evita residuos de papel, impresión y emisiones de transporte. La elegancia y la responsabilidad no se excluyen: se refuerzan mutuamente.')}
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💡</div>
              <h3 className="heading-sm">{t('Innovation with Soul', 'Innovación con alma')}</h3>
              <p className="text-sm" style={{ marginTop: '0.75rem' }}>
                {t('We harness cutting-edge web technologies — immersive animations, interactive RSVP, real-time dashboards — but always in service of emotion, never for spectacle alone.', 'Utilizamos tecnología web de vanguardia —animaciones inmersivas, confirmación interactiva y paneles en tiempo real— siempre al servicio de la emoción, nunca como mero espectáculo.')}
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
              <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>{t('What Sets Us Apart', 'Lo que nos diferencia')}</span>
              <h2 className="heading-lg">{t('More Than a Link — An Experience', 'Más que un enlace: una experiencia')}</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                {t('When your guests tap that link, they do not just see information. They experience an immersive unveiling — an elegant opening animation, curated music, and a journey through every detail of your celebration. From the ceremony schedule to accommodation suggestions, from the photo gallery to the RSVP — everything unfolds with intention.', 'Cuando vuestros invitados abren el enlace, no solo consultan información. Descubren una experiencia inmersiva: una elegante animación de apertura, música seleccionada y un recorrido por cada detalle de la celebración. Desde el horario de la ceremonia y las sugerencias de alojamiento hasta la galería de fotos y la confirmación de asistencia, todo se presenta con intención.')}
              </p>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                {t('This is what makes a FOLDÈ invitation different. It is not a webpage. It is a moment.', 'Eso es lo que distingue a una invitación FOLDÈ. No es una página web: es un momento.')}
              </p>
            </div>
            <div className={styles.differenceStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>500+</span>
                <span className={styles.statLabel}>{t('Couples Served', 'Parejas acompañadas')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{t('12,000+', '12.000+')}</span>
                <span className={styles.statLabel}>{t('Guests Invited', 'Personas invitadas')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>98%</span>
                <span className={styles.statLabel}>{t('Satisfaction Rate', 'Índice de satisfacción')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className={styles.commitmentSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{t('Our Commitment', 'Nuestro compromiso')}</span>
            <h2 className="heading-lg">{t('The FOLDÈ Promise', 'La promesa FOLDÈ')}</h2>
          </div>
          <div className={styles.commitGrid}>
            {(locale === 'es' ? [
              { title: 'Precios transparentes', desc: 'Sin costes ocultos ni sorpresas. Desde la primera conversación sabréis exactamente qué pagáis y qué recibiréis.' },
              { title: 'Revisiones ilimitadas', desc: 'Afinamos y ajustamos cada detalle hasta que el resultado os encante, sin límite de cambios ni cargos adicionales.' },
              { title: 'Acceso duradero', desc: 'El enlace de vuestra invitación seguirá activo mientras lo necesitéis y, después de la boda, podrá convertirse en un precioso recuerdo digital.' },
            ] : [
              { title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. You know exactly what you pay for and what you receive — from the very first call.' },
              { title: 'Unlimited Revisions', desc: 'We refine and adjust until you are truly delighted. There is no cap on iterations and no extra charge for changes.' },
              { title: 'Lasting Access', desc: 'Your invitation link remains active as long as you need it. Even after the wedding, it becomes a beautiful digital keepsake.' },
            ]).map((item, i) => (
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
          <h2 className="heading-lg">{t("Let's Create Something Beautiful Together", 'Creemos juntos algo extraordinario')}</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem' }}>{t('Your story deserves an invitation worthy of it.', 'Vuestra historia merece una invitación a su altura.')}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout" className="btn-primary" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderColor: 'var(--color-background)' }}>
              {t('Order Now', 'Crear invitación')}
            </Link>
            <Link href="/collections" className="btn-secondary" style={{ borderColor: 'rgba(250,249,246,0.3)', color: 'var(--color-background)' }}>
              {t('Explore Gallery', 'Explorar colecciones')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
