"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/data/content";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-ivory-deep py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          <Reveal className="min-w-0 md:col-span-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-600">
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
            {faqs.map((f, i) => {
              const open = openIndex === i;
              return (
                <Reveal key={f.question} delay={i * 0.05}>
                  <div className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="font-serif text-xl font-medium text-ink md:text-2xl">
                        {f.question}
                      </span>
                      <Plus
                        className={cn(
                          "h-5 w-5 shrink-0 text-rosegold-600 transition-transform duration-300",
                          open && "rotate-45"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 text-base font-light leading-relaxed text-ink-soft md:text-sm">
                          {f.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
