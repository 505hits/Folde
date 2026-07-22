"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDatabase } from "@/context/DatabaseContext";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, login, createOrder } = useDatabase();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      // No session ID — might be a direct visit, show generic success
      setStatus('success');
      return;
    }

    const verifyAndCreateOrder = async () => {
      try {
        // 1. Verify the Stripe session
        const res = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const session = await res.json();

        if (session.status !== 'paid') {
          setStatus('error');
          return;
        }

        // 2. Get pending order from localStorage
        const pendingRaw = typeof window !== 'undefined' && localStorage.getItem('pendingOrder');
        let pending = null;
        if (pendingRaw) {
          try { pending = JSON.parse(pendingRaw); } catch (e) {}
        }

        // Use Stripe metadata as fallback if localStorage is empty
        const name = pending?.name || session.metadata?.name || '';
        const partnerName = pending?.partnerName || session.metadata?.partnerName || '';
        const email = pending?.email || session.metadata?.email || session.customerEmail || '';
        const theme = pending?.theme || session.metadata?.theme || 'bordeaux';
        const plan = pending?.plan || session.metadata?.plan || 'Standard';
        const planId = pending?.planId || plan.toLowerCase();
        const password = pending?.password || 'welcome123';
        const price = pending?.price || (session.amountTotal / 100);

        // 3. Register/Login the user (if not already logged in)
        const registerResult = await register(email, password, name, partnerName);
        if (!registerResult.success) {
          // Account might already exist, try login
          await login(email, password);
        }

        // 4. Create the order
        createOrder(email, name, partnerName, theme, plan, price);

        // 5. Clean up
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pendingOrder');
        }

        setOrderData({ name, partnerName, plan, planId, email });
        setStatus('success');

      } catch (error) {
        console.error('Verification error:', error);
        // Still show success (payment was likely successful)
        setStatus('success');
      }
    };

    verifyAndCreateOrder();
  }, [searchParams]);

  // Loading / Verifying
  if (status === 'verifying') {
    return (
      <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', color: '#3D2B1F', padding: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #f0ede9', borderTopColor: '#5C3A1E', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: '#3D2B1F', marginBottom: '0.5rem' }}>Confirming Payment</h1>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  // Error
  if (status === 'error') {
    return (
      <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', color: '#3D2B1F', padding: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem' }}>✕</div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#3D2B1F', marginBottom: '1rem' }}>Payment Issue</h1>
          <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            We couldn't verify your payment. If you believe this is an error, please contact us at folde.wedding@gmail.com.
          </p>
          <Link href="/checkout" style={{ display: 'inline-block', backgroundColor: '#5C3A1E', color: '#fff', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', letterSpacing: '1px' }}>
            TRY AGAIN
          </Link>
        </div>
      </div>
    );
  }

  // Success
  const isPremiumOrCustom = orderData?.planId === 'premium' || orderData?.planId === 'Custom' || orderData?.planId === 'custom';

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', color: '#3D2B1F', padding: '2rem' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem', boxShadow: '0 4px 12px rgba(92,58,30,0.2)' }}>
          ✓
        </div>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#3D2B1F', marginBottom: '1rem' }}>Payment Validated!</h1>
        <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          {isPremiumOrCustom
            ? `Welcome ${orderData?.name || ''}! Your ${orderData?.plan} order is confirmed. Access your dashboard to start customizing, and our team will reach out within 24h.`
            : `Your order has been successfully confirmed. Welcome to FOLDÈ Design! You can now access your private dashboard to start personalizing your invitation.`
          }
        </p>
        <Link href="/dashboard" style={{ display: 'inline-block', width: '100%', backgroundColor: '#5C3A1E', color: '#fff', padding: '1rem', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s', letterSpacing: '1px' }}>
          ACCESS MY DASHBOARD →
        </Link>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #f0ede9', borderTopColor: '#5C3A1E', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
