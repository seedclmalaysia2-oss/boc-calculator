"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export type Lang = "en" | "vi" | "id";

/** A run of text in a paragraph; `b` marks the run as bold. */
export interface Seg {
  t: string;
  b?: boolean;
}

/**
 * English strings. This object is the source of truth for the dictionary
 * shape — `Dict` is derived from it, so the Vietnamese table must match.
 */
const en = {
  // ---- Header ----------------------------------------------------------
  appTitle: "Ortho-K Trial Lens Calculator",
  printTitle: "SEED BOC Ortho-K Trial Lens Recommendation",
  appSubtitle: "Initial Lens Selection Tool",
  reportDate: "Report Date",

  // ---- Instructions ----------------------------------------------------
  instructionsTitle: "Instructions",
  step1Label: "STEP 1",
  step2Label: "STEP 2",
  step1: [
    { t: "Key in keratometry data — Flat K and Steep K in " },
    { t: "mm or dioptre", b: true },
    {
      t: " — then select the closest diameter (based on 95% of HVID).",
    },
  ] as Seg[],
  step2: [
    { t: "Key in the spectacle refraction data, then press " },
    { t: "Calculate", b: true },
    { t: " to view recommended trial lenses." },
  ] as Seg[],

  // ---- Panels ----------------------------------------------------------
  keratometryTitle: "Keratometry",
  refractionTitle: "Refraction",

  // ---- Units -----------------------------------------------------------
  unitDioptre: "Dioptre",

  // ---- Keratometry fields ---------------------------------------------
  flatK: "Flat K",
  flatKAxis: "Flat K Axis",
  steepK: "Steep K",
  steepKAxis: "Steep K Axis",
  closestDiameter: "Closest Diameter",
  fittingCurveBasis: "Fitting Curve Basis",
  averageK: "Average K",

  // ---- Eyes / aria -----------------------------------------------------
  rightEye: "right eye",
  leftEye: "left eye",
  bothEyes: "right and left eye",
  reOd: "RE · OD",
  leOs: "LE · OS",
  reShort: "RE",
  leShort: "LE",

  // ---- Unit mismatch / validation -------------------------------------
  unitMismatch: (other: string, current: string) =>
    `These readings look like ${other} values, but the unit is set to ${current}.`,
  switchUnit: (other: string) => `Switch to ${other} — keep these numbers`,
  cmpLess: "less",
  cmpGreater: "greater",
  validation: (cmp: string, eyes: string) =>
    `Flat K must not be ${cmp} than Steep K — please check the ${eyes} entry.`,

  // ---- Refraction fields ----------------------------------------------
  sphere: "Sphere",
  cylinder: "Cylinder",
  axis: "Axis",
  va: "VA",
  visualAcuity: "Visual Acuity",
  refractionAxis: "Refraction Axis",

  // ---- Conversion table -----------------------------------------------
  conversionTitle: "Keratometry Information — Dioptre",
  fittingCurveD: "Fitting Curve (D)",

  // ---- Screening table -------------------------------------------------
  screeningTableTitle: "Shape of Cornea Effectiveness",
  screeningRow: "Screening ≥ 39",
  suitability: "Suitability",
  reason: "Reason",
  screeningHead: "Flattest K − Target Power",
  yes: "Yes",
  no: "No",

  // ---- Actions ---------------------------------------------------------
  amendInputs: "Amend Inputs",
  inputsLocked: "Inputs are locked — tap to edit and recalculate.",
  calculate: "Calculate",

  // ---- Results ---------------------------------------------------------
  trialLensResults: "Trial Lens Results",
  printPage: "Print Page",
  downloadPdf: "Download PDF",

  // ---- Lens result card -----------------------------------------------
  firstTrialLens: "1st Trial Lens",
  fittingCurve: "Fitting Curve",
  targetPower: "Target Power",
  diameter: "Diameter",
  outOfRange: "Out of range",
  notEntered: "Not entered",
  suitable: "Suitable",
  notSuitable: "Not Suitable",
  noDataEye: "No data entered for this eye.",

  // ---- Fitting reference ----------------------------------------------
  fittingReferenceTitle: "Fitting Reference",
  fittingReferenceCaption: [
    { t: "When the recommended " },
    { t: "1st trial lens", b: true },
    {
      t: " — BOC STD or BOC TD — is applied and assessed under fluorescein, a correct fit should resemble the pattern shown: the lens well-centred on the cornea, with a defined central treatment zone and an even mid-peripheral ring. Use this image as the reference for an ideal initial fit.",
    },
  ] as Seg[],

  // ---- Hybrid management ----------------------------------------------
  hybridTitle: "Hybrid Myopia Management",
  hybridIntro:
    "For screening-limited candidates — each BOC lens is fitted to the maximum it can correct; the residual is carried by the spectacle top-up at the steep-K axis.",
  hybridCtxScreening: "Screening",
  hybridCtxMid: (shortfall: string) =>
    ` — ${shortfall} D below the 39.00 minimum. Residual myopia `,
  hybridCtxEnd: ".",
  hybridNotLimited: "Not screening-limited — no hybrid plan needed.",
  spectacleTopup: "Spectacle Top-up",
  orthoKTargetPower: "Ortho-K Target Power",
  toricLensCylinder: "Toric Lens Cylinder",
  notOrderable: "Not orderable",
  hybridPlanSpherical: "Hybrid Plan · Spherical",
  hybridPlanToric: "Hybrid Plan · Toric",
  understandingTargetPower: "Understanding the Best Target Power",
  explainerP1: [
    { t: "The ortho-K " },
    { t: "target power", b: true },
    {
      t: " shown is the maximum the cornea can safely take — not a limit of the calculator.",
    },
  ] as Seg[],
  explainerFormula: "Screening value = Flat K (D) + Target Power",
  explainerP2: [
    {
      t: "The cornea can only be flattened until the screening value reaches its ",
    },
    { t: "39.00 minimum", b: true },
    { t: "; the target power is capped exactly there." },
  ] as Seg[],
  explainerWhyNotDeeper: "Why not a deeper target power?",
  explainerP3: [
    {
      t: "A deeper (more-minus) target power drops the screening value below 39.00 — over-flattening the cornea. The screening rule exists to prevent that: over-flattening risks ",
    },
    {
      t: "high corneal pressure, SPK (superficial punctate keratitis), and poor lens wear",
      b: true,
    },
    {
      t: ". A deeper target power does not give “free” correction — it only moves the fit into unsafe territory.",
    },
  ] as Seg[],
  explainerWhyGlasses: "Why do the glasses carry so much?",
  explainerP4: [
    { t: "A large spectacle residual means the cornea is " },
    { t: "flat", b: true },
    {
      t: " — not that the calculator fell short. A flat cornea (low Flat K) has little room to be flattened further, so the ortho-K’s share is small. To reduce the spectacle power you would need a ",
    },
    { t: "steeper cornea (higher Flat K)", b: true },
    { t: ", not a deeper target power." },
  ] as Seg[],

  // ---- Disclaimer ------------------------------------------------------
  disclaimerTitle: "Disclaimer",
  disclaimerItems: [
    "This calculator is not intended to determine final lens specifications; it does not account for topography images reflecting the actual eye condition before or after fitting BOC Ortho-K lenses.",
    "It is solely for selecting initial trial lenses. Further parameter adjustments are necessary if the initial trial lens is unsuitable after the fitting process.",
    "No data is stored, captured, or screenshotted. No information is saved on any server or location.",
  ],

  // ---- Theme -----------------------------------------------------------
  toggleDarkMode: "Toggle dark mode",

  // ---- Calculator engine (reason / note strings) ----------------------
  calc: {
    allWithinRange: "All parameters within range.",
    outOfRange: "Out of range.",
    screeningBelow: (v: string) => `Screening value ${v} is below 39.00.`,
    stdFitOutside: (ft: string) =>
      `Fitting curve ${ft} D is outside the STD range (39.00 to 47.00 D).`,
    stdTpOutside: (tp: string, ft: string, max: string, min: string) =>
      `Target power ${tp} D is outside the STD order range for a ${ft} D fitting curve (${max} to ${min} D).`,
    stdCylOutside:
      "Corneal cylinder outside the STD range (−0.25 to −0.75 D).",
    hdTpOutside: "Target power outside the HD range (−4.25 to −8.00 D).",
    hdCylOutside: "Corneal cylinder outside the HD range (−0.25 to −0.75 D).",
    tdTpOutside: (tp: string) =>
      `Target power ${tp} D is outside the TD range (−1.00 D or more minus).`,
    tdCylOutside: "Cylinder outside the TD range (−1.00 to −3.00 D).",
    notOrderableNote:
      "Cornea too flat to reach the −1.00 D minimum ortho-K power — lens not orderable; full correction by spectacles.",
    stdSphericalNote:
      "Spherical lens — corrects sphere only; the full corneal cylinder is carried in the spectacle top-up.",
    tdUnavailableNote: (cyl: string) =>
      `Corneal cylinder ${cyl} D is below the BOC TD minimum (−1.00 D) — the cornea is too spherical for a toric lens; BOC STD only.`,
    toricFit: (cyl: string) => `Toric lens fitted at ${cyl} D cylinder`,
    toricFullyCorrected: (fit: string) =>
      `${fit} — corneal cylinder fully corrected.`,
    toricResidual: (cyl: string) =>
      `${cyl} D residual cylinder is carried in the spectacle top-up`,
    toricNoteClamped: (cornealCyl: string, fit: string, residual: string) =>
      `Corneal cylinder ${cornealCyl} D is beyond the BOC TD range; ${fit} and the ${residual}.`,
    toricNotePlain: (fit: string, residual: string) =>
      `${fit}; the ${residual}.`,
  },

  // ---- PDF report ------------------------------------------------------
  pdf: {
    detailedReport: "Detailed report",
    report: "Report",
    measurement: "Measurement",
    screening: "Screening",
    assessment: "Assessment",
    hybridPlan: "Hybrid Plan",
    notIndicated: "Not indicated",
    screeningValue: "Screening value",
    suitabilityGte: "Suitability (>= 39.00)",
    bestTargetPower: "Best Target Power",
    targetExplainer:
      "The target power is the maximum the cornea can safely take - capped where the screening value reaches its 39.00 minimum (Screening = Flat K + Target Power). A deeper target power would over-flatten the cornea, risking high corneal pressure, SPK and poor lens wear. A large spectacle residual reflects a flat cornea, not a calculator limit - reducing it would need a steeper cornea, not a deeper target power.",
    fittingCaption:
      "When the recommended 1st trial lens (BOC STD or BOC TD) is applied and assessed under fluorescein, a correct fit should resemble the image: the lens well-centred on the cornea, with a defined central treatment zone and an even mid-peripheral ring. Use it as the reference for an ideal initial fit.",
    hybridContext: (
      label: string,
      screen: string,
      shortfall: string,
      residual: string,
    ) =>
      `${label}: screening ${screen} (${shortfall} D below 39.00); residual myopia ${residual} D.`,
  },
};

