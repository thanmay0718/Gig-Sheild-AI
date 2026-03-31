import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Briefcase } from 'lucide-react';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', phoneNumber: '', role: 'WORKER' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      // 🔌 POST /api/v1/auth/register → Register new user
      await register(form.name, form.username, form.email, form.password, form.phoneNumber, form.role);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex h-screen w-screen">
      {/* LEFT — Animated Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent)' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(200,255,0,0.12), transparent)' }} />
        </div>

        <div className="shield-container anim-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />
          <div className="orbit-dot orbit-dot-1" />
          <div className="orbit-dot orbit-dot-2" />
          <div className="orbit-dot orbit-dot-3" />
          <div className="orbit-dot orbit-dot-4" />
          <div className="shield-hex">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Shield size={36} color="#c8ff00" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 12px rgba(200,255,0,0.4))' }} />
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 gs-card p-4 anim-float" style={{ width: 200 }}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: '#a78bfa' }}>AI-POWERED</p>
          <p className="text-sm font-semibold text-white">Zero Paperwork</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-dim)' }}>Auto-triggered claims via weather APIs</p>
        </div>

        <div className="absolute bottom-1/4 right-1/6 gs-card p-4 anim-float" style={{ animationDelay: '1.5s', width: 180 }}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: '#4ade80' }}>COVERAGE</p>
          <p className="text-2xl font-bold text-white">₹299<span className="text-xs font-normal" style={{ color: 'var(--color-text-dim)' }}>/mo</span></p>
        </div>
      </div>

      {/* RIGHT — Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-[420px] px-6 anim-fade-up">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #c8ff00, #94bf00)', boxShadow: '0 4px 20px rgba(200,255,0,0.2)' }}>
              <Shield size={18} color="#09090b" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">GigShield<span style={{ color: '#c8ff00' }}>.</span></span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ letterSpacing: '-0.5px' }}>Create your account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Join 24,800+ workers protected by AI-powered parametric insurance</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm anim-scale-in"
              style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="gs-label">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'WORKER', label: 'Gig Worker', desc: 'Delivery, ride-share', icon: Briefcase },
                  { val: 'ADMIN', label: 'Administrator', desc: 'Platform manager', icon: Shield },
                ].map(r => (
                  <button key={r.val} type="button" onClick={() => update('role', r.val)}
                    className="gs-card p-4 text-left transition-all"
                    style={{
                      borderColor: form.role === r.val ? '#c8ff00' : 'var(--color-border)',
                      background: form.role === r.val ? 'rgba(200,255,0,0.04)' : 'var(--color-bg-card)',
                    }}>
                    <r.icon size={18} style={{ color: form.role === r.val ? '#c8ff00' : 'var(--color-text-dim)', marginBottom: 8 }} />
                    <p className="text-sm font-semibold text-white">{r.label}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="gs-label">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="gs-input" placeholder="John Doe" required style={{ paddingLeft: 44 }} />
                </div>
              </div>

              <div>
                <label className="gs-label">Username</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
                  <input type="text" value={form.username} onChange={e => update('username', e.target.value)}
                    className="gs-input" placeholder="johndoe" required style={{ paddingLeft: 44 }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="gs-label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="gs-input" placeholder="you@example.com" required style={{ paddingLeft: 44 }} />
                </div>
              </div>

              <div>
                <label className="gs-label">Phone Number</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
                  <input type="tel" value={form.phoneNumber} onChange={e => update('phoneNumber', e.target.value)}
                    className="gs-input" placeholder="9876543210" pattern="^[6-9]\d{9}$" required style={{ paddingLeft: 44 }} title="Must be a valid 10-digit Indian phone number starting with 6-9" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="gs-label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                    className="gs-input" placeholder="••••••••" required style={{ paddingLeft: 44 }} />
                </div>
              </div>
              <div>
                <label className="gs-label">Confirm</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
                  <input type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                    className="gs-input" placeholder="••••••••" required style={{ paddingLeft: 44 }} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="gs-btn gs-btn-primary w-full h-12 text-sm font-semibold" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-sm text-center mt-8" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account? <Link to="/login" className="font-medium" style={{ color: '#c8ff00' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
