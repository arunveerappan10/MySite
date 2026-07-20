"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileRow, SectionRow, SettingsRow } from "@/lib/types";

interface SiteNavProps {
  sections: SectionRow[];
  settings: SettingsRow;
  profile: ProfileRow;
}

function splitCompactName(fullName: string) {
  const tokens = fullName.trim().split(/\s+/);
  if (tokens.length <= 1) return { first: fullName, rest: "" };
  const compact = tokens.slice(0, -1);
  return { first: compact[0], rest: compact.slice(1).join(" ") };
}

export function SiteNav({ sections, settings, profile }: SiteNavProps) {
  const navItems = sections
    .filter((s) => s.is_published && s.nav_label)
    .sort((a, b) => a.position - b.position);
  const { first, rest } = splitCompactName(profile.full_name);
  const [active, setActive] = useState<string>(navItems[0]?.key ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    navItems.forEach((item) => {
      const el = document.getElementById(item.key);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // Section ids are static for the lifetime of the page — safe to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-[color:var(--hairline)]">
      <div className="mx-auto max-w-6xl px-4 md:px-10 h-14 flex items-center gap-4 md:gap-6">
        <a href="#top" className="font-display text-lg md:text-xl tracking-tight shrink-0">
          {first}
          {rest && <span className="hidden sm:inline"> {rest}</span>}
          <span className="text-primary">.</span>
        </a>
        <nav
          aria-label="Section navigation"
          className="ml-auto flex items-center gap-5 md:gap-8 text-sm overflow-x-auto no-scrollbar min-w-0"
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className={cn(
                "shine-on-hover group relative inline-block shrink-0 px-1 py-1 rounded-md transition-colors",
                active === item.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative inline-block transition-transform duration-500 group-hover:translate-x-0.5">
                {item.nav_label}
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute left-1 right-1 -bottom-0.5 h-px bg-primary origin-left transition-transform duration-500",
                  active === item.key ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>
        <a
          href={settings.nav_cta_href}
          className="group hidden sm:inline-flex items-center gap-2 shrink-0 text-sm border border-foreground rounded-full px-3.5 py-1.5 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
        >
          {settings.nav_cta_label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}
