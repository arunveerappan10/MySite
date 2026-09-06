"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { fadeInVariants, staggerContainerVariants } from "@/components/motion/variants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MOTION_EASE } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import type { InterestRow } from "@/lib/types";

const ROW_TRANSITION = { duration: 0.55, ease: MOTION_EASE };

/** An interest tile. Tiles with a link or detail rows open a dialog holding them —
 * chess links out to a profile, volunteering lists the events attended. Tiles with
 * neither stay inert rather than opening an empty dialog.
 *
 * Openable tiles carry a persistent prompt rather than a corner badge — hover-only
 * affordances leave the tile looking inert until the pointer lands on it. The wording is
 * the admin's ("Play a game?", "Details"), falling back to "View details". */
export function InterestCard({ interest, index }: { interest: InterestRow; index: number }) {
  const Icon = getIcon(interest.icon);
  const details = interest.details ?? [];
  const isInteractive = Boolean(interest.link_url) || details.length > 0;
  const ordinal = String(index + 1).padStart(2, "0");
  // Admin-authored, so rendered as typed — no uppercase transform.
  const cueLabel = interest.cue_label ?? "View details";

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
          {ordinal}
        </div>
        <div className="font-display text-lg leading-tight transition-transform duration-500 group-hover:translate-x-0.5">
          {interest.label}
        </div>
      </div>
      {isInteractive && (
        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 font-mono-tight text-[11px] tracking-wide text-muted-foreground/70 transition-colors duration-500 group-hover:text-primary"
        >
          {cueLabel}
          <ArrowRight className="h-3 w-3 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
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
          aria-label={`${interest.label} — ${cueLabel}`}
        />
      </FadeIn>

      <DialogContent className="sm:max-w-2xl gap-0 overflow-hidden border-[color:var(--hairline)] bg-card p-0 max-h-[85vh]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent"
        />
        <div className="relative overflow-y-auto p-8 md:p-10">
          <DialogHeader className="space-y-0">
            <div className="flex items-center gap-5">
              <motion.span
                initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: MOTION_EASE }}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[color:var(--hairline)] flex items-center justify-center text-primary bg-background"
              >
                {interest.image_url ? (
                  <Image
                    src={interest.image_url}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon className="h-7 w-7" />
                )}
              </motion.span>
              <div className="min-w-0 text-left">
                <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
                  {ordinal}
                </div>
                <DialogTitle className="font-display text-2xl md:text-3xl leading-tight text-left">
                  {interest.label}
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="sr-only">More about {interest.label}</DialogDescription>
          </DialogHeader>

          {details.length > 0 && (
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={staggerContainerVariants(0.07, 0.15)}
              className="mt-9 border-t border-[color:var(--hairline)]"
            >
              {details.map((detail, i) => (
                <motion.li
                  key={`${detail.label}-${i}`}
                  variants={fadeInVariants}
                  transition={ROW_TRANSITION}
                  className="group/row flex flex-col gap-1 border-b border-[color:var(--hairline)] py-4 transition-colors duration-300 hover:bg-primary/[0.04] sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="font-medium text-primary leading-snug transition-transform duration-300 group-hover/row:translate-x-1">
                    {detail.label}
                  </span>
                  {/* Values run from a short date to a full sentence, so this wraps rather
                      than shrink-0'ing and crushing the label. */}
                  {detail.value && (
                    <span className="text-sm leading-relaxed text-foreground/90 sm:max-w-[58%] sm:text-right">
                      {detail.value}
                    </span>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}

          {interest.link_url && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ROW_TRANSITION, delay: 0.15 + details.length * 0.07 }}
              className="mt-9"
            >
              <a
                href={interest.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--hairline)] bg-background px-6 py-4 text-sm font-medium transition-all duration-500 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_20px_50px_-25px_var(--primary)]"
              >
                {interest.link_label ?? "Open link"}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </a>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
