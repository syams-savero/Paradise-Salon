import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/content";
import { ClipReveal } from "@/components/motion";
import { Img } from "@/components/img";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-ivory">
      <div className="absolute inset-0" aria-hidden>
        <Img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80"
          alt=""
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pb-32 md:pt-44">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-blush-200">
          Salon Premium di {site.city}
        </p>
        <h1 className="max-w-4xl font-serif text-6xl font-medium leading-[1.02] text-ivory md:text-7xl lg:text-8xl">
          <ClipReveal delay={0.05}>Your beauty</ClipReveal>
          <ClipReveal delay={0.18}>
            starts here<span className="text-blush-200">.</span>
          </ClipReveal>
        </h1>
        <div className="mt-6 max-w-lg md:mt-8">
          <p className="font-serif text-2xl italic leading-snug text-ivory/90 md:text-2xl lg:text-[28px]">
            Potong rambut, warna, dan treatment yang dibuat khusus untukmu —
            oleh tangan berpengalaman, di ruang yang nyaman seperti milikmu
            sendiri.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4">
          <Button asChild size="lg" className="group flex-1 sm:flex-none">
            <Link href="/#booking">
              Booking via WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ivory" className="flex-1 sm:flex-none">
            <Link href="/paket">Lihat Paket & Harga</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
