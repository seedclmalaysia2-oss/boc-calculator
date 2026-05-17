import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Máy tính kính thử Ortho-K BOC",
  description:
    "Máy tính Ortho-K Breath-O Correct để chọn kính thử ban đầu từ dữ liệu đo giác mạc và khúc xạ.",
};

/** Vietnamese calculator at /vi — same engine as the English home page. */
export default function ViHome() {
  return <Calculator lang="vi" />;
}
