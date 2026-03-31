import { useState } from 'react';
import { Search, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

// 🔌 POST /api/v1/fraud/check                → Check claim for fraud
// 🔌 GET  /api/v1/fraud/{claimId}             → Get fraud result by claim
// 🔌 GET  /api/v1/fraud/worker/{workerId}     → Get fraud history by worker

const mockFraud = [
  { claimId: 'CL-3003', workerId: 'WK-1003', workerName: 'Arun Patel', score: 0.85, result: 'Fraudulent', reason: 'Multiple claims from same location within 2 hours', date: '2026-03-28', model: 'Isolation Forest' },
  { claimId: 'CL-3005', workerId: 'WK-1005', workerName: 'Mohammed Iqbal', score: 0.92, result: 'Fraudulent', reason: 'Claim filed during inactive policy period', date: '2026-03-26', model: 'Random Forest' },
  { claimId: 'CL-3847', workerId: 'WK-1001', workerName: 'Rajesh Kumar', score: 0.12, result: 'Legitimate', reason: 'Pattern consistent with genuine weather event', date: '2026-03-31', model: 'XGBoost' },
  { claimId: 'CL-3846', workerId: 'WK-1002', workerName: 'Priya Sharma', score: 0.08, result: 'Legitimate', reason: 'Temperature confirmed via OpenWeatherMap API', date: '2026-03-30', model: 'XGBoost' },
  { claimId: 'CL-3844', workerId: 'WK-1006', workerName: 'Kavita Reddy', score: 0.15, result: 'Legitimate', reason: 'Rainfall data matches claim parameters', date: '2026-03-29', model: 'Isolation Forest' },
  { claimId: 'CL-3008', workerId: 'WK-1008', workerName: 'Ananya Gupta', score: 0.67, result: 'Suspicious', reason: 'Unusual claim amount for trigger type', date: '2026-03-27', model: 'Random Forest' },
];

export default function Fraud() {
  const [search, setSearch] = useState('');
  const filtered = mockFraud.filter(f => f.workerName.toLowerCase().includes(search.toLowerCase()) || f.claimId.toLowerCase().includes(search.toLowerCase()));

  const fraudCount = mockFraud.filter(f => f.result === 'Fraudulent').length;
  const suspiciousCount = mockFraud.filter(f => f.result === 'Suspicious').length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h2 className="text-xl font-bold text-white">Fraud Detection</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>AI-powered anomaly detection using ML models</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 anim-fade-up delay-100">
        <div className="gs-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} style={{ color: '#f87171' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-dim)' }}>FRAUDULENT</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#f87171' }}>{fraudCount}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>Claims flagged as fraud</p>
        </div>
        <div className="gs-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-dim)' }}>SUSPICIOUS</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#fbbf24' }}>{suspiciousCount}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>Under review</p>
        </div>
        <div className="gs-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} style={{ color: '#4ade80' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-dim)' }}>LEGITIMATE</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>{mockFraud.filter(f => f.result === 'Legitimate').length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>Verified genuine claims</p>
        </div>
      </div>

      <div className="flex items-center gap-3 anim-fade-up delay-200">
        <div className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-md"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
          <input type="text" placeholder="Search fraud records..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1" />
        </div>
      </div>

      <div className="gs-card overflow-hidden anim-fade-up delay-300">
        <table className="gs-table">
          <thead><tr>{['Claim ID', 'Worker', 'Fraud Score', 'Result', 'ML Model', 'Reason', 'Date'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 GET /api/v1/fraud/{claimId} → Replace mockFraud with API data */}
            {filtered.map(f => (
              <tr key={f.claimId}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{f.claimId}</td>
                <td className="font-medium text-white">{f.workerName}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full progress-fill" style={{
                        width: `${f.score * 100}%`,
                        background: f.score > 0.7 ? '#f87171' : f.score > 0.4 ? '#fbbf24' : '#4ade80'
                      }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: f.score > 0.7 ? '#f87171' : f.score > 0.4 ? '#fbbf24' : '#4ade80' }}>
                      {(f.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`gs-badge ${f.result === 'Legitimate' ? 'gs-badge-success' : f.result === 'Suspicious' ? 'gs-badge-warning' : 'gs-badge-danger'}`}>
                    {f.result}
                  </span>
                </td>
                <td><span className="gs-badge gs-badge-info">{f.model}</span></td>
                <td className="text-xs max-w-xs truncate">{f.reason}</td>
                <td>{f.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
