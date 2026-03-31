import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './index.css';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Layout
import AppLayout from './components/layout/AppLayout';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Workers from './pages/admin/Workers';
import AdminPolicies from './pages/admin/Policies';
import AdminClaims from './pages/admin/Claims';
import AdminPayments from './pages/admin/Payments';
import Fraud from './pages/admin/Fraud';
import Analytics from './pages/admin/Analytics';

// Worker pages
import WorkerDashboard from './pages/worker/Dashboard';
import MyPolicies from './pages/worker/MyPolicies';
import MyClaims from './pages/worker/MyClaims';
import MyPayments from './pages/worker/MyPayments';
import WorkerProfile from './pages/worker/Profile';
import WorkerSettings from './pages/worker/Settings';

// Admin shared settings
import AdminSettings from './pages/shared/Settings';

// ─── Route Guards ───
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/worker" />;
  return children;
}

function WorkerRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (isAdmin) return <Navigate to="/admin" />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/worker'} />;
  return children;
}

// ─── Page Router for layout ───
function AdminPages({ activePage }) {
  const pageMap = {
    dashboard: <AdminDashboard />,
    analytics: <Analytics />,
    workers: <Workers />,
    policies: <AdminPolicies />,
    claims: <AdminClaims />,
    payments: <AdminPayments />,
    fraud: <Fraud />,
    settings: <AdminSettings />,
  };
  return pageMap[activePage] || <AdminDashboard />;
}

function WorkerPages({ activePage }) {
  const pageMap = {
    dashboard: <WorkerDashboard />,
    triggers: <WorkerDashboard />,
    policies: <MyPolicies />,
    claims: <MyClaims />,
    payments: <MyPayments />,
    profile: <WorkerProfile />,  // 🆕 Personal details setup/view/edit
    settings: <WorkerSettings />, // 🆕 Delete account + preferences
  };
  return pageMap[activePage] || <WorkerDashboard />;
}

// ─── Loading Screen ───
function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--color-bg-base)' }}>
      <div className="flex flex-col items-center gap-4 anim-fade-in">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #c8ff00, #94bf00)', animation: 'pulse-glow 2s ease-in-out infinite' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading GigShield...</p>
      </div>
    </div>
  );
}

// ─── App ───
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Admin Dashboard */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AppLayout>
              {({ activePage }) => <AdminPages activePage={activePage} />}
            </AppLayout>
          </AdminRoute>
        } />

        {/* Worker Dashboard */}
        <Route path="/worker/*" element={
          <WorkerRoute>
            <AppLayout>
              {({ activePage }) => <WorkerPages activePage={activePage} />}
            </AppLayout>
          </WorkerRoute>
        } />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
