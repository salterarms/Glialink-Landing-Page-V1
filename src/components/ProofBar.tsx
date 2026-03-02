import { PROOF_BAR } from "@/lib/copy";

export default function ProofBar() {
  return (
    <section className="border-y border-border bg-purple-light/50 px-6 py-14 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
        {PROOF_BAR.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-[family-name:var(--font-heading)] text-4xl font-bold text-purple">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-gray">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
