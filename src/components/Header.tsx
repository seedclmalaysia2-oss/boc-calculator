import Image from "next/image";
import bocLogo from "@/assets/boc-logo.jpg";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ dateLabel }: { dateLabel: string }) {
  return (
    <header className="relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-[linear-gradient(115deg,#2a5193_0%,#234780_55%,#1b3866_100%)] px-6 py-6 text-white shadow-[0_12px_30px_-14px_rgba(31,61,112,0.55)] sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "repeating-radial-gradient(circle at center, transparent 0 19px, rgba(255,255,255,0.07) 19px 20px)",
        }}
      />
      <div className="relative z-10 flex items-center gap-4 sm:gap-[18px]">
        <div className="flex-none rounded-[11px] bg-white px-3 py-2 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.3)]">
          <Image
            src={bocLogo}
            alt="Breath-O Correct"
            priority
            className="h-[42px] w-auto"
          />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight tracking-[-0.015em] sm:text-[22px]">
            <span className="print:hidden">Ortho-K Trial Lens Calculator</span>
            <span className="hidden print:inline">
              SEED BOC Ortho-K Trial Lens Recommendation
            </span>
          </h1>
          <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.17em] text-[#b9c8e2]">
            Initial Lens Selection Tool
          </p>
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9fb1d0]">
            Report Date
          </div>
          <div
            suppressHydrationWarning
            className="mt-0.5 min-h-[20px] font-mono text-[15px]"
          >
            {dateLabel}
          </div>
        </div>
        <div className="print:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
