"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import { waLink } from "@/data/content";
import type { Service } from "@/data/content";
import { Img } from "@/components/img";

export function ServiceCategory({
  category,
  items,
}: {
  category: string;
  items: Service[];
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = items.slice(0, 4);
  const rest = items.slice(4);
  const hasMore = rest.length > 0;

  return (
    <div className="mb-12 last:mb-0">
      <h3 className="mb-6 font-serif text-2xl font-medium text-ink md:text-3xl">
        {category}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
        {preview.map((s) => (
          <ServiceCard key={s.name} s={s} />
        ))}
        {expanded && rest.map((s) => <ServiceCard key={s.name} s={s} />)}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-ink/25 bg-transparent px-6 text-sm font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-rosegold-600 hover:text-rosegold-700"
          >
            {expanded ? "Tutup" : "Lihat selengkapnya"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ s }: { s: Service }) {
  return (
    <Link
      href={waLink(
        `Halo Paradise Salon, saya tertarik dengan layanan ${s.name}. Boleh info lebih lanjut?`
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden border border-line bg-white/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img
          src={s.image}
          alt={s.name}
          sizes="(min-width: 768px) 25vw, 50vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-3 md:p-4">
        <h4 className="font-serif text-lg font-medium text-ink md:text-xl">
          {s.name}
        </h4>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
            <Clock className="h-3 w-3" /> {s.duration}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-rosegold-700">
            {s.from}
          </span>
        </div>
      </div>
    </Link>
  );
}