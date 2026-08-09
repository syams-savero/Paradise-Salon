import content from "./content.json";

export const site = content.site as typeof content.site;
export const stats = content.stats;
export const services = content.services;
export const packages = content.packages;
export const galleryCategories = content.galleryCategories;
export const gallery = content.gallery;
export const testimonials = content.testimonials;
export const faqs = content.faqs;
export const galleryCta = content.galleryCta;

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waDefaultMessage =
  "Halo Paradise Salon, saya ingin tanya-tanya tentang layanan dan ketersediaan jadwal. Terima kasih!";

export type Site = typeof site;
export type Service = (typeof services)[number];
export type Package = (typeof packages)[number];
export type GalleryItem = (typeof gallery)[number];
export type Testimonial = (typeof testimonials)[number];
export type Faq = (typeof faqs)[number];
export type Stats = typeof stats;
export type Content = typeof content;
