import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { galleryCta } from "@/data/content";
import { Reveal } from "@/components/motion";
import { Img } from "@/components/img";

const shots = [
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80", alt: "Interior Paradise Salon yang hangat dan elegan" },
  { src: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=80", alt: "Hasil balayage cokelat klien" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80", alt: "Potongan rambut pria yang rapi" },
  { src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80", alt: "Stylist sedang menata rambut klien" },
  { src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80", alt: "Area treatment Paradise Salon yang bersih dan nyaman" },
  { src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80", alt: "Proses pewarnaan rambut yang sedang berlangsung" },
];

export function GalleryPreview() {
  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
              Galeri
            </p>
            <h2 className="max-w-lg font-serif text-4xl font-medium leading-tight text-ink md:text-6xl">
              Hasil yang bisa kamu lihat, bukan hanya janji
            </h2>
          </div>
          <Link
            href="/galeri"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-ink hover:text-rosegold-700"
          >
            Buka galeri
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {shots.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 3) * 0.08}
              className={i === 0 || i === 3 ? "md:mt-10" : undefined}
            >
              <div className="group relative aspect-[3/4] overflow-hidden">
                <Img
                  src={img.src}
                  alt={img.alt}
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="font-serif text-2xl italic text-ink-soft md:text-3xl">
            {galleryCta}
          </p>
          <Link
            href="https://instagram.com/paradisesalon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-rosegold-700 hover:text-rosegold-800"
          >
            <Star className="h-4 w-4" /> @paradisesalon
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
