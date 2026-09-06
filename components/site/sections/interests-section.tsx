import { SectionHeading } from "@/components/site/section-heading";
import { InterestCard } from "@/components/site/sections/interest-card";
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
        {interests.map((interest, i) => (
          <InterestCard key={interest.id} interest={interest} index={i} />
        ))}
      </div>
    </section>
  );
}
