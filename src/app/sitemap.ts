import type { MetadataRoute } from "next";
import { site } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${site.domain}`;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/paket`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/galeri`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tentang-kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}

export const dynamic = "force-static";
