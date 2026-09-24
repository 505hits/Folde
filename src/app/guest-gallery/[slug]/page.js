'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../guest-photos.module.css';

export default function GuestGalleryPage({ params }) {
  const { slug } = use(params);
  const [photos, setPhotos] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadGallery = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch(`/api/guest-upload?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || 'This gallery could not be loaded.');
      setWedding(data.wedding);
      setPhotos(data.photos || []);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'This gallery could not be loaded.');
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadGallery(), 0);
    const interval = window.setInterval(() => loadGallery({ quiet: true }), 15000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadGallery]);

  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const close = (event) => { if (event.key === 'Escape') setSelectedPhoto(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [selectedPhoto]);

  const copyGalleryLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copying is unavailable here. Copy the address from your browser instead.');
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.brand} href={`/invite/${slug}`}>
          <strong>FOLDÈ</strong>
          <span className={styles.privateBadge}>⌁ Private wedding space</span>
        </Link>

        <header className={styles.galleryHero}>
          <p className={styles.eyebrow}>{wedding?.couple || 'Shared wedding memories'}</p>
          <h1>A gallery made by everyone who was there.</h1>
          <p>Photos appear here moments after guests share them. This page refreshes automatically while the celebration unfolds.</p>
          <div className={styles.galleryActions}>
            <Link className={styles.primary} href={`/guest-upload/${slug}`}>+ Add your photos</Link>
            <button className={styles.secondary} type="button" onClick={copyGalleryLink}>{copied ? 'Link copied!' : 'Share this gallery'}</button>
            <Link className={styles.secondary} href={`/invite/${slug}`}>View invitation</Link>
          </div>
        </header>

        <div className={styles.galleryMeta}>
          <span>{photos.length} shared {photos.length === 1 ? 'memory' : 'memories'}</span>
          <span>Private · refreshes automatically</span>
        </div>

        {loading ? (
          <div className={styles.loading}><span className={styles.spinner} aria-label="Loading gallery" /></div>
        ) : error ? (
          <div className={styles.empty}><span>◇</span><p>{error}</p><button className={styles.secondary} type="button" onClick={() => loadGallery()}>Try again</button></div>
        ) : photos.length === 0 ? (
          <div className={styles.empty}><span>✦</span><h2>The first memory is waiting to be shared.</h2><p>Be the first guest to add a photo to this private wedding gallery.</p><Link className={styles.primary} href={`/guest-upload/${slug}`}>Add the first photo</Link></div>
        ) : (
          <section className={styles.galleryGrid} aria-label="Guest wedding photos">
            {photos.map((photo) => (
              <button className={styles.photoCard} key={photo.id} type="button" onClick={() => setSelectedPhoto(photo)} aria-label={`Open photo${photo.guestName ? ` shared by ${photo.guestName}` : ''}`}>
                <img src={photo.url} alt={photo.caption || (photo.guestName ? `Wedding memory shared by ${photo.guestName}` : 'Shared wedding memory')} loading="lazy" />
                {(photo.guestName || photo.caption) && <span className={styles.photoCredit}>{photo.caption || `Shared by ${photo.guestName}`}</span>}
              </button>
            ))}
          </section>
        )}
      </div>

      {selectedPhoto && (
        <button className={styles.lightbox} type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close enlarged photo">
          <img src={selectedPhoto.url} alt={selectedPhoto.caption || 'Enlarged wedding memory'} />
        </button>
      )}
    </main>
  );
}
