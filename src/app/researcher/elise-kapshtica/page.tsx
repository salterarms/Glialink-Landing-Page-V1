"use client";

import Image from "next/image";
import Link from "next/link";

const asks = [
  {
    id: 1,
    label: "Hospital Partner",
    icon: "🏥",
    title: "Introduce us to a hospital partner studying radiation safety",
    detail:
      "We're looking to connect with medical physicists or radiation oncology researchers who study radiation dose distribution or tissue attenuation — particularly those working with radiotherapy planning, CT imaging, or dosimetry modeling.",
  },
  {
    id: 2,
    label: "Medical Physics Collaborator",
    icon: "⚗️",
    title: "Looking for medical physics collaborators working on X-ray dosimetry",
    detail:
      "If you work in medical imaging or radiation therapy and have access to anonymized datasets related to tissue attenuation, radiation exposure, or imaging physics, we'd welcome collaboration to validate or expand our theoretical models.",
  },
  {
    id: 3,
    label: "Computational Scientist",
    icon: "💻",
    title: "Seeking a data scientist experienced in radiation modeling",
    detail:
      "We'd appreciate introductions to researchers or students with experience in MATLAB, Python, or radiation transport simulations (e.g., Monte Carlo modeling) who may be interested in helping reproduce or extend our analysis.",
  },
];

export default function ElisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/glialink-logo.png"
              alt="Glialink"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-ink">
              Glialink
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-purple px-5 py-2 text-sm font-medium text-white transition-all hover:bg-purple-dark"
          >
            Share your research →
          </Link>
        </div>
      </nav>

      {/* Hero / Profile header */}
      <section className="relative overflow-hidden bg-white px-6 py-16 md:px-12">
        <div className="pointer-events-none absolute top-[-80px] right-[-60px] h-[350px] w-[350px] rounded-full bg-purple-light opacity-50 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-purple-light px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple">
            ✦ Research Project
          </span>

          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink md:text-4xl lg:text-5xl">
            X-Ray Interactions in Sensitive Biological Tissues
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray">
            Understanding how X-ray photons scatter and attenuate in the eye lens, blood, and reproductive tissues — with implications for safer radiation treatments and more accurate imaging.
          </p>

          {/* Researcher info */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-light font-[family-name:var(--font-heading)] font-bold text-purple">
                EK
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Elise Kapshtica</p>
                <p className="text-xs text-gray">University of Alabama at Birmingham</p>
              </div>
            </div>
            <span className="text-border">|</span>
            <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray">
              Medical Physics
            </span>
            <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray">
              Radiation Biology
            </span>
            <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray">
              Biomedical Research
            </span>
          </div>

          {/* Publication link */}
          <a
            href="https://www.mdpi.com/2673-592X/5/3/24"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-gray transition-colors hover:border-purple hover:text-purple"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Published in MDPI Radiation · 2025
          </a>
        </div>
      </section>

      {/* Specific Asks — the hero feature */}
      <section className="bg-purple-light px-6 py-14 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple">
              Specific Asks
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              Here's exactly how you can help
            </h2>
            <p className="mt-2 text-sm text-gray">
              Know someone who fits? Forward this page — or share an individual ask.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {asks.map((ask) => (
              <div
                key={ask.id}
                className="group relative flex flex-col rounded-2xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md hover:shadow-purple/10"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{ask.icon}</span>
                  <span className="rounded-full bg-purple-light px-2.5 py-0.5 text-xs font-semibold text-purple">
                    Ask #{ask.id}
                  </span>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray">
                  {ask.label}
                </p>
                <p className="mb-4 flex-1 text-sm font-semibold leading-snug text-ink">
                  {ask.title}
                </p>
                <p className="text-xs leading-relaxed text-gray">{ask.detail}</p>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Research Ask: ${ask.title}`,
                        text: ask.detail,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-purple opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share this ask
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the research */}
      <section className="px-6 py-14 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple">
                The Research
              </p>
              <h2 className="font-[family-name:var(--font-heading)] mb-4 text-2xl font-bold text-ink">
                Why this work matters
              </h2>
              <div className="space-y-4 text-gray">
                <p>
                  Radiation is everywhere in modern medicine — CT scans, cancer treatment, mammography. But accurately controlling radiation dose requires a deep understanding of how it interacts with different tissues. This research digs into exactly that.
                </p>
                <p>
                  Using the Klein–Nishina formula, we analyzed how X-ray photons scatter and attenuate in biological tissues that are especially sensitive to radiation: the eye lens, blood, and reproductive tissues. These aren't just academic choices — they're the tissues most at risk during radiation exposure.
                </p>
                <p>
                  The findings show that radiation energy, tissue density, electron density, and effective atomic number all significantly affect how radiation interacts with the body. Understanding these variables is a prerequisite for safer treatments and better imaging.
                </p>
              </div>

              <div className="mt-8">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple">
                  Why I Do This
                </p>
                <blockquote className="border-l-2 border-purple pl-4 italic text-gray">
                  "Working on this project introduced me to the intersection of medical physics, radiation biology, and healthcare — and it strengthened my interest in biomedical research and healthcare applications of physics."
                  <footer className="mt-2 not-italic text-xs font-semibold text-ink">— Elise Kapshtica</footer>
                </blockquote>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray">
                  Research Areas
                </p>
                <ul className="space-y-2 text-sm text-ink">
                  {["X-ray attenuation & scattering", "Medical physics", "Radiation dosimetry", "Tissue interaction modeling", "Biomedical research"].map((area) => (
                    <li key={area} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray">
                  Potential Impact
                </p>
                <ul className="space-y-3 text-sm text-gray">
                  {[
                    "Safer radiation treatments",
                    "More accurate imaging techniques",
                    "Better protection of healthy tissue during therapy",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-purple">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="https://www.mdpi.com/2673-592X/5/3/24"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-border p-4 text-sm font-medium text-gray transition-all hover:border-purple hover:text-purple"
              >
                Read the full paper →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="border-t border-border bg-purple-light px-6 py-14 text-center md:px-12">
        <div className="mx-auto max-w-xl">
          <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
            Is your research invisible to people who could help?
          </p>
          <p className="mt-3 text-gray">
            Glialink turns your work into a shareable page like this one — in minutes.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-purple to-purple-dark px-8 py-4 font-semibold text-white shadow-lg shadow-purple/25 transition-all hover:brightness-110"
          >
            Share your research →
          </Link>
          <p className="mt-3 text-xs text-gray-light">Free. No account needed to start.</p>
        </div>
      </section>
    </div>
  );
}