export type Dict = typeof en;

/**
 * Vietnamese strings. Clinical product names (BOC STD / TD / HD), the OD/OS
 * Latin abbreviations, "Ortho-K", "fluorescein", "SPK", "HVID" and "K" are
 * kept as-is — they are used untranslated in Vietnamese optometry practice.
 */
const vi: Dict = {
  appTitle: "Máy tính kính thử Ortho-K",
  printTitle: "Khuyến nghị kính thử Ortho-K SEED BOC",
  appSubtitle: "Công cụ chọn kính ban đầu",
  reportDate: "Ngày báo cáo",

  instructionsTitle: "Hướng dẫn",
  step1Label: "BƯỚC 1",
  step2Label: "BƯỚC 2",
  step1: [
    { t: "Nhập dữ liệu đo giác mạc — K dẹt và K cong theo " },
    { t: "mm hoặc đi-ốp", b: true },
    {
      t: " — sau đó chọn đường kính gần nhất (dựa trên 95% HVID).",
    },
  ] as Seg[],
  step2: [
    { t: "Nhập dữ liệu khúc xạ kính gọng, sau đó nhấn " },
    { t: "Tính toán", b: true },
    { t: " để xem các kính thử được khuyến nghị." },
  ] as Seg[],

  keratometryTitle: "Đo giác mạc",
  refractionTitle: "Khúc xạ",

  unitDioptre: "Đi-ốp",

  flatK: "K dẹt",
  flatKAxis: "Trục K dẹt",
  steepK: "K cong",
  steepKAxis: "Trục K cong",
  closestDiameter: "Đường kính gần nhất",
  fittingCurveBasis: "Cơ sở đường cong lắp",
  averageK: "K trung bình",

  rightEye: "mắt phải",
  leftEye: "mắt trái",
  bothEyes: "mắt phải và mắt trái",
  reOd: "MP · OD",
  leOs: "MT · OS",
  reShort: "MP",
  leShort: "MT",

  unitMismatch: (other: string, current: string) =>
    `Các số đo này trông giống giá trị ${other}, nhưng đơn vị đang được đặt là ${current}.`,
  switchUnit: (other: string) =>
    `Chuyển sang ${other} — giữ nguyên các số này`,
  cmpLess: "nhỏ hơn",
  cmpGreater: "lớn hơn",
  validation: (cmp: string, eyes: string) =>
    `K dẹt không được ${cmp} K cong — vui lòng kiểm tra giá trị nhập của ${eyes}.`,

  sphere: "Cầu",
  cylinder: "Trụ",
  axis: "Trục",
  va: "Thị lực",
  visualAcuity: "Thị lực",
  refractionAxis: "Trục khúc xạ",

  conversionTitle: "Thông tin đo giác mạc — Đi-ốp",
  fittingCurveD: "Đường cong lắp (D)",

  screeningTableTitle: "Hiệu quả định hình giác mạc",
  screeningRow: "Sàng lọc ≥ 39",
  suitability: "Mức phù hợp",
  reason: "Lý do",
  screeningHead: "K dẹt nhất − Công suất mục tiêu",
  yes: "Có",
  no: "Không",

  amendInputs: "Chỉnh sửa dữ liệu",
  inputsLocked: "Dữ liệu đã khóa — chạm để chỉnh sửa và tính lại.",
  calculate: "Tính toán",

  trialLensResults: "Kết quả kính thử",
  printPage: "In trang",
  downloadPdf: "Tải PDF",

  firstTrialLens: "Kính thử thứ 1",
  fittingCurve: "Đường cong lắp",
  targetPower: "Công suất mục tiêu",
  diameter: "Đường kính",
  outOfRange: "Ngoài phạm vi",
  notEntered: "Chưa nhập",
  suitable: "Phù hợp",
  notSuitable: "Không phù hợp",
  noDataEye: "Chưa nhập dữ liệu cho mắt này.",

  fittingReferenceTitle: "Tham chiếu lắp kính",
  fittingReferenceCaption: [
    { t: "Khi " },
    { t: "kính thử thứ 1", b: true },
    {
      t: " được khuyến nghị — BOC STD hoặc BOC TD — được đặt lên mắt và đánh giá dưới fluorescein, một ca lắp đúng sẽ giống với mẫu hình minh họa: kính định tâm tốt trên giác mạc, có vùng điều trị trung tâm rõ ràng và vòng giữa-ngoại vi đều. Dùng hình ảnh này làm tham chiếu cho ca lắp ban đầu lý tưởng.",
    },
  ] as Seg[],

  hybridTitle: "Quản lý cận thị kết hợp",
  hybridIntro:
    "Dành cho các trường hợp bị giới hạn bởi sàng lọc — mỗi kính BOC được lắp ở mức tối đa mà nó có thể điều chỉnh; phần còn lại được bù bằng kính gọng bổ sung tại trục K cong.",
  hybridCtxScreening: "Sàng lọc",
  hybridCtxMid: (shortfall: string) =>
    ` — thấp hơn ngưỡng tối thiểu 39.00 là ${shortfall} D. Cận thị còn lại `,
  hybridCtxEnd: ".",
  hybridNotLimited:
    "Không bị giới hạn bởi sàng lọc — không cần kế hoạch kết hợp.",
  spectacleTopup: "Bổ sung bằng kính gọng",
  orthoKTargetPower: "Công suất mục tiêu Ortho-K",
  toricLensCylinder: "Trụ kính Toric",
  notOrderable: "Không thể đặt",
  hybridPlanSpherical: "Kế hoạch kết hợp · Cầu",
  hybridPlanToric: "Kế hoạch kết hợp · Toric",
  understandingTargetPower: "Tìm hiểu về Công suất mục tiêu tốt nhất",
  explainerP1: [
    { t: "" },
    { t: "Công suất mục tiêu", b: true },
    {
      t: " ortho-K hiển thị là mức tối đa mà giác mạc có thể chịu được an toàn — không phải giới hạn của máy tính.",
    },
  ] as Seg[],
  explainerFormula: "Giá trị sàng lọc = K dẹt (D) + Công suất mục tiêu",
  explainerP2: [
    {
      t: "Giác mạc chỉ có thể được làm dẹt cho đến khi giá trị sàng lọc đạt ",
    },
    { t: "ngưỡng tối thiểu 39.00", b: true },
    { t: "; công suất mục tiêu được giới hạn đúng tại đó." },
  ] as Seg[],
  explainerWhyNotDeeper: "Tại sao không dùng công suất mục tiêu sâu hơn?",
  explainerP3: [
    {
      t: "Công suất mục tiêu sâu hơn (âm hơn) làm giá trị sàng lọc tụt xuống dưới 39.00 — làm dẹt giác mạc quá mức. Quy tắc sàng lọc tồn tại để ngăn điều đó: làm dẹt quá mức có nguy cơ gây ",
    },
    {
      t: "áp lực giác mạc cao, SPK (viêm giác mạc chấm nông) và đeo kính kém",
      b: true,
    },
    {
      t: ". Công suất mục tiêu sâu hơn không mang lại điều chỉnh “miễn phí” — nó chỉ đưa ca lắp vào vùng không an toàn.",
    },
  ] as Seg[],
  explainerWhyGlasses: "Tại sao kính gọng phải gánh nhiều như vậy?",
  explainerP4: [
    { t: "Phần dư kính gọng lớn nghĩa là giác mạc " },
    { t: "dẹt", b: true },
    {
      t: " — không phải máy tính tính thiếu. Giác mạc dẹt (K dẹt thấp) có ít dư địa để làm dẹt thêm, nên phần ortho-K đảm nhận là nhỏ. Để giảm công suất kính gọng, bạn cần một ",
    },
    { t: "giác mạc cong hơn (K dẹt cao hơn)", b: true },
    { t: ", không phải công suất mục tiêu sâu hơn." },
  ] as Seg[],

  disclaimerTitle: "Miễn trừ trách nhiệm",
  disclaimerItems: [
    "Máy tính này không nhằm xác định thông số kính cuối cùng; nó không tính đến hình ảnh bản đồ giác mạc phản ánh tình trạng mắt thực tế trước hoặc sau khi lắp kính Ortho-K BOC.",
    "Công cụ chỉ dùng để chọn kính thử ban đầu. Cần điều chỉnh thêm các thông số nếu kính thử ban đầu không phù hợp sau quá trình lắp.",
    "Không có dữ liệu nào được lưu trữ, thu thập hoặc chụp màn hình. Không có thông tin nào được lưu trên bất kỳ máy chủ hay vị trí nào.",
  ],

  toggleDarkMode: "Bật/tắt chế độ tối",

  calc: {
    allWithinRange: "Tất cả thông số trong phạm vi.",
    outOfRange: "Ngoài phạm vi.",
    screeningBelow: (v: string) => `Giá trị sàng lọc ${v} thấp hơn 39.00.`,
    stdFitOutside: (ft: string) =>
      `Đường cong lắp ${ft} D nằm ngoài phạm vi STD (39.00 đến 47.00 D).`,
    stdTpOutside: (tp: string, ft: string, max: string, min: string) =>
      `Công suất mục tiêu ${tp} D nằm ngoài phạm vi đặt hàng STD cho đường cong lắp ${ft} D (${max} đến ${min} D).`,
    stdCylOutside:
      "Trụ giác mạc nằm ngoài phạm vi STD (−0.25 đến −0.75 D).",
    hdTpOutside:
      "Công suất mục tiêu nằm ngoài phạm vi HD (−4.25 đến −8.00 D).",
    hdCylOutside:
      "Trụ giác mạc nằm ngoài phạm vi HD (−0.25 đến −0.75 D).",
    tdTpOutside: (tp: string) =>
      `Công suất mục tiêu ${tp} D nằm ngoài phạm vi TD (−1.00 D hoặc âm hơn).`,
    tdCylOutside: "Trụ nằm ngoài phạm vi TD (−1.00 đến −3.00 D).",
    notOrderableNote:
      "Giác mạc quá dẹt để đạt công suất ortho-K tối thiểu −1.00 D — không thể đặt kính; điều chỉnh hoàn toàn bằng kính gọng.",
    stdSphericalNote:
      "Kính cầu — chỉ điều chỉnh độ cầu; toàn bộ trụ giác mạc được bù bằng kính gọng bổ sung.",
    tdUnavailableNote: (cyl: string) =>
      `Trụ giác mạc ${cyl} D thấp hơn mức tối thiểu của BOC TD (−1.00 D) — giác mạc quá cầu để dùng kính toric; chỉ dùng BOC STD.`,
    toricFit: (cyl: string) => `Kính toric được lắp với trụ ${cyl} D`,
    toricFullyCorrected: (fit: string) =>
      `${fit} — trụ giác mạc được điều chỉnh hoàn toàn.`,
    toricResidual: (cyl: string) =>
      `${cyl} D trụ còn lại được bù bằng kính gọng bổ sung`,
    toricNoteClamped: (cornealCyl: string, fit: string, residual: string) =>
      `Trụ giác mạc ${cornealCyl} D vượt quá phạm vi BOC TD; ${fit} và ${residual}.`,
    toricNotePlain: (fit: string, residual: string) => `${fit}; ${residual}.`,
  },

  pdf: {
    detailedReport: "Báo cáo chi tiết",
    report: "Báo cáo",
    measurement: "Chỉ số đo",
    screening: "Sàng lọc",
    assessment: "Đánh giá",
    hybridPlan: "Kế hoạch kết hợp",
    notIndicated: "Không chỉ định",
    screeningValue: "Giá trị sàng lọc",
    suitabilityGte: "Mức phù hợp (>= 39.00)",
    bestTargetPower: "Công suất mục tiêu tốt nhất",
    targetExplainer:
      "Công suất mục tiêu là mức tối đa mà giác mạc có thể chịu an toàn - được giới hạn tại nơi giá trị sàng lọc đạt ngưỡng tối thiểu 39.00 (Sàng lọc = K dẹt + Công suất mục tiêu). Công suất mục tiêu sâu hơn sẽ làm dẹt giác mạc quá mức, gây nguy cơ áp lực giác mạc cao, SPK và đeo kính kém. Phần dư kính gọng lớn phản ánh giác mạc dẹt, không phải giới hạn của máy tính - để giảm nó cần một giác mạc cong hơn, không phải công suất mục tiêu sâu hơn.",
    fittingCaption:
      "Khi kính thử thứ 1 được khuyến nghị (BOC STD hoặc BOC TD) được đặt lên mắt và đánh giá dưới fluorescein, một ca lắp đúng sẽ giống với hình ảnh: kính định tâm tốt trên giác mạc, có vùng điều trị trung tâm rõ ràng và vòng giữa-ngoại vi đều. Dùng nó làm tham chiếu cho ca lắp ban đầu lý tưởng.",
    hybridContext: (
      label: string,
      screen: string,
      shortfall: string,
      residual: string,
    ) =>
      `${label}: sàng lọc ${screen} (thấp hơn 39.00 là ${shortfall} D); cận thị còn lại ${residual} D.`,
  },
};

