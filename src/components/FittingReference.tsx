import Image from "next/image";
import { Rich, useT } from "@/lib/i18n";

/** Reference photo for one lens family. Files live in public/. */
const PHOTOS = {
  std: { src: "/fitting-reference.jpg", label: "BOC STD" },
  td: { src: "/fitting-reference-td.jpg", label: "BOC TD" },
} as const;

/**
 * Reference fluorescein image(s) showing how a correctly fitted 1st trial
 * lens should appear. A separate photo is shown per fittable lens family —
 * BOC STD (spherical) and/or BOC TD (toric).
 */
export function FittingReference({
  showStd,
  showTd,
}: {
  showStd: boolean;
  showTd: boolean;
}) {
  const T = useT();
  const photos = [
    showStd ? PHOTOS.std : null,
    showTd ? PHOTOS.td : null,
  ].filter((p): p is (typeof PHOTOS)[keyof typeof PHOTOS] => p !== null);

  if (photos.length === 0) return null;

  return (
    <section className="mt-3.5 overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hairline bg-tint px-[22px] py-[11px] font-display text-xs font-bold uppercase tracking-[0.1em] text-brand">
        <span aria-hidden className="h-[3px] w-4 rounded-sm bg-gold" />
        {T.fittingReferenceTitle}
      </div>
      <div className="grid items-center gap-4 px-[22px] py-4 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-wrap justify-center gap-3">
          {photos.map((p) => (
            <figure key={p.label} className="w-[150px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] border border-line bg-canvas">
                <Image
                  src={p.src}
                  alt={`Fluorescein pattern of a correctly fitted ${p.label} Ortho-K trial lens`}
                  fill
                  sizes="150px"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-1.5 text-center font-display text-[10px] font-bold uppercase tracking-[0.09em] text-brand">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-[12.5px] leading-relaxed text-ink2">
          <Rich
            segs={T.fittingReferenceCaption}
            bold="font-semibold text-ink"
          />
        </p>
      </div>
    </section>
  );
}
