import { useT } from "@/lib/i18n";

export function Disclaimer() {
  const T = useT();
  return (
    <section className="mt-6 rounded-[13px] border border-line bg-surface px-[22px] py-[18px]">
      <h3 className="mb-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink3">
        {T.disclaimerTitle}
      </h3>
      <ol className="space-y-1.5">
        {T.disclaimerItems.map((text, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[11.5px] leading-relaxed text-ink3"
          >
            <span className="grid h-[15px] w-[15px] flex-none place-items-center rounded bg-brand font-mono text-[10px] font-semibold text-white">
              {i + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
