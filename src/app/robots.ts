import type { MetadataRoute } from "next";
import { site } from "@/data/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/uploads/"],
      },
    ],
    sitemap: `https://${site.domain}/sitemap.xml`,
  };
}

export const dynamic = "force-static";
