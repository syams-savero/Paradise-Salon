import { faqs } from "@/data/content";
import { Reveal } from "@/components/motion";

export function Faq() {
  return (
    <section className="bg-ivory-deep py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          <Reveal className="min-w-0 md:col-span-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              FAQ
            </p>
            <h2 className="font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
              Pertanyaan yang sering ditanyakan
            </h2>
            <p className="mt-4 max-w-xs text-base font-light leading-relaxed text-ink-soft md:text-sm">
              Tidak menemukan jawabanmu? Chat kami langsung via WhatsApp —
              kami balas cepat.
            </p>
          </Reveal>

          <div className="min-w-0 md:col-span-8">
            {faqs.map((f, i) => (
              <Reveal key={f.question} delay={i * 0.05}>
                <details className="group border-b border-line" open={i === 0}>
                  <summary className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-xl font-medium text-ink md:text-2xl">
                      {f.question}
                    </span>
                    <span className="block h-5 w-5 shrink-0 text-rosegold-700 transition-transform duration-300 group-open:rotate-45">
                      <PlusMark />
                    </span>
                  </summary>
                  <div>
                    <p className="max-w-2xl pb-6 text-base font-light leading-relaxed text-ink-soft md:text-sm">
                      {f.answer}
                    </p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlusMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="h-full w-full"
    >
      <path d="M10 4v12M4 10h12" strokeLinecap="round" />
    </svg>
  );
}