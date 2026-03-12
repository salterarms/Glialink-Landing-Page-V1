"use client";

import type { PosterTileProps } from "./poster.types";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function WhoBenefitsPosterTile({
  section,
  isActive,
  onClick,
}: PosterTileProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      layoutId={`poster-tile-${section.id}`}
      className={`relative w-full overflow-hidden rounded-lg border transition-all text-left ${
        isActive
          ? "border-purple/60 bg-white/80 shadow-lg"
          : "border-white/30 bg-white/60 hover:border-white/50 hover:bg-white/70 hover:shadow-md"
      }`}
      whileHover={prefersReducedMotion ? {} : { y: -2 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      aria-pressed={isActive}
      aria-label={`Open ${section.posterLabel} section`}
    >
      <div className="flex gap-6 p-6 h-full">
        {/* Left: Text content container */}
        <div className="flex flex-1 flex-col gap-3 justify-between">
          {/* Poster label */}
          <div className="text-xs font-bold tracking-widest text-ink/60 uppercase">
            {section.posterLabel}
          </div>

          {/* Title */}
          <h3 className="text-left font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-ink">
            {section.collapsedTitle}
          </h3>

          {/* Summary */}
          <div className="text-left text-sm leading-relaxed text-ink/70">
            {typeof section.collapsedSummary === "string" ? (
              section.collapsedSummary
            ) : (
              <div className="flex flex-col gap-2">
                {section.collapsedSummary.map((item, idx) => (
                  <span key={idx}>
                    {item.highlight ? (
                      <span className="font-bold text-ink">{item.text}</span>
                    ) : (
                      item.text
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer cue */}
          <motion.div
            className="mt-2 flex items-center gap-1 text-xs text-ink/50"
            animate={isActive ? { x: 4 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>Click to expand</span>
            <motion.svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={isActive ? { x: 2 } : { x: 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* Right: Testimonial container */}
        <motion.div
          className="flex flex-1 items-center justify-center rounded-lg border border-ink/30 bg-white p-4"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        >
          <div className="flex flex-col gap-3 h-full justify-between">
            {/* Testimonial quote */}
            <p className="text-sm leading-relaxed text-ink/70 italic">
              "I've recently been through that whole process of trying to find a lab, emailing a million PIs, and none of them email you back. You're like, okay, what do I do now?"
            </p>

            {/* Testimonial source */}
            <p className="text-xs text-ink/50 font-medium">
              — Neuroscience PhD student, Stony Brook University
            </p>
          </div>
        </motion.div>
      </div>
    </motion.button>
  );
}
