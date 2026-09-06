"use client";

import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getIcon } from "@/lib/icon-map";
import type { InterestRow } from "@/lib/types";
import { cn } from "@/lib/utils";

/** An interest tile. Tiles with a link or detail rows open a dialog holding them —
 * chess links out to a profile, volunteering lists the events attended. Tiles with
 * neither stay inert rather than opening an empty dialog. */
export function InterestCard({ interest, index }: { interest: InterestRow; index: number }) {
  const Icon = getIcon(interest.icon);
  const details = interest.details ?? [];
  const isInteractive = Boolean(interest.link_url) || details.length > 0;

  const face = (
    <>
      <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[color:var(--hairline)] flex items-center justify-center text-primary bg-background group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
        {interest.image_url ? (
          <Image src={interest.image_url} alt="" width={48} height={48} className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-6" />
        )}
      </span>
      <div>
        <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="font-display text-lg leading-tight transition-transform duration-500 group-hover:translate-x-0.5">
          {interest.label}
        </div>
      </div>
      {isInteractive && (
        <span
          aria-hidden
          className="absolute top-5 right-5 text-muted-foreground/60 group-hover:text-primary transition-colors duration-500"
        >
          <Plus className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
        </span>
      )}
      <span
        aria-hidden
        className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
      />
    </>
  );

  const cardClass =
    "shine-on-hover group relative overflow-hidden flex flex-col items-start gap-5 border border-[color:var(--hairline)] rounded-2xl p-6 bg-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_var(--primary)] transition-all duration-500";

  if (!isInteractive) {
    return (
      <FadeIn delay={index * 0.14} className={cardClass}>
        {face}
      </FadeIn>
    );
  }

  return (
    <Dialog>
      <FadeIn delay={index * 0.14} className={cardClass}>
        {face}
        {/* Stretched trigger rather than a button wrapper — FadeIn owns the card's motion
            styling, and nesting it inside a button would break the layout. */}
        <DialogTrigger
          className="absolute inset-0 z-10 rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${interest.label} — see more`}
        />
      </FadeIn>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{interest.label}</DialogTitle>
          <DialogDescription className="sr-only">
            More about {interest.label}
          </DialogDescription>
        </DialogHeader>

        {details.length > 0 && (
          <ul className="divide-y divide-[color:var(--hairline)] border-y border-[color:var(--hairline)]">
            {details.map((detail, i) => (
              <li key={`${detail.label}-${i}`} className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="text-sm leading-snug">{detail.label}</span>
                {detail.value && (
                  <span className="font-mono-tight text-[11px] uppercase tracking-[0.14em] text-primary shrink-0">
                    {detail.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {interest.link_url && (
          <a
            href={interest.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "group/cta w-full gap-2")}
          >
            {interest.link_label ?? "Open link"}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
