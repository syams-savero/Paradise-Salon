"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { gallery, galleryCategories, site } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Img } from "@/components/img";
import { cn } from "@/lib/utils";

const VIDEO_PLACEHOLDER =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

export function GalleryBrowser() {
  const [active, setActive] = useState("semua");
  const items =
    active === "semua"
      ? gallery
      : gallery.filter((g) => g.category === active);

  return (
    <>
      <section className="bg-ivory-deep pb-10 pt-36 md:pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Galeri
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] text-ink md:text-7xl">
              Hasil yang bisa kamu lihat, bukan hanya dijanjikan
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink-soft md:text-sm">
              Ruangan, proses, dan hasil karya tim kami. Semua foto dan video
              di sini adalah hasil nyata dari klien kami di {site.city}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter galeri">
            {galleryCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={active === c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "min-h-11 rounded-[3px] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors",
                  active === c.id
                    ? "bg-ink text-ivory"
                    : "border border-line bg-white/60 text-ink-soft hover:border-rosegold-600/50 hover:text-rosegold-700"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
            {items.map((g, i) => (
              <Reveal
                key={`${g.src}-${i}`}
                delay={(i % 4) * 0.06}
                className={i % 3 === 1 ? "md:mt-8" : undefined}
              >
                <figure className="group relative overflow-hidden">
                  <div
                    className={cn(
                      "overflow-hidden",
                      g.width > g.height ? "aspect-[4/3]" : "aspect-[3/4]"
                    )}
                  >
                    <Img
                      src={g.src}
                      alt={g.alt}
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-ivory">
                      {g.alt}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-12 text-center">
            <p className="text-base font-light text-ink-soft md:text-sm">
              Lihat update harian kami di
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-rosegold-700 hover:text-rosegold-800"
            >
              <InstagramIcon className="h-4 w-4" /> @paradisesalon
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-14 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-blush-200">
              Video
            </p>
            <h2 className="font-serif text-4xl font-medium leading-tight text-ivory md:text-5xl">
              Lihat prosesnya, rasakan hasilnya
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group relative aspect-video overflow-hidden">
              <video
                controls
                preload="none"
                poster="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1280&q=80"
                className="h-full w-full bg-ink"
                aria-label="Video perawatan di Paradise Salon"
              >
                <source src={VIDEO_PLACEHOLDER} type="video/mp4" />
              </video>
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/40 bg-ink/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-6 w-6 fill-ivory text-ivory" />
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-6 text-center">
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ivory/60">
              Video asli perawatan menyusul
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}