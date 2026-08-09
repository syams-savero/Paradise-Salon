"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-32">
      <div
        className="absolute inset-0 opacity-[0.16]"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 80% at 70% 20%, #b76e79 0%, transparent 60%), radial-gradient(50% 70% at 20% 80%, #8c4b56 0%, transparent 55%)",
        }}
      />
      <Reveal className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-blush-200">
          {site.name} · {site.city}
        </p>
        <h2 className="font-serif text-5xl font-medium leading-[1.02] text-ivory md:text-7xl">
          Rambut yang kamu inginkan,
          <br />
          <span className="italic text-blush-200">tinggal satu langkah lagi.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-ivory/70 md:text-sm">
          Konsultasi gratis, harga fix tanpa biaya tersembunyi, dan hasil yang
          kamu bisa lihat sebelum memulai.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="group">
            <Link href="/#booking">
              Booking via WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-ivory/30 text-ivory hover:border-blush-200 hover:text-blush-200">
            <Link href="/galeri">Lihat hasil karya</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
