import { GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { scaleYVariants } from "@/components/motion/variants";
import { SectionHeading } from "@/components/site/section-heading";
import { SectionThumb } from "@/components/site/section-thumb";
import { MOTION_EASE } from "@/lib/constants";
import type { EducationEntryRow, SectionRow } from "@/lib/types";

interface EducationSectionProps {
  section: SectionRow;
  entries: EducationEntryRow[];
}

export function EducationSection({ section, entries }: EducationSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-4 md:left-1/2 top-2 bottom-2 w-px md:-translate-x-1/2"
        >
          <span className="absolute inset-0 bg-primary/40" />
          <FadeIn
            variants={scaleYVariants}
            transition={{ duration: 1.2, ease: MOTION_EASE }}
            className="absolute inset-0 origin-top bg-gradient-to-b from-primary via-primary/60 to-transparent"
          />
        </div>

        <ol className="space-y-10 md:space-y-16">
          {entries.map((entry, i) => {
            const left = i % 2 === 0;
            return (
              <li key={entry.id} className="relative md:grid md:grid-cols-2 md:gap-12">
                <span aria-hidden className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10 flex h-3 w-3">
                  <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                </span>

                <FadeIn
                  delay={i * 0.14}
                  className={`pl-12 md:pl-0 ${left ? "md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}`}
                >
                  <div className="group relative border border-[color:var(--hairline)] rounded-2xl p-6 md:p-8 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_var(--primary)] transition-all duration-500">
                    <div
                      className={`flex items-center gap-2 font-mono-tight text-[11px] uppercase tracking-[0.25em] text-muted-foreground ${left ? "md:justify-end" : ""}`}
                    >
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                      <span>{entry.period_label}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl md:text-3xl leading-snug tracking-tight transition-colors duration-500 group-hover:text-primary">
                      {entry.degree}
                    </h3>
                    <div className={`mt-2 flex items-center gap-2 text-sm text-muted-foreground ${left ? "md:justify-end" : ""}`}>
                      <SectionThumb src={entry.image_url} alt="" size={28} shape="circle" />
                      {entry.school}
                    </div>
                    <div className={`mt-6 flex ${left ? "md:justify-end" : ""}`}>
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-mono-tight text-[11px] uppercase tracking-[0.2em] text-primary">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {entry.score_label}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
