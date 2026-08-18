"use client";

import dynamic from "next/dynamic";
import type { Branch } from "@/data/content";

const Map = dynamic(() => import("./_map").then((m) => m.BranchMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center border border-line bg-ivory-deep text-sm text-ink-soft">
      Memuat peta…
    </div>
  ),
});

export function MapWrapper({ branches }: { branches: Branch[] }) {
  return <Map branches={branches} />;
}
