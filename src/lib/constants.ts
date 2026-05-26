import type { Diameter, EyeInput } from "./types";

/** Keratometer constant linking radius (mm) and power (D): D = 337.5 / mm. */
export const K_CONVERSION = 337.5;

/**
 * Whether BOC HD is shown. Hidden for now — BOC HD is not in use. The HD
 * calculation still runs; flip to `true` to surface it in the app and report.
 */
export const SHOW_BOC_HD: boolean = false;

export const DIAMETERS: Diameter[] = ["10.2", "10.6", "11.0"];
export const DEFAULT_DIAMETER: Diameter = "10.6";

/** Build a descending 0.25-step option list from `0.00` to `min` (inclusive). */
function negativeSteps(min: number): string[] {
  const out: string[] = [];
  for (let v = 0; v >= min - 1e-9; v -= 0.25) {
    out.push((v === 0 ? 0 : v).toFixed(2));
  }
  return out;
}

/** Spectacle sphere options: 0.00 down to -10.00. */
export const SPHERE_OPTIONS = negativeSteps(-10);

/** Spectacle cylinder options: 0.00 down to -6.00. */
export const CYLINDER_OPTIONS = negativeSteps(-6);

export const EMPTY_EYE: EyeInput = {
  flatK: "",
  flatAxis: "",
  steepK: "",
  steepAxis: "",
  diameter: DEFAULT_DIAMETER,
  hvid: "",
  eccentricity: "",
  sphere: "0.00",
  cylinder: "0.00",
  refAxis: "",
  va: "",
};

/** Eccentricity bucket (8–10 mm chord). Drives the STD/HD FC offset. */
export type ECategory = "high" | "normal";

/**
 * Classify an e-value into a fitting bucket. The "Low" bucket has been
 * retired — e-values below 0.45 (and blank / non-numeric inputs) return
 * `null`, leaving the fitting curve unadjusted.
 *
 *   e ≥ 0.60       → "high"
 *   0.45 ≤ e < 0.60 → "normal"
 *   anything else  → null
 */
export function eccentricityCategory(eValue: string): ECategory | null {
  const v = parseFloat(eValue);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v >= 0.6) return "high";
  if (v >= 0.45) return "normal";
  return null;
}

/** Fitting-curve offset (D) applied to Average K for STD/HD. */
export function eccentricityFcOffset(eValue: string): number {
  const cat = eccentricityCategory(eValue);
  if (cat === "high") return -0.25;
  return 0; // "normal" or null → no adjustment
}

/** Recommendation derived from an HVID measurement. */
export interface DiameterRecommendation {
  /** The diameter the dropdown is auto-set to. */
  auto: Diameter;
  /** Human-readable label — may list both options when either is acceptable. */
  label: string;
  /** The rule bucket / range that matched. */
  rule: "small" | "medium" | "large";
}

/**
 * Map an HVID measurement (mm) to a recommended Closest Diameter:
 *   HVID < 11.4       → 10.2  (covers the user's "<11.3" bucket)
 *   HVID 11.4 – 11.89 → 10.6
 *   HVID ≥ 11.9       → 11.0
 * Returns `null` when HVID is blank or non-numeric.
 *
 * Eccentricity does NOT influence the diameter — it only adjusts the
 * STD/HD fitting curve via `eccentricityFcOffset`.
 */
export function recommendedDiameter(hvid: string): DiameterRecommendation | null {
  const v = parseFloat(hvid);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v >= 11.9) return { auto: "11.0", label: "11.0", rule: "large" };
  if (v >= 11.4) return { auto: "10.6", label: "10.6", rule: "medium" };
  return { auto: "10.2", label: "10.2", rule: "small" };
}
