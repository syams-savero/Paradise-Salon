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
    image: `https://${site.domain}/images/hero.jpg`,
    priceRange: "Rp",
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
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      description: h.days,
      opens: h.time.split(" – ")[0].replace(" WIB", ""),
      closes: h.time.split(" – ")[1].replace(" WIB", ""),
    })),
    sameAs: [site.instagram, site.tiktok],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating,
      reviewCount: site.ratingCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
