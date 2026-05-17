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
import { STRINGS, formatDate, type Dict, type Lang } from "./i18n";
import bocLogo from "@/assets/boc-logo.jpg";

export interface GenerateReportArgs {
  mode: "simple" | "detailed";
  unit: Unit;
  /** Match the /simple page: omit screening, dioptre, and Average K. */
  simple: boolean;
  /** Report language — Vietnamese embeds a Unicode-capable font. */
  lang: Lang;
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
const orthoKTp = (opt: HybridLensOption, P: Dict) =>
  opt.orderable ? d2(opt.targetPower) : P.notOrderable;

/** Replace glyphs missing from the PDF core (WinAnsi) font set. */
const ascii = (s: string) =>
  s.replace(/−/g, "-").replace(/≥/g, ">=").replace(/≤/g, "<=");

/** Hybrid spectacle top-up; blank when the lens is not orderable. */
const hybridRx = (opt: HybridLensOption) =>
  opt.orderable ? ascii(opt.glassesRx) : "-";

const hasK = (eye: EyeInput) =>
  eye.flatK.trim() !== "" || eye.steepK.trim() !== "";

/** Encode an ArrayBuffer as base64 in chunks (avoids call-stack limits). */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * Embed Be Vietnam Pro so the report can render Vietnamese text — jsPDF's
 * built-in fonts only cover WinAnsi. Returns false if the fonts cannot be
 * fetched, so the caller can fall back to the core font.
 */
async function registerVietnameseFont(doc: jsPDF): Promise<boolean> {
  const variants: { url: string; style: "normal" | "bold" }[] = [
    { url: "/fonts/BeVietnamPro-Regular.ttf", style: "normal" },
    { url: "/fonts/BeVietnamPro-Bold.ttf", style: "bold" },
  ];
  try {
    for (const { url, style } of variants) {
      const res = await fetch(url);
      if (!res.ok) return false;
      const file = url.split("/").pop()!;
      doc.addFileToVFS(file, arrayBufferToBase64(await res.arrayBuffer()));
      doc.addFont(file, "BeVietnamPro", style);
    }
    return true;
  } catch {
    return false;
  }
}

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

function sectionTitle(doc: jsPDF, text: string, y: number, font: string) {
  doc.setFont(font, "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text(text.toUpperCase(), MARGIN, y);
}

function suitabilityCell(suitable: boolean, P: Dict): CellDef {
  return {
    content: suitable ? P.suitable : P.notSuitable,
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
  font: string,
  P: Dict,
): number {
  autoTable(doc, {
    startY,
    margin: { left: MARGIN, right: MARGIN },
    theme: "grid",
    head: [[headLabel, P.reOd, P.leOs]],
    body: rows,
    styles: {
      font,
      fontSize: 8,
      textColor: INK,
      cellPadding: 2,
      lineColor: LINE,
      lineWidth: 0.1,
    },
    headStyles: {
      font,
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
  P: Dict,
): RowInput[] {
  const rows: RowInput[] = [
    [`${P.flatK} (mm)`, num2(re.flatK), num2(le.flatK)],
    [P.flatKAxis, orDash(re.flatAxis), orDash(le.flatAxis)],
    [`${P.steepK} (mm)`, num2(re.steepK), num2(le.steepK)],
    [P.steepKAxis, orDash(re.steepAxis), orDash(le.steepAxis)],
  ];
  // Average K mirrors the Fitting Curve Basis card — hidden on /simple.
  if (!simple) {
    rows.push([
      `${P.averageK} (mm)`,
      reActive ? d2(result.re.avgKmm) : "-",
      leActive ? d2(result.le.avgKmm) : "-",
    ]);
  }
  rows.push([`${P.closestDiameter} (mm)`, re.diameter, le.diameter]);
  return rows;
}

function refractionInputRows(re: EyeInput, le: EyeInput, P: Dict): RowInput[] {
  return [
    [`${P.sphere} (D)`, orDash(re.sphere), orDash(le.sphere)],
    [`${P.cylinder} (D)`, orDash(re.cylinder), orDash(le.cylinder)],
    [P.refractionAxis, orDash(re.refAxis), orDash(le.refAxis)],
    [P.visualAcuity, orDash(re.va), orDash(le.va)],
  ];
}

function dioptreRows(result: CalcResult, P: Dict): RowInput[] {
  const r = result.re;
  const l = result.le;
  return [
    [P.flatK, d2(r.flatKd), d2(l.flatKd)],
    [P.steepK, d2(r.steepKd), d2(l.steepKd)],
    [P.cylinder, d2(r.cornealCyl), d2(l.cornealCyl)],
    [P.averageK, d2(r.avgKd), d2(l.avgKd)],
  ];
}

function screeningRows(result: CalcResult, P: Dict): RowInput[] {
  const cell = (e: EyeResult): CellDef => ({
    content: e.screeningSuitable ? P.yes : P.no,
    styles: {
      fillColor: e.screeningSuitable ? OK_BG : NO_BG,
      textColor: e.screeningSuitable ? OK_FG : NO_FG,
      fontStyle: "bold",
    },
  });
  return [
    [
      P.pdf.screeningValue,
      d2(result.re.screeningValue),
      d2(result.le.screeningValue),
    ],
    [P.pdf.suitabilityGte, cell(result.re), cell(result.le)],
  ];
}

function lensRows(
  re: LensResult,
  le: LensResult,
  toric: boolean,
  P: Dict,
): RowInput[] {
  const rows: RowInput[] = [
    [P.fittingCurveD, d2(re.ft), d2(le.ft)],
    [`${P.targetPower} (D)`, d2(re.tp), d2(le.tp)],
  ];
  // Only the toric BOC TD lens has a cylinder; BOC STD / HD are spherical.
  if (toric) {
    rows.push([
      `${P.cylinder} (D)`,
      re.cylOutOfRange ? P.outOfRange : d2(re.cyl),
      le.cylOutOfRange ? P.outOfRange : d2(le.cyl),
    ]);
  }
  rows.push(
    [`${P.diameter} (mm)`, d2(re.diameter), d2(le.diameter)],
    [
      P.suitability,
      suitabilityCell(re.suitable, P),
      suitabilityCell(le.suitable, P),
    ],
    [P.reason, ascii(re.reason), ascii(le.reason)],
  );
  return rows;
}

/** Per-eye one-line hybrid screening context. */
function hybridContext(
  eye: EyeResult,
  label: string,
  P: Dict,
): string | null {
  const h = eye.hybrid;
  if (!h) return null;
  return P.pdf.hybridContext(
    label,
    d2(eye.screeningValue),
    d2(h.screeningShortfall),
    d2(h.residualSphere),
  );
}

function hybridStdRows(result: CalcResult, P: Dict): RowInput[] {
  const pick = (h: HybridPlan | null, get: (p: HybridPlan) => string) =>
    h ? get(h) : "-";
  const re = result.re.hybrid;
  const le = result.le.hybrid;
  return [
    [
      `${P.orthoKTargetPower} (D)`,
      pick(re, (h) => orthoKTp(h.std, P)),
      pick(le, (h) => orthoKTp(h.std, P)),
    ],
    [
      P.spectacleTopup,
      pick(re, (h) => hybridRx(h.std)),
      pick(le, (h) => hybridRx(h.std)),
    ],
    [
      P.pdf.assessment,
      pick(re, (h) => ascii(h.std.note)),
      pick(le, (h) => ascii(h.std.note)),
    ],
  ];
}

function hybridTdRows(result: CalcResult, P: Dict): RowInput[] {
  const pick = (h: HybridPlan | null, get: (p: HybridPlan) => string) =>
    h ? get(h) : "-";
  const re = result.re.hybrid;
  const le = result.le.hybrid;
  return [
    [
      `${P.orthoKTargetPower} (D)`,
      pick(re, (h) => (h.td ? orthoKTp(h.td, P) : P.pdf.notIndicated)),
      pick(le, (h) => (h.td ? orthoKTp(h.td, P) : P.pdf.notIndicated)),
    ],
    [
      `${P.toricLensCylinder} (D)`,
      pick(re, (h) => (h.td && h.td.orderable ? d2(h.td.fittedCyl) : "-")),
      pick(le, (h) => (h.td && h.td.orderable ? d2(h.td.fittedCyl) : "-")),
    ],
    [
      P.spectacleTopup,
      pick(re, (h) => (h.td ? hybridRx(h.td) : "-")),
      pick(le, (h) => (h.td ? hybridRx(h.td) : "-")),
    ],
    [
      P.pdf.assessment,
      pick(re, (h) => ascii(h.td ? h.td.note : (h.tdUnavailableNote ?? ""))),
      pick(le, (h) => ascii(h.td ? h.td.note : (h.tdUnavailableNote ?? ""))),
    ],
  ];
}

export async function generateReport({
  mode,
  simple,
  lang,
  re,
  le,
  result,
}: GenerateReportArgs): Promise<void> {
  const doc = new jsPDF("p", "mm", "a4");
  const P = STRINGS[lang];
  const detailed = mode === "detailed";
  const reActive = hasK(re);
  const leActive = hasK(le);

  // Vietnamese needs a Unicode font; fall back to the core font on failure.
  let font = "helvetica";
  if (lang === "vi" && (await registerVietnameseFont(doc))) {
    font = "BeVietnamPro";
  }

  // ---- Header ----------------------------------------------------------
  const logo = await loadImage(bocLogo.src);
  if (logo) doc.addImage(logo, "JPEG", MARGIN, 11, 34, 17);

  doc.setFont(font, "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BLUE);
  doc.text(P.printTitle, RIGHT, 17, { align: "right" });
  doc.setFont(font, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const dateStr = formatDate(lang);
  doc.text(
    `${detailed ? P.pdf.detailedReport : P.pdf.report} · ${dateStr}`,
    RIGHT,
    23,
    { align: "right" },
  );
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, 31, RIGHT, 31);

  // ---- Keratometry input ----------------------------------------------
  let y = 39;
  sectionTitle(doc, P.keratometryTitle, y, font);
  y =
    eyeTable(
      doc,
      y + 2.5,
      P.pdf.measurement,
      keratometryInputRows(re, le, result, reActive, leActive, simple, P),
      font,
      P,
    ) + 8;

  // ---- Refraction input -----------------------------------------------
  sectionTitle(doc, P.refractionTitle, y, font);
  y =
    eyeTable(
      doc,
      y + 2.5,
      P.pdf.measurement,
      refractionInputRows(re, le, P),
      font,
      P,
    ) + 8;

  // ---- Screening -------------------------------------------------------
  if (!simple) {
    sectionTitle(doc, P.screeningTableTitle, y, font);
    y =
      eyeTable(
        doc,
        y + 2.5,
        P.pdf.screening,
        gate(screeningRows(result, P), reActive, leActive),
        font,
        P,
      ) + 8;
  }

  // ---- Keratometry in dioptre (detailed only) --------------------------
  if (detailed && !simple) {
    sectionTitle(doc, P.conversionTitle, y, font);
    y =
      eyeTable(
        doc,
        y + 2.5,
        P.fittingCurveD,
        gate(dioptreRows(result, P), reActive, leActive),
        font,
        P,
      ) + 8;
  }

  // ---- Trial lens results ---------------------------------------------
  sectionTitle(doc, P.trialLensResults, y, font);
  y += 2.5;

  const lenses: {
    name: string;
    toric: boolean;
    re: LensResult;
    le: LensResult;
  }[] = [
    {
      name: `BOC STD — ${P.firstTrialLens}`,
      toric: false,
      re: result.re.std,
      le: result.le.std,
    },
  ];
  if (SHOW_BOC_HD) {
    lenses.push({
      name: `BOC HD — ${P.firstTrialLens}`,
      toric: false,
      re: result.re.hd,
      le: result.le.hd,
    });
  }
  if (!result.hideTd) {
    lenses.push({
      name: `BOC TD — ${P.firstTrialLens}`,
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
        gate(lensRows(lens.re, lens.le, lens.toric, P), reActive, leActive),
        font,
        P,
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
      sectionTitle(doc, P.fittingReferenceTitle, y, font);
      y += 4;
      doc.addImage(fittingImg, "JPEG", MARGIN, y, imgW, imgH);
      const capX = MARGIN + imgW + 6;
      doc.setFont(font, "normal");
      doc.setFontSize(8);
      doc.setTextColor(...INK);
      const lines = doc.splitTextToSize(P.pdf.fittingCaption, RIGHT - capX);
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
    sectionTitle(doc, P.hybridTitle, y, font);
    y += 4;
    doc.setFont(font, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    for (const ctx of [
      reHybrid ? hybridContext(result.re, `${P.reShort} - OD`, P) : null,
      leHybrid ? hybridContext(result.le, `${P.leShort} - OS`, P) : null,
    ]) {
      if (!ctx) continue;
      doc.text(doc.splitTextToSize(ctx, RIGHT - MARGIN), MARGIN, y);
      y += 4;
    }
    y += 1;
    y =
      eyeTable(
        doc,
        y,
        `BOC STD - ${P.pdf.hybridPlan}`,
        hybridStdRows(result, P),
        font,
        P,
      ) + 5;
    y =
      eyeTable(
        doc,
        y,
        `BOC TD - ${P.pdf.hybridPlan}`,
        hybridTdRows(result, P),
        font,
        P,
      ) + 5;

    doc.setFont(font, "bold");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text(P.pdf.bestTargetPower.toUpperCase(), MARGIN, y);
    y += 3.6;
    doc.setFont(font, "normal");
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(P.pdf.targetExplainer, RIGHT - MARGIN);
    doc.text(lines, MARGIN, y);
    y += lines.length * 3.4 + 6;
  }

  // ---- Disclaimer ------------------------------------------------------
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFont(font, "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(P.disclaimerTitle.toUpperCase(), MARGIN, y);
  doc.setFont(font, "normal");
  doc.setFontSize(7.5);
  let dy = y + 4.5;
  P.disclaimerItems.forEach((text, i) => {
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
