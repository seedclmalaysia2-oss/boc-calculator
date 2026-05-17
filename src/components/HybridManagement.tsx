import type { CalcResult, HybridLensOption, HybridPlan } from "@/lib/types";
import { fmt } from "@/lib/format";
import { Rich, useT } from "@/lib/i18n";

const DASH = "—";

/** Per-eye screening context shown above the lens cards. */
function ContextStrip({
  reH,
  leH,
  reScreen,
  leScreen,
}: {
  reH: HybridPlan | null;
  leH: HybridPlan | null;
  reScreen: number;
  leScreen: number;
}) {
  const T = useT();
  const cell = (
    label: string,
    dot: string,
    h: HybridPlan | null,
    screen: number,
  ) => (
    <div className="px-3.5 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink3">
        <i className={`h-[7px] w-[7px] rounded-full ${dot}`} />
        {label}
      </div>
      {h ? (
        <p className="mt-1 text-[11.5px] text-ink2">
          {T.hybridCtxScreening}{" "}
          <span className="font-mono font-semibold text-no">
            {fmt(screen)}
          </span>
          {T.hybridCtxMid(fmt(h.screeningShortfall))}
          <span className="font-mono font-semibold text-ink">
            {fmt(h.residualSphere)} D
          </span>
          {T.hybridCtxEnd}
        </p>
      ) : (
        <p className="mt-1 text-[11.5px] text-ink3">{T.hybridNotLimited}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[10px] border border-line bg-surface sm:grid-cols-2 sm:divide-x sm:divide-line">
      {cell(T.reOd, "bg-brand", reH, reScreen)}
      {cell(T.leOs, "bg-gold", leH, leScreen)}
    </div>
  );
}

interface CardRow {
  label: string;
  re: string;
  le: string;
}

/** A hybrid lens card (BOC STD or BOC TD), styled like a trial-lens card. */
function HybridCard({
  name,
  subtitle,
  rows,
  reRx,
  leRx,
  notes,
}: {
  name: string;
  subtitle: string;
  rows: CardRow[];
  reRx: string;
  leRx: string;
  notes: React.ReactNode;
}) {
  const T = useT();
  return (
    <article className="overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="bg-[linear-gradient(120deg,#2a5193,#21437c)] px-4 py-3 text-white">
        <div className="font-display text-base font-bold">{name}</div>
        <small className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.13em] text-[#aebfdc]">
          {subtitle}
        </small>
      </div>

      <div className="px-[18px] pb-4 pt-1">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-line2 py-[9px]">
          <span aria-hidden />
          <span className="w-[74px] text-right text-[9.5px] font-bold tracking-[0.09em] text-ink3">
            {T.reOd}
          </span>
          <span className="w-[74px] text-right text-[9.5px] font-bold tracking-[0.09em] text-ink3">
            {T.leOs}
          </span>
        </div>

        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line2 py-[9px]"
          >
            <span className="text-[11.5px] font-bold text-ink2">
              {row.label}
            </span>
            <span className="w-[74px] text-right font-mono text-sm font-semibold text-brand">
              {row.re}
            </span>
            <span className="w-[74px] text-right font-mono text-sm font-semibold text-gold">
              {row.le}
            </span>
          </div>
        ))}

        <div className="mt-3 rounded-lg bg-gold-soft p-2.5">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.09em] text-ink3">
            {T.spectacleTopup}
          </div>
          <div className="flex items-center justify-between gap-2 py-[3px]">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink3">
              <i className="h-[6px] w-[6px] rounded-full bg-brand" />
              {T.reOd}
            </span>
            <span className="font-mono text-[13px] font-bold text-ink">
              {reRx}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 py-[3px]">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink3">
              <i className="h-[6px] w-[6px] rounded-full bg-gold" />
              {T.leOs}
            </span>
            <span className="font-mono text-[13px] font-bold text-ink">
              {leRx}
            </span>
          </div>
        </div>

        <div className="mt-2.5 space-y-1">{notes}</div>
      </div>
    </article>
  );
}

function NoteLine({
  eye,
  dot,
  text,
}: {
  eye?: string;
  dot?: string;
  text: string;
}) {
  return (
    <p className="flex gap-1.5 text-[11px] leading-snug text-ink3">
      {eye && (
        <span className="flex flex-none items-center gap-1 pt-px text-[9.5px] font-bold uppercase tracking-[0.07em] text-ink3">
          <i className={`h-[6px] w-[6px] rounded-full ${dot}`} />
          {eye}
        </span>
      )}
      <span>{text}</span>
    </p>
  );
}

