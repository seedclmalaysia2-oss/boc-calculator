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

/** Eccentricity bucket (8–10 mm chord). Drives FC ±0.50 D and diameter. */
export type ECategory = "high" | "normal" | "low";

/** Classify an e-value into one of the three fitting buckets. */
export function eccentricityCategory(eValue: string): ECategory | null {
  const v = parseFloat(eValue);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v >= 0.65) return "high";
  if (v >= 0.45) return "normal";
  return "low";
}

/** Fitting-curve offset (D) applied to Average K for STD/HD. */
export function eccentricityFcOffset(eValue: string): number {
  const cat = eccentricityCategory(eValue);
  if (cat === "high") return -0.25;
  if (cat === "low") return 0.25;
  return 0; // "normal" or null → no adjustment
}

/** Recommendation derived from an HVID measurement or eccentricity bucket. */
export interface DiameterRecommendation {
  /** The diameter the dropdown is auto-set to. */
  auto: Diameter;
  /** Human-readable label — may list both options when either is acceptable. */
  label: string;
  /** Which input drove the recommendation. */
  source: "hvid" | "eccentricity";
  /** The rule bucket / range that matched. */
  rule: "small" | "medium" | "large" | ECategory;
}

/**
 * Map an HVID measurement (mm) to a recommended Closest Diameter:
 *   HVID < 11.5      → 10.2 or 10.6  (defaults the dropdown to 10.6)
 *   HVID 11.5 – 12.0 → 10.6
 *   HVID > 12.0      → 11.0
 * Returns `null` when HVID is blank or non-numeric.
 */
export function recommendedDiameter(hvid: string): DiameterRecommendation | null {
  const v = parseFloat(hvid);
  if (!Number.isFinite(v) || v <= 0) return null;
  if (v > 12.0)
    return { auto: "11.0", label: "11.0", source: "hvid", rule: "large" };
  if (v >= 11.5)
    return { auto: "10.6", label: "10.6", source: "hvid", rule: "medium" };
  return { auto: "10.6", label: "10.2 or 10.6", source: "hvid", rule: "small" };
}

/**
 * Map eccentricity to a recommended Closest Diameter:
 *   e ≥ 0.65 (High)   → 10.2
 *   0.45 ≤ e (Normal) → 10.6
 *   e < 0.45 (Low)    → 11.0
 */
export function eccentricityDiameter(
  eValue: string,
): DiameterRecommendation | null {
  const cat = eccentricityCategory(eValue);
  if (!cat) return null;
  const auto: Diameter = cat === "high" ? "10.2" : cat === "normal" ? "10.6" : "11.0";
  return { auto, label: auto, source: "eccentricity", rule: cat };
}

/**
 * Resolve the diameter recommendation for an eye. Eccentricity takes
 * precedence over HVID because it is the more specific clinical signal —
 * when both are entered, the e-value bucket wins.
 */
export function resolveDiameterRecommendation(
  hvid: string,
  eccentricity: string,
): DiameterRecommendation | null {
  return eccentricityDiameter(eccentricity) ?? recommendedDiameter(hvid);
}
