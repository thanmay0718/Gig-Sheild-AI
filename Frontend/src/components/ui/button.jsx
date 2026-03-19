export default function Button({ children, className = "", variant = "primary", type = "button", ...props }) {
  const variants = {
    primary: "bg-sky-500 text-white hover:bg-sky-400 shadow-glow",
    secondary: "bg-white/[0.04] text-white border border-white/10 hover:bg-white/[0.07]",
    ghost: "bg-transparent text-zinc-300 hover:bg-white/[0.05]",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition duration-200 hover:scale-[1.02] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
