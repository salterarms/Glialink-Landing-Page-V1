import type { ReactNode } from "react";
import { SOLUTION } from "@/lib/copy";

function SolutionIcon({ type }: { type: "page" | "ask" | "intro" }) {
  const paths: Record<string, ReactNode> = {
    page: (
      <path
        d="M4 6a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm3 2h6m-6 4h6m-6 4h3"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      />
    ),
    ask: (
      <path
        d="M12 4C7.58 4 4 7.03 4 10.8c0 2.14 1.18 4.04 3 5.27V20l3.2-1.76c.58.1 1.18.16 1.8.16 4.42 0 8-3.03 8-6.8S16.42 4 12 4zm0 3v4m0 2h.01"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    intro: (
      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.5 7a7.5 7.5 0 0115 0M7 9a3 3 0 01-3-3m16 3a3 3 0 003-3"
        strokeWidth={1.5}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      />
    ),
  };

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-purple">
        {paths[type]}
      </svg>
    </div>
  );
}

export default function Solution() {
  return (
    <section className="bg-gray-100 px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-[family-name:var(--font-heading)] text-center text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {SOLUTION.heading}
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {SOLUTION.items.map((item) => (
            <div key={item.title} className="flex flex-col items-start">
              <SolutionIcon type={item.icon} />
              <h3 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-ink/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
