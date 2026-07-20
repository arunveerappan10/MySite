"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import { DEFAULT_TRANSITION, fadeInVariants } from "./variants";

const TAGS = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  span: motion.span,
} as const;

type Tag = keyof typeof TAGS;

interface FadeInProps {
  as?: Tag;
  delay?: number;
  variants?: Variants;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}

/**
 * Single-element scroll-triggered reveal — the Framer Motion equivalent of the
 * reference design's `.reveal` / IntersectionObserver system. Fires once, 12% into view.
 * `as` picks the rendered tag so this can sit directly inside a <dl>/<ul>/<ol> as a
 * spec-valid item wrapper instead of forcing an extra non-semantic <div>.
 *
 * Deliberately typed with an explicit, minimal prop set rather than extending
 * `HTMLMotionProps<"div">` — that type's per-tag DOM event handler generics (e.g.
 * `onCopy: ClipboardEventHandler<HTMLDivElement>`) aren't structurally assignable to the
 * `motion.li` / `motion.ul` variants `as` can render, and none of this design's usages
 * need to attach DOM event handlers to the wrapper itself anyway.
 */
export function FadeIn({ as = "div", delay = 0, variants, transition, ...props }: FadeInProps) {
  const Component = TAGS[as];
  const resolvedTransition: Transition = transition ?? { ...DEFAULT_TRANSITION, delay };
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
      variants={variants ?? fadeInVariants}
      transition={resolvedTransition}
      {...props}
    />
  );
}
