import { FileDown, Mail, MapPin, Phone } from "lucide-react";
import type { ProfileRow, SectionRow, SettingsRow } from "@/lib/types";

interface SiteFooterProps {
  sections: SectionRow[];
  settings: SettingsRow;
  profile: ProfileRow;
}

export function SiteFooter({ sections, settings, profile }: SiteFooterProps) {
  const navItems = sections
    .filter((s) => s.is_published && s.nav_label)
    .sort((a, b) => a.position - b.position);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--hairline)] bg-card/40">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="font-display text-3xl md:text-4xl tracking-tight">
              {profile.full_name}
              <span className="text-primary">.</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
              {settings.footer_bio}
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Navigate
            </div>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={`#${item.key}`}
                    className="text-foreground/80 hover:text-primary transition-colors"
                  >
                    {item.nav_label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Direct
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" /> {profile.email}
              </li>
              {profile.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" /> {profile.phone}
                </li>
              )}
              {profile.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {profile.location}
                </li>
              )}
              {settings.resume_file_url && (
                <li>
                  <a
                    href={settings.resume_file_url}
                    download
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FileDown className="h-3.5 w-3.5 text-primary" /> Download resume
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[color:var(--hairline)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono-tight uppercase tracking-[0.2em] text-muted-foreground">
          <span>
            © {year} {profile.full_name} · All rights reserved
          </span>
          <span>{settings.footer_tagline}</span>
        </div>
      </div>
    </footer>
  );
}
