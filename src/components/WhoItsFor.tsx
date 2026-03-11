import type { ReactNode } from "react";
import { WHO_ITS_FOR } from "@/lib/copy";

function PersonaIcon({ type }: { type: "assistant" | "student" | "presenter" | "pi" }) {
  const paths: Record<string, ReactNode> = {
    // Student research assistant — person with a link/connection
    assistant: (
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zm-1 2h2m-1 0v5m-4 0h8M5 10H3m18 0h-2"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Grad student / postdoc — mortarboard cap
    student: (
      <path
        d="M12 3L2 8l10 5 10-5-10-5zm0 0v13m-7-8.5v5c0 2.5 3.13 4.5 7 4.5s7-2 7-4.5v-5"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Conference presenter — screen/presentation
    presenter: (
      <path
        d="M3 6h18v10H3V6zm9 10v4m-4 0h8M7 11h2m2 0h2m2 0h2"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Principal Investigator — person with network connections
    pi: (
      <path
        d="M12 14a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0M2 10h3m14 0h3"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      />
    ),
  };

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-purple">
        {paths[type]}
      </svg>
    </div>
  );
}

export default function WhoItsFor() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-[family-name:var(--font-heading)] text-center text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {WHO_ITS_FOR.heading}
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {WHO_ITS_FOR.personas.map((persona) => (
            <div
              key={persona.title}
              className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md hover:shadow-purple/5"
            >
              <PersonaIcon type={persona.icon} />
              <h3 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-semibold text-ink">
                {persona.title}
              </h3>
              <p className="mt-2 text-sm text-gray leading-relaxed">
                {persona.description}
              </p>
              {persona.quote && (
                <blockquote className="mt-4 border-l-2 border-purple/30 pl-4">
                  <p className="text-sm italic text-ink/70 leading-relaxed">
                    {persona.quote}
                  </p>
                  {persona.quoteSource && (
                    <cite className="mt-1 block text-xs not-italic text-gray-light">
                      — {persona.quoteSource}
                    </cite>
                  )}
                </blockquote>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
