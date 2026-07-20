"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Applies the visitor's OS-level prefers-reduced-motion setting to every Framer Motion
 * animation on the public site in one place, rather than checking it per-component. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
