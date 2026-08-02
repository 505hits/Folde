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

  // En mode preview, on affiche toutes les modifs. 
  // En mode live, on affiche 'publishedData' si ça existe, sinon fullData (pour la compatibilité des anciens).
  const data = isPreview ? fullData : (fullData.publishedData || fullData);

  return <BordeauxTemplate data={data} editMode={false} autoPlaySimulation={true} />;
}
