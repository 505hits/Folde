'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../guest-photos.module.css';

const compressPhoto = (file) => new Promise((resolve, reject) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    resolve(file);
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('This image could not be read.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('Please use a JPG, PNG, WebP, HEIC or HEIF image.'));
    image.onload = () => {
      const limit = 2200;
      const scale = Math.min(1, limit / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('This image could not be prepared.')), 'image/jpeg', 0.88);
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export default function GuestUploadPage({ params }) {
  const { slug } = use(params);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/guest-upload?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (!active || !data.success) return;
        setWedding(data.wedding);
        setPhotos(data.photos || []);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [slug]);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 20);
    event.target.value = '';
    if (!files.length) return;
    setUploading(true);
    setError('');
    setMessage('');
    setProgress(0);
    const uploaded = [];
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        if (!file.type.startsWith('image/')) throw new Error('Please select image files only.');
        const optimized = await compressPhoto(file);
        const body = new FormData();
        body.append('slug', slug);
        body.append('file', optimized, file.name || `${Date.now()}-${index}.jpg`);
        body.append('guestName', guestName);
        body.append('caption', caption);
        const response = await fetch('/api/guest-upload', { method: 'POST', body });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.photo?.url) throw new Error(data.error || 'We could not upload this photo.');
        uploaded.push(data.photo);
        setProgress(Math.round(((index + 1) / files.length) * 100));
      }
      setPhotos((previous) => [...uploaded.reverse(), ...previous]);
      setMessage(`${uploaded.length} photo${uploaded.length > 1 ? 's are' : ' is'} now in the wedding gallery. Thank you!`);
      setCaption('');
    } catch (uploadError) {
      setError(uploadError.message || 'We could not upload this photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyGalleryLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/guest-gallery/${slug}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copying is unavailable here. Open the gallery and copy its address from your browser.');
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.brand} href={`/invite/${slug}`}>
          <strong>FOLDÈ</strong>
          <span className={styles.privateBadge}>⌁ Private wedding space</span>
        </Link>

        <section className={styles.uploadLayout}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{wedding?.couple || 'Wedding memories'}</p>
            <h1>Share the moments only you captured.</h1>
            <p className={styles.introLead}>From the dance floor to the quiet in-between moments, add your photos to the couple’s private gallery in a few taps.</p>
            <ol className={styles.steps}>
              <li><span>1</span>Choose up to 20 photos at a time</li>
              <li><span>2</span>We optimise and store them securely</li>
              <li><span>3</span>They appear in the shared gallery</li>
            </ol>
          </div>

          <div className={styles.formPanel}>
            <div className={styles.field}>
              <label htmlFor="guest-name">Your name <span aria-hidden="true">·</span> optional</label>
              <input id="guest-name" value={guestName} onChange={(event) => setGuestName(event.target.value)} maxLength={80} placeholder="So the couple knows who shared them" />
            </div>
            <div className={styles.field}>
              <label htmlFor="photo-caption">A note for the couple <span aria-hidden="true">·</span> optional</label>
              <input id="photo-caption" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={240} placeholder="A little memory, a place, a moment…" />
            </div>
            <label className={`${styles.dropzone} ${uploading ? styles.dropzoneBusy : ''}`}>
              <span className={styles.camera}>↥</span>
              <strong>{uploading ? 'Adding your memories…' : 'Choose photos from your phone'}</strong>
              <small>JPG, PNG, WebP or HEIC · 8 MB maximum per photo · up to 20 at once</small>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple disabled={uploading} onChange={handleUpload} hidden />
            </label>
            {uploading && <div className={styles.progress} aria-label={`Upload ${progress}%`}><i style={{ width: `${progress}%` }} /></div>}
            {message && <p className={`${styles.notice} ${styles.success}`}>{message}</p>}
            {error && <p className={`${styles.notice} ${styles.error}`}>{error}</p>}
            <p className={styles.privacy}><span>🔒</span><span>These photos are stored privately and are not indexed by search engines. Gallery links are intended for wedding guests only.</span></p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={`/guest-gallery/${slug}`}>View the private gallery</Link>
              <button className={styles.secondary} type="button" onClick={copyGalleryLink}>{copied ? 'Link copied!' : 'Copy gallery link'}</button>
              <Link className={styles.secondary} href={`/invite/${slug}`}>Back to invitation</Link>
            </div>
            {photos.length > 0 && <div className={styles.miniGrid}>{photos.slice(0, 8).map((photo) => <img key={photo.id} src={photo.url} alt={photo.caption || 'Guest wedding memory'} />)}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
