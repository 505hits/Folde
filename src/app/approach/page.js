import Link from "next/link";
import styles from "./method.module.css";

export const metadata = {
  title: "Our Method | FOLDÈ Design — How We Create Your Digital Wedding Invitation",
  description: "Discover our streamlined 4-step process to design your premium digital wedding invitation. From consultation to delivery, we guide you every step of the way.",
  alternates: { canonical: "https://www.folde-wedding.com/approach", languages: { en: "https://www.folde-wedding.com/approach", es: "https://www.folde-wedding.com/es/approach", fr: "https://www.folde-wedding.com/fr/approach", "x-default": "https://www.folde-wedding.com/approach" } },
};

const steps = [
  {
    num: '01',
    title: 'Book Your Discovery Call',
    desc: 'It all begins with a conversation. We take the time to understand your event, your aesthetic preferences, and everything that makes your celebration unique. This initial call is free, relaxed, and comes with zero commitment.',
    details: [
      'Understand your wedding theme and vision',
      'Discuss timeline, guest count, and key dates',
      'Answer all your questions about digital invitations',
      'Recommend the ideal package for your needs',
    ],
  },
  {
    num: '02',
    title: 'Provide Your Event Details',
    desc: 'Once we align on the direction, you share the essential information for your invitation. We provide a guided framework so nothing gets overlooked — from your ceremony schedule to accommodation options for out-of-town guests.',
    details: [
      'Wedding date, venue, and ceremony schedule',
      'Photos of the couple for the cover design',
      'Guest accommodation and travel details',
      'RSVP preferences and dietary options',
    ],
  },
  {
    num: '03',
    title: 'We Design Your Invitation',
    desc: 'Our team brings your vision to life. We craft a bespoke digital invitation using the design universe you selected, integrating your content, photos, and personal touches. Every element is refined based on your feedback until it feels perfectly yours.',
    details: [
      'Custom design based on your chosen universe',
      'Cover photo or video integration',
      'Music selection and immersive opening',
      'Unlimited revisions until you are delighted',
    ],
  },
  {
    num: '04',
    title: 'Share With Your Guests',
    desc: 'Your finalized invitation is delivered as a single, elegant link. Share it via WhatsApp, email, or any messaging platform. Your guests simply tap to open an immersive, interactive experience — and RSVP directly from their phone.',
    details: [
      'One link for all your guests — no app required',
      'Share via WhatsApp, iMessage, email, or social media',
      'Real-time RSVP tracking on your personal dashboard',
      'Update details anytime without resending',
    ],
  },
];

const spanishSteps = [
  {
    num: '01',
    title: 'Reservad una llamada inicial',
    desc: 'Todo empieza con una conversación. Dedicamos el tiempo necesario a conocer vuestra celebración, vuestras preferencias estéticas y aquello que la hace única. Esta primera llamada es gratuita, distendida y sin compromiso.',
    details: [
      'Comprender el estilo y la visión de vuestra boda',
      'Comentar el calendario, el número de invitados y las fechas clave',
      'Resolver todas vuestras dudas sobre las invitaciones digitales',
      'Recomendar el plan que mejor se adapte a vuestras necesidades',
    ],
  },
  {
    num: '02',
    title: 'Compartid los detalles del evento',
    desc: 'Una vez definida la dirección, nos facilitáis la información esencial de la invitación. Os guiamos con una estructura clara para que no se pase nada por alto, desde el horario de la ceremonia hasta el alojamiento para quienes vienen de fuera.',
    details: [
      'Fecha de la boda, lugar y horario de la ceremonia',
      'Fotografías de la pareja para el diseño de portada',
      'Información de alojamiento y viaje para los invitados',
      'Preferencias de confirmación y opciones de menú',
    ],
  },
  {
    num: '03',
    title: 'Diseñamos vuestra invitación',
    desc: 'Nuestro equipo da forma a vuestra visión. Creamos una invitación digital a medida a partir del universo visual elegido e integramos vuestros textos, fotografías y detalles personales. Ajustamos cada elemento con vuestros comentarios hasta que el resultado sea plenamente vuestro.',
    details: [
      'Diseño personalizado a partir del universo elegido',
      'Integración de fotografía o vídeo de portada',
      'Selección musical y apertura inmersiva',
      'Revisiones ilimitadas hasta vuestra aprobación',
    ],
  },
  {
    num: '04',
    title: 'Compartidla con vuestros invitados',
    desc: 'Recibiréis la invitación terminada en un único enlace elegante. Podréis compartirlo por WhatsApp, correo electrónico o cualquier servicio de mensajería. Los invitados solo tienen que tocar el enlace para vivir la experiencia y confirmar su asistencia desde el móvil.',
    details: [
      'Un enlace para todos los invitados, sin instalar ninguna aplicación',
      'Envío por WhatsApp, iMessage, correo electrónico o redes sociales',
      'Seguimiento de confirmaciones en tiempo real desde vuestro panel',
      'Actualización de los datos en cualquier momento, sin reenviar el enlace',
    ],
  },
];