/**
 * Indonesian strings. Clinical product names (BOC STD / TD / HD), the OD/OS
 * Latin abbreviations, "Ortho-K", "fluorescein", "SPK", "HVID", "toric" and
 * "K" are kept as-is — they are used untranslated in Indonesian optometry
 * practice.
 */
const id: Dict = {
  appTitle: "Kalkulator Lensa Coba Ortho-K",
  printTitle: "Rekomendasi Lensa Coba Ortho-K SEED BOC",
  appSubtitle: "Alat Pemilihan Lensa Awal",
  reportDate: "Tanggal Laporan",

  instructionsTitle: "Petunjuk",
  step1Label: "LANGKAH 1",
  step2Label: "LANGKAH 2",
  step1: [
    { t: "Masukkan data keratometri — K Datar dan K Curam dalam " },
    { t: "mm atau dioptri", b: true },
    {
      t: " — lalu pilih diameter terdekat (berdasarkan 95% HVID).",
    },
  ] as Seg[],
  step2: [
    { t: "Masukkan data refraksi kacamata, lalu tekan " },
    { t: "Hitung", b: true },
    { t: " untuk melihat lensa coba yang direkomendasikan." },
  ] as Seg[],

  keratometryTitle: "Keratometri",
  refractionTitle: "Refraksi",

  unitDioptre: "Dioptri",

  flatK: "K Datar",
  flatKAxis: "Aksis K Datar",
  steepK: "K Curam",
  steepKAxis: "Aksis K Curam",
  closestDiameter: "Diameter Terdekat",
  fittingCurveBasis: "Dasar Kurva Fitting",
  averageK: "K Rata-rata",

  rightEye: "mata kanan",
  leftEye: "mata kiri",
  bothEyes: "mata kanan dan kiri",
  reOd: "OD",
  leOs: "OS",
  reShort: "OD",
  leShort: "OS",

  unitMismatch: (other: string, current: string) =>
    `Pembacaan ini terlihat seperti nilai ${other}, tetapi satuannya diatur ke ${current}.`,
  switchUnit: (other: string) =>
    `Beralih ke ${other} — pertahankan angka ini`,
  cmpLess: "lebih kecil",
  cmpGreater: "lebih besar",
  validation: (cmp: string, eyes: string) =>
    `K Datar tidak boleh ${cmp} dari K Curam — silakan periksa entri ${eyes}.`,

  sphere: "Sferis",
  cylinder: "Silinder",
  axis: "Aksis",
  va: "Visus",
  visualAcuity: "Ketajaman Penglihatan",
  refractionAxis: "Aksis Refraksi",

  conversionTitle: "Informasi Keratometri — Dioptri",
  fittingCurveD: "Kurva Fitting (D)",

  screeningTableTitle: "Efektivitas Bentuk Kornea",
  screeningRow: "Skrining ≥ 39",
  suitability: "Kesesuaian",
  reason: "Alasan",
  screeningHead: "K Terdatar − Daya Target",
  yes: "Ya",
  no: "Tidak",

  amendInputs: "Ubah Data",
  inputsLocked: "Data terkunci — ketuk untuk mengedit dan menghitung ulang.",
  calculate: "Hitung",

  trialLensResults: "Hasil Lensa Coba",
  printPage: "Cetak Halaman",
  downloadPdf: "Unduh PDF",

  firstTrialLens: "Lensa Coba ke-1",
  fittingCurve: "Kurva Fitting",
  targetPower: "Daya Target",
  diameter: "Diameter",
  outOfRange: "Di luar rentang",
  notEntered: "Belum dimasukkan",
  suitable: "Sesuai",
  notSuitable: "Tidak Sesuai",
  noDataEye: "Tidak ada data untuk mata ini.",

  fittingReferenceTitle: "Referensi Fitting",
  fittingReferenceCaption: [
    { t: "Ketika " },
    { t: "lensa coba ke-1", b: true },
    {
      t: " yang direkomendasikan — BOC STD atau BOC TD — dipasang dan dinilai di bawah fluorescein, fitting yang benar akan menyerupai pola yang ditunjukkan: lensa terpusat dengan baik pada kornea, dengan zona perawatan sentral yang jelas dan cincin mid-perifer yang merata. Gunakan gambar ini sebagai referensi untuk fitting awal yang ideal.",
    },
  ] as Seg[],

  hybridTitle: "Manajemen Miopia Hibrida",
  hybridIntro:
    "Untuk kandidat yang dibatasi skrining — setiap lensa BOC dipasang pada maksimum yang dapat dikoreksinya; sisanya ditanggung oleh tambahan kacamata pada aksis K Curam.",
  hybridCtxScreening: "Skrining",
  hybridCtxMid: (shortfall: string) =>
    ` — ${shortfall} D di bawah minimum 39.00. Miopia sisa `,
  hybridCtxEnd: ".",
  hybridNotLimited:
    "Tidak dibatasi skrining — tidak perlu rencana hibrida.",
  spectacleTopup: "Tambahan Kacamata",
  orthoKTargetPower: "Daya Target Ortho-K",
  toricLensCylinder: "Silinder Lensa Toric",
  notOrderable: "Tidak dapat dipesan",
  hybridPlanSpherical: "Rencana Hibrida · Sferis",
  hybridPlanToric: "Rencana Hibrida · Toric",
  understandingTargetPower: "Memahami Daya Target Terbaik",
  explainerP1: [
    { t: "" },
    { t: "Daya target", b: true },
    {
      t: " ortho-K yang ditampilkan adalah maksimum yang dapat ditanggung kornea dengan aman — bukan batas kalkulator.",
    },
  ] as Seg[],
  explainerFormula: "Nilai skrining = K Datar (D) + Daya Target",
  explainerP2: [
    {
      t: "Kornea hanya dapat didatarkan hingga nilai skrining mencapai ",
    },
    { t: "minimum 39.00", b: true },
    { t: "; daya target dibatasi tepat di titik itu." },
  ] as Seg[],
  explainerWhyNotDeeper: "Mengapa tidak daya target yang lebih dalam?",
  explainerP3: [
    {
      t: "Daya target yang lebih dalam (lebih minus) menurunkan nilai skrining di bawah 39.00 — mendatarkan kornea secara berlebihan. Aturan skrining ada untuk mencegah hal itu: pendataran berlebihan berisiko menyebabkan ",
    },
    {
      t: "tekanan kornea tinggi, SPK (superficial punctate keratitis), dan pemakaian lensa yang buruk",
      b: true,
    },
    {
      t: ". Daya target yang lebih dalam tidak memberikan koreksi “gratis” — ia hanya membawa fitting ke wilayah yang tidak aman.",
    },
  ] as Seg[],
  explainerWhyGlasses: "Mengapa kacamata menanggung begitu banyak?",
  explainerP4: [
    { t: "Sisa kacamata yang besar berarti kornea " },
    { t: "datar", b: true },
    {
      t: " — bukan karena kalkulator kurang. Kornea datar (K Datar rendah) memiliki sedikit ruang untuk didatarkan lebih lanjut, sehingga porsi ortho-K kecil. Untuk mengurangi daya kacamata, Anda memerlukan ",
    },
    { t: "kornea yang lebih curam (K Datar lebih tinggi)", b: true },
    { t: ", bukan daya target yang lebih dalam." },
  ] as Seg[],

  disclaimerTitle: "Penafian",
  disclaimerItems: [
    "Kalkulator ini tidak dimaksudkan untuk menentukan spesifikasi lensa akhir; kalkulator ini tidak memperhitungkan citra topografi yang mencerminkan kondisi mata sebenarnya sebelum atau sesudah pemasangan lensa Ortho-K BOC.",
    "Alat ini hanya untuk memilih lensa coba awal. Penyesuaian parameter lebih lanjut diperlukan jika lensa coba awal tidak sesuai setelah proses fitting.",
    "Tidak ada data yang disimpan, ditangkap, atau di-screenshot. Tidak ada informasi yang disimpan di server atau lokasi mana pun.",
  ],

  toggleDarkMode: "Alihkan mode gelap",

  calc: {
    allWithinRange: "Semua parameter dalam rentang.",
    outOfRange: "Di luar rentang.",
    screeningBelow: (v: string) => `Nilai skrining ${v} di bawah 39.00.`,
    stdFitOutside: (ft: string) =>
      `Kurva fitting ${ft} D berada di luar rentang STD (39.00 hingga 47.00 D).`,
    stdTpOutside: (tp: string, ft: string, max: string, min: string) =>
      `Daya target ${tp} D berada di luar rentang pemesanan STD untuk kurva fitting ${ft} D (${max} hingga ${min} D).`,
    stdCylOutside:
      "Silinder kornea di luar rentang STD (−0.25 hingga −0.75 D).",
    hdTpOutside:
      "Daya target di luar rentang HD (−4.25 hingga −8.00 D).",
    hdCylOutside:
      "Silinder kornea di luar rentang HD (−0.25 hingga −0.75 D).",
    tdTpOutside: (tp: string) =>
      `Daya target ${tp} D berada di luar rentang TD (−1.00 D atau lebih minus).`,
    tdCylOutside: "Silinder di luar rentang TD (−1.00 hingga −3.00 D).",
    notOrderableNote:
      "Kornea terlalu datar untuk mencapai daya ortho-K minimum −1.00 D — lensa tidak dapat dipesan; koreksi penuh dengan kacamata.",
    stdSphericalNote:
      "Lensa sferis — hanya mengoreksi sferis; seluruh silinder kornea ditanggung oleh tambahan kacamata.",
    tdUnavailableNote: (cyl: string) =>
      `Silinder kornea ${cyl} D di bawah minimum BOC TD (−1.00 D) — kornea terlalu sferis untuk lensa toric; hanya BOC STD.`,
    toricFit: (cyl: string) => `Lensa toric dipasang pada silinder ${cyl} D`,
    toricFullyCorrected: (fit: string) =>
      `${fit} — silinder kornea dikoreksi sepenuhnya.`,
    toricResidual: (cyl: string) =>
      `${cyl} D silinder sisa ditanggung oleh tambahan kacamata`,
    toricNoteClamped: (cornealCyl: string, fit: string, residual: string) =>
      `Silinder kornea ${cornealCyl} D melampaui rentang BOC TD; ${fit} dan ${residual}.`,
    toricNotePlain: (fit: string, residual: string) => `${fit}; ${residual}.`,
  },

  pdf: {
    detailedReport: "Laporan terperinci",
    report: "Laporan",
    measurement: "Pengukuran",
    screening: "Skrining",
    assessment: "Penilaian",
    hybridPlan: "Rencana Hibrida",
    notIndicated: "Tidak diindikasikan",
    screeningValue: "Nilai skrining",
    suitabilityGte: "Kesesuaian (>= 39.00)",
    bestTargetPower: "Daya Target Terbaik",
    targetExplainer:
      "Daya target adalah maksimum yang dapat ditanggung kornea dengan aman - dibatasi pada titik di mana nilai skrining mencapai minimum 39.00 (Skrining = K Datar + Daya Target). Daya target yang lebih dalam akan mendatarkan kornea secara berlebihan, berisiko menyebabkan tekanan kornea tinggi, SPK, dan pemakaian lensa yang buruk. Sisa kacamata yang besar mencerminkan kornea yang datar, bukan batas kalkulator - menguranginya memerlukan kornea yang lebih curam, bukan daya target yang lebih dalam.",
    fittingCaption:
      "Ketika lensa coba ke-1 yang direkomendasikan (BOC STD atau BOC TD) dipasang dan dinilai di bawah fluorescein, fitting yang benar akan menyerupai gambar: lensa terpusat dengan baik pada kornea, dengan zona perawatan sentral yang jelas dan cincin mid-perifer yang merata. Gunakan sebagai referensi untuk fitting awal yang ideal.",
    hybridContext: (
      label: string,
      screen: string,
      shortfall: string,
      residual: string,
    ) =>
      `${label}: skrining ${screen} (${shortfall} D di bawah 39.00); miopia sisa ${residual} D.`,
  },
};

