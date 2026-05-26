"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Eye, EyeInput, Unit } from "@/lib/types";
import { EMPTY_EYE, recommendedDiameter } from "@/lib/constants";
import { compute } from "@/lib/calculator";
import { convertK } from "@/lib/format";
import { LangProvider, formatDate, useLang, useT, type Lang } from "@/lib/i18n";
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

export function Calculator({
  simple = false,
  lang = "en",
  switcher = false,
}: {
  simple?: boolean;
  lang?: Lang;
  /** Show an in-header EN/VN/ID language switcher; `lang` is the start value. */
  switcher?: boolean;
}) {
  const [activeLang, setActiveLang] = useState<Lang>(lang);
  return (
    <LangProvider lang={switcher ? activeLang : lang}>
      <CalculatorBody
        simple={simple}
        langControl={
          switcher ? { lang: activeLang, setLang: setActiveLang } : null
        }
      />
    </LangProvider>
  );
}

function CalculatorBody({
  simple,
  langControl,
}: {
  simple: boolean;
  langControl: { lang: Lang; setLang: (l: Lang) => void } | null;
}) {
  const lang = useLang();
  const T = useT();
  const [re, setRe] = useState<EyeInput>(EMPTY_EYE);
  const [le, setLe] = useState<EyeInput>(EMPTY_EYE);
  const [unit, setUnit] = useState<Unit>("d");
  const [hasCalculated, setHasCalculated] = useState(false);
  const reportDate = formatDate(lang);
  const mainRef = useRef<HTMLElement>(null);

  const result = useMemo(
    () => compute(eyeInMm(re, unit), eyeInMm(le, unit), lang),
    [re, le, unit, lang],
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

  /**
   * Update HVID and, when it parses cleanly, snap Closest Diameter to the
   * HVID rule. The dropdown stays manually overridable.
   */
  function onHvid(eye: Eye, value: string) {
    setEye(eye, (prev) => {
      const rec = recommendedDiameter(value);
      return rec
        ? { ...prev, hvid: value, diameter: rec.auto }
        : { ...prev, hvid: value };
    });
  }

  /** Eccentricity only affects the STD/HD fitting curve (see calculator.ts);
   *  it no longer changes the diameter. */
  function onEccentricity(eye: Eye, value: string) {
    setEye(eye, (prev) => ({ ...prev, eccentricity: value }));
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
      simple,
      lang,
      re: eyeInMm(re, unit),
      le: eyeInMm(le, unit),
      result,
    });
  }

  /** Print the on-screen report — scaling happens in the effect below. */
  function onPrint() {
    window.print();
  }

  /*
   * Scale the printout to fill the page width and fit within two A4
   * pages. Right before printing we measure the report off-screen at
   * its natural layout width (responsive grids collapsed, non-printing
   * controls hidden, collapsible explainers expanded), then set a
   * `zoom` factor: it shrinks the report so its width matches the A4
   * printable width — using the whole page, not a narrow strip — and
   * never spills past two pages. Covers the Print button and Ctrl/Cmd+P.
   */
  useEffect(() => {
    // A4 @ 96dpi, 12mm page margins → 703px wide, 1032px tall printable.
    const PAGE_WIDTH = 703;
    const TWO_PAGES = 2064;
    const SAFETY = 60;
    // The report's natural layout width — must match `.print-fit` in
    // globals.css. The report lays out this wide, then zooms down to
    // the page width so it prints full-width.
    const LAYOUT_WIDTH = 1090;

    function beforePrint() {
      const main = mainRef.current;
      if (!main) return;

      const clone = main.cloneNode(true) as HTMLElement;
      clone.classList.add("print-fit");
      clone
        .querySelectorAll('[class~="print:hidden"]')
        .forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      clone.querySelectorAll("details").forEach((d) => {
        d.open = true;
      });
      Object.assign(clone.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        visibility: "hidden",
      });
      document.body.appendChild(clone);
      const height = clone.getBoundingClientRect().height;
      document.body.removeChild(clone);

      const zoom = Math.min(
        PAGE_WIDTH / LAYOUT_WIDTH,
        (TWO_PAGES - SAFETY) / height,
      );
      main.style.setProperty("--print-zoom", String(zoom));
      main.classList.add("print-fit");
    }

    function afterPrint() {
      const main = mainRef.current;
      if (!main) return;
      main.classList.remove("print-fit");
      main.style.removeProperty("--print-zoom");
    }

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className="mx-auto max-w-[1090px] px-4 py-7 sm:px-5 sm:py-[30px]"
    >
      <Header dateLabel={reportDate} langControl={langControl} />

      <div className="mt-[15px]">
        <InstructionsCard />
      </div>

      <div className="print-2col mt-[15px] grid gap-[15px] md:grid-cols-2">
        <KeratometryPanel
          re={re}
          le={le}
          unit={unit}
          result={result}
          locked={hasCalculated}
          simple={simple}
          onField={onField}
          onHvid={onHvid}
          onEccentricity={onEccentricity}
          onUnit={onUnit}
          onAdoptUnit={onAdoptUnit}
        />
        <RefractionPanel
          re={re}
          le={le}
          result={result}
          reActive={reActive}
          leActive={leActive}
          locked={hasCalculated}
          simple={simple}
          onField={onField}
        />
      </div>

      <div className="my-[22px] flex flex-col items-center gap-2 print:hidden">
        {hasCalculated ? (
          <>
            <button
              type="button"
              onClick={() => setHasCalculated(false)}
              className="flex items-center gap-2.5 rounded-[10px] border border-brand bg-surface px-12 py-[13px] font-display text-[15px] font-bold tracking-[0.01em] text-brand transition-colors hover:bg-tint"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              {T.amendInputs}
            </button>
            <p className="text-[11.5px] text-ink3">{T.inputsLocked}</p>
          </>
        ) : (
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
            {T.calculate}
          </button>
        )}
      </div>

      {hasCalculated && (
        <>
          {!simple && (
            <ConversionTable
              result={result}
              reActive={reActive}
              leActive={leActive}
            />
          )}
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
