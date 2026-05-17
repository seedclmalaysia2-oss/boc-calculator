import type { CalcResult, Eye, EyeInput, Unit } from "@/lib/types";
import { DIAMETERS } from "@/lib/constants";
import { fmt } from "@/lib/format";
import { Panel } from "./Panel";
import { EyeColumnHeader, FieldRow, InputCell, SelectCell } from "./fields";

function UnitToggle({
  unit,
  onUnit,
  disabled = false,
}: {
  unit: Unit;
  onUnit: (u: Unit) => void;
  disabled?: boolean;
}) {
  const opt = (u: Unit, label: string) => (
    <button
      type="button"
      onClick={() => onUnit(u)}
      disabled={disabled}
      aria-pressed={unit === u}
      className={`rounded-[5px] px-3 py-[5px] font-mono text-[11px] tracking-[0.03em] transition-colors disabled:cursor-not-allowed ${
        unit === u
          ? "bg-brand font-semibold text-white"
          : "text-ink3 hover:text-ink2"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="ml-auto inline-flex gap-0.5 rounded-lg border border-hairline bg-surface p-[3px]">
      {opt("mm", "mm")}
      {opt("d", "Dioptre")}
    </div>
  );
}

/** Average-K reference value — shown once both meridians are entered. */
function avgKValue(eye: EyeInput, mm: number, d: number, unit: Unit): string {
  if (eye.flatK.trim() === "" && eye.steepK.trim() === "") return "—";
  return fmt(unit === "mm" ? mm : d);
}

/** Flat-K reference value — shown once the flat meridian is entered. */
function flatKValue(eye: EyeInput, mm: number, d: number, unit: Unit): string {
  if (eye.flatK.trim() === "") return "—";
  return fmt(unit === "mm" ? mm : d);
}

/**
 * True when an entered K value is physically impossible for the selected
 * unit. A corneal radius sits near 7–9 mm and corneal power near 38–48 D —
 * ranges that never overlap — so a value on the wrong side of 15 means the
 * unit toggle is set to the wrong unit.
 */
function looksLikeWrongUnit(eye: EyeInput, unit: Unit): boolean {
  const vals = [eye.flatK, eye.steepK]
    .map((v) => parseFloat(v))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (vals.length === 0) return false;
  return unit === "mm" ? vals.some((n) => n > 15) : vals.some((n) => n < 15);
}

/** One row of the fitting-curve basis card: a K value and the lenses it drives. */
function BasisRow({
  kLabel,
  lenses,
  re,
  le,
}: {
  kLabel: string;
  lenses: string;
  re: string;
  le: string;
}) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2.5 px-3 py-2 sm:grid-cols-[116px_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="leading-tight">
        <div className="text-[12.5px] font-bold text-ink">{kLabel}</div>
        <div className="mt-[3px] text-[9px] font-semibold uppercase tracking-[0.07em] text-ink3">
          {lenses}
        </div>
      </div>
      <span className="text-center font-mono text-[15px] font-semibold text-brand">
        {re}
      </span>
      <span className="text-center font-mono text-[15px] font-semibold text-brand">
        {le}
      </span>
    </div>
  );
}

export function KeratometryPanel({
  re,
  le,
  unit,
  result,
  locked,
  onField,
  onUnit,
  onAdoptUnit,
}: {
  re: EyeInput;
  le: EyeInput;
  unit: Unit;
  result: CalcResult;
  locked: boolean;
  onField: (eye: Eye, field: keyof EyeInput, value: string) => void;
  onUnit: (u: Unit) => void;
  onAdoptUnit: (u: Unit) => void;
}) {
  const eyes: { key: Eye; data: EyeInput }[] = [
    { key: "re", data: re },
    { key: "le", data: le },
  ];
  const invalidEye = (key: Eye) => !result[key].valid;

  const kCell = (key: Eye, field: "flatK" | "steepK", label: string) => (
    <InputCell
      ariaLabel={`${label} ${key === "re" ? "right eye" : "left eye"}`}
      value={eyes.find((e) => e.key === key)!.data[field]}
      tone={invalidEye(key) ? "invalid" : "default"}
      disabled={locked}
      onChange={(v) => onField(key, field, v)}
    />
  );

  const axisCell = (key: Eye, field: "flatAxis" | "steepAxis", label: string) => (
    <InputCell
      ariaLabel={`${label} ${key === "re" ? "right eye" : "left eye"}`}
      inputMode="numeric"
      value={eyes.find((e) => e.key === key)!.data[field]}
      disabled={locked}
      onChange={(v) => onField(key, field, v)}
    />
  );

  const unitMismatch =
    looksLikeWrongUnit(re, unit) || looksLikeWrongUnit(le, unit);
  const otherUnit: Unit = unit === "mm" ? "d" : "mm";
  const otherUnitLabel = unit === "mm" ? "Dioptre" : "mm";
  const currentUnitLabel = unit === "mm" ? "mm" : "Dioptre";

  return (
    <Panel
      step={1}
      title="Keratometry"
      headerRight={<UnitToggle unit={unit} onUnit={onUnit} disabled={locked} />}
    >
      <EyeColumnHeader />

      <FieldRow
        label="Flat K"
        re={kCell("re", "flatK", "Flat K")}
        le={kCell("le", "flatK", "Flat K")}
      />
      <FieldRow
        label="Flat K Axis"
        re={axisCell("re", "flatAxis", "Flat K axis")}
        le={axisCell("le", "flatAxis", "Flat K axis")}
      />
      <FieldRow
        label="Steep K"
        re={kCell("re", "steepK", "Steep K")}
        le={kCell("le", "steepK", "Steep K")}
      />
      <FieldRow
        label="Steep K Axis"
        re={axisCell("re", "steepAxis", "Steep K axis")}
        le={axisCell("le", "steepAxis", "Steep K axis")}
      />
      <FieldRow
        label="Closest Diameter"
        re={
          <SelectCell
            ariaLabel="Closest diameter right eye"
            value={re.diameter}
            options={DIAMETERS}
            disabled={locked}
            onChange={(v) => onField("re", "diameter", v)}
          />
        }
        le={
          <SelectCell
            ariaLabel="Closest diameter left eye"
            value={le.diameter}
            options={DIAMETERS}
            disabled={locked}
            onChange={(v) => onField("le", "diameter", v)}
          />
        }
      />

      <div className="mt-3.5 overflow-hidden rounded-[10px] border border-line bg-tint">
        <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-[7px]">
          <span aria-hidden className="h-[3px] w-3.5 rounded-sm bg-gold" />
          <h3 className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink3">
            Fitting Curve Basis
          </h3>
        </div>
        <div className="divide-y divide-hairline">
          <BasisRow
            kLabel="Average K"
            lenses="BOC STD"
            re={avgKValue(re, result.re.avgKmm, result.re.avgKd, unit)}
            le={avgKValue(le, result.le.avgKmm, result.le.avgKd, unit)}
          />
          <BasisRow
            kLabel="Flat K"
            lenses="BOC TD"
            re={flatKValue(re, result.re.flatKmm, result.re.flatKd, unit)}
            le={flatKValue(le, result.le.flatKmm, result.le.flatKd, unit)}
          />
        </div>
      </div>

      {unitMismatch ? (
        <div className="mt-3 rounded-lg border border-gold/40 bg-gold-soft px-3 py-2.5 text-center">
          <p className="text-[12px] font-semibold text-ink2">
            These readings look like{" "}
            <strong className="font-bold text-ink">{otherUnitLabel}</strong>{" "}
            values, but the unit is set to {currentUnitLabel}.
          </p>
          <button
            type="button"
            onClick={() => onAdoptUnit(otherUnit)}
            disabled={locked}
            className="mt-2 rounded-md bg-gold px-3 py-[5px] font-display text-[11px] font-bold text-white transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Switch to {otherUnitLabel} — keep these numbers
          </button>
        </div>
      ) : !result.valid ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-no-line bg-no-soft px-3 py-2 text-center text-[12px] font-semibold text-no"
        >
          Flat K must not be {unit === "mm" ? "less" : "greater"} than Steep K —
          please check the{" "}
          {!result.re.valid && !result.le.valid
            ? "right and left eye"
            : !result.re.valid
              ? "right eye"
              : "left eye"}{" "}
          entry.
        </p>
      ) : null}
    </Panel>
  );
}
