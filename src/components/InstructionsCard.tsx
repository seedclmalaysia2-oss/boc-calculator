import { Rich, useT, type Seg } from "@/lib/i18n";

function StepNote({ step, segs }: { step: string; segs: Seg[] }) {
  return (
    <div className="flex gap-[11px] text-[13.5px] text-ink2">
      <span className="h-fit whitespace-nowrap rounded-[5px] bg-gold px-2 py-[3px] font-mono text-[10.5px] font-semibold tracking-[0.03em] text-white">
        {step}
      </span>
      <span>
        <Rich segs={segs} bold="font-bold text-ink" />
      </span>
    </div>
  );
}

export function InstructionsCard() {
  const T = useT();
  return (
    <section className="overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hairline bg-tint px-[22px] py-[11px] font-display text-xs font-bold uppercase tracking-[0.13em] text-brand">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="6.3" stroke="currentColor" strokeWidth="1.3" />
          <path d="M7 6v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="7" cy="3.7" r="1" fill="currentColor" />
        </svg>
        {T.instructionsTitle}
      </div>
      <div className="print-2col grid gap-4 px-[22px] py-4 md:grid-cols-2">
        <StepNote step={T.step1Label} segs={T.step1} />
        <StepNote step={T.step2Label} segs={T.step2} />
      </div>
    </section>
  );
}
