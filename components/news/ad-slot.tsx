export function AdSlot({ label = "Advertisement" }: { label?: string }) {
  return (
    <aside className="grid min-h-28 place-items-center rounded border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center text-xs font-bold uppercase tracking-[0.24em] text-white/35">
      {label}
    </aside>
  );
}
