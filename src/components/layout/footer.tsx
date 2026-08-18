import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { site, waLink, waDefaultMessage } from "@/data/content";

const nav = [
  { href: "/", label: "Beranda" },
  { href: "/paket", label: "Paket & Harga" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang-kontak", label: "Tentang & Kontak" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="flex items-center gap-3 leading-none">
              <Image
                src={site.logo}
                alt={site.name}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-3xl font-semibold tracking-wide">
                  {site.name}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.42em] text-blush-200">
                  Salon · {site.city}
                </span>
              </div>
            </div>
            <p className="max-w-xs text-sm font-light leading-relaxed text-ivory/70">
              {site.slogan}. Salon premium di {site.city} untuk perawatan rambut,
              warna, dan momen spesialmu.
            </p>
            <div className="flex gap-3">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-ivory/20 text-ivory/80 transition-colors hover:border-blush-200 hover:text-blush-200"
                >
                  {s.label.includes("TikTok") ? (
                    <TikTokIcon className="h-4 w-4" />
                  ) : (
                    <InstagramIcon className="h-4 w-4" />
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-blush-200">
              Navigasi
            </h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-light text-ivory/75 transition-colors hover:text-blush-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-blush-200">
              Jam Operasional
            </h3>
            <ul className="mt-5 space-y-3 text-sm font-light text-ivory/75">
              {site.hours.map((h) => (
                <li key={h.days} className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blush-200/80" />
                  <span>
                    <span className="block">{h.days}</span>
                    <span className="text-ivory/60">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-blush-200">
              Cabang Kami
            </h3>
            <ul className="mt-5 space-y-4 text-sm font-light text-ivory/75">
              {site.branches.map((b) => (
                <li key={b.name} className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blush-200/80" />
                  <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blush-200">
                    <span className="block font-medium text-ivory/90">{b.name}</span>
                    <span>{b.address}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={waLink(waDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border-b border-blush-200/50 pb-1 pt-1.5 text-sm font-medium text-blush-200 transition-colors hover:border-blush-200"
            >
              Chat kami sekarang →
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ivory/10 pt-6 text-xs font-light text-ivory/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.city}, Indonesia
          </p>
          <p>{site.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
