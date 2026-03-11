"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HERO, NAV } from "@/lib/copy";
import { event } from "@/lib/analytics";
import { getVariant } from "@/lib/variants";

export default function Hero() {
  const [variant, setVariant] = useState<string>("control");

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
    <section className="relative overflow-hidden bg-white px-6 pt-8 pb-20 md:px-12 lg:px-20">
      {/* Subtle organic background decoration */}
      <div className="pointer-events-none absolute top-[-120px] right-[-80px] h-[400px] w-[400px] rounded-full bg-purple-light opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-60px] left-[-100px] h-[300px] w-[300px] rounded-full bg-purple-light opacity-40 blur-3xl" />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between pb-16 md:pb-24">
        <div className="flex items-center gap-3">
          <Image
            src="/glialink-logo.png"
            alt={NAV.logoAlt}
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <span className="text-xl font-semibold tracking-tight text-ink font-[family-name:var(--font-heading)]">
            Glialink
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => scrollTo("problem")}
            className="rounded-full px-4 py-2 text-sm font-medium text-gray transition-colors hover:bg-purple-light hover:text-ink"
          >
            {NAV.about}
          </button>
          <button
            onClick={() => {/* Demo modal — implementation in next PR */}}
            className="rounded-full px-4 py-2 text-sm font-medium text-gray transition-colors hover:bg-purple-light hover:text-ink"
          >
            {NAV.demo}
          </button>
          <button
            onClick={() => scrollTo("book-call")}
            className="rounded-full px-4 py-2 text-sm font-medium text-gray transition-colors hover:bg-purple-light hover:text-ink"
          >
            {NAV.bookCall}
          </button>
          <button
            onClick={scrollToSignup}
            className="ml-2 rounded-full bg-purple px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-purple-dark hover:shadow-lg hover:shadow-purple/20"
          >
            {HERO.cta}
          </button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-6xl">
          {HERO.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray md:text-xl">
          {HERO.sub}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={scrollToSignup}
              className="rounded-full bg-gradient-to-b from-purple to-purple-dark px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple/25 transition-all hover:shadow-xl hover:shadow-purple/30 hover:brightness-110"
            >
              {HERO.cta}
            </button>
            <button
              onClick={() => {/* Example modal — implementation in next PR */}}
              className="rounded-full border border-purple/30 bg-white px-8 py-4 text-lg font-semibold text-purple transition-all hover:border-purple/60 hover:bg-purple-light hover:shadow-md"
            >
              {HERO.ctaSecondary}
            </button>
          </div>
          <p className="text-sm text-gray-light">{HERO.ctaSub}</p>
        </div>
      </div>
    </section>
  );
}
