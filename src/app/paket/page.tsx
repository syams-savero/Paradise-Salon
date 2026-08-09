import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { Packages } from "@/components/sections/packages";
import { Cta } from "@/components/sections/cta";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Paket & Harga",
  description: `Daftar lengkap paket dan harga ${site.name} di ${site.city}: potong rambut, hair color, balayage, treatment, hingga paket bridal. Harga transparan, konsultasi gratis via WhatsApp.`,
  alternates: { canonical: "/paket" },
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
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-600">
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
