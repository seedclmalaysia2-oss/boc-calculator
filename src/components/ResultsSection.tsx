import type { CalcResult } from "@/lib/types";
import { SHOW_BOC_HD } from "@/lib/constants";
import { LensResultCard } from "./LensResultCard";
import { FittingReference } from "./FittingReference";
import { HybridManagement } from "./HybridManagement";

export function ResultsSection({
  result,
  reActive,
  leActive,
  onDownload,
  onPrint,
}: {
  result: CalcResult;
  reActive: boolean;
  leActive: boolean;
  onDownload: () => void;
  onPrint: () => void;
}) {
  const cards: {
    name: string;
    toric: boolean;
    re: CalcResult["re"]["std"];
    le: CalcResult["le"]["std"];
  }[] = [
    { name: "BOC STD", toric: false, re: result.re.std, le: result.le.std },
  ];
  if (SHOW_BOC_HD) {
    cards.push({ name: "BOC HD", toric: false, re: result.re.hd, le: result.le.hd });
  }
  if (!result.hideTd) {
    cards.push({ name: "BOC TD", toric: true, re: result.re.td, le: result.le.td });
  }

  // The fitting reference applies once a BOC STD or BOC TD lens is fittable.
  const fitsStdOrTd = (eye: CalcResult["re"]) =>
    eye.std.suitable || eye.td.suitable;
  const showFittingReference =
    (reActive && fitsStdOrTd(result.re)) ||
    (leActive && fitsStdOrTd(result.le));

  return (
    <section className="mt-8">
      <div className="mb-3.5 flex items-center gap-3.5">
        <h2 className="whitespace-nowrap font-display text-[15px] font-extrabold uppercase tracking-[0.1em] text-brand">
          Trial Lens Results
        </h2>
        <span className="h-0.5 flex-1 rounded-sm bg-hairline" />
      </div>

      <div
        className={`print-2col grid gap-3.5 md:grid-cols-2 ${
          cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        {cards.map((c) => (
          <LensResultCard
            key={c.name}
            name={c.name}
            toric={c.toric}
            re={c.re}
            le={c.le}
            reActive={reActive}
            leActive={leActive}
          />
        ))}
      </div>

      {showFittingReference && <FittingReference />}

      <HybridManagement
        result={result}
        reActive={reActive}
        leActive={leActive}
      />

      <div className="mt-4 flex flex-wrap justify-end gap-2.5 print:hidden">
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-2 rounded-[9px] border border-hairline bg-surface px-[18px] py-[11px] text-[12.5px] font-bold text-brand transition-colors hover:bg-tint"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Page
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex items-center gap-2 rounded-[9px] border border-gold bg-gold px-[20px] py-[11px] text-[12.5px] font-bold text-white transition-colors hover:brightness-105"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M7 1v8M3.5 5.5L7 9l3.5-3.5M2 11.5h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download PDF
        </button>
      </div>
    </section>
  );
}
