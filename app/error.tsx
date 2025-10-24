'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global error occurred', error, { digest: error.digest });
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Something went wrong!
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              We apologize for the inconvenience. A critical error occurred.
            </p>
            {error.digest && (
              <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '1.5rem' }}>
                Error ID: {error.digest}
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                  border: '1px solid #ccc',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
