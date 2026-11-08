"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { collectLocalWeddingData } from '@/lib/local-recovery.mjs';

export default function RecoverLocalPage() {
  const { currentUser, orders } = useDatabase();
  const [message, setMessage] = useState('');
  const download = () => {
    const slugs = orders.filter(o => o.email?.toLowerCase() === currentUser.email.toLowerCase()).map(o => o.slug);
    const data = collectLocalWeddingData(localStorage, currentUser.email, slugs);
    if (!data.orders.length && !Object.keys(data.weddings).length) { setMessage('No older wedding data was found in this browser. Try the browser and device originally used to edit your invitation.'); return; }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'folde-wedding-recovery.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Backup downloaded. Nothing in your browser or wedding account was changed. Keep this file private: it can contain wedding details and guest responses.');
  };
  return <main style={{ minHeight: '75vh', padding: '3rem 1rem', background: '#faf8f5' }}><section style={{ maxWidth: 600, margin: 'auto' }}>
    <h1>Recover older wedding edits</h1>
    <p>Use the same browser and device you originally used. This creates a backup of any older wedding data still available locally. It does not replace your saved invitation or send data to our server.</p>
    {currentUser ? <button onClick={download} style={{ padding: '1rem', background: '#5c3a1e', color: '#fff', border: 0, borderRadius: 8 }}>Download a local backup</button> : <Link href="/dashboard">Sign in to your wedding account first</Link>}
    {message && <p role="status">{message}</p>}
    <p><Link href="/dashboard">Back to dashboard</Link></p>
  </section></main>;
}
