export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`h-16 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pb-3 pt-7 text-white outline-none transition focus:border-sky-500/30 ${className}`}
      {...props}
    />
  );
}
