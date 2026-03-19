import { Outlet } from "react-router-dom";

import AmbientBackground from "@/components/AmbientBackground";
import AppLogo from "@/components/AppLogo";

export default function AuthLayout() {
  return (
    <div className="app-shell relative overflow-hidden">
      <AmbientBackground />
      <div className="relative z-10 px-6 py-6 lg:px-10">
        <AppLogo />
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
