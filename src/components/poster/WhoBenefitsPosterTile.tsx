"use client";

import type { PosterTileProps } from "./poster.types";
import { motion } from "framer-motion";

export default function WhoBenefitsPosterTile({
  section,
  isActive,
  onClick,
}: PosterTileProps) {

  return (
    <motion.button
      onClick={onClick}
      layoutId={`poster-tile-${section.id}`}
      className={`relative w-full overflow-hidden rounded-lg border text-left ${
        isActive
          ? "border-purple/60 bg-white/80 shadow-lg"
          : "border-white/30 bg-white/60 hover:border-white/50 hover:bg-white/70 hover:shadow-md"
      }`}
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
          <div className="mt-2 flex items-center gap-1 text-xs text-ink/50">
            <span>Click to expand</span>
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Right: Testimonial container - hidden on mobile */}
        <div
          className="hidden md:flex flex-1 items-center justify-center"
        >
          <div className="flex flex-col gap-3 h-fit justify-between rounded-lg border border-ink/30 bg-white p-4 max-w-sm">
            {/* Testimonial quote */}
            <p className="text-base leading-relaxed text-ink/70 italic">
              "Faculty have a <span className="font-bold">very hard time finding good people</span>… finding people who are a <span className="font-bold">good fit for their programs</span>."
            </p>

            {/* Testimonial source */}
            <p className="text-xs text-ink/50 font-medium">
              — Researcher at the Medical University of South Carolina
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
