export function Panel({
  step,
  title,
  headerRight,
  children,
}: {
  step: number;
  title: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[13px] border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-hairline bg-tint px-5 py-3">
        <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px] bg-gold font-mono text-xs font-semibold text-white">
          {step}
        </span>
        <h2 className="font-display text-[17px] font-bold tracking-[-0.015em] text-brand">
          {title}
        </h2>
        {headerRight}
      </div>
      <div className="px-5 pb-5 pt-[18px]">{children}</div>
    </section>
  );
}
