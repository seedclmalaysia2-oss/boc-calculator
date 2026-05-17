import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Kalkulator Lensa Coba Ortho-K BOC",
  description:
    "Kalkulator Ortho-K Breath-O Correct untuk memilih lensa coba awal dari data keratometri dan refraksi.",
};

/** Indonesian calculator at /id — same engine as the English home page. */
export default function IdHome() {
  return <Calculator lang="id" />;
}
