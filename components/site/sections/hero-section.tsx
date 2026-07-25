import { ArrowUpRight, FileDown } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import type { ProfileRow, SettingsRow } from "@/lib/types";

interface HeroSectionProps {
  profile: ProfileRow;
  settings: SettingsRow;
}

function splitHeroName(fullName: string, accentWord: string) {
  const idx = fullName.indexOf(accentWord);
  if (!accentWord || idx === -1) return { before: fullName, accent: "", after: "" };
  return {
    before: fullName.slice(0, idx),
    accent: accentWord,
    after: fullName.slice(idx + accentWord.length),
  };
}

export function HeroSection({ profile, settings }: HeroSectionProps) {
  const { before, accent, after } = splitHeroName(profile.full_name, profile.hero_accent_word);

  return (
    <section
      id="top"
      className="pt-20 md:pt-28 pb-20 md:pb-28 border-b border-[color:var(--hairline)]"
    >
      <FadeIn className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end">
        <div className="md:col-span-8">
          <div className="flex items-center gap-3 text-xs font-mono-tight text-muted-foreground uppercase tracking-[0.2em]">
            <span aria-hidden className="inline-block h-px w-8 bg-primary" />
            <span>{profile.hero_eyebrow}</span>
          </div>
          <h1 className="font-display mt-6 text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-[-0.02em]">
            {before}
            {accent && <span className="italic text-primary">{accent}</span>}
            {after}.
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {profile.hero_subheading}
          </p>
        </div>
        <div className="md:col-span-4 md:pb-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[color:var(--hairline)] pt-5">
            {profile.hero_stats.map((stat, i) => (
              <FadeIn
                key={stat.label}
                delay={i * 0.12}
                className="shine-on-hover group relative rounded-lg p-2 -m-2 hover:-translate-y-0.5 transition-transform duration-500"
              >
                <dt className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="font-display text-2xl mt-1 transition-colors duration-500 group-hover:text-primary">
                  {stat.value}
                </dd>
              </FadeIn>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors"
            >
              Impact work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            {settings.resume_file_url && (
              <a
                href="/resume"
                download
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Download resume
                <FileDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
