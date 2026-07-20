"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md space-y-4 p-8 text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          This page hit an unexpected error. You can try again, or head back to the dashboard.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/admin">Dashboard</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
