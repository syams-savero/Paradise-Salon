import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Img } from "@/components/img";

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
          {services.map((s) => (
            <article
              key={s.name}
              className="group w-52 shrink-0 snap-start border border-rosegold-600/70 bg-white/60 shadow-[0_0_0_1px_rgba(183,110,121,0.15)] md:w-64"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Img
                  src={s.image}
                  alt={s.name}
                  sizes="(min-width: 768px) 256px, 208px"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                  {s.name}
                </h3>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-rosegold-700">
                  {s.from}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