/** Collapsible explainer: why the hybrid target power is capped. */
function TargetPowerExplainer() {
  const T = useT();
  return (
    <details className="group mt-3.5 overflow-hidden rounded-[13px] border border-line bg-surface">
      <summary className="flex cursor-pointer select-none list-none items-center gap-2.5 px-[22px] py-3 [&::-webkit-details-marker]:hidden">
        <svg
          className="flex-none text-brand"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden
        >
          <circle cx="7.5" cy="7.5" r="6.6" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M7.5 6.4v4.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="7.5" cy="4.2" r="1" fill="currentColor" />
        </svg>
        <span className="font-display text-[12.5px] font-bold uppercase tracking-[0.1em] text-brand">
          {T.understandingTargetPower}
        </span>
        <svg
          className="ml-auto flex-none text-ink3 transition-transform duration-200 group-open:rotate-180"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.5l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="space-y-3 border-t border-line2 px-[22px] py-4 text-[12px] leading-relaxed text-ink2">
        <p>
          <Rich segs={T.explainerP1} bold="font-semibold text-ink" />
        </p>
        <div className="rounded-lg border border-hairline bg-tint px-4 py-2.5 text-center font-mono text-[12.5px] font-semibold text-brand">
          {T.explainerFormula}
        </div>
        <p>
          <Rich segs={T.explainerP2} bold="font-semibold text-ink" />
        </p>
        <div>
          <h4 className="mb-1 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-gold">
            <span className="h-[2px] w-3 rounded-sm bg-gold" />
            {T.explainerWhyNotDeeper}
          </h4>
          <p>
            <Rich segs={T.explainerP3} bold="font-semibold text-ink" />
          </p>
        </div>
        <div>
          <h4 className="mb-1 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-gold">
            <span className="h-[2px] w-3 rounded-sm bg-gold" />
            {T.explainerWhyGlasses}
          </h4>
          <p>
            <Rich segs={T.explainerP4} bold="font-semibold text-ink" />
          </p>
        </div>
      </div>
    </details>
  );
}

export function HybridManagement({
  result,
  reActive,
  leActive,
}: {
  result: CalcResult;
  reActive: boolean;
  leActive: boolean;
}) {
  const T = useT();
  const reH = reActive ? result.re.hybrid : null;
  const leH = leActive ? result.le.hybrid : null;
  if (!reH && !leH) return null;

  const td = (s: string) => `${s} D`;
  /** Ortho-K target power, or "Not orderable" when below the −1.00 D floor. */
  const orthoKTp = (opt: HybridLensOption | null | undefined): string =>
    !opt ? DASH : opt.orderable ? td(fmt(opt.targetPower)) : T.notOrderable;
  /** Spectacle top-up Rx; blank when the lens is not orderable. */
  const hybridRx = (opt: HybridLensOption | null | undefined): string =>
    opt && opt.orderable ? opt.glassesRx : DASH;

  // ---- BOC STD card ----
  const stdRows: CardRow[] = [
    {
      label: T.orthoKTargetPower,
      re: reH ? orthoKTp(reH.std) : DASH,
      le: leH ? orthoKTp(leH.std) : DASH,
    },
  ];
  const stdNote = (reH ?? leH)?.std.note ?? "";

  // ---- BOC TD card ----
  const tdRows: CardRow[] = [
    {
      label: T.orthoKTargetPower,
      re: orthoKTp(reH?.td),
      le: orthoKTp(leH?.td),
    },
    {
      label: T.toricLensCylinder,
      re: reH?.td && reH.td.orderable ? td(fmt(reH.td.fittedCyl)) : DASH,
      le: leH?.td && leH.td.orderable ? td(fmt(leH.td.fittedCyl)) : DASH,
    },
  ];
  const tdNote = (h: HybridPlan | null) =>
    h ? (h.td ? h.td.note : h.tdUnavailableNote) : null;
  const reTdNote = tdNote(reH);
  const leTdNote = tdNote(leH);
  const oneEye = !(reH && leH);

  return (
    <section className="mt-8">
      <div className="mb-1.5 flex items-center gap-3.5">
        <h2 className="whitespace-nowrap font-display text-[15px] font-extrabold uppercase tracking-[0.1em] text-brand">
          {T.hybridTitle}
        </h2>
        <span className="h-0.5 flex-1 rounded-sm bg-hairline" />
      </div>
      <p className="mb-3.5 text-[12px] text-ink3">{T.hybridIntro}</p>

      <ContextStrip
        reH={reH}
        leH={leH}
        reScreen={result.re.screeningValue}
        leScreen={result.le.screeningValue}
      />

      <div className="print-2col mt-3.5 grid gap-3.5 md:grid-cols-2">
        <HybridCard
          name="BOC STD"
          subtitle={T.hybridPlanSpherical}
          rows={stdRows}
          reRx={hybridRx(reH?.std)}
          leRx={hybridRx(leH?.std)}
          notes={<NoteLine text={stdNote} />}
        />
        <HybridCard
          name="BOC TD"
          subtitle={T.hybridPlanToric}
          rows={tdRows}
          reRx={hybridRx(reH?.td)}
          leRx={hybridRx(leH?.td)}
          notes={
            <>
              {reTdNote && (
                <NoteLine
                  eye={oneEye ? undefined : T.reShort}
                  dot="bg-brand"
                  text={reTdNote}
                />
              )}
              {leTdNote && (
                <NoteLine
                  eye={oneEye ? undefined : T.leShort}
                  dot="bg-gold"
                  text={leTdNote}
                />
              )}
            </>
          }
        />
      </div>

      <TargetPowerExplainer />
    </section>
  );
}
