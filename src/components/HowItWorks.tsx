import { HOW_IT_WORKS } from "@/lib/copy";

export default function HowItWorks() {
  return (
    <section className="bg-purple-light px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[family-name:var(--font-heading)] text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink">
          {HOW_IT_WORKS.heading}
        </h2>

        <div className="mt-14 space-y-0">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 pb-12 last:pb-0">
              {/* Vertical connector line */}
              {i < HOW_IT_WORKS.steps.length - 1 && (
                <div className="absolute left-[23px] top-12 h-full w-px bg-purple/20" />
              )}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple font-[family-name:var(--font-heading)] text-sm font-bold text-white">
                {step.number}
              </div>
              <div className="pt-0 sm:pt-1">
                <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
