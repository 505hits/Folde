"use client";

import { useState } from "react";
import { useDatabase } from "@/context/DatabaseContext";

export default function ClientSite({ params }) {
  const { couple } = params; // This is the dynamic slug, e.g. 'emma-et-lucas'
  const { eventInfo, addGuest, orders } = useDatabase();
  
  // Find the specific couple's order to get the theme or real name
  const order = orders.find(o => o.slug === couple);
  // Find their event info (if they filled it in the dashboard)
  const info = eventInfo[couple];

  const [rsvp, setRsvp] = useState({
    name: '',
    status: 'Attending',
    side: 'Bride',
    meal: 'Beef Wellington'
  });
  const [submitted, setSubmitted] = useState(false);

  // If the URL is invalid or client hasn't been set up
  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f6f0', color: '#4a3f35' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Invitation Not Found</h1>
          <p style={{ marginTop: '1rem', opacity: 0.7 }}>Please check the URL.</p>
        </div>
      </div>
    );
  }

  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    addGuest(couple, rsvp);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf9f8', color: '#4a3f35', fontFamily: 'var(--font-body)' }}>
      
      {/* Hero Section */}
      <section style={{ height: '70vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#e2ddd5' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'linear-gradient(45deg, #d4cfc6, #f9f6f0)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 10, padding: '2rem' }}>
          <p style={{ fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>You are invited to the wedding of</p>
          <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', color: '#5C3A1E', marginBottom: '1rem' }}>
            {order.couple}
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>
            {info ? new Date(info.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Date TBD"}
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: '#5C3A1E' }}>The Details</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '3rem', fontStyle: 'italic', opacity: 0.8 }}>
          {info?.customMessage || "We can't wait to celebrate with you!"}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⛪</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ceremony</h3>
            <p style={{ opacity: 0.7 }}>{info?.ceremonyVenue || "Venue TBD"}</p>
          </div>
          <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🥂</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Reception</h3>
            <p style={{ opacity: 0.7 }}>{info?.receptionVenue || "Venue TBD"}</p>
          </div>
        </div>
      </section>

      {/* RSVP Form Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: '#5C3A1E' }}>RSVP</h2>
          <p style={{ marginBottom: '3rem', opacity: 0.7 }}>Please kindly respond by August 1st.</p>
          
          {submitted ? (
            <div style={{ padding: '3rem', backgroundColor: '#f9f6f0', borderRadius: '16px', border: '1px solid rgba(74,63,53,0.1)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Thank You!</h3>
              <p style={{ opacity: 0.8 }}>Your response has been sent directly to the couple.</p>
            </div>
          ) : (
            <form onSubmit={handleRSVPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={rsvp.name}
                  onChange={e => setRsvp({...rsvp, name: e.target.value})}
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(74,63,53,0.2)', fontSize: '1rem' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Will you attend?</label>
                <select 
                  value={rsvp.status}
                  onChange={e => setRsvp({...rsvp, status: e.target.value})}
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(74,63,53,0.2)', fontSize: '1rem', backgroundColor: '#fff' }}
                >
                  <option value="Attending">Joyfully Accept</option>
                  <option value="Declined">Regretfully Decline</option>
                </select>
              </div>

              {rsvp.status === 'Attending' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Whose guest are you?</label>
                    <select 
                      value={rsvp.side}
                      onChange={e => setRsvp({...rsvp, side: e.target.value})}
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(74,63,53,0.2)', fontSize: '1rem', backgroundColor: '#fff' }}
                    >
                      <option value="Bride">Bride's Side</option>
                      <option value="Groom">Groom's Side</option>
                      <option value="Both">Mutual Friend</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Meal Preference</label>
                    <select 
                      value={rsvp.meal}
                      onChange={e => setRsvp({...rsvp, meal: e.target.value})}
                      style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(74,63,53,0.2)', fontSize: '1rem', backgroundColor: '#fff' }}
                    >
                      <option value="Beef Wellington">Beef Wellington</option>
                      <option value="Salmon">Roasted Salmon</option>
                      <option value="Vegan Risotto">Vegan Risotto</option>
                      <option value="Kids Meal">Kids Meal</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" style={{ marginTop: '1rem', padding: '1.2rem', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>
                Send RSVP
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
