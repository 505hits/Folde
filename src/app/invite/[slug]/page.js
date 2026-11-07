"use client";
import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BordeauxTemplate from '@/components/templates/BordeauxTemplate';
import { weddingRequest } from '@/lib/wedding-client';

export default function InvitePage({ params }) {
  const { slug } = use(params);
  const preview = useSearchParams().get('preview') === 'true';
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    weddingRequest(`/api/invitation?slug=${encodeURIComponent(slug)}&preview=${preview}`).then(result => {
      if (active) { setInvitation(result.invitation); setError(''); }
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [slug, preview]);
  if (error) return <main style={{ padding: '3rem', textAlign: 'center' }} role="alert">{error}</main>;
  if (!invitation) return <main style={{ padding: '3rem', textAlign: 'center' }} role="status">Loading invitation…</main>;
  return <BordeauxTemplate data={invitation} editMode={false} autoPlaySimulation={true} />;
}
