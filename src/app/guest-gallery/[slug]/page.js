'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { photoCopy } from '@/lib/guest-photo-copy.mjs';
import styles from '../../guest-photos.module.css';

export default function GuestGalleryPage({ params }) {
  const { slug } = use(params);
  const [photos, setPhotos] = useState([]);
  const [wedding, setWedding] = useState(null);
  const copy = photoCopy(wedding?.language);
  const direction = wedding?.language === 'ar' ? 'rtl' : 'ltr';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [copied, setCopied] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadGallery = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch(`/api/guest-upload?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || 'This gallery could not be loaded.');
      setWedding(data.wedding);
      setPhotos((previous) => {
        const fresh = data.photos || [];
        if (!quiet) return fresh;
        const ids = new Set(fresh.map((photo) => photo.id));
        return [...fresh, ...previous.filter((photo) => !ids.has(photo.id))];
      });
      setNextOffset((previous) => quiet && previous !== null && previous > 60 ? previous : data.nextOffset);
      setError('');
    } catch (loadError) {
      setError('load');
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

  const loadMore = async () => {
    if (nextOffset === null || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch('/api/guest-upload?slug=' + encodeURIComponent(slug) + '&offset=' + nextOffset, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error();
      setPhotos((previous) => [...new Map([...previous, ...data.photos].map((photo) => [photo.id, photo])).values()]);
      setNextOffset(data.nextOffset);
    } catch { setError('load'); }
    finally { setLoadingMore(false); }
  };

  const copyGalleryLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('copy');
    }
  };

  return (
    <main className={styles.page} lang={wedding?.language || 'en'} dir={direction}>
      <div className={styles.shell}>
        <Link className={styles.brand} href={`/invite/${slug}`}>
          <strong>FOLDÈ</strong>
          <span className={styles.privateBadge}>⌁ {copy.space}</span>
        </Link>

        <header className={styles.galleryHero}>
          <p className={styles.eyebrow}>{wedding?.couple || copy.memories}</p>
          <h1>{copy.galleryTitle}</h1>
          <p>{copy.galleryLead}</p>
          <div className={styles.galleryActions}>
            <Link className={styles.primary} href={`/guest-upload/${slug}`}>+ {copy.add}</Link>
            <button className={styles.secondary} type="button" onClick={copyGalleryLink}>{copied ? copy.copied : copy.copy}</button>
            <Link className={styles.secondary} href={`/invite/${slug}`}>{copy.back}</Link>
          </div>
        </header>

        <div className={styles.galleryMeta}>
          <span>{photos.length} {copy.count}</span>
          <span>{copy.refresh}</span>
        </div>
        {error && photos.length > 0 && <p className={`${styles.notice} ${styles.error}`} role="alert">{error === 'copy' ? copy.copyError : copy.loadError}</p>}

        {loading ? (
          <div className={styles.loading}><span className={styles.spinner} aria-label={copy.loading} /></div>
        ) : error && photos.length === 0 ? (
          <div className={styles.empty}><span>◇</span><p>{error === 'copy' ? copy.copyError : copy.loadError}</p><button className={styles.secondary} type="button" onClick={() => loadGallery()}>{copy.retry}</button></div>
        ) : photos.length === 0 ? (
          <div className={styles.empty}><span>✦</span><h2>{copy.empty}</h2><p>{copy.uploadLead}</p><Link className={styles.primary} href={`/guest-upload/${slug}`}>{copy.first}</Link></div>
        ) : (
          <section className={styles.galleryGrid} aria-label={copy.memories}>
            {photos.map((photo) => (
              <button className={styles.photoCard} key={photo.id} type="button" onClick={() => setSelectedPhoto(photo)} aria-label={`${copy.open}${photo.guestName ? ` · ${photo.guestName}` : ''}`}>
                <img src={photo.url} alt={photo.caption || (photo.guestName ? `${copy.alt} · ${photo.guestName}` : copy.alt)} loading="lazy" />
                {(photo.guestName || photo.caption) && <span className={styles.photoCredit}>{photo.caption || photo.guestName}</span>}
              </button>
            ))}
          </section>
        )}
        {nextOffset !== null && !loading && <div className={styles.galleryActions}><button className={styles.secondary} disabled={loadingMore} onClick={loadMore}>{loadingMore ? copy.loading : copy.more}</button></div>}
      </div>

      {selectedPhoto && (
        <button className={styles.lightbox} type="button" onClick={() => setSelectedPhoto(null)} aria-label={copy.close}>
          <span style={{position:'absolute',top:'1rem',right:'1rem',color:'#fff',fontSize:'2rem'}} aria-hidden="true">×</span>
          <img src={selectedPhoto.url} alt={selectedPhoto.caption || copy.alt} />
        </button>
      )}
    </main>
  );
}
