'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center bg-background">
      <h2 className="text-2xl font-bold text-foreground">Something went wrong!</h2>
      <p className="text-muted-foreground">We couldn&apos;t load the product details.</p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
