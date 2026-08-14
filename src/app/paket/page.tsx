import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { Packages } from "@/components/sections/packages";
import { Cta } from "@/components/sections/cta";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/img";
import { services, site, waLink } from "@/data/content";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Paket & Harga",
  description: `Daftar lengkap paket dan harga ${site.name} di ${site.city}: potong rambut, hair color, balayage, treatment, hingga paket bridal. Harga transparan, konsultasi gratis via WhatsApp.`,
  alternates: { canonical: "/paket" },
  openGraph: {
    title: `Paket & Harga — ${site.name}`,
    description: `Harga transparan tanpa biaya tersembunyi: potong, hair color, balayage, treatment, hingga paket bridal.`,
    url: `https://${site.domain}/paket/`,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
};

const assurances = [
  {
    icon: Sparkles,
    title: "Konsultasi Gratis",
    text: "Ceritakan kondisi rambutmu sebelum datang — kami bantu pilih paket yang tepat untukmu.",
  },
  {
    icon: ShieldCheck,
    title: "Harga Fix",
    text: "Harga di website adalah harga final. Tidak ada biaya tambahan yang muncul diam-diam.",
  },
  {
    icon: MessageCircle,
    title: "Garansi Perbaikan",
    text: "Hasil kurang sesuai? Kabari kami dalam 3 hari, kami perbaiki tanpa biaya.",
  },
];

export default function PaketPage() {
  return (
    <>
      <section className="bg-ivory-deep pb-10 pt-36 md:pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Paket & Harga
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] text-ink md:text-7xl">
              Investasi kecil untuk rambut yang selalu tampil istimewa
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink-soft md:text-sm">
              Semua paket sudah termasuk konsultasi, layanan purna perawatan,
              dan jaminan perbaikan. Harga final, tanpa biaya tersembunyi.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-12 md:mb-16">
            <p className="mb-3 text-lg font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Layanan Kami
            </p>
            <h2 className="max-w-2xl font-serif text-4xl font-medium leading-tight text-ink md:text-6xl">
              Semua layanan yang kami tawarkan
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.06} className="min-w-0">
                <Link
                  href={waLink(
                    `Halo Paradise Salon, saya tertarik dengan layanan ${s.name}. Boleh info lebih lanjut?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-2 overflow-hidden border border-line bg-white/60"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Img
                      src={s.image}
                      alt={s.name}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 md:p-5">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                        {s.name}
                      </h3>
                      <p className="mt-1.5 text-sm font-light leading-relaxed text-ink-soft">
                        {s.tagline}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-3">
                      <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                        <Clock className="h-3.5 w-3.5" /> {s.duration}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-rosegold-700">
                        Mulai {s.from}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Packages showLink={false} />

      <section className="bg-ivory-deep py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {assurances.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08} className="min-w-0">
                <div className="h-full border border-line bg-white/60 p-7 md:p-8">
                  <a.icon className="h-6 w-6 text-rosegold-600" />
                  <h3 className="mt-5 font-serif text-2xl font-medium text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-base font-light leading-relaxed text-ink-soft md:text-sm">
                    {a.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-12 text-center">
            <p className="mb-5 text-base font-light text-ink-soft md:text-sm">
              Masih bingung pilih paket mana? Ceritakan kebutuhanmu, kami
              rekomendasikan.
            </p>
            <Button asChild size="lg">
              <Link href="/#booking">Konsultasi Gratis via WhatsApp</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
