import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { workersAPI } from '../../api/config';
import {
  User, MapPin, Briefcase, CreditCard, Shield, CheckCircle,
  Loader2, AlertCircle, Edit3, Save, X
} from 'lucide-react';

// 🔌 POST /api/v1/workers    → Create new worker profile (first time setup)
// 🔌 PUT  /api/v1/workers/by-email → Update existing worker profile

export default function WorkerProfile() {
  const { user } = useAuth();
  const [mode, setMode] = useState('loading'); // 'loading' | 'setup' | 'view' | 'edit'
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [workerId, setWorkerId] = useState(null);

  const emptyForm = {
    email: user?.email || '',
    area: '',
    pincode: '',
    address: '',
    deliverySegment: 'FOOD',
    avgIncome: '',
    aadhaarNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    bankName: '',
  };

  // Separate state: profile = server response (for VIEW), editForm = what user types (for EDIT)
  const [form, setForm] = useState(emptyForm);
  const [profile, setProfile] = useState(null);

  // ── Sensitive fields that come back masked from backend (e.g. XXXX-XXXX-1234)
  // We NEVER pre-fill these — user must always retype them when editing
  const SENSITIVE_KEYS = ['aadhaarNumber', 'panNumber', 'bankAccountNumber'];

  // On mount, try to fetch existing worker profile by email
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const workers = await workersAPI.getAll();
        const mine = workers.find(w => w.email?.toLowerCase() === user?.email?.toLowerCase());
        if (mine) {
          setProfile(mine);
          setWorkerId(mine.id);
          // Pre-fill form with NON-sensitive fields only
          const safeForm = { ...emptyForm };
          Object.keys(emptyForm).forEach(k => {
            if (!SENSITIVE_KEYS.includes(k)) {
              safeForm[k] = mine[k] ?? emptyForm[k];
            }
          });
          setForm(safeForm);
          setMode('view');
        } else {
          setMode('setup');
        }
      } catch {
        setMode('setup');
      }
    };
    if (user?.email) fetchProfile();
  }, [user]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        ...form, 
        avgIncome: parseFloat(form.avgIncome),
        email: user?.email, // always use the authenticated user's email
      };
      // Remove empty sensitive fields so they don't overwrite with blank
      if (!payload.aadhaarNumber) delete payload.aadhaarNumber;
      if (!payload.panNumber) delete payload.panNumber;
      if (!payload.bankAccountNumber) delete payload.bankAccountNumber;

      let result;
      if (workerId) {
        result = await workersAPI.update(workerId, payload);
      } else {
        result = await workersAPI.create(payload);
        setWorkerId(result?.id);
      }
      // Update profile view with what server returned
      setProfile(result);
      // Reset edit form: pre-fill non-sensitive only
      const SENSITIVE_KEYS = ['aadhaarNumber', 'panNumber', 'bankAccountNumber'];
      const safeForm = { ...emptyForm, email: user?.email };
      if (result) {
        Object.keys(emptyForm).forEach(k => {
          if (!SENSITIVE_KEYS.includes(k)) safeForm[k] = result[k] ?? emptyForm[k];
        });
      }
      setForm(safeForm);
      setMode('view');
      showToast(workerId ? 'Profile updated successfully! ✓' : 'Profile created successfully! ✓');
    } catch (err) {
      showToast(err.message || 'Failed to save profile. Check your details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      section: 'Work Details',
      icon: Briefcase,
      color: '#a78bfa',
      fields: [
        { key: 'area', label: 'Working Area', placeholder: 'e.g. Banjara Hills', type: 'text' },
        { key: 'pincode', label: 'Pincode', placeholder: '500034', type: 'text' },
        { key: 'address', label: 'Full Address', placeholder: 'House No, Street, Locality', type: 'text' },
        {
          key: 'deliverySegment', label: 'Delivery Segment', type: 'select',
          options: [
            { val: 'FOOD', label: '🍕 Food Delivery' },
            { val: 'ECOMMERCE', label: '📦 E-Commerce' },
            { val: 'GROCERY', label: '🛒 Grocery' },
          ]
        },
        { key: 'avgIncome', label: 'Monthly Avg. Income (₹)', placeholder: '25000', type: 'number' },
      ]
    },
    {
      section: 'Identity Verification',
      icon: Shield,
      color: '#c8ff00',
      fields: [
        { key: 'aadhaarNumber', label: 'Aadhaar Number', placeholder: '2000 0000 0000', type: 'text' },
        { key: 'panNumber', label: 'PAN Number', placeholder: 'ABCDE1234F', type: 'text' },
      ]
    },
    {
      section: 'Bank Details',
      icon: CreditCard,
      color: '#fb923c',
      fields: [
        { key: 'bankAccountNumber', label: 'Bank Account Number', placeholder: 'Account number', type: 'text' },
        { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. SBI, HDFC', type: 'text' },
      ]
    },
  ];

  if (mode === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin" style={{ color: '#c8ff00' }} />
      </div>
    );
  }

  return (
    <div className="max-w-[860px] space-y-6 pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl anim-scale-in"
          style={{
            background: toast.type === 'error' ? 'rgba(248,113,113,0.12)' : 'rgba(200,255,0,0.10)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.3)' : 'rgba(200,255,0,0.3)'}`,
            backdropFilter: 'blur(16px)',
          }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} style={{ color: '#f87171' }} />
            : <CheckCircle size={18} style={{ color: '#c8ff00' }} />}
          <span className="text-sm font-medium text-white">{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="anim-fade-up flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c8ff00' }}>
            {mode === 'setup' ? '🚀 First Time Setup' : 'My Profile'}
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            {mode === 'setup' ? 'Complete Your Profile' : profile?.name || user?.name || 'Worker Profile'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {mode === 'setup'
              ? 'Fill in your details to activate your GigShield insurance coverage.'
              : `Email: ${profile?.email || user?.email}`}
          </p>
        </div>
        {mode === 'view' && (
          <button onClick={() => {
            // When switching to edit, make sure sensitive fields are empty (never pre-filled)
            const SENSITIVE_KEYS = ['aadhaarNumber', 'panNumber', 'bankAccountNumber'];
            const safeForm = { ...emptyForm, email: user?.email };
            if (profile) {
              Object.keys(emptyForm).forEach(k => {
                if (!SENSITIVE_KEYS.includes(k)) safeForm[k] = profile[k] ?? emptyForm[k];
              });
            }
            setForm(safeForm);
            setMode('edit');
          }} className="gs-btn gs-btn-primary">
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
        {mode === 'edit' && (
          <button onClick={() => setMode('view')} className="gs-btn gs-btn-secondary">
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {/* View Mode */}
      {mode === 'view' && profile && (
        <div className="space-y-4 anim-fade-up">
          {fields.map(section => (
            <div key={section.section} className="gs-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: section.color + '18' }}>
                  <section.icon size={16} style={{ color: section.color }} />
                </div>
                <h3 className="font-semibold text-white text-sm">{section.section}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map(f => (
                  <div key={f.key}>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>{f.label}</p>
                    <p className="text-sm font-medium text-white">
                      {f.key === 'deliverySegment'
                        ? (f.options?.find(o => o.val === profile[f.key])?.label || profile[f.key] || '—')
                        : f.key === 'avgIncome'
                          ? profile[f.key] ? `₹${Number(profile[f.key]).toLocaleString()}` : '—'
                          : profile[f.key] || <span style={{ color: 'var(--color-text-dim)' }}>—</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Setup / Edit Form */}
      {(mode === 'setup' || mode === 'edit') && (
        <form onSubmit={handleSubmit} className="space-y-4 anim-fade-up">
          {/* Email (read-only) */}
          <div className="gs-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2dd4bf18' }}>
                <User size={16} style={{ color: '#2dd4bf' }} />
              </div>
              <h3 className="font-semibold text-white text-sm">Account</h3>
            </div>
            <div>
              <label className="gs-label">Email (linked to your account)</label>
              <input className="gs-input opacity-60 cursor-not-allowed" value={form.email} readOnly />
            </div>
          </div>

          {fields.map(section => (
            <div key={section.section} className="gs-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: section.color + '18' }}>
                  <section.icon size={16} style={{ color: section.color }} />
                </div>
                <h3 className="font-semibold text-white text-sm">{section.section}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map(f => (
                  <div key={f.key} className={f.key === 'address' ? 'col-span-2' : ''}>
                    <label className="gs-label">
                      {f.label}
                      {/* Show hint for sensitive fields so user knows to retype */}
                      {['aadhaarNumber', 'panNumber', 'bankAccountNumber'].includes(f.key) && mode === 'edit' && (
                        <span className="ml-2 text-[10px] font-normal" style={{ color: '#fbbf24' }}>
                          ⚠ Re-enter to update
                        </span>
                      )}
                    </label>
                    {f.type === 'select' ? (
                      <select className="gs-select" value={form[f.key]} onChange={e => update(f.key, e.target.value)}>
                        {f.options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input
                        className="gs-input"
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => update(f.key, e.target.value)}
                        // Sensitive fields not required on edit (may leave blank = keep old value)
                        required={mode === 'setup' || !['aadhaarNumber','panNumber','bankAccountNumber'].includes(f.key)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="gs-btn gs-btn-primary w-full h-12 text-sm font-semibold"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving
              ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
              : <><Save size={16} /> {workerId ? 'Update Profile' : 'Save & Activate Coverage'}</>}
          </button>
        </form>
      )}
    </div>
  );
}
