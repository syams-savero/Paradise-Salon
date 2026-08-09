"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/data/content";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Beranda" },
  { href: "/paket", label: "Paket & Harga" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang-kontak", label: "Tentang & Kontak" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full max-w-full pt-[env(safe-area-inset-top)] transition-all duration-500",
        scrolled || open
          ? "border-b border-line bg-ivory/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link
          href="/"
          className="group flex flex-col leading-none"
          aria-label={`${site.name} — beranda`}
        >
          <span className="font-serif text-2xl font-semibold tracking-wide text-ink md:text-[26px]">
            Paradise
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.42em] text-rosegold-600">
            Salon · Pekanbaru
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigasi utama">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[13px] font-medium uppercase tracking-[0.18em] transition-colors",
                pathname === item.href
                  ? "text-rosegold-600"
                  : "text-ink/70 hover:text-rosegold-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm">
            <Link href="/#booking">Booking via WhatsApp</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-line bg-ivory/95 backdrop-blur-md transition-[max-height] duration-500 lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col px-5 py-4" aria-label="Navigasi mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b border-line/60 py-4 text-sm font-medium uppercase tracking-[0.18em]",
                pathname === item.href
                  ? "text-rosegold-600"
                  : "text-ink/80"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-5">
            <Link href="/#booking">Booking via WhatsApp</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
