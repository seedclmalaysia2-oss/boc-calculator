/**
 * BOC STD "Possible range of order" chart.
 *
 * Cross-references Fitting Curve (D) against the orderable Target Power (D)
 * window, both on a 0.25 D grid. Flat fitting curves (39.00–40.25) cap the
 * high-minus end of the target-power range; steep fitting curves (46.25–47.00)
 * cap the low-minus end. Mirrors the manufacturer order chart 1:1.
 */

/** Orderable target-power window for one fitting curve (negative dioptre). */
export interface TpRange {
  /** Most-minus orderable target power — numeric minimum, e.g. -8.00. */
  min: number;
  /** Least-minus orderable target power — numeric maximum, e.g. -1.00. */
  max: number;
}

/** Fitting-curve grid bounds (D); 0.25 D increments. */
export const STD_FIT_CURVE_MIN = 39.0;
export const STD_FIT_CURVE_MAX = 47.0;

/**
 * Orderable Target Power window keyed by Fitting Curve (D) as a fixed-2dp
 * string. A target power `tp` is orderable when `min <= tp <= max`.
 */
export const STD_TP_RANGE: Record<string, TpRange> = {
  "39.00": { min: -6.5, max: -1 },
  "39.25": { min: -6.75, max: -1 },
  "39.50": { min: -7, max: -1 },
  "39.75": { min: -7.25, max: -1 },
  "40.00": { min: -7.5, max: -1 },
  "40.25": { min: -7.75, max: -1 },
  "40.50": { min: -8, max: -1 },
  "40.75": { min: -8, max: -1 },
  "41.00": { min: -8, max: -1 },
  "41.25": { min: -8, max: -1 },
  "41.50": { min: -8, max: -1 },
  "41.75": { min: -8, max: -1 },
  "42.00": { min: -8, max: -1 },
  "42.25": { min: -8, max: -1 },
  "42.50": { min: -8, max: -1 },
  "42.75": { min: -8, max: -1 },
  "43.00": { min: -8, max: -1 },
  "43.25": { min: -8, max: -1 },
  "43.50": { min: -8, max: -1 },
  "43.75": { min: -8, max: -1 },
  "44.00": { min: -8, max: -1 },
  "44.25": { min: -8, max: -1 },
  "44.50": { min: -8, max: -1 },
  "44.75": { min: -8, max: -1 },
  "45.00": { min: -8, max: -1 },
  "45.25": { min: -8, max: -1 },
  "45.50": { min: -8, max: -1 },
  "45.75": { min: -8, max: -1 },
  "46.00": { min: -8, max: -1 },
  "46.25": { min: -8, max: -1.25 },
  "46.50": { min: -8, max: -1.5 },
  "46.75": { min: -8, max: -1.75 },
  "47.00": { min: -8, max: -2 },
};

/** Float tolerance for 0.25 D grid comparisons. */
const EPS = 1e-9;

/**
 * Orderable target-power window for a fitting curve (D), or `null` when the
 * fitting curve is off the 39.00–47.00 grid.
 */
export function stdTargetPowerRange(fitCurve: number): TpRange | null {
  return STD_TP_RANGE[fitCurve.toFixed(2)] ?? null;
}

/** True when target power `tp` is orderable at `fitCurve` per the STD chart. */
export function isStdOrderable(fitCurve: number, tp: number): boolean {
  const range = stdTargetPowerRange(fitCurve);
  if (!range) return false;
  return tp >= range.min - EPS && tp <= range.max + EPS;
}