const frenchSteps = [
  { num: '01', title: 'Réservez votre appel découverte', desc: 'Tout commence par un échange. Nous prenons le temps de comprendre votre célébration, vos préférences esthétiques et ce qui rend votre mariage unique. Ce premier appel est gratuit, détendu et sans engagement.', details: ['Comprendre le thème et la vision de votre mariage', 'Échanger sur le calendrier, le nombre d’invités et les dates clés', 'Répondre à vos questions sur les invitations numériques', 'Vous conseiller la formule la plus adaptée'] },
  { num: '02', title: 'Partagez les détails de votre événement', desc: 'Une fois la direction définie, vous nous transmettez les informations essentielles. Notre questionnaire guidé permet de ne rien oublier, du programme de la cérémonie aux hébergements proposés aux invités venant de loin.', details: ['Date, lieu et programme de la cérémonie', 'Photos du couple pour la couverture', 'Informations de voyage et d’hébergement', 'Préférences RSVP et choix de repas'] },
  { num: '03', title: 'Nous créons votre invitation', desc: 'Notre équipe donne vie à votre vision. Nous réalisons une invitation numérique sur mesure à partir de l’univers choisi et intégrons vos textes, vos photos et vos détails personnels. Chaque élément est affiné avec vous jusqu’au résultat idéal.', details: ['Création personnalisée à partir de l’univers choisi', 'Intégration d’une photo ou vidéo de couverture', 'Sélection musicale et ouverture immersive', 'Révisions illimitées jusqu’à votre validation'] },
  { num: '04', title: 'Partagez-la avec vos invités', desc: 'Votre invitation finalisée vous est remise sous la forme d’un lien unique et élégant. Partagez-le par WhatsApp, courriel ou messagerie : vos invités ouvrent l’expérience sur leur téléphone et répondent directement.', details: ['Un lien pour tous vos invités, sans application', 'Partage par WhatsApp, iMessage, courriel ou réseaux sociaux', 'Suivi des RSVP en temps réel dans votre tableau de bord', 'Mise à jour possible sans renvoyer le lien'] }
];

const approachCopy = {
  en: {
    label: 'Our Method',
    title: 'A Guided Experience, Designed Around You',
    intro: 'Creating your digital wedding invitation should feel effortless. Our streamlined process ensures every detail is handled with care — so you can focus on what truly matters.',
    promises: [
      ['Ready in 5–7 Days', 'From first call to final link, your invitation is delivered within one week, including all revisions.'],
      ['Unlimited Revisions', 'We refine every detail until you are completely satisfied. No hidden fees, no revision caps.'],
      ['Dedicated Support', 'A single point of contact throughout the entire process. Your questions are always answered promptly.'],
    ],
    ctaTitle: 'Ready to Begin?', ctaText: 'Select your universe and complete your order.', cta: 'Order Now',
  },
  es: {
    label: 'Nuestro proceso',
    title: 'Una experiencia guiada y diseñada a vuestra medida',
    intro: 'Crear vuestra invitación digital de boda debería ser sencillo. Nuestro proceso cuida cada detalle para que podáis centraros en lo que de verdad importa.',
    promises: [
      ['Lista en 5–7 días', 'Desde la primera llamada hasta el enlace definitivo, entregamos vuestra invitación en una semana, con todas las revisiones incluidas.'],
      ['Revisiones ilimitadas', 'Perfeccionamos cada detalle hasta que estéis completamente satisfechos. Sin costes ocultos ni límite de revisiones.'],
      ['Atención personalizada', 'Tendréis una única persona de contacto durante todo el proceso y respuestas rápidas a vuestras preguntas.'],
    ],
    ctaTitle: '¿Listos para empezar?', ctaText: 'Elegid vuestro universo y completad el pedido.', cta: 'Crear invitación',
  },
  fr: {
    label: 'Notre méthode', title: 'Une expérience guidée, pensée autour de vous', intro: 'Créer votre faire-part de mariage numérique doit rester simple et agréable. Notre méthode prend soin de chaque détail pour que vous puissiez vous concentrer sur l’essentiel.',
    promises: [['Prête en 5 à 7 jours', 'Du premier échange au lien final, votre invitation est livrée sous une semaine, révisions comprises.'], ['Révisions illimitées', 'Nous affinons chaque détail jusqu’à votre entière satisfaction, sans frais cachés ni limite de modifications.'], ['Accompagnement dédié', 'Un interlocuteur unique vous accompagne pendant tout le projet et répond rapidement à vos questions.']],
    ctaTitle: 'Prêts à commencer ?', ctaText: 'Choisissez votre univers et finalisez votre commande.', cta: 'Créer mon invitation'
  },
};

export default function Method({ locale = 'en' }) {
  const copy = approachCopy[locale] || approachCopy.en;
  const localizedSteps = locale === 'es' ? spanishSteps : locale === 'fr' ? frenchSteps : steps;
  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero */}
        <section className={styles.hero}>
          <span className="label animate-fade-in-up">{copy.label}</span>
          <h1 className="heading-xl animate-fade-in-up delay-1">
            {copy.title}
          </h1>
          <p className="text-lg animate-fade-in-up delay-2">
            {copy.intro}
          </p>
        </section>

        {/* Steps */}
        <section className={styles.stepsSection}>
          {localizedSteps.map((step, i) => (
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
              <h3 className="heading-sm">{copy.promises[0][0]}</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>{copy.promises[0][1]}</p>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>♾️</div>
              <h3 className="heading-sm">{copy.promises[1][0]}</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>{copy.promises[1][1]}</p>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>🤝</div>
              <h3 className="heading-sm">{copy.promises[2][0]}</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>{copy.promises[2][1]}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className="heading-lg">{copy.ctaTitle}</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem' }}>{copy.ctaText}</p>
          <Link href="/checkout" className="btn-primary" style={{ marginTop: '2rem' }}>{copy.cta}</Link>
        </section>

      </div>
    </div>
  );
}
