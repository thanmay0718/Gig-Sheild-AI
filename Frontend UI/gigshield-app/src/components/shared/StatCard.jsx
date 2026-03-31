import { useEffect, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, color = '#c8ff00', delay = 0, sparkData }) {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'number' ? value : null;

  useEffect(() => {
    if (numericValue === null) return;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [numericValue]);

  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className="gs-card gs-card-interactive p-6 anim-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + '12', color }}>
          {Icon && <Icon size={18} />}
        </div>
        {trend && (
          <span className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{
              background: isPositive ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
              color: isPositive ? '#4ade80' : '#f87171',
            }}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight" style={{ letterSpacing: '-1px' }}>
        {numericValue !== null ? count.toLocaleString() : value}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>{label}</p>

      {/* Mini sparkline */}
      {sparkData && (
        <div className="mt-4">
          <MiniSparkline data={sparkData} color={color} />
        </div>
      )}
      {trendLabel && (
        <p className="text-[11px] mt-3" style={{ color: 'var(--color-text-muted)' }}>{trendLabel}</p>
      )}
    </div>
  );
}

function MiniSparkline({ data, color }) {
  const w = 200, h = 32, pad = 2;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ opacity: 0.6 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
