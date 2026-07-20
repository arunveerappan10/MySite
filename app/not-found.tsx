import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground">404</p>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight">Page not found.</h1>
      <p className="max-w-md text-muted-foreground leading-relaxed">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 border border-foreground rounded-full px-5 py-2.5 text-sm hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
      >
        Back home
      </Link>
    </div>
  );
}
