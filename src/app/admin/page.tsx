"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut, Save, Loader2, Plus, Trash2, Check, Upload } from "lucide-react";
import type { Content } from "@/data/content";

const INPUT =
  "w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:border-rosegold-600 focus:outline-none focus:ring-2 focus:ring-rosegold-600/20";
const LABEL = "mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft";
const BTN =
  "inline-flex items-center gap-2 rounded-[3px] bg-rosegold-600 px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-rosegold-700 disabled:opacity-50";

type Tab = "profil" | "layanan" | "paket" | "galeri" | "testimoni" | "faq";

type SetC = (fn: (c: Content) => void) => void;

function makeSet(
  set: React.Dispatch<React.SetStateAction<Content | null>>
): SetC {
  return (fn) =>
    set((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
}

const TABS: { id: Tab; label: string }[] = [
  { id: "profil", label: "Profil & Kontak" },
  { id: "layanan", label: "Layanan" },
  { id: "paket", label: "Paket" },
  { id: "galeri", label: "Galeri" },
  { id: "testimoni", label: "Testimoni" },
  { id: "faq", label: "FAQ" },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  rows,
  autoComplete,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  autoComplete?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {textarea ? (
        <textarea
          className={INPUT}
          value={value}
          rows={rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={INPUT}
          value={value}
          autoComplete={autoComplete}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      setErr("Hanya jpg/png/webp/gif");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErr("Maks 4MB");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(
        `/api/admin/upload?name=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: await file.arrayBuffer(),
        }
      );
      const d = await res.json();
      if (!res.ok || !d.url) throw new Error(d.error ?? "Upload gagal");
      onChange(d.url);
    } catch (err) {
      setErr("Upload gagal — coba lagi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex items-start gap-3">
        {value && (
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 rounded-[3px] border border-line object-cover"
          />
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-[3px] border border-rosegold-600 px-3 py-1.5 text-sm font-medium text-rosegold-700 transition-colors hover:bg-rosegold-50">
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {busy ? "Mengunggah..." : "Pilih Foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFile}
              disabled={busy}
            />
          </label>
          <input
            className={INPUT}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="atau tempel URL foto..."
          />
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>("profil");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [buildState, setBuildState] = useState<string>("");

  const checkSession = useCallback(async () => {    try {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const d = await res.json();
        if (d.authed) {
          setAuthed(true);
          const c = await fetch("/api/admin/content");
          if (c.ok) {
            setContent(await c.json());
          } else {
            const ed = await c.json().catch(() => ({}));
            setLoadError(`Gagal memuat konten: ${ed.error ?? c.status}`);
          }
        } else {
          setAuthed(false);
        }
      } else {
        setAuthed(false);
      }
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const d = await res.json();
      if (res.ok && d.authed) {
        setAuthed(true);
        const c = await fetch("/api/admin/content");
        if (c.ok) {
          setContent(await c.json());
        } else {
          const ed = await c.json().catch(() => ({}));
          setLoadError(`Gagal memuat konten: ${ed.error ?? c.status}`);
        }
      } else {
        setLoginError(d.error ?? "Login gagal");
      }
    } catch {
      setLoginError("Server tidak merespons");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setContent(null);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    setBuildState("Menyimpan...");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const d = await res.json();
      if (res.ok) {
        setSaved(true);
        setBuildState(d.rebuilding ? "Tersimpan — rebuild berjalan, ±1 menit..." : "Tersimpan");
        setTimeout(() => setSaved(false), 3000);
      } else {
        setBuildState(d.error ?? "Gagal menyimpan");
      }
    } catch {
      setBuildState("Gagal menyimpan");
    }
    setSaving(false);
  }

  if (authed === null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ivory p-6">
        <Loader2 className="h-6 w-6 animate-spin text-rosegold-600" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ivory p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm border border-line bg-white/70 p-8"
        >
          <h1 className="font-serif text-3xl font-medium text-ink">Admin</h1>
          <p className="mt-1 text-sm font-light text-ink-soft">
            Paradise Salon CMS
          </p>
          <div className="mt-6 space-y-4">
            <Field
              label="Username"
              value={username}
              onChange={setUsername}
              autoComplete="username"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            {loginError && (
              <p className="text-sm text-rosegold-700">{loginError}</p>
            )}
            <button type="submit" className={BTN + " w-full justify-center"}>
              Masuk
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!content) {
    if (loadError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-ivory p-6 text-center">
          <p className="max-w-md rounded-[3px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {loadError}
          </p>
          <button onClick={handleLogout} className={BTN}>
            Logout
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-svh bg-ivory-deep pb-20">
      <header className="border-b border-line bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="font-serif text-2xl font-medium text-ink">
              Dashboard Admin
            </h1>
            <p className="text-xs font-light text-ink-soft">
              Paradise Salon · {content.site.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-700">
                <Check className="h-4 w-4" /> Tersimpan
              </span>
            )}
            <button onClick={handleSave} disabled={saving} className={BTN}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-rosegold-700"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "whitespace-nowrap rounded-[3px] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors " +
                (tab === t.id
                  ? "bg-ink text-ivory"
                  : "text-ink-soft hover:text-rosegold-700")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-8">
        {loadError && (
          <p className="mb-6 rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-light text-red-700">
            {loadError}
          </p>
        )}
        {buildState && (
          <p className="mb-6 rounded-[3px] border border-line bg-white/70 px-4 py-3 text-sm font-light text-ink-soft">
            {buildState}
          </p>
        )}

        {tab === "profil" && <ProfileTab c={content} set={makeSet(setContent)} />}
        {tab === "layanan" && <ServicesTab c={content} set={makeSet(setContent)} />}
        {tab === "paket" && <PackagesTab c={content} set={makeSet(setContent)} />}
        {tab === "galeri" && <GalleryTab c={content} set={makeSet(setContent)} />}
        {tab === "testimoni" && <TestimonialsTab c={content} set={makeSet(setContent)} />}
        {tab === "faq" && <FaqTab c={content} set={makeSet(setContent)} />}
      </main>
    </div>
  );
}

function ProfileTab({
  c,
  set,
}: {
  c: Content;
  set: SetC;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Section title="Profil Salon">
        <Field label="Nama Salon" value={c.site.name} onChange={(v) => set((p) => void (p.site.name = v))} />
        <Field label="Kota" value={c.site.city} onChange={(v) => set((p) => void (p.site.city = v))} />
        <Field label="Slogan" value={c.site.slogan} onChange={(v) => set((p) => void (p.site.slogan = v))} />
        <Field label="Sejak Tahun" value={c.site.founded} onChange={(v) => set((p) => void (p.site.founded = v))} />
        <Field label="Deskripsi (SEO)" value={c.site.description} textarea onChange={(v) => set((p) => void (p.site.description = v))} />
        <Field label="Judul (SEO)" value={c.site.title} textarea onChange={(v) => set((p) => void (p.site.title = v))} />
      </Section>
      <Section title="Kontak">
        <Field label="Nomor WhatsApp (kode negara, tanpa +)" value={c.site.whatsapp} onChange={(v) => set((p) => void (p.site.whatsapp = v))} />
        <Field label="Telepon" value={c.site.phone} onChange={(v) => set((p) => void (p.site.phone = v))} />
        <Field label="Email" value={c.site.email} onChange={(v) => set((p) => void (p.site.email = v))} />
        <Field label="Alamat" value={c.site.address} textarea onChange={(v) => set((p) => void (p.site.address = v))} />
        <Field label="Link Google Maps" value={c.site.mapsUrl} onChange={(v) => set((p) => void (p.site.mapsUrl = v))} />
        <Field label="Link Instagram" value={c.site.instagram} onChange={(v) => set((p) => void (p.site.instagram = v))} />
        <Field label="Link TikTok" value={c.site.tiktok} onChange={(v) => set((p) => void (p.site.tiktok = v))} />
      </Section>
      <Section title="Jam Operasional">
        {c.site.hours.map((h, i) => (
          <div key={i} className="flex gap-3">
            <Field
              label="Hari"
              value={h.days}
              onChange={(v) => set((p) => void (p.site.hours[i].days = v))}
            />
            <Field
              label="Jam"
              value={h.time}
              onChange={(v) => set((p) => void (p.site.hours[i].time = v))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            set((p) => void p.site.hours.push({ days: "", time: "" }))
          }
          className="mt-2 inline-flex items-center gap-1 text-sm text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah jam
        </button>
      </Section>
      <Section title="Statistik">
        {c.stats.map((s, i) => (
          <div key={i} className="flex gap-3">
            <Field
              label="Angka"
              value={s.value}
              onChange={(v) => set((p) => void (p.stats[i].value = v))}
            />
            <Field
              label="Label"
              value={s.label}
              onChange={(v) => set((p) => void (p.stats[i].label = v))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => set((p) => void p.stats.push({ value: "", label: "" }))}
          className="mt-2 inline-flex items-center gap-1 text-sm text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah statistik
        </button>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-line bg-white/70 p-6">
      <h2 className="mb-5 font-serif text-xl font-medium text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ArrayItem({
  title,
  onDelete,
  children,
}: {
  title: string;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-white/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-serif text-lg text-ink">{title}</span>
        <button
          type="button"
          onClick={onDelete}
          className="text-rosegold-700 hover:text-rosegold-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ServicesTab({
  c,
  set,
}: {
  c: Content;
  set: SetC;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            set((p) =>
              void p.services.push({
                name: "",
                tagline: "",
                duration: "",
                from: "",
                image: "",
              })
            )
          }
          className="inline-flex items-center gap-1 text-sm font-medium text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah layanan
        </button>
      </div>
      {c.services.map((s, i) => (
        <ArrayItem
          key={i}
          title={s.name || `Layanan ${i + 1}`}
          onDelete={() => set((p) => void p.services.splice(i, 1))}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Nama" value={s.name} onChange={(v) => set((p) => void (p.services[i].name = v))} />
            <Field label="Durasi" value={s.duration} onChange={(v) => set((p) => void (p.services[i].duration = v))} />
            <Field label="Harga (Mulai)" value={s.from} onChange={(v) => set((p) => void (p.services[i].from = v))} />
          </div>
          <ImageField label="Foto" value={s.image} onChange={(v) => set((p) => void (p.services[i].image = v))} />
          <Field label="Tagline" value={s.tagline} textarea rows={2} onChange={(v) => set((p) => void (p.services[i].tagline = v))} />
        </ArrayItem>
      ))}
    </div>
  );
}

function PackagesTab({
  c,
  set,
}: {
  c: Content;
  set: SetC;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            set((p) =>
              void p.packages.push({
                name: "",
                tagline: "",
                price: "",
                duration: "",
                includes: [],
                featured: false,
              })
            )
          }
          className="inline-flex items-center gap-1 text-sm font-medium text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah paket
        </button>
      </div>
      {c.packages.map((p, i) => (
        <ArrayItem
          key={i}
          title={p.name || `Paket ${i + 1}`}
          onDelete={() => set((p) => void p.packages.splice(i, 1))}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Nama Paket" value={p.name} onChange={(v) => set((p) => void (p.packages[i].name = v))} />
            <Field label="Harga" value={p.price} onChange={(v) => set((p) => void (p.packages[i].price = v))} />
            <Field label="Durasi" value={p.duration} onChange={(v) => set((p) => void (p.packages[i].duration = v))} />
          </div>
          <Field label="Tagline" value={p.tagline} textarea rows={2} onChange={(v) => set((p) => void (p.packages[i].tagline = v))} />
          <Field
            label="Isi Paket (satu baris per item)"
            textarea
            rows={4}
            value={p.includes.join("\n")}
            onChange={(v) =>
              set((prev) => void (prev.packages[i].includes = v.split("\n").filter(Boolean))
              )
            }
          />
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={p.featured}
              onChange={(e) =>
                set((prev) => void (prev.packages[i].featured = e.target.checked))
              }
              className="h-4 w-4 accent-rosegold-600"
            />
            Tampilkan sebagai paket populer
          </label>
        </ArrayItem>
      ))}
    </div>
  );
}

function GalleryTab({
  c,
  set,
}: {
  c: Content;
  set: SetC;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            set((p) =>
              void p.gallery.push({
                src: "",
                alt: "",
                category: "hasil",
                width: 3,
                height: 4,
              })
            )
          }
          className="inline-flex items-center gap-1 text-sm font-medium text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah foto
        </button>
      </div>
      {c.gallery.map((g, i) => (
        <ArrayItem
          key={i}
          title={g.alt || `Foto ${i + 1}`}
          onDelete={() => set((p) => void p.gallery.splice(i, 1))}
        >
          <ImageField label="Foto" value={g.src} onChange={(v) => set((p) => void (p.gallery[i].src = v))} />
          <Field label="Keterangan" value={g.alt} onChange={(v) => set((p) => void (p.gallery[i].alt = v))} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field
              label="Kategori"
              value={g.category}
              onChange={(v) => set((p) => void (p.gallery[i].category = v))}
            />
            <Field
              label="Lebar (3/4)"
              type="number"
              value={String(g.width)}
              onChange={(v) => set((p) => void (p.gallery[i].width = Number(v) || 3))}
            />
            <Field
              label="Tinggi (4/3)"
              type="number"
              value={String(g.height)}
              onChange={(v) => set((p) => void (p.gallery[i].height = Number(v) || 4))}
            />
          </div>
        </ArrayItem>
      ))}
    </div>
  );
}

function TestimonialsTab({
  c,
  set,
}: {
  c: Content;
  set: SetC;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            set((p) =>
              void p.testimonials.push({
                name: "",
                service: "",
                rating: 5,
                quote: "",
              })
            )
          }
          className="inline-flex items-center gap-1 text-sm font-medium text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah testimoni
        </button>
      </div>
      {c.testimonials.map((t, i) => (
        <ArrayItem
          key={i}
          title={t.name || `Testimoni ${i + 1}`}
          onDelete={() => set((p) => void p.testimonials.splice(i, 1))}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Nama" value={t.name} onChange={(v) => set((p) => void (p.testimonials[i].name = v))} />
            <Field label="Layanan" value={t.service} onChange={(v) => set((p) => void (p.testimonials[i].service = v))} />
            <Field
              label="Rating (1-5)"
              type="number"
              min={1}
              max={5}
              value={String(t.rating)}
              onChange={(v) => set((p) => void (p.testimonials[i].rating = Math.min(5, Math.max(1, Number(v) || 5))))}
            />
          </div>
          <Field label="Testimoni" value={t.quote} textarea rows={4} onChange={(v) => set((p) => void (p.testimonials[i].quote = v))} />
        </ArrayItem>
      ))}
    </div>
  );
}

function FaqTab({
  c,
  set,
}: {
  c: Content;
  set: SetC;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            set((p) => void p.faqs.push({ question: "", answer: "" }))
          }
          className="inline-flex items-center gap-1 text-sm font-medium text-rosegold-700"
        >
          <Plus className="h-4 w-4" /> Tambah FAQ
        </button>
      </div>
      {c.faqs.map((f, i) => (
        <ArrayItem
          key={i}
          title={f.question || `FAQ ${i + 1}`}
          onDelete={() => set((p) => void p.faqs.splice(i, 1))}
        >
          <Field label="Pertanyaan" value={f.question} onChange={(v) => set((p) => void (p.faqs[i].question = v))} />
          <Field label="Jawaban" value={f.answer} textarea rows={4} onChange={(v) => set((p) => void (p.faqs[i].answer = v))} />
        </ArrayItem>
      ))}
    </div>
  );
}
