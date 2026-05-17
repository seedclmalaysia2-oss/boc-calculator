import type {
  CalcResult,
  EyeInput,
  EyeResult,
  HybridLensOption,
  HybridPlan,
  LensResult,
} from "./types";
import { formatGlassesRx, formatSigned } from "./format";
import { isStdOrderable, stdTargetPowerRange } from "./stdRange";

/** Keratometric index used to convert corneal radius to refractive power. */
const KERATOMETRIC_INDEX = 1.3375;
const N_MINUS_1 = KERATOMETRIC_INDEX - 1; // 0.3375

/** Round `value` to the nearest `multiple`. Mirrors the legacy `mRound`. */
export function mRound(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple;
}

function num(value: string | number): number {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/** Valid corneal cylinder window shared by BOC STD and BOC HD (dioptre). */
const CYL_MAX = -0.25;
const CYL_MIN = -0.75;
/** BOC TD accepts cylinder rounded to 0.5 within this set. */
const TD_CYL_SET = [-1.0, -1.5, -2.0, -2.5, -3.0];
/** Ortho-K target-power floor — STD and TD must be at least -1.00 D of minus. */
const ORTHOK_TP_MAX = -1.0;
/** Minimum screening value for ortho-K suitability. */
const MIN_SCREENING = 39;

const fmt = (n: number) => n.toFixed(2);

function computeEye(input: EyeInput): EyeResult {
  const flatKmm = num(input.flatK);
  const steepKmm = num(input.steepK);
  const flatAxis = num(input.flatAxis);
  const steepAxis = num(input.steepAxis);
  const diameter = num(input.diameter);
  const sphere = num(input.sphere);

  // Flat K (flatter meridian) must have the larger radius in mm.
  const valid = !(flatKmm < steepKmm);

  const avgKmm = (flatKmm + steepKmm) / 2;

  // Radius in metres. Legacy rounds the steep meridian to 4 decimals.
  const rFlat = flatKmm / 1000;
  const rSteep = parseFloat((steepKmm / 1000).toFixed(4));

  // Keratometry expressed in dioptre, rounded to 0.25 D.
  const flatKd = Number.isFinite(N_MINUS_1 / rFlat)
    ? mRound(N_MINUS_1 / rFlat, 0.25)
    : 0;
  const steepKd = Number.isFinite(N_MINUS_1 / rSteep)
    ? mRound(N_MINUS_1 / rSteep, 0.25)
    : 0;

  // Corneal cylinder: always expressed as a negative magnitude.
  const cylDiff = steepKd - flatKd;
  const cornealCyl = mRound(cylDiff >= 0 ? -cylDiff : cylDiff, 0.25);

  const avgKd = (flatKd + steepKd) / 2;

  // Target power shared by STD and HD before rounding.
  const tpRaw = flatKd - avgKd + sphere;

  const stdTp = parseFloat(fmt(mRound(tpRaw, 0.25)));
  const screeningValue = parseFloat(fmt(flatKd + tpRaw));
  const screeningSuitable = screeningValue >= MIN_SCREENING;

  const fitCurve = mRound(avgKd, 0.25);
  const cylInWindow = cornealCyl >= CYL_MIN && cornealCyl <= CYL_MAX;

  // ---- BOC STD ---------------------------------------------------------
  // Orderable when (fitting curve, target power) falls inside the STD
  // "Possible range of order" chart — see stdRange.ts.
  let stdSuitable = false;
  if (screeningSuitable) {
    stdSuitable = isStdOrderable(fitCurve, stdTp) && cylInWindow;
  }
  const std: LensResult = {
    ft: fitCurve,
    tp: stdTp,
    cyl: cornealCyl,
    cylOutOfRange: false,
    diameter,
    suitable: stdSuitable,
    reason: stdReason(screeningSuitable, screeningValue, fitCurve, stdTp, cylInWindow, stdSuitable),
  };

  // ---- BOC HD ----------------------------------------------------------
  let hdTp = parseFloat(fmt(mRound(tpRaw, 0.25)));
  // Spherical cornea: target power is pinned to -4.25.
  if (flatKd === steepKd) hdTp = -4.25;
  const hdInRange = hdTp <= -4.245 && hdTp >= -8.0;
  let hdSuitable = false;
  if (screeningSuitable) hdSuitable = hdInRange && cylInWindow;
  const hd: LensResult = {
    ft: fitCurve,
    tp: hdTp,
    cyl: cornealCyl,
    cylOutOfRange: false,
    diameter,
    suitable: hdSuitable,
    reason: hdReason(screeningSuitable, screeningValue, hdInRange, cylInWindow, hdSuitable),
  };

  // ---- BOC TD ----------------------------------------------------------
  const tdTp = parseFloat(fmt(mRound(sphere, 0.25)));
  const tdCyl = mRound(cornealCyl, 0.5);
  const tdCylValid = TD_CYL_SET.includes(tdCyl);
  // Target power must be at least -1.00 D of minus (TD order-range floor).
  const tdTpInRange = tdTp <= ORTHOK_TP_MAX + 1e-9;
  let tdSuitable = false;
  if (screeningSuitable) {
    // Legacy guard: `sphere > 8 && cyl > -3` (sphere is never positive here).
    if (sphere > 8.0 && tdCyl > -3.0) tdSuitable = false;
    else tdSuitable = tdCylValid && tdTpInRange;
  }
  const td: LensResult = {
    ft: mRound(flatKd, 0.25),
    tp: tdTp,
    cyl: tdCylValid ? tdCyl : null,
    cylOutOfRange: !tdCylValid,
    diameter,
    suitable: tdSuitable,
    reason: tdReason(
      screeningSuitable,
      screeningValue,
      tdCylValid,
      tdTpInRange,
      tdTp,
      tdSuitable,
    ),
  };

  // ---- Hybrid management ----------------------------------------------
  // Screening-limited eye: each lens is fitted to the maximum it can correct
  // (ortho-K sphere capped at screening = 39; BOC TD cylinder clamped to its
  // orderable range). Whatever is left over — residual sphere, and the
  // corneal cylinder the lens cannot take — is carried by the spectacle
  // top-up at the steep-K axis. No lens is rejected.
  let hybrid: HybridPlan | null = null;
  if (!screeningSuitable) {
    const correctableSphere = MIN_SCREENING - 2 * flatKd + avgKd;
    // Ortho-K cannot add plus power, so cap its share at plano.
    const orthoKSphere = Math.min(correctableSphere, 0);
    const residualSphere = mRound(sphere - orthoKSphere, 0.25);
    if (residualSphere < 0) {
      const axis = input.steepAxis.trim();
      // Full spectacle correction — used when a lens cannot be ordered.
      const fullSphere = mRound(sphere, 0.25);
      const notOrderableNote =
        "Cornea too flat to reach the −1.00 D minimum ortho-K power — lens not orderable; full correction by spectacles.";

      // BOC STD hybrid option.
      const stdTargetPower = mRound(flatKd - avgKd + orthoKSphere, 0.25);
      const stdOrderable = stdTargetPower <= ORTHOK_TP_MAX + 1e-9;
      const std: HybridLensOption = {
        targetPower: stdTargetPower,
        orderable: stdOrderable,
        fittedCyl: 0,
        clamped: false,
        glassesRx: formatGlassesRx(
          stdOrderable ? residualSphere : fullSphere,
          cornealCyl,
          axis,
        ),
        note: stdOrderable
          ? "Spherical lens — corrects sphere only; the full corneal cylinder is carried in the spectacle top-up."
          : notOrderableNote,
      };
      // BOC TD is a toric lens — only indicated when the cornea carries at
      // least its -1.00 D minimum cylinder. Below that, BOC STD only.
      let td: HybridLensOption | null = null;
      let tdUnavailableNote: string | null = null;
      if (cornealCyl <= -1 + 1e-9) {
        const tdRawCyl = mRound(cornealCyl, 0.5);
        // Clamp only the toric (deep) end; the lens is fitted to its maximum.
        const tdFittedCyl = Math.max(-3, tdRawCyl);
        const tdClamped = tdFittedCyl !== tdRawCyl;
        const tdResidualCyl = mRound(cornealCyl - tdFittedCyl, 0.25);
        const tdTargetPower = mRound(orthoKSphere, 0.25);
        const tdOrderable = tdTargetPower <= ORTHOK_TP_MAX + 1e-9;
        td = {
          targetPower: tdTargetPower,
          orderable: tdOrderable,
          fittedCyl: tdFittedCyl,
          clamped: tdClamped,
          glassesRx: tdOrderable
            ? formatGlassesRx(residualSphere, tdResidualCyl, axis)
            : formatGlassesRx(fullSphere, cornealCyl, axis),
          note: tdOrderable
            ? tdHybridNote(cornealCyl, tdFittedCyl, tdResidualCyl, tdClamped)
            : notOrderableNote,
        };
      } else {
        tdUnavailableNote = `Corneal cylinder ${formatSigned(cornealCyl)} D is below the BOC TD minimum (−1.00 D) — the cornea is too spherical for a toric lens; BOC STD only.`;
      }
      hybrid = {
        screeningShortfall: parseFloat(fmt(MIN_SCREENING - screeningValue)),
        residualSphere,
        std,
        td,
        tdUnavailableNote,
      };
    }
  }

  return {
    valid,
    avgKmm,
    flatKmm,
    flatKd,
    steepKd,
    cornealCyl,
    avgKd,
    flatAxis,
    steepAxis,
    screeningValue,
    screeningSuitable,
    std,
    hd,
    td,
    hybrid,
  };
}

function screeningMsg(value: number) {
  return `Screening value ${fmt(value)} is below 39.00.`;
}

/** Explain how BOC TD is fitted in the hybrid plan and what residual remains. */
function tdHybridNote(
  cornealCyl: number,
  fittedCyl: number,
  residualCyl: number,
  clamped: boolean,
): string {
  const fit = `Toric lens fitted at ${formatSigned(fittedCyl)} D cylinder`;
  if (Math.abs(residualCyl) < 1e-9)
    return `${fit} — corneal cylinder fully corrected.`;
  const residual = `${formatSigned(residualCyl)} D residual cylinder is carried in the spectacle top-up`;
  return clamped
    ? `Corneal cylinder ${formatSigned(cornealCyl)} D is beyond the BOC TD range; ${fit} and the ${residual}.`
    : `${fit}; the ${residual}.`;
}

function stdReason(
  screeningOk: boolean,
  screeningValue: number,
  fitCurve: number,
  tp: number,
  cylInWindow: boolean,
  suitable: boolean,
): string {
  if (suitable) return "All parameters within range.";
  if (!screeningOk) return screeningMsg(screeningValue);
  const range = stdTargetPowerRange(fitCurve);
  if (!range)
    return `Fitting curve ${fmt(fitCurve)} D is outside the STD range (39.00 to 47.00 D).`;
  if (tp < range.min - 1e-9 || tp > range.max + 1e-9)
    return `Target power ${fmt(tp)} D is outside the STD order range for a ${fmt(fitCurve)} D fitting curve (${fmt(range.max)} to ${fmt(range.min)} D).`;
  if (!cylInWindow)
    return "Corneal cylinder outside the STD range (−0.25 to −0.75 D).";
  return "Out of range.";
}

function hdReason(
  screeningOk: boolean,
  screeningValue: number,
  tpInRange: boolean,
  cylInWindow: boolean,
  suitable: boolean,
): string {
  if (suitable) return "All parameters within range.";
  if (!screeningOk) return screeningMsg(screeningValue);
  if (!tpInRange)
    return "Target power outside the HD range (−4.25 to −8.00 D).";
  if (!cylInWindow)
    return "Corneal cylinder outside the HD range (−0.25 to −0.75 D).";
  return "Out of range.";
}

function tdReason(
  screeningOk: boolean,
  screeningValue: number,
  cylValid: boolean,
  tpInRange: boolean,
  tp: number,
  suitable: boolean,
): string {
  if (suitable) return "All parameters within range.";
  if (!screeningOk) return screeningMsg(screeningValue);
  if (!tpInRange)
    return `Target power ${fmt(tp)} D is outside the TD range (−1.00 D or more minus).`;
  if (!cylValid)
    return "Cylinder outside the TD range (−1.00 to −3.00 D).";
  return "Out of range.";
}

/** Compute trial-lens recommendations for both eyes. */
export function compute(re: EyeInput, le: EyeInput): CalcResult {
  const reResult = computeEye(re);
  const leResult = computeEye(le);
  return {
    re: reResult,
    le: leResult,
    valid: reResult.valid && leResult.valid,
    // Legacy: the BOC TD section is hidden when RE STD target power is -4.00.
    hideTd: reResult.std.tp === -4.0,
  };
}
