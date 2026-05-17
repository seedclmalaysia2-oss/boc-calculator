import Image from "next/image";

/**
 * Reference fluorescein image showing how a correctly fitted 1st trial lens
 * (BOC STD or BOC TD) should appear. The photo file lives at
 * public/fitting-reference.jpg.
 */
export function FittingReference() {
  return (
    <section className="mt-3.5 overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hairline bg-tint px-[22px] py-[11px] font-display text-xs font-bold uppercase tracking-[0.1em] text-brand">
        <span aria-hidden className="h-[3px] w-4 rounded-sm bg-gold" />
        Fitting Reference
      </div>
      <div className="grid items-center gap-4 px-[22px] py-4 sm:grid-cols-[190px_1fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[190px] overflow-hidden rounded-[10px] border border-line bg-canvas">
          <Image
            src="/fitting-reference.jpg"
            alt="Fluorescein pattern of a correctly fitted BOC Ortho-K trial lens"
            fill
            sizes="190px"
            className="object-contain"
          />
        </div>
        <p className="text-[12.5px] leading-relaxed text-ink2">
          When the recommended{" "}
          <strong className="font-semibold text-ink">1st trial lens</strong> —
          BOC STD or BOC TD — is applied and assessed under fluorescein, a
          correct fit should resemble the pattern shown: the lens well-centred
          on the cornea, with a defined central treatment zone and an even
          mid-peripheral ring. Use this image as the reference for an ideal
          initial fit.
        </p>
      </div>
    </section>
  );
}
