import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The calculator is fully client-side, so `next build` emits a
  // self-contained static `out/` folder — no Node server to run.
  output: "export",
  // Static export has no Image Optimization server; serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
