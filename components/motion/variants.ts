import type { Variants } from "framer-motion";
import { MOTION_EASE } from "@/lib/constants";

export const DEFAULT_TRANSITION = { duration: 0.9, ease: MOTION_EASE };

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export const scaleYVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1 },
};

export function staggerContainerVariants(staggerChildren = 0.12, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}
