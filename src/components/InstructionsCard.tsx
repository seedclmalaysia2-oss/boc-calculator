function StepNote({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-[11px] text-[13.5px] text-ink2">
      <span className="h-fit whitespace-nowrap rounded-[5px] bg-gold px-2 py-[3px] font-mono text-[10.5px] font-semibold tracking-[0.03em] text-white">
        {step}
      </span>
      <span>{children}</span>
    </div>
  );
}

export function InstructionsCard() {
  return (
    <section className="overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hairline bg-tint px-[22px] py-[11px] font-display text-xs font-bold uppercase tracking-[0.13em] text-brand">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="6.3" stroke="currentColor" strokeWidth="1.3" />
          <path d="M7 6v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="7" cy="3.7" r="1" fill="currentColor" />
        </svg>
        Instructions
      </div>
      <div className="print-2col grid gap-4 px-[22px] py-4 md:grid-cols-2">
        <StepNote step="STEP 1">
          Key in keratometry data — Flat K and Steep K in{" "}
          <strong className="font-bold text-ink">mm or dioptre</strong> — then
          select the closest diameter (based on 95% of HVID).
        </StepNote>
        <StepNote step="STEP 2">
          Key in the spectacle refraction data, then press{" "}
          <strong className="font-bold text-ink">Calculate</strong> to view
          recommended trial lenses.
        </StepNote>
      </div>
    </section>
  );
}
