import { Star } from "lucide-react";
import { testimonials } from "@/data/content";
import { Reveal } from "@/components/motion";

export function Testimonials() {
  return (
    <section className="bg-ivory-deep py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
            Kata Mereka
          </p>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-medium leading-tight text-ink md:text-6xl">
            Kepercayaan 10.000+ klien, dibuktikan setiap hari
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base font-light leading-relaxed text-ink-soft md:text-sm">
            Cerita nyata dari klien yang mempercayakan rambut mereka kepada
            kami di Pekanbaru.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.1} className="min-w-0">
              <figure className="flex h-full flex-col justify-between border border-line bg-white/60 p-6 md:p-8">
                <div>
                  <div className="mb-4 flex gap-1" aria-label={`Rating ${t.rating} dari 5`}>
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-rosegold-600 text-rosegold-600" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-xl italic leading-relaxed text-ink md:text-2xl">
                    “{t.quote}”
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 font-serif text-lg text-rosegold-800">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-sm font-light text-ink-soft">
                      {t.service} · Klien Paradise Salon
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-soft">
            Baca review lengkap di Google Maps
          </p>
        </Reveal>
      </div>
    </section>
  );
}
