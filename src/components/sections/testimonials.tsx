import { Star } from "lucide-react";
import { testimonials } from "@/data/content";

function ReviewCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="flex w-80 shrink-0 flex-col justify-between border border-line bg-white/60 p-5 md:w-96 md:p-6">
      <div>
        <div className="mb-3 flex gap-1" aria-label={`Rating ${t.rating} dari 5`}>
          {Array.from({ length: t.rating }).map((_, s) => (
            <Star key={s} className="h-3.5 w-3.5 fill-rosegold-600 text-rosegold-600" />
          ))}
        </div>
        <blockquote className="text-sm font-light italic leading-relaxed text-ink md:text-base">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 font-serif text-sm text-rosegold-800">
          {t.name.charAt(0)}
        </span>
        <div>
          <p className="text-xs font-medium text-ink">{t.name}</p>
          <p className="text-[11px] font-light text-ink-soft">{t.service}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 = testimonials.slice(mid);

  return (
    <section className="bg-ivory-deep py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center md:mb-16">
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
        </div>
      </div>

      <div className="space-y-4">
        <div className="group relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-ivory-deep to-transparent md:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-ivory-deep to-transparent md:w-32" />
          <div className="flex w-max gap-4 animate-scroll-left group-hover:[animation-play-state:paused]">
            {[...row1, ...row1].map((t, i) => (
              <ReviewCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-ivory-deep to-transparent md:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-ivory-deep to-transparent md:w-32" />
          <div className="flex w-max gap-4 animate-scroll-right group-hover:[animation-play-state:paused]">
            {[...row2, ...row2].map((t, i) => (
              <ReviewCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
