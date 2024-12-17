'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>Something went wrong while loading the dashboard.</p>
            <div className="text-sm text-muted-foreground">
              {error.message || 'An unexpected error occurred'}
            </div>
            <button
              onClick={reset}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 rounded-md text-sm transition-colors"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
