import { jsPDF } from "jspdf";
import autoTable, {
  type CellDef,
  type CellInput,
  type RowInput,
} from "jspdf-autotable";
import type {
  CalcResult,
  EyeInput,
  EyeResult,
  HybridLensOption,
  HybridPlan,
  LensResult,
  Unit,
} from "./types";
import { SHOW_BOC_HD } from "./constants";
import bocLogo from "@/assets/boc-logo.jpg";

export interface GenerateReportArgs {
  mode: "simple" | "detailed";
  unit: Unit;
  /** Match the /simple page: omit screening, dioptre, and Average K. */
  simple: boolean;
  /** Eye inputs with K values expressed in millimetres. */
  re: EyeInput;
  le: EyeInput;
  result: CalcResult;
}

const BLUE: [number, number, number] = [42, 81, 147];
const GOLD: [number, number, number] = [179, 138, 76];
const INK: [number, number, number] = [28, 35, 48];
const MUTED: [number, number, number] = [120, 130, 140];
const OK_BG: [number, number, number] = [233, 244, 238];
const OK_FG: [number, number, number] = [30, 125, 79];
const NO_BG: [number, number, number] = [250, 233, 231];
const NO_FG: [number, number, number] = [192, 57, 43];
const LINE: [number, number, number] = [227, 231, 237];

const MARGIN = 14;
const RIGHT = 196;

/** 2-decimal format with ASCII minus (PDF core fonts lack U+2212). */
const d2 = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n) ? "-" : n.toFixed(2);

const orDash = (s: string) => (s.trim() === "" ? "-" : s.trim());

/** Numeric input to 2 decimals (matches computed K formatting); dash if blank. */
const num2 = (s: string) => {
  const t = s.trim();
  if (t === "") return "-";
  const n = Number(t);
  return Number.isFinite(n) ? n.toFixed(2) : t;
};

/** Hybrid ortho-K target power, or "Not orderable" below the -1.00 D floor. */
const orthoKTp = (opt: HybridLensOption) =>
  opt.orderable ? d2(opt.targetPower) : "Not orderable";

/** Replace glyphs missing from the PDF core (WinAnsi) font set. */
const ascii = (s: string) =>
  s.replace(/−/g, "-").replace(/≥/g, ">=").replace(/≤/g, "<=");

/** Hybrid spectacle top-up; blank when the lens is not orderable. */
const hybridRx = (opt: HybridLensOption) =>
  opt.orderable ? ascii(opt.glassesRx) : "-";

const hasK = (eye: EyeInput) =>
  eye.flatK.trim() !== "" || eye.steepK.trim() !== "";

/** Blank out a computed eye column when that eye has no keratometry data. */
function gate(
  rows: RowInput[],
  reActive: boolean,
  leActive: boolean,
): RowInput[] {
  if (reActive && leActive) return rows;
  return rows.map((row) =>
    (row as CellInput[]).map((cell, i) => {
      if (i === 1 && !reActive) return "-";
      if (i === 2 && !leActive) return "-";
      return cell;
    }),
  );
}

function finalY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

/** Fetch an image and return it as a data URL, or null on failure. */
async function loadImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function sectionTitle(doc: jsPDF, text: string, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text(text.toUpperCase(), MARGIN, y);
}

function suitabilityCell(suitable: boolean): CellDef {
  return {
    content: suitable ? "Suitable" : "Not suitable",
    styles: {
      fillColor: suitable ? OK_BG : NO_BG,
      textColor: suitable ? OK_FG : NO_FG,
      fontStyle: "bold",
    },
  };
}

function eyeTable(
  doc: jsPDF,
  startY: number,
  headLabel: string,
  rows: RowInput[],
): number {
  autoTable(doc, {
    startY,
    margin: { left: MARGIN, right: MARGIN },
    theme: "grid",
    head: [[headLabel, "RE · OD", "LE · OS"]],
    body: rows,
    styles: {
      fontSize: 8,
      textColor: INK,
      cellPadding: 2,
      lineColor: LINE,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: BLUE,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [77, 86, 102], cellWidth: 64 },
      1: { halign: "center" },
      2: { halign: "center" },
    },
  });
  return finalY(doc);
}

