"use client";

/**
 * Light/dark theme switch. The `.dark` class on <html> is the source of
 * truth — set pre-paint by the init script in the root layout and flipped
 * here. Icon visibility is driven purely by the `dark:` CSS variant, so the
 * button renders identically on the server and client (no hydration flash).
 */
export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage unavailable (private mode) — toggle still works for the session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
    >
      {/* Moon — shown in light mode (click switches to dark). */}
      <svg
        className="block h-[18px] w-[18px] dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M20.2 14.6A8.2 8.2 0 0 1 9.4 3.8 8.2 8.2 0 1 0 20.2 14.6Z"
          fill="currentColor"
        />
      </svg>
      {/* Sun — shown in dark mode (click switches to light). */}
      <svg
        className="hidden h-[18px] w-[18px] dark:block"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4.3" fill="currentColor" />
        <g
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        >
          <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6" />
          <path d="M5.3 5.3l1.85 1.85M16.85 16.85l1.85 1.85M18.7 5.3l-1.85 1.85M7.15 16.85L5.3 18.7" />
        </g>
      </svg>
    </button>
  );
}
