import Link from "next/link";
import styles from "./offers.module.css";

export const metadata = {
  title: "Our Formulas | FOLDÈ Design — Premium Digital Wedding Invitation Formulas",
  description: "Choose from our curated digital wedding invitation formulas. Standard — includes unlimited guests, integrated RSVP, and personalized guidance.",
};

export default function Offers() {
  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero */}
        <section className={styles.hero} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <span className="label animate-fade-in-up">Choose Your Formula</span>
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
          .price-card.popular { border: 2px solid #5C3A1E; box-shadow: 0 12px 40px rgba(92,58,30,0.1); }
          .price-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #5C3A1E; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }
          .price-header { text-align: center; margin-bottom: 2rem; flex-grow: 0; }
          .price-amount { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1rem; }
          .price-features { list-style: none; padding: 0; margin: 0 0 2.5rem 0; flex-grow: 1; }
          .price-features li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.9rem; color: #555; line-height: 1.4; }
          .price-features li .check { color: #5C3A1E; font-weight: bold; margin-top: 1px; }
          .price-btn { display: block; width: 100%; padding: 1rem; text-align: center; border-radius: 50px; font-weight: 600; font-size: 1.05rem; text-decoration: none; transition: all 0.2s ease; margin-top: auto; }
          .btn-primary-plan { background: #5C3A1E; color: #fff; border: 1px solid #5C3A1E; }
          .btn-primary-plan:hover { background: #3d2513; box-shadow: 0 4px 15px rgba(92,58,30,0.3); }
          .btn-secondary-plan { background: #fff; color: #1a1a1a; border: 1px solid #e0dcd7; }
          .btn-secondary-plan:hover { border-color: #5C3A1E; color: #5C3A1E; background: #faf8f5; }
          @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr; max-width: 500px; gap: 3rem; } }
        `}</style>

        {/* Pricing Grid */}
        <section style={{ marginBottom: '8rem' }}>
          <div className="pricing-grid">
            
             {/* Standard */}
             <div className="price-card">
                <div className="price-header">
                  <h2 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>Standard</h2>
                  <p className="text-sm" style={{ opacity: 0.7, minHeight: '60px' }}>
                    Choose from our +10 exclusive templates and receive a personalized digital wedding invitation.
                  </p>
                  <div className="price-amount">
                    <span style={{ fontSize: '1.1rem', opacity: 0.4, textDecoration: 'line-through' }}>99.90$</span>
                    <span style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#5C3A1E' }}>49.90$</span>
                  </div>
                </div>
                <ul className="price-features">
                  <li><span className="check">✓</span> Choose 1 template from over 10 options</li>
                  <li><span className="check">✓</span> Your colors and info applied</li>
                  <li><span className="check">✓</span> RSVP + private dashboard</li>
                  <li><span className="check">✓</span> <strong>All languages supported</strong></li>
                  <li><span className="check">✓</span> <strong>Unlimited guests included</strong></li>
                  <li><span className="check">✓</span> 2 design revision rounds</li>
                </ul>
                <Link href="/checkout?plan=essential" className="price-btn btn-secondary-plan">
                  Start with Standard
                </Link>
             </div>
 
             {/* Premium */}
             <div className="price-card popular">
                <div className="price-badge">Editor's Choice</div>
                <div className="price-header">
                  <h2 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '1.8rem', color: '#5C3A1E' }}>Premium</h2>
                  <p className="text-sm" style={{ opacity: 0.7, minHeight: '60px' }}>
                    We redesign and personalize any template to match the exact style of your wedding. All extras included.
                  </p>
                  <div className="price-amount">
                    <span style={{ fontSize: '1.1rem', opacity: 0.4, textDecoration: 'line-through' }}>490$</span>
                    <span style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#5C3A1E' }}>290$</span>
                  </div>
                </div>
                <ul className="price-features">
                  <li><span className="check">✓</span> Template redesigned to your style</li>
                  <li><span className="check">✓</span> Full invitation personalization</li>
                  <li><span className="check">✓</span> Custom icons, typography & illustrations</li>
                  <li><span className="check">✓</span> Includes Video, Music & AI Images</li>
                  <li><span className="check">✓</span> Unlimited blocks & revisions</li>
                  <li><span className="check">✓</span> Direct contact with your designer</li>
                  <li><span className="check">✓</span> <strong>All languages supported</strong></li>
                  <li><span className="check">✓</span> <strong>Unlimited guests included</strong></li>
                </ul>
                <Link href="/checkout?plan=premium" className="price-btn btn-primary-plan">
                  Start with Premium
                </Link>
             </div>
 
             {/* Custom */}
             <div className="price-card">
                <div className="price-header">
                  <h2 className="heading-lg" style={{ marginBottom: '0.75rem', fontSize: '1.8rem' }}>Custom</h2>
                  <p className="text-sm" style={{ opacity: 0.7, minHeight: '60px' }}>
                    100% bespoke design from scratch with editorial art direction. A unique, one-of-a-kind piece.
                  </p>
                  <div className="price-amount">
                    <span style={{ fontSize: '1.1rem', opacity: 0.4, textDecoration: 'line-through' }}>890$</span>
                    <span style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#3D2B1F' }}>490$</span>
                  </div>
                </div>
                <ul className="price-features">
                  <li><span className="check">✓</span> 100% custom design from scratch</li>
                  <li><span className="check">✓</span> Editorial art direction</li>
                  <li><span className="check">✓</span> Includes Video, Music & AI Images</li>
                  <li><span className="check">✓</span> Personal concierge & priority support</li>
                  <li><span className="check">✓</span> <strong>All languages supported</strong></li>
                  <li><span className="check">✓</span> <strong>Unlimited guests included</strong></li>
                  <li><span className="check">✓</span> Everything in Premium</li>
                </ul>
                <Link href="/checkout?plan=Custom" className="price-btn btn-secondary-plan">
                  Start with Custom
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
          <div className={styles.includesGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem' }}>
            {[
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
                  </svg>
                ),
                title: 'Mobile-First Design',
                desc: 'Your invitation is optimized for every device — smartphones, tablets, and desktops — ensuring a flawless experience for every guest.'
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 6l9 6 9-6" />
                    <path d="M12 13a2.5 2.5 0 0 1 4.5 1.5c0 2-3.5 4.5-4.5 5.5-1-1-4.5-3.5-4.5-5.5a2.5 2.5 0 0 1 4.5-1.5z" fill="rgba(184, 134, 11, 0.12)" />
                  </svg>
                ),
                title: 'Integrated RSVP',
                desc: 'Guests confirm, decline, or provide details directly from the invitation. No external tools, no friction.'
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 17v-6" />
                    <path d="M15 17V9" />
                    <path d="M9 11l6-2" />
                  </svg>
                ),
                title: 'Real-Time Dashboard',
                desc: 'Track confirmations, pending responses, and declines from a clean, intuitive interface. Export your guest list to Excel anytime.'
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                ),
                title: 'One Link, Unlimited Guests',
                desc: 'Share a single elegant link via WhatsApp, email, or social media. Every guest receives the same premium experience.'
              },
            ].map((item, i) => (
              <div key={i} className={styles.includeCard} style={{ textAlign: 'center' }}>
                <div className={styles.includeIcon} style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item.icon}</div>
                <h4 className="heading-sm" style={{ marginBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-foreground)' }}>{item.title}</h4>
                <p className="text-sm" style={{ opacity: 0.85, lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
