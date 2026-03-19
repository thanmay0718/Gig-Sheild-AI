import { Navigate, Route, Routes } from "react-router-dom";

import { AppToaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";          // CHANGED: removed AuthProvider
                                                           // import, already in main.jsx
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import MarketingLayout from "@/layouts/MarketingLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AdminClaims from "@/pages/admin/AdminClaims";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Analytics from "@/pages/admin/Analytics";
import FraudAlerts from "@/pages/admin/FraudAlerts";
import AdminWorkers from "@/pages/admin/AdminWorkers";
import WorkerClaims from "@/pages/worker/WorkerClaims";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import WorkerPayments from "@/pages/worker/WorkerPayments";
import WorkerPolicies from "@/pages/worker/WorkerPolicies";
import WorkerRegister from "@/pages/worker/WorkerRegister";

function ProtectedRoute({ role, children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role && user?.role?.toUpperCase() !== role.toUpperCase())  // CHANGED: case-insensitive
    return <Navigate                                              // comparison so "ADMIN"
      to={user?.role?.toUpperCase() === "ADMIN"                  // and "admin" both work
        ? "/admin"
        : "/worker"}
      replace
    />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login defaultMode="login" />} />
        <Route path="/register" element={<WorkerRegister />} />
      </Route>

      <Route
        path="/worker"
        element={
          <ProtectedRoute role="WORKER">              {/* CHANGED: uppercase to match  */}
            <DashboardLayout />                        {/* Spring Boot's role format   */}
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route path="policies" element={<WorkerPolicies />} />
        <Route path="claims" element={<WorkerClaims />} />
        <Route path="payments" element={<WorkerPayments />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">              {/* CHANGED: uppercase to match  */}
            <DashboardLayout />                       {/* Spring Boot's role format   */}
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="workers" element={<AdminWorkers />} />
        <Route path="claims" element={<AdminClaims />} />
        <Route path="fraud" element={<FraudAlerts />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (                                               // CHANGED: removed <AuthProvider>
    <>                                                   // wrapper, it's in main.jsx
      <AppToaster />                                     // double wrapping caused context
      <AppRoutes />                                      // to reset on every re-render
    </>
  );
}