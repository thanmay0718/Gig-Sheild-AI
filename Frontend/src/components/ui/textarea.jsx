export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none transition focus:border-sky-500/30 ${className}`}
      {...props}
    />
  );
}
