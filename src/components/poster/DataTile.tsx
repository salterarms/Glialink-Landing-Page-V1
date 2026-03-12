"use client";

import type { PosterSection } from "@/lib/copy";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface DataTileProps {
  section: PosterSection;
  isActive: boolean;
  onClick: () => void;
}

export default function DataTile({
  section,
  isActive,
  onClick,
}: DataTileProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      layoutId={`poster-tile-${section.id}`}
      className={`relative w-full overflow-hidden rounded-lg border transition-all text-left ${
        isActive
          ? "border-purple/60 bg-purple/5 shadow-lg"
          : "border-ink/20 bg-white/50 hover:border-ink/40 hover:bg-white hover:shadow-md"
      }`}
      whileHover={prefersReducedMotion ? {} : { y: -2 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      aria-pressed={isActive}
      aria-label={`Open ${section.posterLabel} section`}
      style={{ maxHeight: "160px" }}
    >
      <div className="flex gap-6 p-6 h-full">
        {/* Left: Text content container - flexible width */}
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          {/* Label */}
          <div className="text-xs font-bold tracking-widest text-ink/60 uppercase">
            {section.posterLabel}
          </div>

          {/* Title */}
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-ink">
            {section.collapsedTitle}
          </h3>

          {/* Summary */}
          <p className="text-sm leading-relaxed text-ink/70">
            {section.collapsedSummary}
          </p>

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

        {/* Right: Individual stat containers with borders */}
        {section.miniStats && section.miniStats.length > 0 && (
          <div className="flex flex-shrink-0 gap-2 h-full flex-col justify-center items-center">
            {section.miniStats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="flex flex-1 flex-col items-center justify-center rounded-lg border border-ink/30 bg-white"
                style={{ minHeight: "60px" }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              >
                {/* Stat number and label on same line */}
                <div className="text-center font-[family-name:var(--font-heading)] text-sm font-bold text-purple">
                  {stat.stat}
                  {stat.footnote && (
                    <sup className="text-xs text-ink/60">{stat.footnote}</sup>
                  )}
                  <span className="text-xs text-ink/70 font-normal ml-1">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}