function keratometryInputRows(
  re: EyeInput,
  le: EyeInput,
  result: CalcResult,
  reActive: boolean,
  leActive: boolean,
  simple: boolean,
): RowInput[] {
  const rows: RowInput[] = [
    ["Flat K (mm)", num2(re.flatK), num2(le.flatK)],
    ["Flat K Axis", orDash(re.flatAxis), orDash(le.flatAxis)],
    ["Steep K (mm)", num2(re.steepK), num2(le.steepK)],
    ["Steep K Axis", orDash(re.steepAxis), orDash(le.steepAxis)],
  ];
  // Average K mirrors the Fitting Curve Basis card — hidden on /simple.
  if (!simple) {
    rows.push([
      "Average K (mm)",
      reActive ? d2(result.re.avgKmm) : "-",
      leActive ? d2(result.le.avgKmm) : "-",
    ]);
  }
  rows.push(["Closest Diameter (mm)", re.diameter, le.diameter]);
  return rows;
}

function refractionInputRows(re: EyeInput, le: EyeInput): RowInput[] {
  return [
    ["Sphere (D)", orDash(re.sphere), orDash(le.sphere)],
    ["Cylinder (D)", orDash(re.cylinder), orDash(le.cylinder)],
    ["Refraction Axis", orDash(re.refAxis), orDash(le.refAxis)],
    ["Visual Acuity", orDash(re.va), orDash(le.va)],
  ];
}

function dioptreRows(result: CalcResult): RowInput[] {
  const r = result.re;
  const l = result.le;
  return [
    ["Flat K", d2(r.flatKd), d2(l.flatKd)],
    ["Steep K", d2(r.steepKd), d2(l.steepKd)],
    ["Cylinder", d2(r.cornealCyl), d2(l.cornealCyl)],
    ["Average K", d2(r.avgKd), d2(l.avgKd)],
  ];
}

function screeningRows(result: CalcResult): RowInput[] {
  const cell = (e: EyeResult): CellDef => ({
    content: e.screeningSuitable ? "Yes" : "No",
    styles: {
      fillColor: e.screeningSuitable ? OK_BG : NO_BG,
      textColor: e.screeningSuitable ? OK_FG : NO_FG,
      fontStyle: "bold",
    },
  });
  return [
    ["Screening value", d2(result.re.screeningValue), d2(result.le.screeningValue)],
    ["Suitability (>= 39.00)", cell(result.re), cell(result.le)],
  ];
}

function lensRows(
  re: LensResult,
  le: LensResult,
  toric: boolean,
): RowInput[] {
  const rows: RowInput[] = [
    ["Fitting Curve (D)", d2(re.ft), d2(le.ft)],
    ["Target Power (D)", d2(re.tp), d2(le.tp)],
  ];
  // Only the toric BOC TD lens has a cylinder; BOC STD / HD are spherical.
  if (toric) {
    rows.push([
      "Cylinder (D)",
      re.cylOutOfRange ? "Out of range" : d2(re.cyl),
      le.cylOutOfRange ? "Out of range" : d2(le.cyl),
    ]);
  }
  rows.push(
    ["Diameter (mm)", d2(re.diameter), d2(le.diameter)],
    ["Suitability", suitabilityCell(re.suitable), suitabilityCell(le.suitable)],
    ["Reason", ascii(re.reason), ascii(le.reason)],
  );
  return rows;
}

/** Per-eye one-line hybrid screening context. */
function hybridContext(eye: EyeResult, label: string): string | null {
  const h = eye.hybrid;
  if (!h) return null;
  return `${label}: screening ${d2(eye.screeningValue)} (${d2(h.screeningShortfall)} D below 39.00); residual myopia ${d2(h.residualSphere)} D.`;
}

function hybridStdRows(result: CalcResult): RowInput[] {
  const pick = (h: HybridPlan | null, get: (p: HybridPlan) => string) =>
    h ? get(h) : "-";
  const re = result.re.hybrid;
  const le = result.le.hybrid;
  return [
    [
      "Ortho-K target power (D)",
      pick(re, (h) => orthoKTp(h.std)),
      pick(le, (h) => orthoKTp(h.std)),
    ],
    [
      "Spectacle top-up",
      pick(re, (h) => hybridRx(h.std)),
      pick(le, (h) => hybridRx(h.std)),
    ],
    [
      "Assessment",
      pick(re, (h) => ascii(h.std.note)),
      pick(le, (h) => ascii(h.std.note)),
    ],
  ];
}

