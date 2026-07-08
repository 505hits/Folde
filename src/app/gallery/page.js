import Link from "next/link";
import InteractiveVideo from "../../components/InteractiveVideo";

export const metadata = {
  title: "Gallery | Our Day Studio — Explore Our Universes",
  description: "Browse our collection of premium digital wedding invitations. Each universe is uniquely designed with elegant animations and customizable details.",
};

const envelopes = [
  { id: 'bordeaux', name: 'Bordeaux Envelope', desc: 'Deep and majestic.', video: '/videos/bordeaux.mp4' },
  { id: 'ivory', name: 'Ivory Elegance', desc: 'Pure and delicate.', video: '/videos/ivory.mp4' },
  { id: 'champagne', name: 'Champagne Glow', desc: 'Royal and sophisticated.', video: '/videos/champagne.mp4' },
  { id: 'terracotta', name: 'Terracotta Arches', desc: 'Warm and timeless.', video: '/videos/terracotta.mp4' },
  { id: 'royal-bordeaux', name: 'Royal Bordeaux', desc: 'Intense and noble.', video: '/videos/royal-bordeaux.mp4' },
  { id: 'royal-blue', name: 'Royal Blue', desc: 'Elegant and deep.', video: '/videos/royal-blue.mp4' },
  { id: 'sage', name: 'Sage Green', desc: 'Natural and refined.', video: '/videos/sage.mp4' },
  { id: 'chocolate', name: 'Chocolate Velvet', desc: 'Warmth and character.', video: '/videos/chocolate.mp4' }
];

const doors = [
  { id: 'horizon-bordeaux', name: 'Bordeaux Horizon', desc: 'A deep entrance, between warmth and refinement.', video: '/videos/horizon-bordeaux.mp4' },
  { id: 'royal-doves', name: 'Royal Doves', desc: 'A gentle entrance, carried by grace.', video: '/videos/royal-doves.mp4' },
  { id: 'imperial-light', name: 'Imperial Light', desc: 'An opening sculpted by light.', video: '/videos/imperial-light.mp4' },
  { id: 'golden-palace', name: 'Golden Palace', desc: 'A precious glow, like a promise.', video: '/videos/golden-palace.mp4' },
  { id: 'oriental-palace', name: 'Oriental Palace', desc: 'An entrance sculpted from heritage and light.', video: '/videos/oriental-palace.mp4' }
];

const veils = [
  { id: 'celestial-veil', name: 'Celestial Veil', desc: 'A veil of air… and the world calms.', video: '/videos/celestial-veil.mp4' },
  { id: 'ivory-veil', name: 'Ivory Veil', desc: 'A caress of light, in silence.', video: '/videos/ivory-veil.mp4' },
  { id: 'rose-veil', name: 'Rosé Veil', desc: 'A rosy whisper, like the start of a dream.', video: '/videos/rose-veil.mp4' }
];

export default function Gallery() {
  return (
    <div style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="container">

        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 5rem auto' }}>
          <span className="label" style={{ display: 'block', marginBottom: '1rem' }}>The Gallery</span>
          <h1 className="heading-xl animate-fade-in-up" style={{ marginBottom: '1.2rem' }}>
            Choose the Universe That Tells Your Story
          </h1>
          <p className="text-lg animate-fade-in-up delay-1">
            Every invitation begins with a captivating opening sequence. Tap on any design to see it come to life.
          </p>
        </div>

        {/* Envelopes Section */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>Envelopes</span>
            <h2 className="heading-lg">The Timeless Charm of a Sealed Envelope</h2>
            <p className="text-lg" style={{ marginTop: '0.5rem' }}>Reinvented with elegance for the digital age.</p>
          </div>
          <div className="creations-grid">
            {envelopes.map((item) => (
              <div key={item.id} className="creation-card">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', overflow: 'hidden', borderRadius: '8px' }}>
                  <InteractiveVideo 
                    src={item.video}
                    alt={`${item.name} Wedding Invitation`}
                  />
                </div>
                <div className="creation-content">
                  <h3 className="creation-title">{item.name}</h3>
                  <p className="creation-desc">{item.desc}</p>
                  <div className="creation-actions">
                    <Link href={`/contact?theme=${item.id}`} className="creation-link">
                      View Demo
                    </Link>
                    <Link href="/templates" className="creation-link-secondary">
                      Order Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Doors Section */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>Grand Entrances</span>
            <h2 className="heading-lg">Behind These Doors, Your Moment Begins</h2>
            <p className="text-lg" style={{ marginTop: '0.5rem' }}>Majestic openings that set the tone for your celebration.</p>
          </div>
          <div className="creations-grid">
            {doors.map((item) => (
              <div key={item.id} className="creation-card">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', overflow: 'hidden', borderRadius: '8px' }}>
                  <InteractiveVideo 
                    src={item.video}
                    alt={`${item.name} Wedding Invitation`}
                  />
                </div>
                <div className="creation-content">
                  <h3 className="creation-title">{item.name}</h3>
                  <p className="creation-desc">{item.desc}</p>
                  <div className="creation-actions">
                    <Link href={`/contact?theme=${item.id}`} className="creation-link">
                      View Demo
                    </Link>
                    <Link href="/templates" className="creation-link-secondary">
                      Order Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Veils Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>Veils</span>
            <h2 className="heading-lg">A Gentle Breath, a Soft Reveal</h2>
            <p className="text-lg" style={{ marginTop: '0.5rem' }}>Delicate unveilings that whisper the start of something beautiful.</p>
          </div>
          <div className="creations-grid">
            {veils.map((item) => (
              <div key={item.id} className="creation-card">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', overflow: 'hidden', borderRadius: '8px' }}>
                  <InteractiveVideo 
                    src={item.video}
                    alt={`${item.name} Wedding Invitation`}
                  />
                </div>
                <div className="creation-content">
                  <h3 className="creation-title">{item.name}</h3>
                  <p className="creation-desc">{item.desc}</p>
                  <div className="creation-actions">
                    <Link href={`/contact?theme=${item.id}`} className="creation-link">
                      View Demo
                    </Link>
                    <Link href="/templates" className="creation-link-secondary">
                      Order Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--color-foreground)',
          color: 'var(--color-background)',
          borderRadius: 'var(--radius-xl)',
          marginTop: '2rem'
        }}>
          <h2 className="heading-lg">Ready to Create Your Invitation?</h2>
          <p style={{ marginTop: '0.75rem', opacity: 0.7, fontSize: '1.05rem' }}>Select your universe and complete your order.</p>
          <Link
            href="/templates"
            className="btn-primary"
            style={{
              marginTop: '2rem',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)',
              borderColor: 'var(--color-background)'
            }}
          >
            Order Now
          </Link>
        </div>

      </div>
    </div>
  );
}
