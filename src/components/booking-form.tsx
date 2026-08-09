"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { packages, site, waLink } from "@/data/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function BookingForm() {
  const [name, setName] = useState("");
  const [pkg, setPkg] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = [
      `Halo ${site.name}, saya ${name || "calon klien"} ingin booking:`,
      "",
      `Paket: ${pkg || "belum menentukan (minta rekomendasi)"}`,
      `No. HP: ${phone || "-"}`,
      note ? `Catatan: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-white/70 p-6 md:p-9"
    >
      <h3 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Booking sekarang
      </h3>
      <p className="mt-2 text-sm font-light text-ink-soft">
        Isi form singkat ini — pesanmu akan terisi otomatis di WhatsApp.
      </p>

      <div className="mt-7 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="bk-name">Nama</Label>
          <Input
            id="bk-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bk-pkg">Pilih Paket</Label>
          <select
            id="bk-pkg"
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
            className="flex h-12 w-full rounded-[3px] border border-line bg-white/70 px-4 text-base text-ink transition-colors focus-visible:border-rosegold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-600/20 md:text-sm"
          >
            <option value="">Belum yakin — minta rekomendasi</option>
            {packages.map((p) => (
              <option key={p.name} value={`${p.name} (${p.price})`}>
                {p.name} — {p.price}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bk-phone">No. WhatsApp</Label>
          <Input
            id="bk-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xx-xxxx-xxxx"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bk-note">Catatan (opsional)</Label>
          <Textarea
            id="bk-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: ingin balayage cokelat untuk acara minggu depan"
          />
        </div>

        <Button type="submit" size="lg" className="w-full gap-2">
          Lanjutkan ke WhatsApp
          <Send className="h-4 w-4" />
        </Button>
        <p className="text-center text-xs font-light text-ink-soft">
          Tanpa biaya · Tanpa komitmen · Balasan cepat saat jam operasional
        </p>
      </div>
    </form>
  );
}
