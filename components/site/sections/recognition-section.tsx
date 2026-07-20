import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { getIcon } from "@/lib/icon-map";
import type { RecognitionRow, SectionRow } from "@/lib/types";

interface RecognitionSectionProps {
  section: SectionRow;
  recognitions: RecognitionRow[];
}

export function RecognitionSection({ section, recognitions }: RecognitionSectionProps) {
  if (recognitions.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recognitions.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <FadeIn
              key={item.id}
              as="div"
              delay={i * 0.11}
              className="shine-on-hover group relative border border-[color:var(--hairline)] rounded-2xl p-6 md:p-7 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_var(--primary)] transition-all duration-500 ease-out"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
              <div className="relative flex items-start justify-between gap-3 mb-6">
                <span className="h-10 w-10 overflow-hidden rounded-lg border border-[color:var(--hairline)] flex items-center justify-center text-primary bg-background transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                  {item.image_url ? (
                    <Image src={item.image_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span aria-hidden className="relative flex h-2 w-2 mt-2">
                  <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              </div>
              <h3 className="relative font-display text-xl md:text-2xl leading-snug transition-transform duration-500 group-hover:translate-x-0.5">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
