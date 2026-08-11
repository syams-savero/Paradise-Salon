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
  const [phoneError, setPhoneError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (cleanPhone && !/^(\+?\d{8,15})$/.test(cleanPhone)) {
      setPhoneError("Nomor tidak valid — contoh: 081234567890");
      return;
    }
    setPhoneError("");
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
    setSent(true);
    window.setTimeout(() => setSent(false), 5000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="booking-title"
      className="border border-line bg-white/70 p-6 md:p-9"
    >
      <h3 id="booking-title" className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Booking sekarang
      </h3>
      <p className="mt-2 text-sm font-light text-ink-soft">
        Isi form singkat ini — pesanmu akan terisi otomatis di WhatsApp.
      </p>
      <div aria-live="polite" className="mt-7">
        {sent && (
          <p className="mb-4 rounded-[3px] border border-rosegold-600/30 bg-rosegold-50 p-3 text-sm text-rosegold-800">
            WhatsApp sudah dibuka — kirim pesannya untuk mengonfirmasi booking.
          </p>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="bk-name">Nama <span className="text-rosegold-700" aria-hidden="true">*</span></Label>
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
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError("");
            }}
            placeholder="08xx-xxxx-xxxx"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={phoneError ? true : undefined}
            aria-describedby={phoneError ? "bk-phone-error" : undefined}
          />
          {phoneError && (
            <p id="bk-phone-error" className="text-xs text-red-700">
              {phoneError}
            </p>
          )}
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
