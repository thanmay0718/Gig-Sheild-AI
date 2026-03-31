import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Lock } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="space-y-12 max-w-[1100px] mx-auto py-6">
      <div className="anim-fade-up">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>Settings & Preferences</h2>
        <p className="text-base mt-2" style={{ color: 'var(--color-text-muted)' }}>Manage your account preferences and security options</p>
      </div>

      <div className="gs-card gs-card-interactive anim-fade-up delay-100" style={{ padding: '40px' }}>
        <div className="flex items-center gap-4 mb-8"><User size={24} style={{ color: 'var(--color-accent)' }} /><h3 className="text-xl font-bold content-title" style={{ color: 'var(--color-text-primary)' }}>Profile Identity</h3></div>
        <div className="grid grid-cols-2 gap-8">
          <div><label className="gs-label">Full Name</label><input className="gs-input hover:border-white/20" defaultValue={user?.name} /></div>
          <div><label className="gs-label">Email Address</label><input className="gs-input" defaultValue={user?.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} /></div>
          <div><label className="gs-label">System Role</label><input className="gs-input" defaultValue={user?.role} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} /></div>
        </div>
      </div>

      <div className="gs-card anim-fade-up delay-200" style={{ padding: '40px' }}>
        <div className="flex items-center gap-4 mb-8"><Bell size={24} style={{ color: '#a78bfa' }} /><h3 className="text-xl font-bold content-title" style={{ color: 'var(--color-text-primary)' }}>Notification Center</h3></div>
        <div className="space-y-4">
          {['Email notifications', 'Push notifications', 'Claim trigger alerts', 'Payment settlement confirmations'].map(n => (
            <div key={n} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 px-4 rounded-xl transition-colors">
              <span className="text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>{n}</span>
              <TogglePill defaultOn={true} />
            </div>
          ))}
        </div>
      </div>

      <div className="gs-card anim-fade-up delay-300" style={{ padding: '40px' }}>
        <div className="flex items-center gap-4 mb-8"><Lock size={24} style={{ color: '#fb923c' }} /><h3 className="text-xl font-bold content-title" style={{ color: 'var(--color-text-primary)' }}>Security & Backup</h3></div>
        <button onClick={() => alert("Password reset instructions have been sent to your email!")} className="gs-btn gs-btn-secondary h-14 px-8 font-bold cursor-pointer hover:bg-white/20">Change Password</button>
      </div>
      <div>
        <button className="gs-btn gs-btn-primary h-14 px-10 text-base font-bold anim-fade-up delay-400">Save All Changes</button>
      </div>
    </div>
  );
}

function TogglePill({ defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className="transition-all hover:scale-105" style={{ width: 44, height: 24, borderRadius: 12, padding: 2, background: on ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', border: 'none' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: on ? '#09090b' : 'rgba(255,255,255,0.3)', transform: on ? 'translateX(20px)' : 'translateX(0)', border: '1px solid rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }} />
    </button>
  );
}
