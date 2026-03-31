import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 🔌 POST /api/v1/auth/login → Login & get JWT token
      const userData = await login(email, password);
      navigate(userData.role === 'ADMIN' ? '/admin' : '/worker');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex h-screen w-screen">
      {/* LEFT — Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-[420px] px-6 anim-fade-up">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #c8ff00, #94bf00)', boxShadow: '0 4px 20px rgba(200,255,0,0.2)' }}>
              <Shield size={18} color="#09090b" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              GigShield<span style={{ color: '#c8ff00' }}>.</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ letterSpacing: '-0.5px' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Sign in to protect your gig earnings with AI-powered insurance
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm anim-scale-in"
              style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="gs-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-dim)' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="gs-input" placeholder="you@example.com" required
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>
            <div>
              <label className="gs-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-dim)' }} />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="gs-input" placeholder="Enter your password" required
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-text-dim)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#c8ff00]" />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Remember me</span>
              </label>
              <a href="#" className="text-xs font-medium transition-colors" style={{ color: '#c8ff00' }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit" disabled={loading}
              className="gs-btn gs-btn-primary w-full h-12 text-sm font-semibold"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Hint for demo */}
          <div className="mt-6 p-3 rounded-xl" style={{ background: 'var(--color-accent-mute)', border: '1px solid rgba(200,255,0,0.08)' }}>
            <p className="text-[11px] font-medium" style={{ color: '#c8ff00' }}>Demo Accounts</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-dim)' }}>
              <strong>Admin:</strong> admin@gigshield.ai · <strong>Worker:</strong> worker@gigshield.ai
            </p>
          </div>

          {/* Sign up link */}
          <p className="text-sm text-center mt-8" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium transition-colors" style={{ color: '#c8ff00' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — Animated Shield Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        {/* Ambient gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(200,255,0,0.15), transparent)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent)' }} />
        </div>

        {/* Shield animation */}
        <div className="shield-container anim-fade-in" style={{ animationDelay: '300ms' }}>
          {/* Orbit rings */}
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />

          {/* Orbiting dots */}
          <div className="orbit-dot orbit-dot-1" />
          <div className="orbit-dot orbit-dot-2" />
          <div className="orbit-dot orbit-dot-3" />
          <div className="orbit-dot orbit-dot-4" />

          {/* Central shield */}
          <div className="shield-hex">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Shield size={36} color="#c8ff00" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 12px rgba(200,255,0,0.4))' }} />
            </div>
          </div>
        </div>

        {/* Floating info cards */}
        <div className="absolute top-1/4 right-1/4 gs-card p-4 anim-float" style={{ animationDelay: '0s', width: 180 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="live-dot" />
            <span className="text-[10px] font-semibold" style={{ color: '#c8ff00' }}>LIVE PROTECTION</span>
          </div>
          <p className="text-xl font-bold text-white">24,817</p>
          <p className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Workers protected</p>
        </div>

        <div className="absolute bottom-1/3 left-1/6 gs-card p-4 anim-float" style={{ animationDelay: '2s', width: 180 }}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--color-text-dim)' }}>INSTANT PAYOUTS</p>
          <p className="text-xl font-bold text-white">₹42.5L</p>
          <p className="text-[10px]" style={{ color: '#4ade80' }}>+23% this month</p>
        </div>
      </div>
    </div>
  );
}
