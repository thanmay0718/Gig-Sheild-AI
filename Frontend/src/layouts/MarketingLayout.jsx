import { Link, Outlet } from "react-router-dom";

import AmbientBackground from "@/components/AmbientBackground";
import AppLogo from "@/components/AppLogo";
import Button from "@/components/ui/button";

export default function MarketingLayout() {
  return (
    <div className="app-shell relative overflow-hidden">
      <AmbientBackground />
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <AppLogo />
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/register"><Button variant="primary">Get Started</Button></Link>
          </div>
        </div>
      </header>
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
