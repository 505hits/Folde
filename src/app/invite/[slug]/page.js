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

  // Find the order for this slug if available in local state, or fallback to slug & eventInfo
  const order = orders.find(o => o.slug === slug);
  const data = { ...(order?.details || {}), ...(eventInfo[slug] || {}), slug };

  return <BordeauxTemplate data={data} editMode={false} autoPlaySimulation={true} />;
}
