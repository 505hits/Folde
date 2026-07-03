import Link from "next/link";
import styles from "./offers.module.css";

export const metadata = {
  title: "Our Offers | Our Day Studio �$� Premium Digital Wedding Invitation Packages",
  description: "Choose from our curated digital wedding invitation packages. Essential �$� includes unlimited guests, integrated RSVP, and personalized guidance.",
};

export default function Offers() {
  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero */}
        <section className={styles.hero} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <span className="label animate-fade-in-up">Choose Your Plan</span>
          <h1 className="heading-xl animate-fade-in-up delay-1" style={{ marginBottom: '1rem' }}>
            Everything you need for a perfect digital invitation
          </h1>
          <p className="text-lg animate-fade-in-up delay-2">
            No hidden fees, no subscriptions. A single payment for an elegant, interactive digital wedding invitation with dedicated guidance.
          </p>
        </section>

        <style>{`
          .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; align-items: start; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
          .price-card { background: #fff; border-radius: 24px; padding: 3rem 2rem; border: 1px solid rgba(0,0,0,0.06); position: relative; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
          .price-card:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
          .price-card.popular { border: 2px solid #6b363e; box-shadow: 0 12px 40px rgba(107,54,62,0.1); }
          .price-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #6b363e; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }
          .price-header { text-align: center; margin-bottom: 2rem; flex-grow: 0; }
          .price-amount { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1rem; }
          .price-features { list-style: none; padding: 0; margin: 0 0 2.5rem 0; flex-grow: 1; }
          .price-features li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.9rem; color: #555; line-height: 1.4; }
          .price-features li .check { color: #b08968; font-weight: bold; margin-top: 1px; }
          .price-btn { display: block; width: 100%; padding: 1rem; text-align: center; border-radius: 50px; font-weight: 600; font-size: 1.05rem; text-decoration: none; transition: all 0.2s ease; margin-top: auto; }
          .btn-primary-plan { background: #6b363e; color: #fff; border: 1px solid #6b363e; }
          .btn-primary-plan:hover { background: #5a2c33; box-shadow: 0 4px 15px rgba(107,54,62,0.3); }
          .btn-secondary-plan { background: #fff; color: #1a1a1a; border: 1px solid #e0dcd7; }
          .btn-secondary-plan:hover { border-color: #6b363e; color: #6b363e; background: #faf8f5; }
          @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; max-width: 500px; gap: 3rem; } }
        `}</style>

        {/* Pricing Grid */}
        <section style={{ marginBottom: '8rem' }}>
          <div className="pricing-grid">
            
            {/* Essential */}
            <div className="price-card">
              <div className="price-header">
                <h2 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>Essential</h2>
                <p className="text-sm" style={{ opacity: 0.7, minHeight: '60px' }}>
                  Choose from our +15 exclusive templates and receive a personalized digital wedding invitation.
                </p>
                <div className="price-amount">
                  <span style={{ fontSize: '1.1rem', opacity: 0.4, textDecoration: 'line-through' }}>325$</span>
                  <span style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#6b363e' }}>175$</span>
                </div>
              </div>
              <ul className="price-features">
                <li><span className="check">✓</span> Choose 1 template from over 15 options</li>
                <li><span className="check">✓</span> Your colors and info applied</li>
                <li><span className="check">✓</span> RSVP + private dashboard</li>
                <li><span className="check">✓</span> 2 languages included</li>
                <li><span className="check">✓</span> 2 design revision rounds</li>
              </ul>
              <Link href="/templates" className="price-btn btn-secondary-plan">
                Start with Essential
              </Link>
            </div>

            {/* Premium */}
            <div className="price-card popular">
              <div className="price-badge">Most Chosen</div>
              <div className="price-header">
                <h2 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '1.8rem', color: '#6b363e' }}>Premium</h2>
                <p className="text-sm" style={{ opacity: 0.7, minHeight: '60px' }}>
                  We redesign and personalize any template to match the exact style of your wedding. All extras included.
                </p>
                <div className="price-amount">
                  <span style={{ fontSize: '1.1rem', opacity: 0.4, textDecoration: 'line-through' }}>850$</span>
                  <span style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#6b363e' }}>575$</span>
                </div>
              </div>
              <ul className="price-features">
                <li><span className="check">✓</span> Template redesigned to your style</li>
                <li><span className="check">✓</span> Full invitation personalization</li>
                <li><span className="check">✓</span> Custom icons, typography & illustrations</li>
                <li><span className="check">✓</span> Includes Video, Music & AI Images</li>
                <li><span className="check">✓</span> Unlimited blocks & 4 revision rounds</li>
                <li><span className="check">✓</span> Direct contact with your designer</li>
              </ul>
              <Link href="/templates" className="price-btn btn-primary-plan">
                Start with Premium
              </Link>
            </div>

            {/* Excellence */}
            <div className="price-card">
              <div className="price-header">
                <h2 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>Excellence</h2>
                <p className="text-sm" style={{ opacity: 0.7, minHeight: '60px' }}>
                  100% bespoke design from scratch with editorial art direction. A unique, one-of-a-kind piece.
                </p>
                <div className="price-amount">
                  <span style={{ fontSize: '1.1rem', opacity: 0.4, textDecoration: 'line-through' }}>1450$</span>
                  <span style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>975$</span>
                </div>
              </div>
              <ul className="price-features">
                <li><span className="check">✓</span> 100% custom design from scratch</li>
                <li><span className="check">✓</span> Editorial art direction</li>
                <li><span className="check">✓</span> Includes Video, Music & AI Images</li>
                <li><span className="check">✓</span> Personal concierge & priority support</li>
                <li><span className="check">✓</span> Everything in Premium</li>
              </ul>
              <Link href="/contact" className="price-btn btn-secondary-plan">
                Contact Us
              </Link>
            </div>

          </div>
        </section>

        {/* What's included breakdown */}
        <section className={styles.includesSection}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label">What&apos;s Included</span>
            <h2 className="heading-lg">Every Detail, Covered</h2>
          </div>
          <div className={styles.includesGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {[
              { icon: '📱', title: 'Mobile-First Design', desc: 'Your invitation is optimized for every device �$� smartphones, tablets, and desktops �$� ensuring a flawless experience for every guest.' },
              { icon: '💌', title: 'Integrated RSVP', desc: 'Guests confirm, decline, or provide details directly from the invitation. No external tools, no friction.' },
              { icon: '📊', title: 'Real-Time Dashboard', desc: 'Track confirmations, pending responses, and declines from a clean, intuitive interface. Export your guest list to Excel anytime.' },
              { icon: '🔗', title: 'One Link, Unlimited Guests', desc: 'Share a single elegant link via WhatsApp, email, or social media. Every guest receives the same premium experience.' },
            ].map((item, i) => (
              <div key={i} className={styles.includeCard} style={{ textAlign: 'center' }}>
                <div className={styles.includeIcon} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h4 className="heading-sm" style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
                <p className="text-sm" style={{ opacity: 0.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
