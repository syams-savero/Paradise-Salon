import { site } from "@/data/content";

export function JsonLd() {
  const primary = site.branches[0];
  const schema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.name,
    slogan: site.slogan,
    description: site.description,
    url: `https://${site.domain}`,
    telephone: site.phone,
    image: site.ogImage,
    priceRange: "Rp5.000-Rp160.000",
    address: site.branches.map((b) => ({
      "@type": "PostalAddress",
      name: b.name,
      streetAddress: b.address.split(",")[0],
      addressLocality: site.city,
      addressRegion: "Riau",
      addressCountry: "ID",
    })),
    geo: {
      "@type": "GeoCoordinates",
      latitude: primary.lat,
      longitude: primary.lng,
    },
    openingHoursSpecification: site.hours.map((h) => {
      const t = h.time.replace(" WIB", "").split(" – ");
      const days = h.days === "Setiap Hari"
        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        : h.days.split(" – ");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens: t[0].replace(".", ":"),
        closes: t[1].replace(".", ":"),
      };
    }),
    sameAs: site.socials.map((s) => s.url),
  };

  const html = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
