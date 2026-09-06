'use client';

import { use, useState } from 'react';
import Link from 'next/link';

const compressPhoto = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('This image could not be read.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('Please use a JPG, PNG, or WebP image.'));
    image.onload = () => {
      const limit = 1600;
      const scale = Math.min(1, limit / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('This image could not be prepared.')), 'image/jpeg', 0.86);
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export default function GuestUploadPage({ params }) {
  const { slug } = use(params);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    setUploading(true);
    setError('');
    setMessage(`Preparing ${files.length} photo${files.length > 1 ? 's' : ''}...`);
    const uploaded = [];
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        if (!file.type.startsWith('image/')) throw new Error('Please select image files only.');
        setMessage(`Uploading photo ${index + 1} of ${files.length}...`);
        const optimized = await compressPhoto(file);
        const body = new FormData();
        body.append('slug', slug);
        body.append('file', optimized, `${Date.now()}-${index}.jpg`);
        const response = await fetch('/api/guest-upload', { method: 'POST', body });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.photoUrl) throw new Error(data.error || 'We could not upload this photo.');
        uploaded.push(data.photoUrl);
      }
      setPhotos((previous) => [...uploaded, ...previous]);
      setMessage(`Thank you — ${uploaded.length} photo${uploaded.length > 1 ? 's have' : ' has'} been added to the wedding gallery.`);
    } catch (uploadError) {
      setError(uploadError.message || 'We could not upload this photo. Please try again.');
      setMessage('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#faf7f2', display: 'grid', placeItems: 'center', padding: '1.5rem', fontFamily: 'Arial, sans-serif', color: '#3e2723' }}>
      <section style={{ width: '100%', maxWidth: '560px', background: '#fff', border: '1px solid #eadfd5', boxShadow: '0 16px 45px rgba(81, 49, 27, 0.1)', borderRadius: '28px', padding: 'clamp(1.5rem, 5vw, 3rem)', textAlign: 'center' }}>
        <p style={{ letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a7258', fontSize: '0.72rem', fontWeight: 700, margin: '0 0 1rem' }}>Wedding memories</p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 7vw, 3.25rem)', fontFamily: 'Georgia, serif', fontWeight: 500 }}>Share your photos</h1>
        <p style={{ color: '#74675f', lineHeight: 1.6, margin: '1rem auto 2rem', maxWidth: '420px' }}>Add the moments you captured. They will appear in the couple’s private wedding gallery.</p>
        <label style={{ minHeight: '190px', border: '1.5px dashed #b99579', borderRadius: '20px', background: '#fffcf9', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.65 : 1, padding: '1.5rem', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '2rem' }}>📷</span>
          <strong>{uploading ? 'Uploading your memories…' : 'Choose photos to share'}</strong>
          <span style={{ color: '#8c7b70', fontSize: '0.84rem' }}>JPG, PNG or WebP · up to 4 MB each</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={handleUpload} style={{ display: 'none' }} />
        </label>
        {message && <p style={{ color: '#2d7a45', background: '#effaf1', borderRadius: '12px', padding: '0.85rem 1rem', lineHeight: 1.45, fontSize: '0.9rem' }}>{message}</p>}
        {error && <p style={{ color: '#b42318', background: '#fff2f1', borderRadius: '12px', padding: '0.85rem 1rem', lineHeight: 1.45, fontSize: '0.9rem' }}>{error}</p>}
        {photos.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginTop: '1.5rem' }}>{photos.map((url) => <img key={url} src={url} alt="Newly shared wedding memory" style={{ width: '100%', aspectRatio: 1, borderRadius: '10px', objectFit: 'cover' }} />)}</div>}
        <Link href={`/invite/${slug}`} style={{ display: 'inline-block', marginTop: '2rem', color: '#6d4324', fontWeight: 700, textDecoration: 'none' }}>← Back to the invitation</Link>
      </section>
    </main>
  );
}
