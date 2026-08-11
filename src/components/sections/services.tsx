import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { services, waLink } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Img } from "@/components/img";

export function Services() {
  const [primary, ...rest] = services;

  return (
    <section className="bg-ivory-deep py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Layanan Kami
            </p>
            <h2 className="max-w-xl font-serif text-4xl font-medium leading-tight text-ink md:text-6xl">
              Perawatan yang disesuaikan dengan kebutuhanmu
            </h2>
          </div>
          <Link
            href="/paket"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-ink hover:text-rosegold-700"
          >
            Semua paket & harga
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          <Reveal className="group min-w-0 md:col-span-7">
            <Link
              href={waLink(
                `Halo Paradise Salon, saya tertarik dengan layanan ${primary.name}. Boleh info lebih lanjut?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Img
                  src={primary.image}
                  alt={primary.name}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h3 className="font-serif text-2xl font-medium text-ivory md:text-4xl">
                    {primary.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between border border-t-0 border-line bg-white/50 px-5 py-4 md:px-6">
                <p className="text-sm font-light text-ink-soft">
                  {primary.tagline}
                </p>
                <span className="hidden shrink-0 gap-4 text-xs font-medium uppercase tracking-[0.14em] text-ink md:flex">
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    <Clock className="h-3.5 w-3.5" /> {primary.duration}
                  </span>
                  <span className="text-rosegold-700">
                    Mulai {primary.from}
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:col-span-5 md:gap-6">
            {rest.slice(0, 2).map((s, i) => (
              <Reveal key={s.name} delay={0.1 + i * 0.08} className="min-w-0">
                <Link
                  href={waLink(
                    `Halo Paradise Salon, saya tertarik dengan layanan ${s.name}. Boleh info lebih lanjut?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-2 overflow-hidden border border-line bg-white/50"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Img
                      src={s.image}
                      alt={s.name}
                      sizes="(min-width: 768px) 21vw, 50vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 md:p-5">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                        {s.name}
                      </h3>
                      <p className="mt-1.5 hidden text-sm font-light leading-relaxed text-ink-soft sm:block">
                        {s.tagline}
                      </p>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-rosegold-700">
                      Mulai {s.from}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2">
          {rest.slice(2).map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08} className="min-w-0">
              <Link
                href={waLink(
                  `Halo Paradise Salon, saya tertarik dengan layanan ${s.name}. Boleh info lebih lanjut?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 border border-line bg-white/50 p-4 transition-colors hover:border-rosegold-600/40 md:p-5"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden md:h-24 md:w-32">
                  <Img
                    src={s.image}
                    alt={s.name}
                    sizes="160px"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                    {s.name}
                  </h3>
                  <p className="mt-1 truncate text-sm font-light text-ink-soft">
                    {s.tagline}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-rosegold-700">
                    {s.from}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-ink-soft">
                    <Clock className="h-3 w-3" /> {s.duration}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
