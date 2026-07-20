import Image from "next/image";
import { Star } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";
import type { SectionRow, TestimonialRow } from "@/lib/types";

interface TestimonialsSectionProps {
  section: SectionRow;
  testimonials: TestimonialRow[];
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * No equivalent section exists in the reference design — this is new, required content
 * per spec. Renders nothing when empty, so the public page stays pixel-identical to the
 * reference until the admin publishes a first testimonial.
 */
export function TestimonialsSection({ section, testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((testimonial, i) => (
          <FadeIn
            key={testimonial.id}
            delay={i * 0.11}
            className="shine-on-hover group relative border border-[color:var(--hairline)] rounded-2xl p-6 md:p-7 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_var(--primary)] transition-all duration-500 ease-out flex flex-col"
          >
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            />
            {testimonial.rating && (
              <div className="relative flex items-center gap-0.5 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      "h-3.5 w-3.5",
                      idx < testimonial.rating! ? "fill-primary text-primary" : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
            )}
            <p className="relative text-sm md:text-[15px] text-foreground leading-relaxed flex-1">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="relative mt-6 pt-4 border-t border-[color:var(--hairline)] flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[color:var(--hairline)] bg-background flex items-center justify-center font-mono-tight text-xs text-primary">
                {testimonial.image_url ? (
                  <Image
                    src={testimonial.image_url}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(testimonial.author_name)
                )}
              </span>
              <div className="min-w-0">
                <div className="text-sm text-foreground truncate">{testimonial.author_name}</div>
                {testimonial.author_role && (
                  <div className="text-xs text-muted-foreground truncate">{testimonial.author_role}</div>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
