"use client";

import React, { useEffect, useState, use } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import BordeauxTemplate from '@/components/templates/BordeauxTemplate';
import { useSearchParams } from 'next/navigation';

export default function InvitePage({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const slug = resolvedParams.slug;
  const { eventInfo, orders, isLoaded } = useDatabase();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return null;

  const isPreview = searchParams.get('preview') === 'true';
  const order = orders.find(o => o.slug === slug);
  const fullData = { ...(order?.details || {}), ...(eventInfo[slug] || {}), slug };

  const isExpert = ['custom', 'expert'].includes(String(order?.plan || '').toLowerCase());
  if (!isPreview && isExpert && order?.status !== 'Live') {
    return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: '#faf8f5', textAlign: 'center', fontFamily: 'var(--font-body)' }}><div style={{ maxWidth: '460px', background: '#fff', border: '1px solid #eadfd5', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 12px 36px rgba(92,58,30,0.08)' }}><div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✦</div><h1 style={{ fontFamily: 'var(--font-heading)', color: '#5C3A1E', margin: '0 0 0.75rem' }}>Invitation in preparation</h1><p style={{ color: '#6b625c', lineHeight: 1.6, margin: 0 }}>This bespoke wedding invitation is being carefully crafted by the Folde studio.</p></div></main>;
  }

  // En mode preview, on affiche toutes les modifs. 
  // En mode live, on affiche 'publishedData' si ça existe, sinon fullData (pour la compatibilité des anciens).
  const data = { ...(isPreview ? fullData : (fullData.publishedData || fullData)), slug };

  return <BordeauxTemplate data={data} editMode={false} autoPlaySimulation={true} />;
}
