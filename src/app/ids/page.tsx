import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Kalkulator Lensa Coba Ortho-K BOC — Sederhana",
};

/**
 * Indonesian simplified calculator at /ids — mirrors /simple with the
 * Fitting Curve Basis, Shape of Cornea Effectiveness, and Keratometry
 * Information tables hidden. Not linked from the main page.
 */
export default function IdSimplePage() {
  return <Calculator simple lang="id" />;
}
