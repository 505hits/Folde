import React, { useRef, useState } from 'react';

export default function StyledFileInput({ accept, onChange, label = "Choisir un fichier", multiple = false, style }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        setFileName(`${e.target.files.length} fichier(s) sélectionné(s)`);
      } else {
        setFileName(e.target.files[0].name);
      }
    } else {
      setFileName('');
    }
    if (onChange) onChange(e);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', ...style }}>
      <button 
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e0dcd7',
          borderRadius: '8px',
          padding: '0.6rem 1.2rem',
          color: '#5C3A1E',
          fontWeight: 500,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5C3A1E'; e.currentTarget.style.backgroundColor = '#fbf8f9'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0dcd7'; e.currentTarget.style.backgroundColor = '#fff'; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        {label}
      </button>
      <input 
        ref={inputRef}
        type="file" 
        accept={accept} 
        onChange={handleChange} 
        multiple={multiple}
        style={{ display: 'none' }} 
      />
      {fileName && (
        <span style={{ fontSize: '0.8rem', color: '#666', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fileName}
        </span>
      )}
    </div>
  );
}
