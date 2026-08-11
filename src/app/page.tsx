import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Stats } from "@/components/sections/stats";
import { Services } from "@/components/sections/services";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { Packages } from "@/components/sections/packages";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { BookingForm } from "@/components/booking-form";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Marquee />
      <Stats />
      <Services />
      <GalleryPreview />
      <Testimonials />
      <Packages />
      <section id="booking" className="py-16 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-5 md:grid-cols-12 md:px-8">
          <div className="min-w-0 md:col-span-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Booking
            </p>
            <h2 className="font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
              Siap tampil lebih percaya diri?
            </h2>
            <p className="mt-4 text-base font-light leading-relaxed text-ink-soft md:text-sm">
              Ambil HP-mu, isi form di samping, dan chat kami. Tim kami akan
              konfirmasi jadwal dan menjawab semua pertanyaanmu — tanpa
              biaya tambahan.
            </p>
            <ul className="mt-7 space-y-3 text-base font-light text-ink/85 md:text-sm">
              {["Konsultasi gratis sebelum perawatan", "Harga fix sesuai paket, tanpa biaya tersembunyi", "Stylist berpengalaman untuk semua jenis rambut"].map(
                (item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rosegold-600" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="min-w-0 md:col-span-6 md:col-start-7">
            <BookingForm />
          </div>
        </div>
      </section>
      <Faq />
      <Cta />
    </>
  );
}
