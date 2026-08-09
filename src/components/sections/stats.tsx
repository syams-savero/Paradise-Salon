import { stats } from "@/data/content";
import { Reveal } from "@/components/motion";

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span className="font-serif text-4xl font-medium text-ink md:text-5xl">
              {s.value}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft">
              {s.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
