import { cn } from "@/lib/utils";

const SIZES = [480, 640, 800, 1200, 1600];

function buildSrcSet(src: string): { srcSet: string; sizesDefault: string } | null {
  if (!src.startsWith("https://images.unsplash.com/")) return null;
  const [base, query] = src.split("?");
  const params = new URLSearchParams(query || "");
  const srcSet = SIZES.map((w) => {
    const p = new URLSearchParams(params);
    p.set("w", String(w));
    p.set("auto", "format");
    return `${base}?${p.toString()} ${w}w`;
  }).join(", ");
  return { srcSet, sizesDefault: `${SIZES[SIZES.length - 1]}px` };
}

export function Img({
  src,
  alt,
  className,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const responsive = buildSrcSet(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={responsive ? responsive.srcSet : undefined}
      sizes={sizes || (responsive ? responsive.sizesDefault : "100vw")}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
