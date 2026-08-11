import type { Metadata } from "next";
import { site } from "@/data/content";
import { GalleryBrowser } from "./_gallery";

export const metadata: Metadata = {
  title: "Galeri — Hasil Karya",
  description: `Lihat ruangan, proses, dan hasil karya selengkapnya dari ${site.name} di ${site.city}: potong rambut, pewarnaan, perawatan, hingga hasil bridal.`,
  alternates: { canonical: "/galeri" },
  openGraph: {
    title: `Galeri — ${site.name}`,
    description: `Ruangan, proses, dan hasil karya tim ${site.name}.`,
    url: `https://${site.domain}/galeri/`,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
};

export default function GalleryPage() {
  return <GalleryBrowser />;
}