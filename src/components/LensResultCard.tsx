import type { LensResult } from "@/lib/types";
import { fmt } from "@/lib/format";

const DASH = "—";

function cylText(lens: LensResult): string {
  return lens.cylOutOfRange ? "Out of range" : fmt(lens.cyl);
}

function ValueRow({
  code,
  name,
  re,
  le,
  reBad,
  leBad,
}: {
  code: string;
  name: string;
  re: string;
  le: string;
  reBad?: boolean;
  leBad?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line2 py-[9px] last:border-b-0">
      <span className="text-[11.5px] font-bold text-ink2">
        {code} <span className="font-medium text-ink3">{name}</span>
      </span>
      <span
        className={`w-[62px] text-right font-mono text-sm font-semibold ${
          reBad ? "text-no" : "text-brand"
        }`}
      >
        {re}
      </span>
      <span
        className={`w-[62px] text-right font-mono text-sm font-semibold ${
          leBad ? "text-no" : "text-gold"
        }`}
      >
        {le}
      </span>
    </div>
  );
}

function SuitabilityRow({
  eye,
  dotClass,
  active,
  lens,
}: {
  eye: string;
  dotClass: string;
  active: boolean;
  lens: LensResult;
}) {
  const tone = !active
    ? "bg-line2 text-ink3"
    : lens.suitable
      ? "bg-ok-soft text-ok"
      : "bg-no-soft text-no";
  const dot = !active ? "bg-ink3" : lens.suitable ? "bg-ok" : "bg-no";
  const label = !active ? "Not entered" : lens.suitable ? "Suitable" : "Not Suitable";
  const reason = active ? lens.reason : "No data entered for this eye.";
  return (
    <div className="flex items-start gap-2.5 py-2">
      <span className="flex w-[52px] flex-none items-center gap-1.5 pt-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink3">
        <i className={`h-[7px] w-[7px] rounded-full ${dotClass}`} />
        {eye}
      </span>
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[10px] font-extrabold uppercase tracking-[0.05em] ${tone}`}
        >
          <i className={`h-[6px] w-[6px] rounded-full ${dot}`} />
          {label}
        </span>
        <p className="mt-1 text-[11px] leading-snug text-ink3">{reason}</p>
      </div>
    </div>
  );
}

export function LensResultCard({
  name,
  toric,
  re,
  le,
  reActive,
  leActive,
}: {
  name: string;
  /** True only for the toric BOC TD lens; STD / HD are spherical (no cylinder). */
  toric: boolean;
  re: LensResult;
  le: LensResult;
  reActive: boolean;
  leActive: boolean;
}) {
  const reVal = (s: string) => (reActive ? s : DASH);
  const leVal = (s: string) => (leActive ? s : DASH);
  const headDot = (active: boolean, suitable: boolean) =>
    !active ? "bg-line" : suitable ? "bg-ok-line" : "bg-no-line";

  return (
    <article className="overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-2.5 bg-[linear-gradient(120deg,#2a5193,#21437c)] px-4 py-3 text-white">
        <div className="font-display text-base font-bold">
          {name}
          <small className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.13em] text-[#aebfdc]">
            1st Trial Lens
          </small>
        </div>
        <div className="flex gap-1.5">
          <i className={`h-2.5 w-2.5 rounded-full ${headDot(reActive, re.suitable)}`} />
          <i className={`h-2.5 w-2.5 rounded-full ${headDot(leActive, le.suitable)}`} />
        </div>
      </div>

      <div className="px-[18px] pb-4 pt-1">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-line2 py-[9px]">
          <span aria-hidden />
          <span className="w-[62px] text-right text-[9.5px] font-bold tracking-[0.09em] text-ink3">
            RE
          </span>
          <span className="w-[62px] text-right text-[9.5px] font-bold tracking-[0.09em] text-ink3">
            LE
          </span>
        </div>
        <ValueRow
          code="FT"
          name="Fitting Curve"
          re={reVal(fmt(re.ft))}
          le={leVal(fmt(le.ft))}
        />
        <ValueRow
          code="TP"
          name="Target Power"
          re={reVal(fmt(re.tp))}
          le={leVal(fmt(le.tp))}
        />
        {toric && (
          <ValueRow
            code="CYL"
            name="Cylinder"
            re={reVal(cylText(re))}
            le={leVal(cylText(le))}
            reBad={reActive && re.cylOutOfRange}
            leBad={leActive && le.cylOutOfRange}
          />
        )}
        <ValueRow
          code="DIA"
          name="Diameter"
          re={reVal(fmt(re.diameter))}
          le={leVal(fmt(le.diameter))}
        />

        <div className="mt-1.5 border-t border-line2 pt-1">
          <SuitabilityRow eye="RE·OD" dotClass="bg-brand" active={reActive} lens={re} />
          <SuitabilityRow eye="LE·OS" dotClass="bg-gold" active={leActive} lens={le} />
        </div>
      </div>
    </article>
  );
}
