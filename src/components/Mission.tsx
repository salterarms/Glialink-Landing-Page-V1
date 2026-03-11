import { MISSION } from "@/lib/copy";

export default function Mission() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 md:px-12 lg:px-20">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/8 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <h2 className="font-[family-name:var(--font-heading)] text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
          {MISSION.heading}
        </h2>

        <div className="mt-10 space-y-4 text-left">
          {MISSION.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`leading-relaxed ${
                // Short punchy lines ("I was wrong.", "I want to change that.")
                // get visual emphasis
                p.length < 40
                  ? "text-xl font-semibold text-white"
                  : "text-base text-white/70"
              }`}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
