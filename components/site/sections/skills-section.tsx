import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { getIcon } from "@/lib/icon-map";
import type { SectionRow, SkillGroupRow } from "@/lib/types";

interface SkillsSectionProps {
  section: SectionRow;
  groups: SkillGroupRow[];
}

export function SkillsSection({ section, groups }: SkillsSectionProps) {
  if (groups.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {groups.map((group, i) => {
          const Icon = getIcon(group.icon);
          return (
            <li key={group.id} className="h-full">
              <FadeIn
                delay={i * 0.11}
                className="h-full shine-on-hover group relative border border-[color:var(--hairline)] rounded-2xl p-6 md:p-7 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_var(--primary)] transition-all duration-500 ease-out"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 overflow-hidden rounded-lg border border-[color:var(--hairline)] flex items-center justify-center text-primary bg-background transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                      {group.image_url ? (
                        <Image src={group.image_url} alt="" width={36} height={36} className="h-full w-full object-cover" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <div className="font-display text-lg md:text-xl leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-0.5">
                      {group.group_name}
                    </div>
                  </div>
                  <span aria-hidden className="relative flex h-2 w-2 mt-2">
                    <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                </div>
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {group.items.map((item, j) => (
                    <FadeIn
                      key={item}
                      as="li"
                      delay={i * 0.11 + j * 0.05}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.11 + j * 0.05 }}
                      className="text-xs border border-[color:var(--hairline)] rounded-full px-3 py-1.5 bg-background text-foreground/80 hover:text-primary-foreground hover:bg-primary hover:border-primary hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                    >
                      {item}
                    </FadeIn>
                  ))}
                </ul>
              </FadeIn>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
