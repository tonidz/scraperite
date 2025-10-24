'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/utils/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Page error occurred', error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="text-gray-600">
          We apologize for the inconvenience. An error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-4 justify-center mt-6">
          <Button
            onClick={reset}
            variant="default"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
