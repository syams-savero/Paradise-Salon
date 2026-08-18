const items = [
  "Gunting",
  "Creambath Spa",
  "Hair Color",
  "Lash Lift",
  "Facial Sariayu",
  "Pijat Seluruh Badan",
  "Lulur Whitening",
  "Nail Art",
  "Bridal & Event",
  "Konsultasi Gratis",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div
      className="relative w-full max-w-full overflow-hidden overflow-x-clip border-y border-line bg-blush-50 py-3.5"
      aria-hidden
    >
      <div className="marquee-track flex w-max animate-marquee gap-0">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-serif text-lg italic tracking-wide text-rosegold-700">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-rosegold-600/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
