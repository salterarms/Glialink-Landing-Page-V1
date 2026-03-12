import { PROBLEM } from "@/lib/copy";

export default function Problem() {
  return (
    <section id="problem" className="relative bg-gray-100 px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Off-white rectangle container with negative margin for overlap */}
        <div className="relative z-10 -mt-32 rounded-3xl bg-white px-8 py-16 md:px-12 md:py-20 lg:px-16">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {PROBLEM.heading}
          </h2>

          <div className="mt-10 space-y-8">
            {PROBLEM.beats.map((beat, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-ink" />
                </div>
                <p className="text-lg leading-relaxed text-ink/80">
                  <span className="font-semibold text-ink">{beat.title} </span>
                  {beat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
