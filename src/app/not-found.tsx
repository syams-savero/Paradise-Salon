import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/content";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
  description: `Halaman yang kamu cari tidak tersedia di ${site.name}.`,
};

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center justify-center bg-ivory px-6 py-24">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.45em] text-rosegold-700">
          404
        </p>
        <h1 className="mt-4 font-serif text-5xl font-medium text-ink md:text-6xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base font-light leading-relaxed text-ink-soft md:text-sm">
          Sepertinya halaman itu sudah dipindah atau tidak pernah ada. Yuk
          balik ke beranda.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}