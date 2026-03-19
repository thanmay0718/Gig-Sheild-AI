export default function Progress({ value = 0 }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-white/[0.06]">
      <div className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}
