"use client";

import type { PosterExpandedViewProps } from "./poster.types";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function PosterExpandedView({
  section,
  onClose,
  isContained = false,
}: PosterExpandedViewProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!section) return null;

  if (isContained) {
    // Contained mode - fills the purple container below header
    return (
      <motion.div
        layoutId={`poster-tile-${section.id}`}
        className="relative w-full rounded-lg bg-white/80 p-8 h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back button */}
        <motion.button
          onClick={onClose}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          whileHover={prefersReducedMotion ? {} : { x: -2 }}
          aria-label="Close expanded view"
        >
          <motion.svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </motion.svg>
          <span>Back to poster</span>
        </motion.button>

        {/* Scrollable content */}
        <div className="overflow-y-auto pr-4" style={{ height: "calc(100% - 48px)" }}>
          {/* Title */}
          <motion.h2
            className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {section.expandedTitle}
          </motion.h2>

          {/* Intro */}
          {section.expandedContent.intro && (
            <motion.p
              className="mt-6 text-lg leading-relaxed text-ink/80"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {section.expandedContent.intro}
            </motion.p>
          )}

          {/* Content blocks */}
          <div className="mt-10 space-y-8">
            {section.expandedContent.blocks?.map((block, idx) => (
              <motion.div
                key={idx}
                className={`${
                  block.highlight ? "rounded-lg border border-purple/20 bg-purple/5 p-6" : ""
                }`}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
              >
                {block.heading && (
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-ink">
                    {block.heading}
                  </h3>
                )}
                <div
                  className={`${
                    block.heading ? "mt-3" : ""
                  } leading-relaxed text-ink/80`}
                  dangerouslySetInnerHTML={{ __html: block.body }}
                />
              </motion.div>
            ))}
          </div>

          {/* Features grid */}
          {section.expandedContent.features && section.expandedContent.features.length > 0 && (
            <div className="mt-10 space-y-6 md:grid md:gap-6 md:grid-cols-3">
              {section.expandedContent.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="rounded-lg border border-purple/20 bg-purple/5 p-6"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
                >
                  <div className="mb-3 text-sm font-bold text-purple">
                    Feature {feature.number}
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-ink mb-3">
                    {feature.heading}
                  </h3>
                  <p className="leading-relaxed text-ink/80">
                    {feature.body}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Padding at bottom for scroll comfort */}
          <div className="mt-8" />
        </div>
      </motion.div>
    );
  }

  // Original fullscreen mode
  return (
    <motion.div
      layoutId={`poster-tile-${section.id}`}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-auto bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content container */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-xl border border-ink/20 bg-white shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back button + close area */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-white/95 px-8 py-4 backdrop-blur-sm">
          <motion.button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            whileHover={prefersReducedMotion ? {} : { x: -2 }}
            aria-label="Close expanded view"
          >
            <motion.svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
            <span>Back</span>
          </motion.button>

          {/* Poster label */}
          <div className="text-xs font-bold tracking-widest text-ink/50 uppercase">
            {section.posterLabel}
          </div>

          {/* Spacer */}
          <div className="w-16" />
        </div>

        {/* Scrollable content */}
        <div className="max-h-[70vh] overflow-y-auto px-8 py-8">
          {/* Title */}
          <motion.h2
            className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {section.expandedTitle}
          </motion.h2>

          {/* Intro */}
          {section.expandedContent.intro && (
            <motion.p
              className="mt-6 text-lg leading-relaxed text-ink/80"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {section.expandedContent.intro}
            </motion.p>
          )}

          {/* Content blocks */}
          <div className="mt-10 space-y-8">
            {section.expandedContent.blocks?.map((block, idx) => (
              <motion.div
                key={idx}
                className={`${
                  block.highlight ? "rounded-lg border border-purple/20 bg-purple/5 p-6" : ""
                }`}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
              >
                {block.heading && (
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-ink">
                    {block.heading}
                  </h3>
                )}
                <div
                  className={`${
                    block.heading ? "mt-3" : ""
                  } leading-relaxed text-ink/80`}
                  dangerouslySetInnerHTML={{ __html: block.body }}
                />
              </motion.div>
            ))}
          </div>

          {/* Padding at bottom for scroll comfort */}
          <div className="mt-12" />
        </div>
      </motion.div>
    </motion.div>
  );
}
