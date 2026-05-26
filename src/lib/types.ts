export type Unit = "mm" | "d";
export type Eye = "re" | "le";
export type Diameter = "10.2" | "10.6" | "11.0";

/** Raw form state for a single eye. K values are stored canonically in mm. */
export interface EyeInput {
  flatK: string;
  flatAxis: string;
  steepK: string;
  steepAxis: string;
  diameter: Diameter;
  /** Horizontal visible iris diameter (mm). Drives the diameter recommendation. */
  hvid: string;
  /** Corneal eccentricity (e-value, 8–10 mm chord). Adjusts STD/HD fitting
   *  curve by ±0.25 D and (when present) overrides the HVID diameter rule. */
  eccentricity: string;
  sphere: string;
  cylinder: string;
  refAxis: string;
  va: string;
}

export interface LensResult {
  /** Fitting curve (D). */
  ft: number;
  /** Target power (D). */
  tp: number;
  /** Cylinder (D); null when out of range (BOC TD only). */
  cyl: number | null;
  cylOutOfRange: boolean;
  diameter: number;
  suitable: boolean;
  reason: string;
}

/**
 * A candidate ortho-K lens for the hybrid plan (BOC STD or BOC TD). The lens
 * is always fitted to the maximum it can correct; whatever falls outside its
 * range becomes the residual carried by the spectacle top-up.
 */
export interface HybridLensOption {
  /** Ortho-K reduced target power (D). */
  targetPower: number;
  /** False when the target power is weaker than the −1.00 D orderable floor. */
  orderable: boolean;
  /** Cylinder the lens is fitted at (D); 0 for the spherical BOC STD lens. */
  fittedCyl: number;
  /** True when the corneal cylinder was beyond the lens range and clamped. */
  clamped: boolean;
  /** Spectacle top-up Rx carrying the residual sphere and cylinder. */
  glassesRx: string;
  /** Explanation of how the lens is fitted. */
  note: string;
}

/**
 * Hybrid myopia management plan for a screening-limited eye: the ortho-K lens
 * corrects as much as the cornea allows, spectacles carry the residual. Both
 * the BOC STD (spherical) and BOC TD (toric) lenses are evaluated.
 */
export interface HybridPlan {
  /** How far the screening value falls below the 39.00 minimum (D). */
  screeningShortfall: number;
  /** Residual myopia carried by spectacles (D, negative). */
  residualSphere: number;
  /** BOC STD (spherical) hybrid option — always available. */
  std: HybridLensOption;
  /** BOC TD (toric) hybrid option; null when the cornea is too spherical. */
  td: HybridLensOption | null;
  /** Why BOC TD is not indicated; null when `td` is present. */
  tdUnavailableNote: string | null;
}

export interface EyeResult {
  /** Flat K (mm) is not less than Steep K (mm). */
  valid: boolean;
  /** Corneal radius (mm) — average meridian; basis for BOC STD / HD. */
  avgKmm: number;
  /** Corneal radius (mm) — flat meridian; basis for BOC TD. */
  flatKmm: number;
  /** Keratometry expressed in dioptre. */
  flatKd: number;
  steepKd: number;
  cornealCyl: number;
  avgKd: number;
  flatAxis: number;
  steepAxis: number;
  /** Screening value: Flat K (D) + STD target power. */
  screeningValue: number;
  screeningSuitable: boolean;
  std: LensResult;
  hd: LensResult;
  td: LensResult;
  /** Hybrid management plan; null unless screening falls below 39.00. */
  hybrid: HybridPlan | null;
}

export interface CalcResult {
  re: EyeResult;
  le: EyeResult;
  /** Both eyes pass the Flat K / Steep K validation. */
  valid: boolean;
  /** Legacy behaviour: hide the BOC TD section when RE STD target power is exactly -4.00. */
  hideTd: boolean;
}
