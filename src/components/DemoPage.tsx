"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DemoPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const tags = [
    "Medical Physics",
    "Radiation Dosimetry",
    "X-ray Attenuation",
    "Tissue Modeling",
    "Biomedical Imaging",
    "Radiation Safety",
  ];

  const findings = [
    "Radiation energy and tissue composition strongly affect attenuation behavior.",
    "Eye lens and reproductive tissues deserve special attention because they are especially sensitive to exposure.",
    "Tissue-specific interaction models can improve both safety and precision in diagnostic and therapeutic settings.",
    "The results offer a foundation for future validation using imaging and dosimetry datasets.",
  ];

  const figures = [
    {
      num: "Figure 1",
      title: "Electronic and atomic cross-sections across the investigated tissue types and X-ray energy ranges",
      desc: "Cross-section behavior changes with energy level and tissue properties, showing why dose planning cannot be one-size-fits-all.",
    },
    {
      num: "Figure 2",
      title: "Compton mass attenuation coefficients and tissue-specific response patterns for sensitive tissues",
      desc: "Attenuation relationships suggest tissue-specific implications for imaging optimization, shielding, and radiotherapy precision.",
    },
  ];

  const asks = [
    {
      title: "Introduce us to a hospital partner studying radiation safety",
      description:
        "We want to connect with medical physicists or radiation oncology researchers working on tissue attenuation, CT imaging, radiotherapy planning, or dosimetry modeling.",
      fit: "Hospital research groups, radiotherapy labs, clinical imaging teams",
    },
    {
      title: "Find medical physics collaborators with relevant datasets",
      description:
        "If you have anonymized imaging, attenuation, or radiation exposure datasets, we'd love collaboration opportunities to validate or expand the theoretical work.",
      fit: "Medical imaging labs, therapy centers, dosimetry researchers",
    },
    {
      title: "Connect us with computational modelers",
      description:
        "We're seeking researchers or students with MATLAB, Python, or Monte Carlo radiation transport experience who may want to reproduce or extend the analysis.",
      fit: "Computational physics students, modelers, radiation simulation researchers",
    },
  ];

  const impacts = [
    "Safer radiation treatments",
    "More accurate imaging",
    "Tissue-specific dose planning",
    "Better healthy tissue protection",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Topbar - matching home page style */}
      <header
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/95"
        style={{ borderBottom: "1px solid rgba(43, 23, 77, 0.08)" }}
      >
        <div className="w-full px-4 py-2.5 md:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-5">
            {/* Logo links to home */}
            <Link href="/" className="text-base md:text-lg font-bold tracking-tight text-ink hover:opacity-80 transition-opacity flex-shrink-0" style={{ color: "#161225" }}>
              Glialink
            </Link>
            
            {/* Right side buttons */}
            <div className="flex gap-2 items-center ml-auto">
              <button
                className="px-3 py-2 rounded-full text-sm md:text-base font-semibold transition-all"
                style={{
                  color: "#161225",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Read Publication
              </button>
              <button
                className="px-3 py-2 rounded-full text-sm md:text-base font-semibold transition-all"
                style={{
                  color: "#161225",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Share Your Research
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-6 px-4 md:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-60"
                style={{ color: "#8b5cf6" }}
              >
                ← Back to home
              </Link>
            </motion.div>

            <motion.div
              className="rounded-full p-2 inline-flex items-center gap-2 text-xs"
              style={{
                background: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                color: "#2b174d",
              }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>✦</span>
              <span className="font-semibold tracking-widest uppercase">Research Project Poster</span>
            </motion.div>

            <motion.h1
              className="font-[family-name:var(--font-heading)] mt-6 w-full text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: "#161225", lineHeight: 1.2, letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              X-Ray Interaction and the Electronic, Atomic Cross-Sections and Compton Mass-Attenuation Coefficients of Human Blood, Breasts, Eye Lens, Ovaries, and Testis
            </motion.h1>

            <motion.p
              className="mt-4 w-full text-sm md:text-base leading-relaxed"
              style={{ color: "#5f5a72" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              This project studies how X-ray photons interact with sensitive human tissues like the eye lens, blood, and reproductive organs. By modeling how radiation scatters and attenuates across these tissues, the work supports safer treatment planning, more accurate imaging, and stronger protection of healthy tissue during medical exposure.
            </motion.p>
          </div>
        </section>

        {/* Grid Section */}
        <section className="py-4 px-4 md:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Background */}
                <motion.article
                  id="background"
                  className="rounded-xl border p-5"
                  style={{
                    background: "white",
                    borderColor: "#e6e0f5",
                    boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                    Background
                  </div>
                  <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                    Why this matters
                  </h2>
                  <p style={{ color: "#5f5a72", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
                    Radiation is central to modern medicine — from CT scans to cancer treatment — but safe dose control depends on knowing exactly how radiation behaves in different tissues. Sensitive tissues need more precise modeling if clinicians want better outcomes with lower unintended exposure.
                  </p>
                </motion.article>

                {/* Research Question */}
                <motion.article
                  id="question"
                  className="rounded-xl border p-5"
                  style={{
                    background: "white",
                    borderColor: "#e6e0f5",
                    boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                    Research Question
                  </div>
                  <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                    What is being investigated?
                  </h2>
                  <p style={{ color: "#5f5a72", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
                    How do X-ray photons scatter and attenuate in radiosensitive biological tissues, and which physical tissue properties most strongly influence those interactions across different X-ray energy levels?
                  </p>
                </motion.article>

                {/* Methods */}
                <motion.article
                  id="methods"
                  className="rounded-xl border p-5"
                  style={{
                    background: "white",
                    borderColor: "#e6e0f5",
                    boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                    Methods / Approach
                  </div>
                  <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                    Theoretical modeling of X-ray interaction across tissue types
                  </h2>
                  <p style={{ color: "#5f5a72", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
                    The study applies the Klein–Nishina formula to calculate electronic and atomic cross-sections and Compton mass-attenuation coefficients across five tissue types: blood, breast, eye lens, ovary, and testis. The analysis compares how tissue density, electron density, and effective atomic number shape radiation interaction behavior under different X-ray energies.
                  </p>
                </motion.article>


              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Glialink Summary - replacing previous Impact section */}
                <motion.article
                  className="rounded-xl border p-5"
                  style={{
                    background: "#f8f7fc",
                    borderColor: "#e6e0f5",
                    boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                    Glialink Summary
                  </div>
                  <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                    Key findings
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: "10px", display: "grid", gap: "8px" }}>
                    {findings.map((finding, idx) => (
                      <li key={idx} style={{ display: "grid", gridTemplateColumns: "8px 1fr", gap: "10px", alignItems: "start", color: "#5f5a72", fontSize: "0.9rem", lineHeight: 1.5 }}>
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "999px",
                            marginTop: "7px",
                            background: "#8b5cf6",
                            flexShrink: 0,
                          }}
                        />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>

                {/* Tags Section */}
                <motion.article
                  className="rounded-xl border p-5"
                  style={{
                    background: "white",
                    borderColor: "#e6e0f5",
                    boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                    Project Tags
                  </div>
                  <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                    Research areas
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "#f8f7fc",
                          border: "1px solid #e6e0f5",
                          color: "#2b174d",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.article>
              </div>
            </div>
          </div>
        </section>

        {/* Figures Section */}
        <section className="py-4 px-4 md:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <motion.article
              className="rounded-xl border p-5"
              style={{
                background: "white",
                borderColor: "#e6e0f5",
                boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                Figures from the publication
              </div>
              <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                Selected visual evidence
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))", gap: "12px", marginTop: "12px" }}>
                {figures.map((fig) => (
                  <div
                    key={fig.num}
                    className="rounded-lg border-2 border-dashed p-4"
                    style={{
                      borderColor: "rgba(139,92,246,0.35)",
                      background: "#fafbfc",
                    }}
                  >
                    <small style={{ display: "block", color: "#432a70", fontWeight: 600, fontSize: "0.75rem" }}>{fig.num}</small>
                    <h3 style={{ marginTop: "6px", fontSize: "0.95rem", color: "#161225", lineHeight: 1.2, letterSpacing: "-0.02em", margin: 0 }} className="font-[family-name:var(--font-heading)] font-bold">
                      {fig.title}
                    </h3>
                    <p style={{ margin: "8px 0 0", color: "#5f5a72", fontSize: "0.85rem", lineHeight: 1.5 }}>
                      {fig.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
        </section>

        {/* Asks Section */}
        <section id="asks" className="py-4 px-4 md:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <motion.article
              className="rounded-xl border p-5"
              style={{
                background: "white",
                borderColor: "#e6e0f5",
                boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                Specific Asks / Collaboration Opportunities
              </div>
              <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                How others can directly help extend this research
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))", gap: "12px", marginTop: "12px" }}>
                {asks.map((ask, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border p-4"
                    style={{
                      background: "#f8f7fc",
                      borderColor: "#e6e0f5",
                      boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                      Ask {idx + 1}
                    </div>
                    <h3 style={{ marginTop: "0px", fontSize: "0.95rem", color: "#161225", lineHeight: 1.2, letterSpacing: "-0.02em", margin: 0 }} className="font-[family-name:var(--font-heading)] font-bold">
                      {ask.title}
                    </h3>
                    <p style={{ margin: "8px 0 0", color: "#5f5a72", fontSize: "0.85rem", lineHeight: 1.5, flexGrow: 1 }}>
                      {ask.description}
                    </p>
                    <small style={{ display: "block", marginTop: "8px", color: "#432a70", fontWeight: 600, fontSize: "0.75rem", marginBottom: "12px" }}>
                      Best fit: {ask.fit}
                    </small>
                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "white",
                        border: "1px solid #e6e0f5",
                        color: "#161225",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f0f0f0";
                        e.currentTarget.style.borderColor = "#d0d0d0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderColor = "#e6e0f5";
                      }}
                    >
                      Share this ask
                    </button>
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
        </section>

        {/* Potential Impact and Researcher Perspective Section */}
        <section className="py-4 px-4 md:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
              {/* Left Column - Potential Impact */}
              <motion.article
                className="rounded-xl border p-5"
                style={{
                  background: "white",
                  borderColor: "#e6e0f5",
                  boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                  Potential Impact
                </div>
                <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                  What this could improve
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                  {impacts.map((impact) => (
                    <span
                      key={impact}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "#efe7ff",
                        border: "1px solid #dbcaff",
                        color: "#2b174d",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {impact}
                    </span>
                  ))}
                </div>
              </motion.article>

              {/* Right Column - Researcher Perspective */}
              <motion.article
                className="rounded-xl border p-5"
                style={{
                  background: "white",
                  borderColor: "#e6e0f5",
                  boxShadow: "0 2px 8px rgba(30, 18, 60, 0.04)",
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#432a70", marginBottom: "8px" }}>
                  Researcher Perspective
                </div>
                <h2 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "10px", lineHeight: 1.2, letterSpacing: "-0.02em" }} className="font-[family-name:var(--font-heading)] font-bold">
                  Why Elise cares about this work
                </h2>
                <blockquote
                  style={{
                    borderLeft: "3px solid #8b5cf6",
                    paddingLeft: "12px",
                    marginTop: "10px",
                    color: "#5f5a72",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  "As a student researcher, working on this project introduced me to the intersection of medical physics, radiation biology, and healthcare, and it strengthened my interest in biomedical research and healthcare applications of physics."
                  <br />
                  <span style={{ display: "block", marginTop: "8px", fontWeight: 600, color: "#2b174d" }}>— Elise Kapshtica</span>
                </blockquote>
              </motion.article>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(43, 23, 77, 0.08)", padding: "24px 0 0", color: "#5f5a72", fontSize: "0.85rem" }}>
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8 lg:px-12 pb-8">
          <h3 style={{ fontSize: "1.1rem", color: "#161225", marginBottom: "12px", lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 12px 0" }} className="font-[family-name:var(--font-heading)] font-bold">
            Is your research invisible to people who could help? Get the collaborators, students, and support you've been missing.
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#5f5a72", marginBottom: "12px", margin: "0 0 12px 0" }}>
            Glialink turns your paper, abstract, and link into a living page with clear asks and active context.
          </p>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              background: "#8b5cf6",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#8b5cf6";
            }}
          >
            Share your research
          </button>
        </div>

        {/* Glialink Footer */}
        <div style={{ borderTop: "1px solid rgba(43, 23, 77, 0.08)", padding: "12px 0 20px", color: "#5f5a72", fontSize: "0.85rem" }}>
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8 lg:px-12">
            Elise Kapshtica — Glialink project page.
          </div>
        </div>
      </footer>
    </div>
  );
}
