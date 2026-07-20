"use client";

import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground">Error</p>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight">Something went wrong.</h1>
      <p className="max-w-md text-muted-foreground leading-relaxed">
        This section couldn&rsquo;t load. Try again, or refresh the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="group inline-flex items-center gap-2 border border-foreground rounded-full px-5 py-2.5 text-sm hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