function hybridTdRows(result: CalcResult): RowInput[] {
  const pick = (h: HybridPlan | null, get: (p: HybridPlan) => string) =>
    h ? get(h) : "-";
  const re = result.re.hybrid;
  const le = result.le.hybrid;
  return [
    [
      "Ortho-K target power (D)",
      pick(re, (h) => (h.td ? orthoKTp(h.td) : "Not indicated")),
      pick(le, (h) => (h.td ? orthoKTp(h.td) : "Not indicated")),
    ],
    [
      "Toric lens cylinder (D)",
      pick(re, (h) => (h.td && h.td.orderable ? d2(h.td.fittedCyl) : "-")),
      pick(le, (h) => (h.td && h.td.orderable ? d2(h.td.fittedCyl) : "-")),
    ],
    [
      "Spectacle top-up",
      pick(re, (h) => (h.td ? hybridRx(h.td) : "-")),
      pick(le, (h) => (h.td ? hybridRx(h.td) : "-")),
    ],
    [
      "Assessment",
      pick(re, (h) => ascii(h.td ? h.td.note : (h.tdUnavailableNote ?? ""))),
      pick(le, (h) => ascii(h.td ? h.td.note : (h.tdUnavailableNote ?? ""))),
    ],
  ];
}

export async function generateReport({
  mode,
  simple,
  re,
  le,
  result,
}: GenerateReportArgs): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4");
  const detailed = mode === "detailed";
  const reActive = hasK(re);
  const leActive = hasK(le);

  // ---- Header ----------------------------------------------------------
  const logo = await loadImage(bocLogo.src);
  if (logo) doc.addImage(logo, "JPEG", MARGIN, 11, 34, 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BLUE);
  doc.text("SEED BOC Ortho-K Trial Lens Recommendation", RIGHT, 17, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`${detailed ? "Detailed report" : "Report"} · ${dateStr}`, RIGHT, 23, {
    align: "right",
  });
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, 31, RIGHT, 31);

  // ---- Keratometry input ----------------------------------------------
  let y = 39;
  sectionTitle(doc, "Keratometry", y);
  y =
    eyeTable(
      doc,
      y + 2.5,
      "Measurement",
      keratometryInputRows(re, le, result, reActive, leActive, simple),
    ) + 8;

  // ---- Refraction input -----------------------------------------------
  sectionTitle(doc, "Refraction", y);
  y = eyeTable(doc, y + 2.5, "Measurement", refractionInputRows(re, le)) + 8;

  // ---- Screening -------------------------------------------------------
  if (!simple) {
    sectionTitle(doc, "Shape of Cornea Effectiveness", y);
    y =
      eyeTable(
        doc,
        y + 2.5,
        "Screening",
        gate(screeningRows(result), reActive, leActive),
      ) + 8;
  }

  // ---- Keratometry in dioptre (detailed only) --------------------------
  if (detailed && !simple) {
    sectionTitle(doc, "Keratometry Information — Dioptre", y);
    y =
      eyeTable(
        doc,
        y + 2.5,
        "Fitting Curve (D)",
        gate(dioptreRows(result), reActive, leActive),
      ) + 8;
  }

  // ---- Trial lens results ---------------------------------------------
  sectionTitle(doc, "Trial Lens Results", y);
  y += 2.5;

  const lenses: {
    name: string;
    toric: boolean;
    re: LensResult;
    le: LensResult;
  }[] = [
    {
      name: "BOC STD — 1st Trial Lens",
      toric: false,
      re: result.re.std,
      le: result.le.std,
    },
  ];
  if (SHOW_BOC_HD) {
    lenses.push({
      name: "BOC HD — 1st Trial Lens",
      toric: false,
      re: result.re.hd,
      le: result.le.hd,
    });
  }
  if (!result.hideTd) {
    lenses.push({
      name: "BOC TD — 1st Trial Lens",
      toric: true,
      re: result.re.td,
      le: result.le.td,
    });
  }
  for (const lens of lenses) {
    y =
      eyeTable(
        doc,
        y,
        lens.name,
        gate(lensRows(lens.re, lens.le, lens.toric), reActive, leActive),
      ) + 6;
  }

  // ---- Fitting reference ----------------------------------------------
  // Shown once a BOC STD or BOC TD lens is fittable — see public/fitting-reference.jpg.
  const fittable = (e: EyeResult) => e.std.suitable || e.td.suitable;
  if (
    (reActive && fittable(result.re)) ||
    (leActive && fittable(result.le))
  ) {
    const fittingImg = await loadImage("/fitting-reference.jpg");
    if (fittingImg) {
      const imgW = 46;
      const props = doc.getImageProperties(fittingImg);
      const imgH = props.width > 0 ? (props.height / props.width) * imgW : imgW;
      if (y + imgH > 265) {
        doc.addPage();
        y = 20;
      }
      sectionTitle(doc, "Fitting Reference", y);
      y += 4;
      doc.addImage(fittingImg, "JPEG", MARGIN, y, imgW, imgH);
      const capX = MARGIN + imgW + 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...INK);
      const caption =
        "When the recommended 1st trial lens (BOC STD or BOC TD) is applied and assessed under fluorescein, a correct fit should resemble the image: the lens well-centred on the cornea, with a defined central treatment zone and an even mid-peripheral ring. Use it as the reference for an ideal initial fit.";
      const lines = doc.splitTextToSize(caption, RIGHT - capX);
      doc.text(lines, capX, y + 4);
      y += Math.max(imgH, lines.length * 3.8) + 8;
    }
  }

  // ---- Hybrid management ----------------------------------------------
  const reHybrid = reActive && result.re.hybrid !== null;
  const leHybrid = leActive && result.le.hybrid !== null;
  if (reHybrid || leHybrid) {
    if (y > 215) {
      doc.addPage();
      y = 20;
    }
    sectionTitle(doc, "Hybrid Myopia Management", y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    for (const ctx of [
      reHybrid ? hybridContext(result.re, "RE - OD") : null,
      leHybrid ? hybridContext(result.le, "LE - OS") : null,
    ]) {
      if (!ctx) continue;
      doc.text(doc.splitTextToSize(ctx, RIGHT - MARGIN), MARGIN, y);
      y += 4;
    }
    y += 1;
    y = eyeTable(doc, y, "BOC STD - Hybrid Plan", hybridStdRows(result)) + 5;
    y = eyeTable(doc, y, "BOC TD - Hybrid Plan", hybridTdRows(result)) + 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text("BEST TARGET POWER", MARGIN, y);
    y += 3.6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    const explainer =
      "The target power is the maximum the cornea can safely take - capped where the screening value reaches its 39.00 minimum (Screening = Flat K + Target Power). A deeper target power would over-flatten the cornea, risking high corneal pressure, SPK and poor lens wear. A large spectacle residual reflects a flat cornea, not a calculator limit - reducing it would need a steeper cornea, not a deeper target power.";
    const lines = doc.splitTextToSize(explainer, RIGHT - MARGIN);
    doc.text(lines, MARGIN, y);
    y += lines.length * 3.4 + 6;
  }

  // ---- Disclaimer ------------------------------------------------------
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("DISCLAIMER", MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const disclaimer = [
    "This calculator is not intended to determine final lens specifications; it does not account for topography images reflecting the actual eye condition before or after fitting BOC Ortho-K lenses.",
    "It is solely for selecting initial trial lenses. Further parameter adjustments are necessary if the initial trial lens is unsuitable after the fitting process.",
    "No data is stored, captured, or screenshotted. No information is saved on any server or location.",
  ];
  let dy = y + 4.5;
  disclaimer.forEach((text, i) => {
    const lines = doc.splitTextToSize(`${i + 1}.  ${text}`, RIGHT - MARGIN);
    doc.text(lines, MARGIN, dy);
    dy += lines.length * 3.6 + 1.5;
  });

  doc.save(
    simple
      ? "boc-report.pdf"
      : detailed
        ? "boc-detailed-report.pdf"
        : "boc-report.pdf",
  );
}
