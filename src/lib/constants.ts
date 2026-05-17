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
  sphere: "0.00",
  cylinder: "0.00",
  refAxis: "",
  va: "",
};
