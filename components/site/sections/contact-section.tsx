import { FileDown, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactForm } from "./contact-form";
import { getIcon } from "@/lib/icon-map";
import { platformLabel } from "@/lib/constants";
import type { ProfileRow, SectionRow, SettingsRow, SocialLinkRow } from "@/lib/types";

interface ContactSectionProps {
  section: SectionRow;
  profile: ProfileRow;
  settings: SettingsRow;
  socialLinks: SocialLinkRow[];
}

export function ContactSection({ section, profile, settings, socialLinks }: ContactSectionProps) {
  const primarySocial = [...socialLinks].sort((a, b) => a.position - b.position)[0];
  const SocialIcon = primarySocial ? getIcon(primarySocial.icon) : null;

  return (
    <section id={section.key} className="py-24 md:py-32">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <FadeIn className="md:col-span-5 space-y-8">
          <p className="text-muted-foreground leading-relaxed max-w-md">{profile.contact_intro}</p>
          <a href={`mailto:${profile.email}`} className="group block">
            <div className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Email
            </div>
            <div className="font-display text-2xl md:text-3xl group-hover:text-primary transition-colors break-all">
              {profile.email}
            </div>
          </a>
          {settings.resume_file_url && (
            <a
              href="/resume"
              download
              className="shine-on-hover group inline-flex items-center gap-3 rounded-full border border-foreground px-5 py-2.5 text-sm hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
            >
              Download resume
              <FileDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          )}
          <div className="grid grid-cols-2 gap-6 text-sm">
            {primarySocial && SocialIcon && (
              <a href={primarySocial.url} target="_blank" rel="noreferrer" className="group">
                <div className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  {platformLabel(primarySocial.platform)}
                </div>
                <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  <SocialIcon className="h-4 w-4" /> {primarySocial.label}
                </div>
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="group">
                <div className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Phone
                </div>
                <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" /> {profile.phone}
                </div>
              </a>
            )}
            {profile.location && (
              <div>
                <div className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Location
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </div>
              </div>
            )}
            {profile.availability_note && (
              <div>
                <div className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Availability
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {profile.availability_note}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
        <FadeIn as="div" className="md:col-span-7">
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}
