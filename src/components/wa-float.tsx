import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { waLink, waDefaultMessage } from "@/data/content";

export function WaFloat() {
  return (
    <Link
      href={waLink(waDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rosegold-600 text-ivory shadow-[0_8px_30px_rgba(183,110,121,0.45)] transition-all hover:scale-105 hover:bg-rosegold-700 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}
