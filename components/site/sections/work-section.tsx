"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/site/section-heading";
import { SectionThumb } from "@/components/site/section-thumb";
import { MOTION_EASE } from "@/lib/constants";
import type { ProjectRow, SectionRow } from "@/lib/types";

interface WorkSectionProps {
  section: SectionRow;
  projects: ProjectRow[];
}

export function WorkSection({ section, projects }: WorkSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (projects.length === 0) return null;

  return (
    <section id={section.key} className="py-24 md:py-32 border-b border-[color:var(--hairline)]">
      <SectionHeading eyebrow={section.eyebrow} heading={section.heading} />
      <ul className="divide-y divide-[color:var(--hairline)] border-y border-[color:var(--hairline)]">
        {projects.map((project) => {
          const open = openId === project.id;
          return (
            <li key={project.id}>
              <FadeIn className="shine-on-hover px-2 md:px-6">
                <button
                  onClick={() => setOpenId(open ? null : project.id)}
                  aria-expanded={open}
                  className="w-full group grid grid-cols-12 gap-4 py-7 md:py-8 text-left items-baseline hover:pl-2 transition-[padding] duration-500"
                >
                  <span className="col-span-12 md:col-span-8 pr-2 flex items-center gap-4 font-display text-2xl md:text-3xl tracking-tight transition-colors duration-500 group-hover:text-primary">
                    <SectionThumb src={project.image_url} alt="" size={48} />
                    {project.title}
                  </span>
                  <span className="hidden md:block md:col-span-3 pr-4 text-sm text-muted-foreground">
                    {project.tag}
                  </span>
                  <span className="col-span-12 md:col-span-1 flex md:justify-end md:pr-2">
                    <ArrowUpRight
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-500 ${
                        open
                          ? "rotate-45 text-primary"
                          : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      }`}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: MOTION_EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 pb-10 md:pb-14 pt-2 pr-2 md:pr-6">
                        <div className="md:col-span-7 space-y-6">
                          <Field label="Problem" body={project.problem} />
                          <Field label="Role" body={project.role} />
                          <Field label="Approach" body={project.approach} />
                          <Field label="Outcome" body={project.outcome} accent />
                        </div>
                        <div className="md:col-span-4 md:col-start-9 space-y-3">
                          {project.metrics.map((metric) => (
                            <div
                              key={metric.label}
                              className="flex items-baseline justify-between border-b border-[color:var(--hairline)] pb-2"
                            >
                              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-mono-tight">
                                {metric.label}
                              </span>
                              <span className="font-display text-2xl text-foreground">
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Field({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </div>
      <p className={`leading-relaxed ${accent ? "text-foreground text-lg" : "text-muted-foreground"}`}>
        {body}
      </p>
    </div>
  );
}
