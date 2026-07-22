"use client";

import React, { useEffect, useState, use } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import BordeauxTemplate from '@/components/templates/BordeauxTemplate';

export default function InvitePage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { eventInfo, orders, isLoaded } = useDatabase();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return null;

  // Find the order for this slug
  const order = orders.find(o => o.slug === slug);
  
  if (!order) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf8f5', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#1a1a1a', marginBottom: '1rem' }}>Invitation not found</h1>
          <p style={{ color: '#888' }}>The invitation link you followed seems to be invalid or expired.</p>
        </div>
      </div>
    );
  }

  // Get the data for this slug
  const data = eventInfo[slug] || {};

  // For now, we use BordeauxTemplate as our universal base template 
  // (we change colors dynamically via other ways or it handles its own themes)
  return <BordeauxTemplate data={{ ...data, slug }} editMode={false} />;
}
