import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Máy tính kính thử Ortho-K BOC — Đơn giản",
};

/**
 * Vietnamese simplified calculator at /vis — mirrors /simple with the
 * Fitting Curve Basis, Shape of Cornea Effectiveness, and Keratometry
 * Information tables hidden. Not linked from the main page.
 */
export default function ViSimplePage() {
  return <Calculator simple lang="vi" />;
}
