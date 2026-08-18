"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { waLink } from "@/data/content";
import type { Service } from "@/data/content";

export function ServiceCategory({
  category,
  items,
}: {
  category: string;
  items: Service[];
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = items.slice(0, 6);
  const rest = items.slice(6);
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
      className="group flex flex-col justify-between border border-line bg-white/60 p-5 transition-all duration-300 hover:border-rosegold-600/40 hover:bg-white md:p-6"
    >
      <h4 className="font-serif text-lg font-medium text-ink md:text-xl">
        {s.name}
      </h4>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.12em] text-rosegold-700">
        Mulai {s.from}
      </p>
    </Link>
  );
}
