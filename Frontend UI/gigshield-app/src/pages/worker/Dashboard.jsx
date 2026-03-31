import StatCard from '../../components/shared/StatCard';
import { Shield, FileText, CreditCard, Activity, Zap, Clock, CheckCircle, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// 🔌 GET /api/v1/workers/me                    → worker profile
// 🔌 GET /api/v1/policies?workerId={workerId}   → worker's policies
// 🔌 GET /api/v1/claims/worker/{workerId}       → worker's claims
// 🔌 GET /api/v1/payments/worker/{workerId}     → worker's payments

export default function WorkerDashboard() {
  const stats = [
    { icon: Shield, label: 'Coverage Active', value: '87%', trend: 'Active', color: '#c8ff00', spark: [75,78,80,82,84,85,86,87,87,87,87,87] },
    { icon: Activity, label: 'My Risk Score', value: 23, trend: 'Low Risk', color: '#2dd4bf', spark: [35,32,30,28,27,26,25,24,24,23,23,23] },
    { icon: FileText, label: 'Total Claims', value: 5, trend: '+2 this month', color: '#a78bfa', spark: [1,1,2,2,3,3,3,4,4,5,5,5] },
    { icon: CreditCard, label: 'Payouts Received', value: '₹12,400', trend: '+₹2,400', color: '#fb923c', spark: [20,30,40,55,65,72,80,88,95,100,110,124] },
  ];

  const recentClaims = [
    { id: 'CL-3001', trigger: 'Heavy Rainfall', amount: 2400, status: 'Approved', date: '2026-03-28' },
    { id: 'CL-3002', trigger: 'Extreme Heat', amount: 1800, status: 'Approved', date: '2026-03-22' },
    { id: 'CL-3003', trigger: 'High AQI', amount: 3200, status: 'Approved', date: '2026-03-15' },
    { id: 'CL-3004', trigger: 'Heavy Rainfall', amount: 2400, status: 'Pending', date: '2026-03-10' },
    { id: 'CL-3005', trigger: 'Manual Claim', amount: 2600, status: 'Rejected', date: '2026-03-05' },
  ];

  const triggers = [
    { icon: '🌧️', label: 'Rainfall', value: '32mm', threshold: '50mm', pct: 64, color: '#4ade80' },
    { icon: '🌡️', label: 'Temperature', value: '38°C', threshold: '42°C', pct: 90, color: '#fbbf24' },
    { icon: '💨', label: 'AQI', value: '156', threshold: '200', pct: 78, color: '#fbbf24' },
  ];

  return (
    <div className="space-y-16 px-8 max-w-[1400px] mb-20 mx-auto">
      <div className="anim-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c8ff00', letterSpacing: '1.5px' }}>My Dashboard</span>
          <div className="flex items-center gap-1.5 ml-2"><span className="live-dot" style={{ backgroundColor: '#c8ff00' }} /><span className="text-[10px] font-medium" style={{ color: '#c8ff00' }}>Protected</span></div>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Your Earnings Are Protected</h2>
        <p className="text-base mt-2" style={{ color: 'var(--color-text-muted)' }}>Automatic weather-triggered payouts when conditions affect your deliveries.</p>
      </div>

      {/* How To Use Platform Carousel */}
      <HowToUseCarousel />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} trend={s.trend}
            color={s.color} delay={100 + i * 80} sparkData={s.spark} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Policy coverage donut */}
        <div className="gs-card p-6 flex flex-col items-center anim-fade-up delay-500">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-5 self-start" style={{ color: 'var(--color-text-dim)' }}>Policy Coverage</h3>
          <DonutChart percentage={87} />
          <div className="flex items-center gap-5 mt-5">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: '#c8ff00' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Covered</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Remaining</span></div>
          </div>
        </div>

        {/* Trigger monitor */}
        <div className="col-span-2 gs-card p-6 anim-fade-up delay-600">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} style={{ color: '#c8ff00' }} />
            <h3 className="text-sm font-semibold text-white">Weather Monitor</h3>
            <div className="flex items-center gap-1.5 ml-auto"><span className="live-dot" /><span className="text-[10px]" style={{ color: '#c8ff00' }}>Monitoring</span></div>
          </div>
          <div className="space-y-5">
            {triggers.map(t => (
              <div key={t.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><span className="text-base">{t.icon}</span><span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{t.label}</span></div>
                  <span className="text-xs font-semibold" style={{ color: t.color }}>{t.value}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full progress-fill" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
                <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--color-text-dim)' }}>Threshold: {t.threshold}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="gs-card p-6 anim-fade-up delay-700">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white">Recent Claims</h3>
          <button className="gs-btn gs-btn-primary text-xs py-2 px-4">
            <FileText size={14} /> File Manual Claim
          </button>
        </div>
        <table className="gs-table">
          <thead><tr>{['Claim ID', 'Trigger', 'Amount', 'Status', 'Date'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 GET /api/v1/claims/worker/{workerId} → Replace with API data */}
            {recentClaims.map(c => (
              <tr key={c.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{c.id}</td>
                <td><span className="gs-badge gs-badge-accent">{c.trigger}</span></td>
                <td className="font-semibold text-white">₹{c.amount.toLocaleString()}</td>
                <td><span className={`gs-badge ${c.status === 'Approved' ? 'gs-badge-success' : c.status === 'Pending' ? 'gs-badge-warning' : 'gs-badge-danger'}`}>{c.status}</span></td>
                <td>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonutChart({ percentage = 87 }) {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <circle cx="65" cy="65" r={radius} fill="none" stroke="url(#donutG)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference}
          style={{ animation: `donutR 1.8s cubic-bezier(0.16,1,0.3,1) 0.5s forwards` }} />
        <defs>
          <linearGradient id="donutG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8ff00" /><stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Coverage</span>
      </div>
      <style>{`@keyframes donutR { to { stroke-dashoffset: ${strokeDashoffset}; } }`}</style>
    </div>
  );
}

function HowToUseCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const slides = [
    { title: "Getting Started with GigShield", desc: "Learn how your coverage works. Our smart contracts automatically protect your earnings from disruptions caused by extreme weather, poor air quality, or curfews.", bg: "https://images.unsplash.com/photo-1593022201416-0fcbeaf44d65?auto=format&fit=crop&q=80&w=1200" },
    { title: "How Payouts Work", desc: "When local conditions cross the threshold, the GigShield API detects the event and transfers emergency liquidity straight to your wallet within minutes.", bg: "https://images.unsplash.com/photo-1561491745-f938d6df2fe7?auto=format&fit=crop&q=80&w=1200" },
    { title: "Filing Manual Claims", desc: "For incidents outside automated triggers, you can file a manual claim. Our processing AI reviews your evidence and approves valid claims almost instantly.", bg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" }
  ];

  return (
    <div className="gs-card overflow-hidden relative anim-fade-up delay-300 group h-[340px]" style={{ borderRadius: 28, padding: 0, border: 'none', height: '340px' }}>
      <div className="absolute inset-0 transition-transform duration-1000 ease-out scale-105 group-hover:scale-100" style={{ backgroundImage: `url(${slides[activeIdx].bg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3) saturate(1.2)' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute inset-x-10 bottom-10 z-10">
        <div className="flex items-end justify-between">
          <div className="max-w-[70%]">
            <span className="gs-badge gs-badge-accent mb-4 tracking-wider">Worker Training</span>
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
