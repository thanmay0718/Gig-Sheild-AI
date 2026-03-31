import StatCard from '../../components/shared/StatCard';
import { TrendingUp, Users, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// 🔌 GET /api/v1/workers    → worker growth data
// 🔌 GET /api/v1/claims     → claims volume data
// 🔌 GET /api/v1/payments   → revenue & payout data
// 🔌 GET /api/v1/policies   → policy conversion rate

export default function Analytics() {
  const cityData = [
    { city: 'Hyderabad', workers: 5420, claims: 89, payouts: '₹8.2L', risk: 32 },
    { city: 'Mumbai', workers: 4890, claims: 112, payouts: '₹12.4L', risk: 45 },
    { city: 'Bengaluru', workers: 4200, claims: 67, payouts: '₹6.8L', risk: 28 },
    { city: 'Delhi', workers: 3950, claims: 95, payouts: '₹10.1L', risk: 52 },
    { city: 'Chennai', workers: 3100, claims: 45, payouts: '₹4.5L', risk: 22 },
    { city: 'Pune', workers: 2257, claims: 38, payouts: '₹3.2L', risk: 18 },
  ];

  const triggerDistribution = [
    { type: 'Heavy Rainfall', pct: 42, color: '#60a5fa', count: 146 },
    { type: 'Extreme Heat', pct: 28, color: '#f87171', count: 97 },
    { type: 'High AQI', pct: 18, color: '#fbbf24', count: 63 },
    { type: 'Curfew/Lockdown', pct: 8, color: '#a78bfa', count: 28 },
    { type: 'Manual Claims', pct: 4, color: '#2dd4bf', count: 13 },
  ];

  return (
    <div className="space-y-12 max-w-[1400px]">
      <div className="anim-fade-up">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Platform Analytics</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Comprehensive data insights across the GigShield network</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard icon={Users} label="Worker Growth" value="24,817" trend="+12.4%" color="#c8ff00" delay={100} trendLabel="vs last month" />
        <StatCard icon={TrendingUp} label="Claim Rate" value="1.4%" trend="-0.3%" color="#a78bfa" delay={200} trendLabel="Lower is better" />
        <StatCard icon={DollarSign} label="Avg. Payout" value="₹2,340" trend="+8.1%" color="#2dd4bf" delay={300} trendLabel="Per approved claim" />
        <StatCard icon={Percent} label="Policy Conversion" value="76.2%" trend="+4.5%" color="#fb923c" delay={400} trendLabel="Signup → Active" />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Claims by trigger type */}
        <div className="gs-card anim-fade-up delay-500" style={{ padding: '32px' }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Claims by Trigger Type</h3>
          <div className="space-y-4">
            {triggerDistribution.map(t => (
              <div key={t.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{t.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: t.color }}>{t.count}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>{t.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full progress-fill" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue chart */}
        <div className="col-span-2 gs-card anim-fade-up delay-600" style={{ padding: '32px' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Revenue vs Payouts</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#c8ff00' }} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Revenue</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#f87171' }} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>Payouts</span></div>
            </div>
          </div>
          <BarChart />
        </div>
      </div>

      {/* City-wise breakdown */}
      <div className="gs-card anim-fade-up delay-700 mt-8" style={{ padding: '32px' }}>
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>City-wise Performance</h3>
        <table className="gs-table">
          <thead><tr>{['City', 'Workers', 'Claims', 'Payouts', 'Avg. Risk', 'Trend'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 Aggregate data from /api/v1/workers + /api/v1/claims grouped by city */}
            {cityData.map(c => (
              <tr key={c.city}>
                <td className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.city}</td>
                <td>{c.workers.toLocaleString()}</td>
                <td>{c.claims}</td>
                <td className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.payouts}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full progress-fill" style={{ width: `${c.risk}%`, background: c.risk > 40 ? '#fbbf24' : '#4ade80' }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: c.risk > 40 ? '#fbbf24' : '#4ade80' }}>{c.risk}</span>
                  </div>
                </td>
                <td>
                  {c.risk > 35 ? (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#f87171' }}><ArrowUpRight size={12} /> High risk</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#4ade80' }}><ArrowDownRight size={12} /> Stable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BarChart() {
  const revenue = [5.2, 6.1, 7.3, 8.5, 7.8, 9.2, 8.9, 10.4, 11.2, 10.8, 12.1, 13.5];
  const payouts = [1.8, 2.3, 3.1, 3.8, 3.2, 4.5, 4.1, 5.2, 5.8, 4.9, 5.6, 6.2];
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const w = 500, h = 160, pad = 40, barW = 14, gap = 4;
  const max = Math.max(...revenue) * 1.1;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {labels.map((l, i) => {
        const x = pad + (i / (labels.length - 1)) * (w - pad * 2) - barW;
        const rh = (revenue[i] / max) * (h - 40);
        const ph = (payouts[i] / max) * (h - 40);
        return (
          <g key={l}>
            <rect x={x} y={h - 20 - rh} width={barW} height={rh} rx={3} fill="#c8ff00" opacity="0.7"
              style={{ animation: `progress-grow 0.8s ease ${i * 60}ms forwards`, transformOrigin: `${x}px ${h - 20}px` }} />
            <rect x={x + barW + gap} y={h - 20 - ph} width={barW} height={ph} rx={3} fill="#f87171" opacity="0.5"
              style={{ animation: `progress-grow 0.8s ease ${i * 60 + 100}ms forwards`, transformOrigin: `${x + barW + gap}px ${h - 20}px` }} />
            <text x={x + barW} y={h - 4} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle" fontFamily="Inter">{l}</text>
          </g>
        );
      })}
    </svg>
  );
}
