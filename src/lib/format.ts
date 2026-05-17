import { K_CONVERSION } from "./constants";

const MINUS = "−"; // typographic minus sign

/** Format a number to 2 decimals using a typographic minus sign. */
export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return n.toFixed(2).replace("-", MINUS);
}

/** Format an axis / degree value without forcing decimals. */
export function fmtAxis(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return String(Math.round(n * 100) / 100).replace("-", MINUS);
}

/** Convert a corneal radius (mm) to keratometric power (D). */
export function mmToDioptre(mm: number): number {
  return mm > 0 ? K_CONVERSION / mm : 0;
}

/** Convert keratometric power (D) to corneal radius (mm). */
export function dioptreToMm(d: number): number {
  return d > 0 ? K_CONVERSION / d : 0;
}

/** Convert a K field between display units, keeping blanks blank. */
export function convertK(value: string, from: "mm" | "d", to: "mm" | "d"): string {
  if (value.trim() === "" || from === to) return value;
  const v = parseFloat(value);
  if (!Number.isFinite(v) || v <= 0) return value;
  const converted = to === "d" ? mmToDioptre(v) : dioptreToMm(v);
  return converted.toFixed(2);
}

/** Format a number with an explicit leading sign: "+0.50" / "−0.50". */
export function formatSigned(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  const body = Math.abs(n).toFixed(2);
  return n < 0 ? `−${body}` : `+${body}`;
}

/**
 * Build a spectacle prescription string. Sphere only → "−3.00 DS";
 * with cylinder → "−3.00 / −1.00 × 180" (cylinder shown with its sign).
 */
export function formatGlassesRx(
  sphere: number,
  cyl: number,
  axis: string,
): string {
  const s = fmt(sphere);
  if (!Number.isFinite(cyl) || Math.abs(cyl) < 1e-9) return `${s} DS`;
  const a = axis.trim();
  const c = formatSigned(cyl);
  return a ? `${s} / ${c} × ${a}` : `${s} / ${c}`;
}
