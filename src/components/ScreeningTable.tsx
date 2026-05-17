import type { CalcResult, EyeResult } from "@/lib/types";
import { fmt } from "@/lib/format";
import { useT } from "@/lib/i18n";

function Tag({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full border px-[9px] py-[3px] text-[10px] font-bold tracking-[0.03em] ${
        ok
          ? "border-ok-line bg-ok-soft text-ok"
          : "border-no-line bg-no-soft text-no"
      }`}
    >
      {children}
    </span>
  );
}

const HEAD =
  "border border-tablehead bg-tablehead px-2.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-white";
const CELL = "border border-line2 px-2.5 py-2 text-[12px]";

function EyeCells({
  active,
  result,
  render,
}: {
  active: boolean;
  result: EyeResult;
  render: (r: EyeResult) => React.ReactNode;
}) {
  return (
    <td className={`${CELL} text-center`}>{active ? render(result) : "—"}</td>
  );
}

export function ScreeningTable({
  result,
  reActive,
  leActive,
}: {
  result: CalcResult;
  reActive: boolean;
  leActive: boolean;
}) {
  const T = useT();
  const rows: {
    label: string;
    render: (r: EyeResult) => React.ReactNode;
  }[] = [
    {
      label: T.screeningRow,
      render: (r) => (
        <span className="font-mono font-semibold">{fmt(r.screeningValue)}</span>
      ),
    },
    {
      label: T.suitability,
      render: (r) => (
        <Tag ok={r.screeningSuitable}>
          {r.screeningSuitable ? T.yes : T.no}
        </Tag>
      ),
    },
    {
      label: T.reason,
      render: (r) => (
        <Tag ok={r.screeningSuitable}>
          {r.screeningSuitable ? "≥ 39.00" : "< 39.00"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="mt-[18px]">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-ink2">
        <span className="h-[3px] w-3.5 rounded-sm bg-gold" />
        {T.screeningTableTitle}
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={`${HEAD} text-left text-[#dce5f3]`}>
              {T.screeningHead}
            </th>
            <th className={`${HEAD} whitespace-nowrap`}>{T.reOd}</th>
            <th className={`${HEAD} whitespace-nowrap`}>{T.leOs}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className={`${CELL} text-left font-semibold text-ink2`}>
                {row.label}
              </td>
              <EyeCells active={reActive} result={result.re} render={row.render} />
              <EyeCells active={leActive} result={result.le} render={row.render} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
