import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { site, waLink, waDefaultMessage } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tentang & Kontak",
  description: `Tentang ${site.name}, salon premium di ${site.city}. Alamat, jam operasional, kontak, dan media sosial. Konsultasi & booking mudah via WhatsApp.`,
  alternates: { canonical: "/tentang-kontak" },
  openGraph: {
    title: `Tentang & Kontak — ${site.name}`,
    description: `Salon premium di ${site.city}. Alamat, jam operasional, kontak, dan media sosial.`,
    url: `https://${site.domain}/tentang-kontak/`,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
};

const values = [
  {
    title: "Pendengar yang Baik",
    text: "Setiap sesi dimulai dari konsultasi. Kami dengar dulu apa maumu, baru menyentuh rambutmu.",
  },
  {
    title: "Tangan Berpengalaman",
    text: "Tim kami terus mengikuti tren dan teknik terbaru, dari potongan klasik hingga balayage modern.",
  },
  {
    title: "Produk Berkualitas",
    text: "Kami hanya memakai produk perawatan yang aman dan menyehatkan rambut dalam jangka panjang.",
  },
  {
    title: "Kenangan yang Nyaman",
    text: "Kopi atau teh, musik yang pas, dan ruang yang bersih — waktumu di sini harus terasa istimewa.",
  },
];

export default function TentangKontakPage() {
  return (
    <>
      <section className="bg-ivory-deep pb-10 pt-36 md:pb-16 md:pt-44">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Tentang Kami
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] text-ink md:text-7xl">
              {site.slogan} — sejak {site.founded} di {site.city}
            </h1>
            <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-ink-soft md:text-sm">
              {site.name} lahir dari satu keyakinan sederhana: kecantikan
              bukan soal mengikuti tren, tapi soal merasa menjadi versi
              terbaik dirimu sendiri. Dari potongan rambut harian hingga
              momen terbesar dalam hidupmu — kami ada di setiap langkahnya.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-10">
            <h2 className="font-serif text-3xl font-medium text-ink md:text-5xl">
              Nilai yang kami pegang
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="min-w-0">
                <div className="h-full border border-line bg-white/60 p-7 md:p-8">
                  <span className="font-serif text-5xl font-medium text-blush-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-medium text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-base font-light leading-relaxed text-ink-soft md:text-sm">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-deep py-14 md:py-24" id="kontak">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <Reveal className="min-w-0 md:col-span-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
                Kontak
              </p>
              <h2 className="font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
                Temukan kami di {site.city}
              </h2>
              <ul className="mt-8 space-y-6 text-sm">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-line bg-white/70 text-rosegold-700">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium uppercase tracking-[0.16em] text-ink">
                      Alamat
                    </p>
                    <a
                      href={site.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-light leading-relaxed text-ink-soft hover:text-rosegold-700"
                    >
                      {site.address}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-line bg-white/70 text-rosegold-700">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium uppercase tracking-[0.16em] text-ink">
                      Jam Operasional
                    </p>
                    <ul className="mt-1 space-y-1 font-light text-ink-soft">
                      {site.hours.map((h) => (
                        <li key={h.days}>
                          {h.days} · {h.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-line bg-white/70 text-rosegold-700">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium uppercase tracking-[0.16em] text-ink">
                      Telepon / WhatsApp
                    </p>
                    <a
                      href={waLink(waDefaultMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-light text-ink-soft hover:text-rosegold-700"
                    >
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-line bg-white/70 text-rosegold-700">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium uppercase tracking-[0.16em] text-ink">
                      Email
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-1 block font-light text-ink-soft hover:text-rosegold-700"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="min-w-0 md:col-span-7">
              <div className="h-full border border-line bg-white/60 p-7 md:p-10">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-ink">
                      Media sosial
                    </h3>
                    <p className="mt-2 text-base font-light text-ink-soft md:text-sm">
                      Lihat hasil karya terbaru dan promo eksklusif kami.
                    </p>
                    <div className="mt-6 space-y-4">
                      {site.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between border-b border-line pb-4"
                        >
                          <span className="flex items-center gap-4">
                            <span className="flex h-11 w-11 items-center justify-center rounded-[3px] bg-ink text-ivory transition-colors group-hover:bg-rosegold-700">
                              {s.label === "Instagram" ? (
                                <InstagramIcon className="h-4 w-4" />
                              ) : (
                                <TikTokIcon className="h-4 w-4" />
                              )}
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-ink">
                                {s.label}
                              </span>
                              <span className="text-xs font-light text-ink-soft">
                                {s.handle}
                              </span>
                            </span>
                          </span>
                          <span className="text-2xl text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-rosegold-700">
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[3px] bg-blush-50 p-6 md:p-8">
                    <p className="font-serif text-xl italic leading-relaxed text-ink md:text-2xl">
                      “{site.slogan}”
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild size="lg">
                        <Link href="/#booking">
                          <MessageCircle className="h-4 w-4" />
                          Booking via WhatsApp
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <a
                          href={site.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buka di Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
