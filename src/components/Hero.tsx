"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { HERO, NAV } from "@/lib/copy";
import { event } from "@/lib/analytics";
import { getVariant } from "@/lib/variants";

// Custom easing curve for premium feel
const premiumEase = { type: "spring", stiffness: 100, damping: 20 };

// ─── Animation Variants ────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const navVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

const headlineVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const ctaGroupVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.4,
    },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const [variant, setVariant] = useState<string>("control");
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Subtle parallax: moves up slightly as user scrolls down
  const heroY = useTransform(scrollY, [0, 500], [0, -50], {
    clamp: true,
  });

  useEffect(() => {
    setVariant(getVariant());
  }, []);

  const scrollToSignup = () => {
    event("hero_cta_click", { variant });
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      ref={heroRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-white px-6 py-0 md:px-12 lg:px-20"
      style={{
        backgroundImage: `url('/neuropathic-background-gray.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Subtle overlay for minimal transparency effect */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      
      {/* Subtle organic background decoration */}
      <div className="pointer-events-none absolute top-[-120px] right-[-80px] h-[400px] w-[400px] rounded-full bg-purple-light opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-60px] left-[-100px] h-[300px] w-[300px] rounded-full bg-purple-light opacity-10 blur-3xl" />

      {/* Parallax container */}
      <motion.div
        style={prefersReducedMotion ? {} : { y: heroY }}
        className="relative z-20 flex flex-1 flex-col"
      >
        {/* Nav */}
        <motion.nav 
          className="flex w-full items-center justify-between px-0 py-4 gap-4"
          variants={navVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          {/* Logo on the left */}
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-white font-[family-name:var(--font-heading)]">
              Glialink
            </span>
          </div>

          {/* Centered nav links - visible on all screens */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 flex-1 ml-0 sm:ml-17">
            <motion.button
              onClick={() => scrollTo("problem")}
              className="rounded-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-purple-light/20 hover:text-purple-light"
              whileHover={prefersReducedMotion ? {} : { y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              {NAV.about}
            </motion.button>
            <motion.button
              onClick={() => {/* Demo modal — implementation in next PR */}}
              className="rounded-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-purple-light/20 hover:text-purple-light"
              whileHover={prefersReducedMotion ? {} : { y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              {NAV.demo}
            </motion.button>
            <motion.button
              onClick={() => {
                scrollTo("book-call");
                // Dispatch custom event to open Calendly in SignUpForm
                window.dispatchEvent(new Event("openCalendly"));
                // Also scroll to the signup form section
                setTimeout(() => {
                  document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
              className="rounded-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-purple-light/20 hover:text-purple-light"
              whileHover={prefersReducedMotion ? {} : { y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              {NAV.bookCall}
            </motion.button>
          </div>

          {/* CTA button on the right - always visible */}
          <motion.button
            onClick={scrollToSignup}
            className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-medium text-white transition-colors hover:text-purple-light flex-shrink-0"
            whileHover={prefersReducedMotion ? {} : { y: -2 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            {HERO.cta}
            <motion.svg 
              className="h-3 sm:h-4 w-5 sm:w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={prefersReducedMotion ? {} : { x: 2 }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </motion.svg>
          </motion.button>
        </motion.nav>

        {/* Hero content — centered vertically and horizontally */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance"
              variants={headlineVariants}
              transition={{ duration: 0.8 }}
            >
              {HERO.headline}
            </motion.h1>
            <motion.p 
              className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed"
              variants={itemVariants}
              transition={{ duration: 0.6 }}
            >
              {HERO.sub}
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col items-center gap-4"
              variants={ctaGroupVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col w-full items-center gap-3 sm:flex-row sm:justify-center">
                <motion.button
                  onClick={scrollToSignup}
                  className="w-full sm:w-auto rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:border-white/60 hover:bg-white/30"
                  variants={ctaVariants}
                  transition={{ duration: 0.6 }}
                  whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.01 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  {HERO.cta}
                </motion.button>
                <motion.button
                  onClick={() => {/* Example modal — implementation in next PR */}}
                  className="w-full sm:w-auto rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
                  variants={ctaVariants}
                  transition={{ duration: 0.6 }}
                  whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.01 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  {HERO.ctaSecondary}
                </motion.button>
              </div>
              <motion.p 
                className="text-sm text-gray-200"
                variants={itemVariants}
                transition={{ duration: 0.6 }}
              >
                {HERO.ctaSub}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
