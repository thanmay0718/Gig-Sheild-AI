import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI, workersAPI } from '../../api/config';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Trash2, Shield, Bell, CheckCircle,
  Loader2, AlertTriangle, Eye, EyeOff, Save
} from 'lucide-react';

// 🔌 DELETE /api/v1/workers/{id}  → Delete worker profile
// 🔌 POST   /auth/logout          → Logout user

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Delete Account ──────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') {
      showToast('Please type DELETE to confirm.', 'error');
      return;
    }
    setDeleting(true);
    try {
      // 1. Find this user's worker profile by email
      const workers = await workersAPI.getAll();
      const mine = workers.find(w => w.email?.toLowerCase() === user?.email?.toLowerCase());
      if (mine) {
        await workersAPI.delete(mine.id); // 🔌 DELETE /api/v1/workers/{id}
      }
      // 2. Logout
      await logout();
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Failed to delete account.', 'error');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-[720px] space-y-6 pb-20">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl anim-scale-in"
          style={{
            background: toast.type === 'error' ? 'rgba(248,113,113,0.12)' : 'rgba(200,255,0,0.10)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.3)' : 'rgba(200,255,0,0.3)'}`,
            backdropFilter: 'blur(16px)',
          }}>
          {toast.type === 'error'
            ? <AlertTriangle size={18} style={{ color: '#f87171' }} />
            : <CheckCircle size={18} style={{ color: '#c8ff00' }} />}
          <span className="text-sm font-medium text-white">{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="anim-fade-up">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c8ff00' }}>Account</span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">Settings</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Manage your account preferences and security.
        </p>
      </div>

      {/* Account Info */}
      <div className="gs-card p-6 anim-fade-up delay-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#c8ff0018' }}>
            <User size={16} style={{ color: '#c8ff00' }} />
          </div>
          <h3 className="font-semibold text-white text-sm">Account Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>Full Name</p>
            <p className="text-sm font-medium text-white">{user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>Email</p>
            <p className="text-sm font-medium text-white">{user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>Role</p>
            <span className="gs-badge gs-badge-accent">{user?.role || '—'}</span>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>Status</p>
            <span className="gs-badge gs-badge-success">Active</span>
          </div>
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
            To update your personal details (address, bank info, etc.), visit the{' '}
            <a
              className="font-semibold cursor-pointer transition-colors"
              style={{ color: '#c8ff00' }}
              onClick={() => navigate('/worker/profile')}
            >
              My Profile
            </a>{' '}
            page.
          </p>
        </div>
      </div>

      {/* Preferences */}
      <div className="gs-card p-6 anim-fade-up delay-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#a78bfa18' }}>
            <Bell size={16} style={{ color: '#a78bfa' }} />
          </div>
          <h3 className="font-semibold text-white text-sm">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Weather alerts when trigger thresholds are near', def: true },
            { label: 'Payout deposited notifications', def: true },
            { label: 'Claim status updates', def: true },
            { label: 'Weekly summary digest', def: false },
          ].map(item => (
            <ToggleRow key={item.label} label={item.label} defaultChecked={item.def} />
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="gs-card p-6 anim-fade-up delay-300"
        style={{ borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.03)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.12)' }}>
            <Trash2 size={16} style={{ color: '#f87171' }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: '#f87171' }}>Danger Zone</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
              These actions are permanent and cannot be undone.
            </p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="gs-btn w-full justify-center"
            style={{
              background: 'rgba(248,113,113,0.08)',
              color: '#f87171',
              border: '1px solid rgba(248,113,113,0.2)',
            }}>
            <Trash2 size={16} /> Delete My Account
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#f87171' }}>⚠️ This will permanently delete:</p>
              <ul className="text-xs space-y-1 mt-2" style={{ color: 'var(--color-text-dim)' }}>
                <li>• Your worker profile and identity documents</li>
                <li>• All your claims history</li>
                <li>• Your insurance policies</li>
              </ul>
            </div>
            <div>
              <label className="gs-label">Type <strong style={{ color: '#f87171' }}>DELETE</strong> to confirm</label>
              <input
                className="gs-input"
                placeholder="DELETE"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                style={{ borderColor: deleteInput === 'DELETE' ? '#f87171' : undefined }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                className="gs-btn gs-btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput !== 'DELETE'}
                className="gs-btn flex-1 justify-center"
                style={{
                  background: 'rgba(248,113,113,0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(248,113,113,0.3)',
                  opacity: deleteInput !== 'DELETE' ? 0.5 : 1,
                }}>
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        className="relative w-10 h-5 rounded-full transition-all duration-300"
        style={{ background: on ? '#c8ff00' : 'rgba(255,255,255,0.08)' }}>
        <span className="absolute top-0.5 transition-all duration-300 w-4 h-4 rounded-full bg-black shadow"
          style={{ left: on ? '22px' : '2px' }} />
      </button>
    </div>
  );
}
