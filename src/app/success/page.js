"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Simulate payment processing delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', color: '#3D2B1F', padding: '2rem' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
        
        {loading ? (
          <div className="animate-fade-in">
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #f0ede9', borderTopColor: '#5C3A1E', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }}></div>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
            <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: '#3D2B1F', marginBottom: '0.5rem' }}>Processing Payment</h1>
            <p style={{ color: '#888', fontSize: '0.95rem' }}>Please wait while we secure your order...</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem', boxShadow: '0 4px 12px rgba(92,58,30,0.2)' }}>
              ✓
            </div>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#3D2B1F', marginBottom: '1rem' }}>Payment Validated!</h1>
            <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Your order has been successfully confirmed. Welcome to FOLDÈ Design! You can now access your private dashboard to start personalizing your invitation.
            </p>
            <Link href="/dashboard" style={{ display: 'inline-block', width: '100%', backgroundColor: '#5C3A1E', color: '#fff', padding: '1rem', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s', letterSpacing: '1px' }}>
              ACCESS MY DASHBOARD →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
