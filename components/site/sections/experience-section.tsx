import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { SectionThumb } from "@/components/site/section-thumb";
import type { ExperienceEntryRow, SectionRow } from "@/lib/types";

interface ExperienceSectionProps {
  section: SectionRow;
  entries: ExperienceEntryRow[];
}

export function ExperienceSection({ section, entries }: ExperienceSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <ol className="space-y-6">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <FadeIn
              delay={i * 0.12}
              className="shine-on-hover group relative border border-[color:var(--hairline)] rounded-2xl bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_28px_70px_-36px_var(--primary)] transition-all duration-500 overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-out"
              />
              <div className="border-b border-[color:var(--hairline)] p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <SectionThumb src={entry.image_url} alt="" size={44} className="mt-1" />
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-tight uppercase tracking-[0.22em] text-muted-foreground">
                        <span>{entry.company}</span>
                        <span aria-hidden className="hidden h-px w-8 bg-primary/50 sm:inline-block" />
                        <span>{entry.domain}</span>
                      </div>
                      <h3 className="mt-4 max-w-3xl font-display text-2xl md:text-4xl leading-tight tracking-tight transition-colors duration-500 group-hover:text-primary">
                        {entry.role_title}
                      </h3>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl border border-[color:var(--hairline)] bg-background/70 px-4 py-3 group-hover:border-primary/40 transition-colors duration-500">
                    <div className="font-mono-tight text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Timeline
                    </div>
                    <div className="mt-1 text-sm text-foreground">{entry.period_label}</div>
                    <div className="mt-1 inline-flex items-center gap-2 text-[11px] font-mono-tight uppercase tracking-[0.2em] text-primary/80">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      {entry.duration_label}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="p-6 md:p-8">
                  <ul className="grid gap-3 md:grid-cols-2 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                    {entry.impact_bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 rounded-xl border border-transparent p-3 -m-3 hover:border-[color:var(--hairline)] hover:bg-background/50 transition-colors duration-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <aside className="border-t lg:border-t-0 lg:border-l border-[color:var(--hairline)] bg-background/45 p-6 md:p-8">
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Measured impact
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {entry.highlights.map((highlight) => (
                      <div
                        key={highlight.label}
                        className="rounded-xl border border-[color:var(--hairline)] bg-card p-4 group-hover:border-primary/35 transition-colors duration-500"
                      >
                        <div className="font-display text-2xl leading-none text-foreground">
                          {highlight.value}
                        </div>
                        <div className="mt-2 font-mono-tight text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {highlight.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-[color:var(--hairline)]">
                    <div className="font-mono-tight text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-3">
                      Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono-tight uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-[color:var(--hairline)] text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground transition-colors duration-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>
    </section>
  );
}
