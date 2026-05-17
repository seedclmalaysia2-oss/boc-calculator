"use client";

import { useMemo, useState } from "react";
import type { Eye, EyeInput, Unit } from "@/lib/types";
import { EMPTY_EYE } from "@/lib/constants";
import { compute } from "@/lib/calculator";
import { convertK } from "@/lib/format";

/** Date the report is generated. Differs server/client — see suppressHydrationWarning. */
function formatToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
import { Header } from "./Header";
import { InstructionsCard } from "./InstructionsCard";
import { KeratometryPanel } from "./KeratometryPanel";
import { RefractionPanel } from "./RefractionPanel";
import { ConversionTable } from "./ConversionTable";
import { ResultsSection } from "./ResultsSection";
import { Disclaimer } from "./Disclaimer";

/** Express an eye's K values in millimetres for the calculation engine. */
function eyeInMm(eye: EyeInput, unit: Unit): EyeInput {
  if (unit === "mm") return eye;
  return {
    ...eye,
    flatK: convertK(eye.flatK, "d", "mm"),
    steepK: convertK(eye.steepK, "d", "mm"),
  };
}

/** An eye is in use once it has at least one K value entered. */
const hasAnyK = (eye: EyeInput) =>
  eye.flatK.trim() !== "" || eye.steepK.trim() !== "";

/** An eye is ready to calculate once both K meridians are entered. */
const hasBothK = (eye: EyeInput) =>
  eye.flatK.trim() !== "" && eye.steepK.trim() !== "";

export function Calculator() {
  const [re, setRe] = useState<EyeInput>(EMPTY_EYE);
  const [le, setLe] = useState<EyeInput>(EMPTY_EYE);
  const [unit, setUnit] = useState<Unit>("mm");
  const [hasCalculated, setHasCalculated] = useState(false);
  const reportDate = formatToday();

  const result = useMemo(
    () => compute(eyeInMm(re, unit), eyeInMm(le, unit)),
    [re, le, unit],
  );

  const reActive = hasBothK(re);
  const leActive = hasBothK(le);
  // Block calculation while an eye is half-entered (one K meridian missing).
  const partialEye =
    (hasAnyK(re) && !reActive) || (hasAnyK(le) && !leActive);
  const canCalculate =
    result.valid && (reActive || leActive) && !partialEye;

  function setEye(eye: Eye, updater: (prev: EyeInput) => EyeInput) {
    (eye === "re" ? setRe : setLe)(updater);
  }

  function onField(eye: Eye, field: keyof EyeInput, value: string) {
    setEye(eye, (prev) => ({ ...prev, [field]: value }));
  }

  function onUnit(next: Unit) {
    if (next === unit) return;
    const convertEye = (eye: EyeInput): EyeInput => ({
      ...eye,
      flatK: convertK(eye.flatK, unit, next),
      steepK: convertK(eye.steepK, unit, next),
    });
    setRe(convertEye);
    setLe(convertEye);
    setUnit(next);
  }

  /** Adopt a unit without converting — the values were already entered in it. */
  function onAdoptUnit(next: Unit) {
    setUnit(next);
  }

  /** Download a compact, brand-styled PDF report (≈2 A4 pages). */
  async function onDownload() {
    const { generateReport } = await import("@/lib/pdf");
    await generateReport({
      mode: "detailed",
      unit,
      re: eyeInMm(re, unit),
      le: eyeInMm(le, unit),
      result,
    });
  }

  /** Print the on-screen page (buttons are hidden via the print stylesheet). */
  function onPrint() {
    window.print();
  }

  return (
    <main className="mx-auto max-w-[1090px] px-4 py-7 sm:px-5 sm:py-[30px]">
      <Header dateLabel={reportDate} />

      <div className="mt-[15px]">
        <InstructionsCard />
      </div>

      <div className="mt-[15px] grid gap-[15px] md:grid-cols-2">
        <KeratometryPanel
          re={re}
          le={le}
          unit={unit}
          result={result}
          onField={onField}
          onUnit={onUnit}
          onAdoptUnit={onAdoptUnit}
        />
        <RefractionPanel
          re={re}
          le={le}
          result={result}
          reActive={reActive}
          leActive={leActive}
          onField={onField}
        />
      </div>

      <div className="my-[22px] flex justify-center print:hidden">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          disabled={!canCalculate}
          className="flex items-center gap-[11px] rounded-[10px] bg-[linear-gradient(180deg,#2f5aa0,#244784)] px-14 py-[15px] font-display text-[15px] font-bold tracking-[0.01em] text-white shadow-[0_8px_20px_-7px_rgba(31,61,112,0.6)] transition-[filter,opacity] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            aria-hidden
            className="h-3.5 w-3.5 rounded-full border-2 border-gold border-r-transparent"
          />
          Calculate
        </button>
      </div>

      {hasCalculated && (
        <>
          <ConversionTable
            result={result}
            reActive={reActive}
            leActive={leActive}
          />
          <ResultsSection
            result={result}
            reActive={reActive}
            leActive={leActive}
            onDownload={onDownload}
            onPrint={onPrint}
          />
        </>
      )}

      <Disclaimer />
    </main>
  );
}
