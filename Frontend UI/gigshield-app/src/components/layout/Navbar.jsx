import { useAuth } from '../../context/AuthContext';
import { Search, Bell, LogOut, Moon, FileText, Users, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const pageTitles = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  workers: 'Workers',
  policies: 'Policies',
  claims: 'Claims',
  payments: 'Payments',
  fraud: 'Fraud Detection',
  settings: 'Settings',
  triggers: 'Live Triggers',
};

export default function Navbar({ activePage }) {
  const { user, logout, isAdmin } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light-mode'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light-mode');
    setIsLight(!isLight);
  };

  return (
    <header
      className="h-20 w-full flex items-center justify-between shrink-0 z-40"
      style={{ background: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)', padding: '0 48px' }}
    >
      {/* Left: Page title + breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{pageTitles[activePage] || 'Dashboard'}</h1>
          <p className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>
            {isAdmin ? 'Admin Panel' : 'Worker Portal'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <div
            className="flex items-center gap-2 px-3 h-10 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--color-bg-surface)',
              border: `1px solid ${searchFocused ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
              width: searchFocused ? 280 : 220,
            }}
          >
            <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              placeholder="Search claims, workers, or policies..."
              className="bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder-zinc-500 flex-1 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
              style={{ color: 'var(--color-text-dim)', background: 'var(--color-bg-elevated)' }}>⌘K</kbd>
          </div>
          {/* Fake Search Results Dropdown */}
          {searchFocused && (searchQuery.length > 0) && (
            <div className="absolute top-12 left-0 w-full rounded-xl shadow-2xl overflow-hidden anim-scale-in" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', zIndex: 100 }}>
              <div className="p-3 text-xs font-semibold" style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-dim)' }}>
                Top Results
              </div>
              <div className="p-2 space-y-1">
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-[var(--color-text-primary)]">
                  <FileText size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Claim <strong className="text-white">#{searchQuery}7X</strong></span>
                </button>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-[var(--color-text-primary)]">
                  <Users size={14} style={{ color: 'var(--color-purple)' }} />
                  <span>Worker data for: <strong className="text-white">{searchQuery}</strong></span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
        >
          <Bell size={16} style={{ color: 'var(--color-text-secondary)' }} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: '#ef4444', color: '#fff' }}>3</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8" style={{ background: 'var(--color-border)' }} />

        {/* Role badge */}
        <span
          className="gs-badge"
          style={{
            background: isAdmin ? 'rgba(200,255,0,0.08)' : 'rgba(167,139,250,0.08)',
            color: isAdmin ? '#c8ff00' : '#a78bfa',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '11px',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block mr-1"
            style={{ background: isAdmin ? '#c8ff00' : '#a78bfa' }} />
          {isAdmin ? 'ADMIN' : 'WORKER'}
        </span>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
            style={{ background: showProfile ? 'var(--color-bg-elevated)' : 'transparent' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                background: isAdmin
                  ? 'linear-gradient(135deg, rgba(200,255,0,0.15), rgba(200,255,0,0.05))'
                  : 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.05))',
                color: isAdmin ? '#c8ff00' : '#a78bfa',
              }}
            >
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </div>
          </button>

          {/* Dropdown */}
          {showProfile && (
            <div
              className="absolute right-0 top-12 w-56 rounded-xl overflow-hidden shadow-2xl anim-scale-in"
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{user?.email}</p>
              </div>
              <div className="p-2">
                <button onClick={toggleTheme} className="sidebar-link w-full text-sm">
                  {isLight ? <Moon size={14} /> : <Sun size={14} />}
                  <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button
                  onClick={logout}
                  className="sidebar-link w-full text-sm"
                  style={{ color: '#f87171' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
