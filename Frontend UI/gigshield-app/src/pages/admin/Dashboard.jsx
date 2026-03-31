import StatCard from '../../components/shared/StatCard';
import { Users, Shield, FileText, CreditCard, AlertTriangle, TrendingUp, Zap, Activity, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// 🔌 GET /api/v1/workers        → fetch worker count
// 🔌 GET /api/v1/policies       → fetch policy count
// 🔌 GET /api/v1/claims         → fetch claims data + chart
// 🔌 GET /api/v1/payments       → fetch total payouts
// 🔌 GET /api/v1/fraud/check    → fraud detection stats

export default function AdminDashboard() {
  // TODO: Replace mock data with API calls above
  const stats = [
    { icon: Users, label: 'Total Workers', value: 24817, trend: '+12.4%', color: '#c8ff00', spark: [65,70,68,75,80,78,85,88,90,92,95,98] },
    { icon: Shield, label: 'Active Policies', value: 18942, trend: '+8.2%', color: '#a78bfa', spark: [50,55,52,60,65,63,70,72,75,78,80,82] },
    { icon: FileText, label: 'Claims Today', value: 347, trend: '+23.1%', color: '#fb923c', spark: [20,25,30,45,35,55,48,60,65,50,45,42] },
    { icon: CreditCard, label: 'Total Payouts', value: '₹42.5L', trend: '+18.7%', color: '#2dd4bf', spark: [30,40,50,60,55,70,65,80,85,72,68,60] },
    { icon: AlertTriangle, label: 'Fraud Flags', value: 12, trend: '-3.1%', color: '#f87171', spark: [15,12,18,14,20,16,22,18,15,14,13,12] },
    { icon: TrendingUp, label: 'Premium Revenue', value: '₹89.2L', trend: '+31.5%', color: '#60a5fa', spark: [40,48,55,62,70,75,80,85,90,88,92,95] },
  ];

  const triggers = [
    { icon: '🌧️', label: 'Rainfall', value: '32mm', threshold: '50mm', pct: 64, status: 'safe', statusColor: '#4ade80' },
    { icon: '🌡️', label: 'Temperature', value: '38°C', threshold: '42°C', pct: 90, status: 'warning', statusColor: '#fbbf24' },
    { icon: '💨', label: 'Air Quality', value: '156 AQI', threshold: '200 AQI', pct: 78, status: 'warning', statusColor: '#fbbf24' },
    { icon: '🚫', label: 'Curfew Status', value: 'No Curfew', threshold: 'Active', pct: 0, status: 'safe', statusColor: '#4ade80' },
  ];

  const recentClaims = [
    { id: 'CL-3847', worker: 'Rajesh Kumar', trigger: 'Heavy Rainfall', amount: 2400, status: 'Approved', date: '2026-03-31' },
    { id: 'CL-3846', worker: 'Priya Sharma', trigger: 'Extreme Heat', amount: 1800, status: 'Pending', date: '2026-03-30' },
    { id: 'CL-3845', worker: 'Arun Patel', trigger: 'High AQI', amount: 3200, status: 'Approved', date: '2026-03-30' },
    { id: 'CL-3844', worker: 'Kavita Reddy', trigger: 'Heavy Rainfall', amount: 2400, status: 'Approved', date: '2026-03-29' },
    { id: 'CL-3843', worker: 'Deepak Singh', trigger: 'Extreme Heat', amount: 1500, status: 'Rejected', date: '2026-03-29' },
  ];

  const statusBadge = (s) => {
    const map = { Approved: 'gs-badge-success', Pending: 'gs-badge-warning', Rejected: 'gs-badge-danger' };
    return <span className={`gs-badge ${map[s]}`}>{s}</span>;
  };

  return (
    <div className="space-y-16 px-8 max-w-[1500px] mb-20">
      {/* Hero Welcome */}
      <div className="anim-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c8ff00', letterSpacing: '1.5px' }}>
            Operations Center
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="live-dot" style={{ backgroundColor: '#c8ff00' }} />
            <span className="text-[10px] font-medium" style={{ color: '#c8ff00' }}>Live</span>
          </div>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, Admin
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Here's what's happening across your platform today.
        </p>
      </div>

      {/* Gig Worker Spotlight Carousel */}
      <VideoCarousel />

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-10">
        {stats.map((s, i) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} trend={s.trend}
            color={s.color} delay={100 + i * 80} sparkData={s.spark} />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-10">
        {/* Chart area */}
        <div className="col-span-2 gs-card p-8 anim-fade-up delay-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Claims & Payouts Trend</h3>
              <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-dim)' }}>12-month overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#c8ff00' }} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Claims</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#a78bfa' }} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Payouts</span></div>
            </div>
          </div>
          <DualLineChart />
        </div>

        {/* Trigger Engine */}
        <div className="gs-card p-8 anim-fade-up delay-600">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} style={{ color: '#c8ff00' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Trigger Engine</h3>
          </div>
          <div className="space-y-5">
            {triggers.map(t => (
              <div key={t.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{t.icon}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{t.label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: t.statusColor }}>{t.value}</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full progress-fill" style={{ width: `${t.pct}%`, background: t.statusColor }} />
                </div>
                <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--color-text-dim)' }}>Threshold: {t.threshold}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="gs-card p-8 anim-fade-up delay-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Recent Claims</h3>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-dim)' }}>Latest parametric claim activity</p>
          </div>
          <Activity size={16} style={{ color: 'var(--color-text-dim)' }} />
        </div>
        <table className="gs-table">
          <thead>
            <tr>
              {['Claim ID', 'Worker', 'Trigger', 'Amount', 'Status', 'Date'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 🔌 GET /api/v1/claims → Replace mock data with API response */}
            {recentClaims.map(c => (
              <tr key={c.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{c.id}</td>
                <td className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{c.worker}</td>
                <td><span className="gs-badge" style={{ background: c.trigger === 'Heavy Rainfall' ? 'rgba(200,255,0,0.1)' : 'rgba(251,146,60,0.1)', color: c.trigger === 'Heavy Rainfall' ? 'var(--color-accent)' : '#fb923c' }}>{c.trigger}</span></td>
                <td className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>₹{c.amount.toLocaleString()}</td>
                <td>{statusBadge(c.status)}</td>
                <td>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VideoCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const slides = [
    { title: "Empowering 24k+ Gig Workers", desc: "Discover how AI-driven parametric insurance guarantees instant payouts without paperwork. See how riders are protected against climate extremes seamlessly.", bg: "https://images.unsplash.com/photo-1593022201416-0fcbeaf44d65?auto=format&fit=crop&q=80&w=1200" },
    { title: "Real-time Weather APIs", desc: "Watch the GigShield Trigger Engine in action intercepting the July heatwaves and initiating split-second direct deposits to impacted accounts.", bg: "https://images.unsplash.com/photo-1561491745-f938d6df2fe7?auto=format&fit=crop&q=80&w=1200" },
    { title: "Zero Fraud System", desc: "How our ML models predict and prevent false claims in milliseconds. The industry-best shield that secures your liquidity pools automatically.", bg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" }
  ];

  return (
    <div className="gs-card overflow-hidden relative anim-fade-up delay-300 group h-[340px]" style={{ borderRadius: 28, padding: 0, border: 'none', height: '340px' }}>
      <div className="absolute inset-0 transition-transform duration-1000 ease-out scale-105 group-hover:scale-100" style={{ backgroundImage: `url(${slides[activeIdx].bg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3) saturate(1.2)' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute inset-x-10 bottom-10 z-10">
        <div className="flex items-end justify-between">
          <div className="max-w-[70%]">
            <span className="gs-badge gs-badge-accent mb-4 tracking-wider">GigShield Documentary</span>
            <h3 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{slides[activeIdx].title}</h3>
            <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{slides[activeIdx].desc}</p>
          </div>
          <button className="w-20 h-20 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/20 hover:scale-110 hover:bg-white/10 transition-all cursor-pointer group/btn shadow-[0_0_30px_rgba(200,255,0,0.2)]">
            <PlayCircle size={40} color="#c8ff00" className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 inset-x-6 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => setActiveIdx(prev => prev === 0 ? slides.length - 1 : prev - 1)} className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-lg border border-white/10 hover:bg-black/70 hover:scale-110 transition-all cursor-pointer"><ChevronLeft size={24} color="#c8ff00" /></button>
        <button onClick={() => setActiveIdx(prev => (prev + 1) % slides.length)} className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-lg border border-white/10 hover:bg-black/70 hover:scale-110 transition-all cursor-pointer"><ChevronRight size={24} color="#c8ff00" /></button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${i === activeIdx ? 'w-10 bg-[#c8ff00] shadow-[0_0_10px_#c8ff00]' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}

function DualLineChart() {
  const claimsData = [120, 180, 250, 310, 280, 420, 380, 490, 520, 410, 370, 347];
  const payoutsData = [80, 120, 180, 220, 200, 300, 280, 360, 400, 320, 280, 250];
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const w = 600, h = 180, pad = 40;
  const max = Math.max(...claimsData) * 1.1;

  const makePath = (data) => data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: 10 + (1 - v / max) * (h - 30),
  }));

  const toLine = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const toArea = (pts) => `${toLine(pts)} L${pts[pts.length - 1].x},${h - 10} L${pts[0].x},${h - 10} Z`;

  const c1 = makePath(claimsData), c2 = makePath(payoutsData);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8ff00" stopOpacity="0.25" /><stop offset="100%" stopColor="#c8ff00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" /><stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1={pad} y1={10 + p * (h - 30)} x2={w - pad} y2={10 + p * (h - 30)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {labels.map((l, i) => (
        <text key={l} x={pad + (i / (labels.length - 1)) * (w - pad * 2)} y={h} fill="rgba(255,255,255,0.4)"
          fontSize="9" textAnchor="middle" fontFamily="Arial">{l}</text>
      ))}
      <path d={toArea(c1)} fill="url(#cg1)" />
      <path d={toArea(c2)} fill="url(#cg2)" />
      <path d={toLine(c1)} fill="none" stroke="#c8ff00" strokeWidth="2" strokeLinecap="round" className="chart-line-draw" style={{ filter: 'drop-shadow(0 0 4px rgba(200,255,0,0.4))' }} />
      <path d={toLine(c2)} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" className="chart-line-draw" style={{ animationDelay: '0.3s', filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.4))' }} />
      <circle cx={c1[c1.length-1].x} cy={c1[c1.length-1].y} r="4" fill="#c8ff00" className="live-dot" style={{ backgroundColor: '#c8ff00' }} />
    </svg>
  );
}
