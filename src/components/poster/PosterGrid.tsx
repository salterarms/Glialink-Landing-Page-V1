"use client";

import type { PosterGridProps } from "./poster.types";
import PosterTile from "./PosterTile";
import DataPosterTile from "./DataPosterTile";
import WhoBenefitsPosterTile from "./WhoBenefitsPosterTile";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function PosterGrid({
  sections,
  activeId,
  onTileClick,
}: PosterGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  // Get sections by id
  const introSection = sections.find((s) => s.id === "introduction");
  const problemSection = sections.find((s) => s.id === "problem");
  const dataSection = sections.find((s) => s.id === "data");
  const methodologySection = sections.find((s) => s.id === "methodology");
  const productSection = sections.find((s) => s.id === "product");
  const whoBenefitsSection = sections.find((s) => s.id === "who-benefits");

  return (
    <motion.div
      className="grid gap-6"
      style={{
        gridTemplateColumns: "1fr 2fr",
      }}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* LEFT CONTAINER: Intro + Problem (stacked vertically, problem grows) */}
      <div className="flex flex-col gap-6">
        {/* Introduction */}
        {introSection && (
          <motion.div
            variants={prefersReducedMotion ? {} : itemVariants}
            className={`transition-all ${
              activeId && activeId !== introSection.id ? "opacity-40 blur-sm" : ""
            }`}
          >
            <PosterTile
              section={introSection}
              isActive={activeId === introSection.id}
              onClick={() => onTileClick(introSection.id)}
            />
          </motion.div>
        )}

        {/* Problem - grows to fill remaining space */}
        {problemSection && (
          <motion.div
            variants={prefersReducedMotion ? {} : itemVariants}
            className={`flex-1 transition-all ${
              activeId && activeId !== problemSection.id ? "opacity-40 blur-sm" : ""
            }`}
          >
            <PosterTile
              section={problemSection}
              isActive={activeId === problemSection.id}
              onClick={() => onTileClick(problemSection.id)}
            />
          </motion.div>
        )}
      </div>

      {/* RIGHT CONTAINER: Data + Who Benefits (stacked) + Methodology + Product (side by side) */}
      <div className="flex flex-col gap-6">
        {/* Data */}
        {dataSection && (
          <motion.div
            variants={prefersReducedMotion ? {} : itemVariants}
            className={`transition-all ${
              activeId && activeId !== dataSection.id ? "opacity-40 blur-sm" : ""
            }`}
          >
            <DataPosterTile
              section={dataSection}
              isActive={activeId === dataSection.id}
              onClick={() => onTileClick(dataSection.id)}
            />
          </motion.div>
        )}

        {/* Who Benefits */}
        {whoBenefitsSection && (
          <motion.div
            variants={prefersReducedMotion ? {} : itemVariants}
            className={`transition-all ${
              activeId && activeId !== whoBenefitsSection.id ? "opacity-40 blur-sm" : ""
            }`}
          >
            <WhoBenefitsPosterTile
              section={whoBenefitsSection}
              isActive={activeId === whoBenefitsSection.id}
              onClick={() => onTileClick(whoBenefitsSection.id)}
            />
          </motion.div>
        )}

        {/* Bottom Row: Methodology + Product (side by side) */}
        <div className="grid gap-6 grid-cols-2">
          {/* Methodology */}
          {methodologySection && (
            <motion.div
              variants={prefersReducedMotion ? {} : itemVariants}
              className={`transition-all ${
                activeId && activeId !== methodologySection.id ? "opacity-40 blur-sm" : ""
              }`}
            >
              <PosterTile
                section={methodologySection}
                isActive={activeId === methodologySection.id}
                onClick={() => onTileClick(methodologySection.id)}
              />
            </motion.div>
          )}

          {/* Product */}
          {productSection && (
            <motion.div
              variants={prefersReducedMotion ? {} : itemVariants}
              className={`transition-all ${
                activeId && activeId !== productSection.id ? "opacity-40 blur-sm" : ""
              }`}
            >
              <PosterTile
                section={productSection}
                isActive={activeId === productSection.id}
                onClick={() => onTileClick(productSection.id)}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
