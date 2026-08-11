import { site } from "@/data/content";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.name,
    slogan: site.slogan,
    description: site.description,
    url: `https://${site.domain}`,
    telephone: site.phone,
    email: site.email,
    image: site.ogImage,
    priceRange: "Rp150.000-Rp2.500.000",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.split(",")[0],
      addressLocality: site.city,
      addressRegion: "Riau",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.5071,
      longitude: 101.4478,
    },
    openingHoursSpecification: site.hours.map((h) => {
      const t = h.time.replace(" WIB", "").split(" – ");
      const days = h.days.split(" – ");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens: t[0].replace(".", ":"),
        closes: t[1].replace(".", ":"),
      };
    }),
    sameAs: [site.instagram, site.tiktok],
  };

  const html = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
