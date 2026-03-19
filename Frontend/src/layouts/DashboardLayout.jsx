import { Link, NavLink, Outlet } from "react-router-dom";   // CHANGED: removed useLocation

import AppLogo from "@/components/AppLogo";
import Panel from "@/components/Panel";
import Button from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const workerNav = [
  { label: "Overview", to: "/worker" },
  { label: "Policies", to: "/worker/policies" },
  { label: "Claims", to: "/worker/claims" },
  { label: "Payments", to: "/worker/payments" },
];

const adminNav = [
  { label: "Overview", to: "/admin" },
  { label: "Workers", to: "/admin/workers" },
  { label: "Claims", to: "/admin/claims" },
  { label: "Fraud Alerts", to: "/admin/fraud" },
  { label: "Analytics", to: "/admin/analytics" },
];

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();               // CHANGED: get isAdmin from
                                                             // useAuth() instead of pathname
                                                             // pathname check could show
                                                             // wrong nav if URL is typed manually
  const navItems = isAdmin ? adminNav : workerNav;

  return (
    <div className="app-shell">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <Panel className="sticky top-4 flex min-h-[calc(100vh-2rem)] flex-col justify-between p-4">
            <div>
              <div className="px-2 pb-8">
                <AppLogo to={isAdmin ? "/admin" : "/worker"} />
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/worker" || item.to === "/admin"}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-sm transition ${
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Panel className="p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Signed in</p>
                <p className="mt-3 text-sm text-white">{user?.email}</p>
                {/* CHANGED: role display uses user?.role directly, lowercase for display */}
                <p className="mt-1 text-sm capitalize text-zinc-500">
                  {user?.role?.toLowerCase()} account
                </p>
              </Panel>
              <Button variant="secondary" className="w-full" onClick={logout}>
                Logout
              </Button>
            </div>
          </Panel>
        </aside>

        <div className="min-w-0 flex-1">
          <Panel className="mb-6 flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {isAdmin ? "Admin workspace" : "Worker workspace"}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {isAdmin ? "Platform intelligence" : "Personal protection overview"}
              </p>
            </div>
            <Link
              to={isAdmin ? "/admin/fraud" : "/worker/claims"}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Notifications
            </Link>
          </Panel>
          <Outlet />
        </div>
      </div>
    </div>
  );
}