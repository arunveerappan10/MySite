import { FadeIn } from "@/components/motion/fade-in";
import { parseAccentedHeading } from "@/lib/accent-heading";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
}

export function SectionHeading({ eyebrow, heading }: SectionHeadingProps) {
  return (
    <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-14 md:mb-20">
      <div className="md:col-span-3">
        <div className="font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-6 bg-primary" />
          {eyebrow}
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 className="shine-on-hover group inline-block font-display text-4xl md:text-5xl tracking-tight leading-[1.05] cursor-default">
          <span className="relative transition-transform duration-500 group-hover:translate-x-1 inline-block">
            {parseAccentedHeading(heading)}
          </span>
        </h2>
      </div>
    </FadeIn>
  );
}
