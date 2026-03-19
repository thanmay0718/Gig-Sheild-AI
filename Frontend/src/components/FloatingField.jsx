export default function FloatingField({ label, children }) {
  return (
    <label className="relative block">
      <span className="absolute left-4 top-3 text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
