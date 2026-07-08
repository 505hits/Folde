import Link from "next/link";
import styles from "./method.module.css";

export const metadata = {
  title: "Our Method | Our Day Studio — How We Create Your Digital Wedding Invitation",
  description: "Discover our streamlined 4-step process to design your premium digital wedding invitation. From consultation to delivery, we guide you every step of the way.",
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

export default function Method() {
  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero */}
        <section className={styles.hero}>
          <span className="label animate-fade-in-up">Our Method</span>
          <h1 className="heading-xl animate-fade-in-up delay-1">
            A Guided Experience, Designed Around You
          </h1>
          <p className="text-lg animate-fade-in-up delay-2">
            Creating your digital wedding invitation should feel effortless. Our streamlined process ensures every detail is handled with care — so you can focus on what truly matters.
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
              <h3 className="heading-sm">Ready in 5–7 Days</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>From first call to final link, your invitation is delivered within one week, including all revisions.</p>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>♾️</div>
              <h3 className="heading-sm">Unlimited Revisions</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>We refine every detail until you are completely satisfied. No hidden fees, no revision caps.</p>
            </div>
            <div className={styles.promiseCard}>
              <div className={styles.promiseIcon}>🤝</div>
              <h3 className="heading-sm">Dedicated Support</h3>
              <p className="text-sm" style={{ marginTop: '0.5rem' }}>A single point of contact throughout the entire process. Your questions are always answered promptly.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className="heading-lg">Ready to Begin?</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem' }}>Select your universe and complete your order.</p>
          <Link href="/checkout" className="btn-primary" style={{ marginTop: '2rem' }}>Order Now</Link>
        </section>

      </div>
    </div>
  );
}
