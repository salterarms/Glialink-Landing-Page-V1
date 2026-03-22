"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import PosterGrid from "./poster/PosterGrid";
import PosterExpandedView from "./poster/PosterExpandedView";
import { POSTER_SECTIONS } from "@/lib/copy";

export default function ConferencePosterSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const activeSection = POSTER_SECTIONS.find((s) => s.id === activeId) || null;

  const handleTileClick = (id: string) => {
    setActiveId(id);
    // Prevent default scroll behavior by scrolling to the top of the poster section
    setTimeout(() => {
      const posterSection = document.getElementById("about");
      if (posterSection) {
        posterSection.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, 0);
  };

  const handleClose = () => {
    setActiveId(null);
  };

  return (
    <section id="about" className="relative bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Dark purple background container */}
        <div className="rounded-lg bg-purple/10 p-6 md:p-12 min-h-screen md:min-h-[900px]">
          {/* Section header */}
          <motion.div
            className="mb-10 flex flex-col md:flex-row gap-8 justify-between md:items-end"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Left: Logo and Title */}
            <div className="flex gap-8 flex-1">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src="/glialink-logo-transparent.png"
                  alt="Glialink logo"
                  className="h-16 md:h-20 w-auto"
                />
              </div>

              {/* Title and description */}
              <div className="flex flex-col gap-3">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
                  The Glialink Research Poster
                </h2>
                <p className="text-base md:text-lg text-ink/70">
                  A comprehensive overview of the research, methodology, and impact behind our work.
                </p>
              </div>
            </div>

            {/* Right: References Button */}
            <button
              onClick={() => handleTileClick("references")}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/60 hover:bg-white/75 border border-white/40 hover:border-white/60 rounded-lg transition-colors font-semibold text-ink whitespace-nowrap h-fit"
            >
              References
              <svg
                className="h-4 w-4"
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
            </button>
          </motion.div>

          {/* Content area - shows grid or expanded view */}
          {!activeId ? (
            // Poster grid
            <motion.div
              animate={{
                opacity: activeId ? 0.4 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none relative z-10"
              style={{ pointerEvents: activeId ? "none" : "auto" }}
            >
              <PosterGrid
                sections={POSTER_SECTIONS}
                activeId={activeId}
                onTileClick={handleTileClick}
              />
            </motion.div>
          ) : (
            // Expanded view within container
            <AnimatePresence>
              {activeId && (
                <PosterExpandedView
                  section={activeSection}
                  onClose={handleClose}
                  isContained={true}
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
