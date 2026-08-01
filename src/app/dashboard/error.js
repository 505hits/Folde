"use client";

export default function DashboardError({ error, reset }) {
    const handleClearAndRetry = () => {
        if (typeof window !== 'undefined') {
            // Clear potentially corrupted localStorage data
            try {
                localStorage.removeItem('eventInfo');
                localStorage.removeItem('orders');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('revisions');
                // Clear any guest data
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('guests_')) {
                        localStorage.removeItem(key);
                    }
                });
            } catch (e) {
                console.warn('Failed to clear localStorage:', e);
            }
        }
        // Reload the page fresh
        window.location.reload();
    };

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf8f5',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            padding: '1.5rem',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(92, 58, 30, 0.08)',
                border: '1px solid rgba(224, 220, 215, 0.7)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1.25rem'
                }}>
                    ⚠️
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    Something went wrong
                </h1>
                <p style={{ color: '#888', marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    An error occurred while loading your dashboard. This is usually caused by corrupted local data.
                </p>
                {error?.message && (
                    <p style={{ color: '#dc2626', fontSize: '0.78rem', backgroundColor: '#fef2f2', padding: '0.6rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', wordBreak: 'break-word' }}>
                        {error.message}
                    </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => reset()}
                        style={{
                            width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
                            backgroundColor: '#5C3A1E', color: '#fff', fontSize: '0.95rem',
                            fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={handleClearAndRetry}
                        style={{
                            width: '100%', padding: '0.75rem', borderRadius: '12px',
                            border: '1px solid #e0dcd7', backgroundColor: '#faf8f5',
                            color: '#5C3A1E', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        🗑️ Clear Cache & Reload
                    </button>
                </div>
            </div>
        </div>
    );
}
