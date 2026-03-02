import { PROBLEM } from "@/lib/copy";

export default function Problem() {
  return (
    <section className="bg-purple-light px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {PROBLEM.heading}
        </h2>

        <div className="mt-10 space-y-8">
          {PROBLEM.beats.map((beat, i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple/10">
                <div className="h-2.5 w-2.5 rounded-full bg-purple" />
              </div>
              <p className="text-lg leading-relaxed text-ink/80">{beat.text}</p>
            </div>
          ))}
        </div>

        <blockquote className="mt-12 border-l-4 border-purple pl-6">
          <p className="text-xl font-medium italic text-ink">
            {PROBLEM.pullQuote.text}
          </p>
          <cite className="mt-2 block text-sm not-italic text-gray">
            {PROBLEM.pullQuote.source}
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
