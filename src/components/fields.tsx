type CellTone = "default" | "invalid";

const cellBase =
  "w-full rounded-lg border bg-field px-2.5 py-2 text-center font-mono text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-field-focus focus:shadow-[0_0_0_3px_var(--focus-ring)]";

function toneClass(tone: CellTone) {
  return tone === "invalid"
    ? "border-no focus:border-no focus:shadow-[0_0_0_3px_var(--focus-ring-invalid)]"
    : "border-line";
}

export function InputCell({
  value,
  onChange,
  ariaLabel,
  placeholder,
  tone = "default",
  inputMode = "decimal",
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  tone?: CellTone;
  inputMode?: "decimal" | "numeric" | "text";
}) {
  return (
    <input
      type="text"
      inputMode={inputMode}
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${cellBase} ${toneClass(tone)}`}
    />
  );
}

export function SelectCell({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${cellBase} ${toneClass("default")} cursor-pointer pr-6`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink3"
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden
      >
        <path
          d="M1 1l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Three-column header row: spacer, RE·OD, LE·OS. */
export function EyeColumnHeader() {
  return (
    <div className="mb-2 grid grid-cols-[116px_1fr_1fr] gap-2.5">
      <span aria-hidden />
      <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-ink3">
        <i className="h-[7px] w-[7px] rounded-full bg-brand" />
        RE · OD
      </span>
      <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-ink3">
        <i className="h-[7px] w-[7px] rounded-full bg-gold" />
        LE · OS
      </span>
    </div>
  );
}

/** A labelled three-column row: field name, RE control, LE control. */
export function FieldRow({
  label,
  re,
  le,
}: {
  label: string;
  re: React.ReactNode;
  le: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 grid grid-cols-[116px_1fr_1fr] items-center gap-2.5">
      <label className="text-[12.5px] font-semibold text-ink2">{label}</label>
      {re}
      {le}
    </div>
  );
}
