import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "BOC オルソK トライアルレンズ計算ツール — シンプル",
};

/**
 * Japanese simplified calculator at /js — mirrors /simple with the
 * Fitting Curve Basis, Shape of Cornea Effectiveness, and Keratometry
 * Information tables hidden. Not linked from the main page.
 */
export default function JaSimplePage() {
  return <Calculator simple lang="ja" />;
}
