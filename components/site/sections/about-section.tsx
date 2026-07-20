import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import type { ProfileRow, SectionRow } from "@/lib/types";

interface AboutSectionProps {
  section: SectionRow;
  profile: ProfileRow;
}

export function AboutSection({ section, profile }: AboutSectionProps) {
  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        <div className="md:col-span-3">
          {profile.image_url && (
            <FadeIn className="relative aspect-square overflow-hidden rounded-2xl border border-[color:var(--hairline)]">
              <Image
                src={profile.image_url}
                alt={profile.full_name}
                fill
                sizes="(min-width: 768px) 20vw, 40vw"
                className="object-cover"
              />
            </FadeIn>
          )}
        </div>
        <FadeIn className="md:col-span-9">
          <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-3xl">
            {profile.about_summary}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
