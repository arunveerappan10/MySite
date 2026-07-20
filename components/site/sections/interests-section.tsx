import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { getIcon } from "@/lib/icon-map";
import type { InterestRow, SectionRow } from "@/lib/types";

interface InterestsSectionProps {
  section: SectionRow;
  interests: InterestRow[];
}

export function InterestsSection({ section, interests }: InterestsSectionProps) {
  if (interests.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interests.map((interest, i) => {
          const Icon = getIcon(interest.icon);
          return (
            <FadeIn
              key={interest.id}
              delay={i * 0.14}
              className="shine-on-hover group relative overflow-hidden flex flex-col items-start gap-5 border border-[color:var(--hairline)] rounded-2xl p-6 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_var(--primary)] transition-all duration-500"
            >
              <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[color:var(--hairline)] flex items-center justify-center text-primary bg-background group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                {interest.image_url ? (
                  <Image src={interest.image_url} alt="" width={48} height={48} className="h-full w-full object-cover" />
                ) : (
                  <Icon className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-6" />
                )}
              </span>
              <div>
                <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-lg leading-tight transition-transform duration-500 group-hover:translate-x-0.5">
                  {interest.label}
                </div>
              </div>
              <span
                aria-hidden
                className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
              />
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
