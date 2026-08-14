import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { packages } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Img } from "@/components/img";
import { cn } from "@/lib/utils";

export function Packages({ showLink = true }: { showLink?: boolean }) {
  return (
    <section className="py-16 md:py-28" id="paket">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Paket & Harga
            </p>
            <h2 className="max-w-xl font-serif text-4xl font-medium leading-tight text-ink md:text-6xl">
              Pilih layananmu, harga transparan tanpa biaya tersembunyi
            </h2>
          </div>
          {showLink && (
            <Link
              href="/paket"
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-ink hover:text-rosegold-700"
            >
              Semua paket & harga
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl snap-x snap-mandatory overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-4 md:gap-5">
          {packages.map((p) => (
            <article
              key={p.name}
              className={cn(
                "group w-64 shrink-0 snap-start border border-rosegold-600/70 bg-white/60 shadow-[0_0_0_1px_rgba(183,110,121,0.15)] md:w-72",
                p.featured && "border-rosegold-700 bg-rosegold-600/5"
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line">
                <Img
                  src={p.image}
                  alt={p.name}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between border-b border-line px-4 pt-4 md:px-5">
                <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                  {p.name}
                </h3>
                {p.featured && (
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-rosegold-700">
                    Terlaris
                  </span>
                )}
              </div>
              <div className="p-4 md:p-5">
                <p className="text-2xl font-medium tracking-wide text-rosegold-700">
                  {p.price}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  {p.duration}
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">
                  {p.tagline}
                </p>
                <ul className="mt-4 space-y-2">
                  {p.includes.map((inc) => (
                    <li
                      key={inc}
                      className="flex items-start gap-2 text-sm font-light text-ink"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rosegold-600" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