export const STRINGS: Record<Lang, Dict> = { en, vi, id };

/** Format the report date in the locale matching the language. */
export function formatDate(lang: Lang): string {
  const locale =
    lang === "vi" ? "vi-VN" : lang === "id" ? "id-ID" : "en-GB";
  return new Date().toLocaleDateString(locale, {
    day: "2-digit",
    month: lang === "vi" ? "2-digit" : "short",
    year: "numeric",
  });
}

interface LangValue {
  lang: Lang;
  t: Dict;
}

const LangCtx = createContext<LangValue>({ lang: "en", t: en });

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <LangCtx.Provider value={{ lang, t: STRINGS[lang] }}>
      {children}
    </LangCtx.Provider>
  );
}

/** The string dictionary for the active language. */
export function useT(): Dict {
  return useContext(LangCtx).t;
}

/** The active language code. */
export function useLang(): Lang {
  return useContext(LangCtx).lang;
}

/** Render a paragraph of `Seg` runs, applying `bold` to bold runs. */
export function Rich({ segs, bold }: { segs: Seg[]; bold: string }) {
  return (
    <>
      {segs.map((s, i) =>
        s.b ? (
          <strong key={i} className={bold}>
            {s.t}
          </strong>
        ) : (
          <span key={i}>{s.t}</span>
        ),
      )}
    </>
  );
}
