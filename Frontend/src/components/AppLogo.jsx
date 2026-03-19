import { Link } from "react-router-dom";

export default function AppLogo({ to = "/" }) {
  return (
    <Link to={to} className="inline-flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <span className="text-lg">🛡</span>
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.28em] text-zinc-500">GIGSHIELD AI</p>
        <p className="text-sm text-zinc-300">Insurance for modern gig work</p>
      </div>
    </Link>
  );
}
