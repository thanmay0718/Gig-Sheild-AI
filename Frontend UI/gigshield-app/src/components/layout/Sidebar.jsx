import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Shield, FileText, Zap, Users, CreditCard, AlertTriangle, BarChart3, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const adminNav = [
  { section: 'OVERVIEW' },
  { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'analytics',  label: 'Analytics',      icon: BarChart3 },
  { section: 'MANAGE' },
  { id: 'workers',    label: 'Workers',        icon: Users },
  { id: 'policies',   label: 'Policies',       icon: Shield },
  { id: 'claims',     label: 'Claims',         icon: FileText },
  { id: 'payments',   label: 'Payments',       icon: CreditCard },
  { id: 'fraud',      label: 'Fraud Detection',icon: AlertTriangle },
  { section: 'SYSTEM' },
  { id: 'settings',   label: 'Settings',       icon: Settings },
];

const workerNav = [
  { section: 'MY DASHBOARD' },
  { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'triggers',   label: 'Live Triggers',  icon: Zap },
  { section: 'MY ACCOUNT' },
  { id: 'profile',    label: 'My Profile',     icon: User },     // 🆕 Personal details
  { id: 'policies',   label: 'My Policies',    icon: Shield },
  { id: 'claims',     label: 'My Claims',      icon: FileText },
  { id: 'payments',   label: 'My Payments',    icon: CreditCard },
  { section: 'SYSTEM' },
  { id: 'settings',   label: 'Settings',       icon: Settings },
];


export default function Sidebar({ activePage, onNavigate }) {
  const { isAdmin, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = isAdmin ? adminNav : workerNav;

  return (
    <aside
      className="h-screen flex flex-col shrink-0 z-50 transition-all duration-300"
      style={{
        width: collapsed ? 90 : 320,
        background: 'var(--color-bg-base)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-8 h-24 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #c8ff00, #94bf00)',
              boxShadow: '0 8px 24px rgba(200,255,0,0.25)',
            }}
          >
            <Shield size={22} color="#09090b" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-xl font-extrabold tracking-tight ml-2" style={{ color: 'var(--color-text-primary)' }}>
              GigShield<span style={{ color: 'var(--color-accent)' }}>.</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ color: 'var(--color-text-dim)' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 py-4">
        {navItems.map((item, i) => {
          if (item.section) {
            if (collapsed) return <div key={i} className="my-5 mx-2 h-px" style={{ background: 'var(--color-border)' }} />;
            return (
              <p key={i} className="px-4 pt-8 pb-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-dim)' }}>
                {item.section}
              </p>
            );
          }
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-link w-full mb-1 min-h-[50px] rounded-xl ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
              style={collapsed ? { justifyContent: 'center', padding: '12px' } : { padding: '12px 20px' }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span className="text-[15px] font-semibold ml-3">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User card at bottom */}
      <div className="px-6 pb-8 pt-6 shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
        {!collapsed ? (
          <div className="flex items-center gap-4 px-2 py-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{
                background: isAdmin ? 'rgba(200,255,0,0.12)' : 'rgba(167,139,250,0.12)',
                color: isAdmin ? '#c8ff00' : '#a78bfa',
              }}
            >
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'User'}</p>
              <p className="text-xs font-semibold mt-0.5 truncate uppercase tracking-wider" style={{ color: 'var(--color-text-dim)' }}>
                {isAdmin ? 'Administrator' : 'Worker'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                background: isAdmin ? 'rgba(200,255,0,0.12)' : 'rgba(167,139,250,0.12)',
                color: isAdmin ? '#c8ff00' : '#a78bfa',
              }}
            >
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
