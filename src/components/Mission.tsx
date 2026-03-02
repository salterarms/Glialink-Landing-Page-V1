import { MISSION } from "@/lib/copy";

export default function Mission() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 md:px-12 lg:px-20">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/8 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-4xl">
          {MISSION.heading}
        </h2>

        <div className="mt-10 space-y-6 text-left">
          {MISSION.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed text-white/70"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
          <p className="text-base leading-relaxed text-white/80 italic">
            {MISSION.whyUs}
          </p>
        </div>
      </div>
    </section>
  );
}
