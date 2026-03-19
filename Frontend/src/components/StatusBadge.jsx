const colors = {
  approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  rejected: "border-red-500/20 bg-red-500/10 text-red-300",
  high: "border-red-500/20 bg-red-500/10 text-red-300",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  low: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  balanced: "border-sky-500/20 bg-sky-500/10 text-sky-300",
};

export default function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${colors[key] || "border-white/10 bg-white/[0.04] text-zinc-300"}`}>
      {status}
    </span>
  );
}
