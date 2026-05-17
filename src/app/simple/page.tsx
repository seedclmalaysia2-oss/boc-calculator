import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "BOC Ortho-K Trial Lens Calculator — Simple",
};

/**
 * Simplified calculator at /simple — same engine, with the Fitting Curve
 * Basis, Shape of Cornea Effectiveness, and Keratometry Information tables
 * hidden. Not linked from the main page.
 */
export default function SimplePage() {
  return <Calculator simple />;
}
