// 🔌 GET /api/v1/policies?workerId={workerId} → Get worker's policies

const mockPolicies = [
  { id: 'POL-001', type: 'Weather Shield', premium: 299, coverage: 50000, startDate: '2026-01-15', endDate: '2027-01-15', status: 'Active', claimsMade: 3, maxClaims: 12 },
  { id: 'POL-009', type: 'AQI Protector', premium: 249, coverage: 40000, startDate: '2026-02-01', endDate: '2027-02-01', status: 'Active', claimsMade: 1, maxClaims: 8 },
];

export default function MyPolicies() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="anim-fade-up">
        <h2 className="text-xl font-bold text-white">My Policies</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Your active insurance coverage plans</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* 🔌 GET /api/v1/policies?workerId={workerId} → Replace mockPolicies with API data */}
        {mockPolicies.map((p, i) => (
          <div key={p.id} className="gs-card p-6 anim-fade-up" style={{ animationDelay: `${100 + i * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="gs-badge gs-badge-success">{p.status}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>{p.id}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{p.type}</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>₹{p.premium}/month · Up to ₹{p.coverage.toLocaleString()} coverage</p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-xs"><span style={{ color: 'var(--color-text-dim)' }}>Start Date</span><span className="text-white">{p.startDate}</span></div>
              <div className="flex justify-between text-xs"><span style={{ color: 'var(--color-text-dim)' }}>End Date</span><span className="text-white">{p.endDate}</span></div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--color-text-dim)' }}>Claims Used</span><span className="text-white">{p.claimsMade}/{p.maxClaims}</span></div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full progress-fill" style={{ width: `${(p.claimsMade / p.maxClaims) * 100}%`, background: '#c8ff00' }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button className="gs-btn gs-btn-secondary flex-1 text-xs py-2">View Details</button>
              <button className="gs-btn gs-btn-primary flex-1 text-xs py-2">Renew Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
