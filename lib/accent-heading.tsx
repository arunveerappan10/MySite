import type { ReactNode } from "react";

/**
 * Splits a heading string on `{{...}}` markup and wraps matched spans in the
 * reference design's italic-primary accent treatment, e.g.
 * "Work that moved the {{needle}}." -> Work that moved the <em>needle</em>.
 */
export function parseAccentedHeading(heading: string): ReactNode {
  const parts = heading.split(/(\{\{[^{}]+\}\})/g).filter((part) => part.length > 0);

  return parts.map((part, i) => {
    const match = /^\{\{([^{}]+)\}\}$/.exec(part);
    if (match) {
      return (
        <span key={i} className="italic text-primary">
          {match[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
