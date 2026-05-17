import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "BOC オルソK トライアルレンズ計算ツール",
  description:
    "ケラトメトリーと屈折のデータから初期トライアルレンズを選択する Breath-O Correct オルソK計算ツール。",
};

/** Japanese calculator at /ja — same engine as the English home page. */
export default function JaHome() {
  return <Calculator lang="ja" />;
}
