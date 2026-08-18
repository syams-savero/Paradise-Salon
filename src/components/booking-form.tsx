"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { Send, X, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { packages, services, serviceCategories, site, waLink } from "@/data/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type PickedItem = { label: string; group: string };
type MenuItem =
  | { type: "category"; name: string }
  | { type: "package"; name: string; price: string }
  | { type: "service"; name: string; from: string; category: string };

export function BookingForm() {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<PickedItem[]>([]);
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sent, setSent] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);
  const [viewStack, setViewStack] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);

  const currentView = viewStack[viewStack.length - 1] ?? null;

  const categoriesWithServices = serviceCategories.map((cat) => ({
    name: cat,
    items: services.filter((s) => s.category === cat),
  }));

  function openPopup() {
    setViewStack([]);
    setQuery("");
    setPopupOpen(true);
  }

  function closePopup() {
    setPopupOpen(false);
    setViewStack([]);
    setQuery("");
  }

  function pushView(name: string) {
    setViewStack((prev) => [...prev, name]);
    setQuery("");
  }

  function popView() {
    setViewStack((prev) => prev.slice(0, -1));
    setQuery("");
  }

  function addItem(label: string, group: string) {
    if (!picked.some((p) => p.label === label)) {
      setPicked((prev) => [...prev, { label, group }]);
    }
    closePopup();
  }

  function removeItem(label: string) {
    setPicked((prev) => prev.filter((p) => p.label !== label));
  }

  const handleBackdrop = useCallback(
    (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    },
    []
  );

  useEffect(() => {
    if (popupOpen) {
      document.addEventListener("mousedown", handleBackdrop);
      return () => document.removeEventListener("mousedown", handleBackdrop);
    }
  }, [popupOpen, handleBackdrop]);

  function getMenuItems(): MenuItem[] {
    if (currentView === null) {
      const cats: MenuItem[] = categoriesWithServices.map((c) => ({
        type: "category" as const,
        name: c.name,
      }));
      cats.push({ type: "category" as const, name: "Paket" });
      return cats;
    }
    if (currentView === "Paket") {
      return packages.map((p) => ({
        type: "package" as const,
        name: p.name,
        price: p.price,
      }));
    }
    const cat = categoriesWithServices.find((c) => c.name === currentView);
    if (cat) {
      return cat.items.map((s) => ({
        type: "service" as const,
        name: s.name,
        from: s.from,
        category: s.category,
      }));
    }
    return [];
  }

  const menuItems = getMenuItems().filter((item) =>
    query ? item.name.toLowerCase().includes(query.toLowerCase()) : true
  );

  function handleSelect(item: MenuItem) {
    if (item.type === "category") {
      pushView(item.name);
    } else if (item.type === "package") {
      addItem(`${item.name} (${item.price})`, "Paket");
    } else {
      addItem(item.name, item.category);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (cleanPhone && !/^(\+?\d{8,15})$/.test(cleanPhone)) {
      setPhoneError("Nomor tidak valid — contoh: 081234567890");
      return;
    }
    setPhoneError("");
    const branchLabel = branch || "Belum ditentukan";
    const itemList = picked.length
      ? picked.map((p) => `- ${p.label} (${p.group})`).join("\n")
      : "- Belum menentukan (minta rekomendasi)";
    const message = [
      `Halo ${site.name}, saya ${name || "calon klien"} ingin booking:`,
      "",
      `Cabang: ${branchLabel}`,
      `Layanan:`,
      itemList,
      "",
      `No. HP: ${phone || "-"}`,
      note ? `Catatan: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const branchData = site.branches.find((b) => b.name === branch);
    const waNumber = branchData?.whatsapp?.[0] ?? site.whatsapp;
    window.open(waLink(message, waNumber), "_blank", "noopener,noreferrer");
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
          <Label htmlFor="bk-name">
            Nama <span className="text-rosegold-700" aria-hidden="true">*</span>
          </Label>
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
          <Label>Pilih Cabang</Label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="flex h-12 w-full rounded-[3px] border border-line bg-white/70 px-4 text-base text-ink transition-colors focus-visible:border-rosegold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-600/20 md:text-sm"
          >
            <option value="">Pilih cabang terdekat</option>
            {site.branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Layanan</Label>

          {picked.map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <div className="flex h-12 flex-1 items-center rounded-[3px] border border-line bg-white/70 px-4 text-sm text-ink">
                {p.label}
              </div>
              <button
                type="button"
                onClick={() => removeItem(p.label)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] border border-line bg-white/70 text-ink-soft transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                aria-label={`Hapus ${p.label}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            ref={inputRef}
            type="button"
            onClick={openPopup}
            className="flex h-12 w-full items-center gap-3 rounded-[3px] border border-dashed border-rosegold-600/40 bg-white/50 px-4 text-sm text-ink-soft transition-colors hover:border-rosegold-600 hover:bg-rosegold-50/50 hover:text-ink"
          >
            <span className="text-rosegold-600">+</span>
            {picked.length === 0 ? "Pilih layanan" : "Tambah layanan"}
          </button>

          {popupOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4">
              <div
                ref={popupRef}
                className="flex w-full max-w-md flex-col rounded-t-xl border border-line bg-white shadow-xl sm:rounded-xl sm:border"
              >
                <div className="flex items-center border-b border-line px-4 py-3">
                  {currentView !== null && (
                    <button
                      type="button"
                      onClick={popView}
                      className="mr-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        currentView === null
                          ? "Cari kategori atau layanan…"
                          : `Cari di ${currentView}…`
                      }
                      className="h-10 w-full rounded-[3px] border border-line bg-ivory-deep pl-9 pr-4 text-sm text-ink placeholder:text-ink-soft focus-visible:border-rosegold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-600/20"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={closePopup}
                    className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto p-2">
                  {menuItems.length === 0 && (
                    <p className="py-6 text-center text-sm text-ink-soft">
                      Tidak ditemukan
                    </p>
                  )}
                  {menuItems.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center justify-between rounded-[3px] px-4 py-3 text-left transition-colors hover:bg-rosegold-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink">{item.name}</p>
                        {item.type === "package" && (
                          <p className="text-xs text-ink-soft">{item.price}</p>
                        )}
                        {item.type === "service" && (
                          <p className="text-xs text-ink-soft">{item.from}</p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-ink-soft" />
                    </button>
                  ))}
                </div>

                <div className="border-t border-line px-4 py-3">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="w-full text-center text-xs font-medium text-ink-soft transition-colors hover:text-ink"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
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
            placeholder="Contoh: Ingin rambut menjadi lebih fresh dan halus"
          />
        </div>

        <Button type="submit" size="lg" className="w-full gap-2">
          Lanjutkan ke WhatsApp
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
