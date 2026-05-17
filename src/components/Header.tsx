import Image from "next/image";
import bocLogo from "@/assets/boc-logo.jpg";
import { useT } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ dateLabel }: { dateLabel: string }) {
  const T = useT();
  return (
    <header className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(115deg,#2a5193_0%,#234780_55%,#1b3866_100%)] px-5 py-5 text-white shadow-[0_12px_30px_-14px_rgba(31,61,112,0.55)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-1/2 hidden h-[360px] w-[360px] -translate-y-1/2 rounded-full sm:block"
        style={{
          background:
            "repeating-radial-gradient(circle at center, transparent 0 19px, rgba(255,255,255,0.07) 19px 20px)",
        }}
      />
      <div className="relative z-10 flex items-center gap-3.5 sm:gap-[18px]">
        <div className="flex-none rounded-[11px] bg-white px-2.5 py-1.5 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.3)] sm:px-3 sm:py-2">
          <Image
            src={bocLogo}
            alt="Breath-O Correct"
            priority
            className="h-9 w-auto sm:h-[42px]"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-base font-bold leading-tight tracking-[-0.015em] break-words sm:text-[22px]">
            <span className="print:hidden">{T.appTitle}</span>
            <span className="hidden print:inline">{T.printTitle}</span>
          </h1>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b9c8e2] sm:text-[11.5px] sm:tracking-[0.17em]">
            {T.appSubtitle}
          </p>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5 sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0">
        <div className="text-left sm:text-right">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9fb1d0]">
            {T.reportDate}
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
