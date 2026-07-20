import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionThumbProps {
  src: string | null;
  alt: string;
  size?: number;
  shape?: "circle" | "rounded";
  className?: string;
}

/** Conditional small thumbnail for the optional image_url fields across content
 * collections — renders nothing when no image has been uploaded, so every section stays
 * exactly as it is today until the admin adds one. */
export function SectionThumb({ src, alt, size = 44, shape = "rounded", className }: SectionThumbProps) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn(
        "shrink-0 border border-[color:var(--hairline)] object-cover",
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className,
      )}
    />
  );
}
