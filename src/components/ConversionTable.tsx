import type { CalcResult, EyeResult } from "@/lib/types";
import { fmt, fmtAxis } from "@/lib/format";

const HEAD =
  "border border-tablehead bg-tablehead px-2.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white";
const CELL = "border border-line2 px-2.5 py-2 text-[12px] text-center";

export function ConversionTable({
  result,
  reActive,
  leActive,
}: {
  result: CalcResult;
  reActive: boolean;
  leActive: boolean;
}) {
  const rows: {
    label: string;
    value: (r: EyeResult) => string;
    danger?: boolean;
  }[] = [
    { label: "Flat K", value: (r) => fmt(r.flatKd) },
    { label: "Flat K Axis", value: (r) => fmtAxis(r.flatAxis) },
    { label: "Steep K", value: (r) => fmt(r.steepKd) },
    { label: "Steep K Axis", value: (r) => fmtAxis(r.steepAxis) },
    { label: "Cylinder", value: (r) => fmt(r.cornealCyl), danger: true },
    { label: "Average K", value: (r) => fmt(r.avgKd) },
  ];

  return (
    <div className="mt-3.5 overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hairline bg-tint px-[22px] py-[11px] font-display text-xs font-bold uppercase tracking-[0.1em] text-brand">
        <span className="h-[3px] w-4 rounded-sm bg-gold" />
        Keratometry Information — Dioptre
      </div>
      <div className="px-[22px] pb-[18px] pt-3.5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${HEAD} text-left text-[#dce5f3]`}>
                Fitting Curve (D)
              </th>
              <th className={HEAD}>RE · OD</th>
              <th className={HEAD}>LE · OS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className={`${CELL} text-left font-semibold text-ink2`}>
                  {row.label}
                </td>
                <td
                  className={`${CELL} font-mono font-semibold ${
                    reActive && row.danger ? "text-no" : "text-ink"
                  }`}
                >
                  {reActive ? row.value(result.re) : "—"}
                </td>
                <td
                  className={`${CELL} font-mono font-semibold ${
                    leActive && row.danger ? "text-no" : "text-ink"
                  }`}
                >
                  {leActive ? row.value(result.le) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
