import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { SectionThumb } from "@/components/site/section-thumb";
import type { CertificationRow, SectionRow } from "@/lib/types";

interface CertificationsSectionProps {
  section: SectionRow;
  certifications: CertificationRow[];
}

export function CertificationsSection({ section, certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert, i) => (
          <li key={cert.id} className="h-full">
            <FadeIn
              delay={i * 0.11}
              className="h-full shine-on-hover group relative border border-[color:var(--hairline)] rounded-2xl p-6 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_var(--primary)] transition-all duration-500 ease-out"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
              <div className="relative flex items-start justify-between gap-3">
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {cert.issuer}
                </span>
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              </div>
              <div className="relative mt-6 flex items-center gap-3">
                <SectionThumb src={cert.image_url} alt="" size={40} />
                <div className="font-display text-lg md:text-xl leading-snug transition-transform duration-500 group-hover:translate-x-0.5">
                  {cert.name}
                </div>
              </div>
              <div className="relative mt-6 pt-3 border-t border-[color:var(--hairline)] flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Credential ID</span>
                <span className="font-mono-tight text-xs text-foreground tracking-wider">
                  {cert.credential_id}
                </span>
              </div>
              <div className="relative mt-3 flex items-center justify-between gap-3 rounded-lg border border-[color:var(--hairline)] bg-background/55 px-3 py-2 group-hover:border-primary/35 transition-colors duration-500">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-xs text-muted-foreground shrink-0">Valid until</span>
                  <span className="font-mono-tight text-[11px] text-primary uppercase tracking-[0.14em] truncate">
                    {cert.validity_label}
                  </span>
                </div>
                {cert.verify_url && (
                  <a
                    href={cert.verify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${cert.name} credential`}
                    className="group/verify inline-flex items-center gap-1 text-[10px] font-mono-tight uppercase tracking-[0.16em] text-muted-foreground hover:text-primary transition-colors duration-300 shrink-0"
                  >
                    <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover/verify:after:scale-x-100">
                      Verify
                    </span>
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/verify:translate-x-0.5 group-hover/verify:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </FadeIn>
          </li>
        ))}
      </ul>
    </section>
  );
}
