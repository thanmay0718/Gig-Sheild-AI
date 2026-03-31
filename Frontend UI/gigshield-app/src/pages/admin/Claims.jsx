import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';

// 🔌 GET    /api/v1/claims                    → Get all claims
// 🔌 GET    /api/v1/claims/worker/{workerId}   → Get claims by worker
// 🔌 GET    /api/v1/claims/status/{status}     → Get claims by status
// 🔌 PUT    /api/v1/claims/{id}                → Update claim (approve/reject)
// 🔌 DELETE /api/v1/claims/{id}                → Delete claim

const mockClaims = [
  { id: 'CL-3847', workerId: 'WK-1001', workerName: 'Rajesh Kumar', trigger: 'Heavy Rainfall', amount: 2400, status: 'Pending', date: '2026-03-31', city: 'Hyderabad', severity: 'High' },
  { id: 'CL-3846', workerId: 'WK-1002', workerName: 'Priya Sharma', trigger: 'Extreme Heat', amount: 1800, status: 'Pending', date: '2026-03-30', city: 'Mumbai', severity: 'Medium' },
  { id: 'CL-3845', workerId: 'WK-1003', workerName: 'Arun Patel', trigger: 'High AQI', amount: 3200, status: 'Approved', date: '2026-03-30', city: 'Bengaluru', severity: 'High' },
  { id: 'CL-3844', workerId: 'WK-1006', workerName: 'Kavita Reddy', trigger: 'Heavy Rainfall', amount: 2400, status: 'Approved', date: '2026-03-29', city: 'Hyderabad', severity: 'Medium' },
  { id: 'CL-3843', workerId: 'WK-1007', workerName: 'Deepak Singh', trigger: 'Extreme Heat', amount: 1500, status: 'Rejected', date: '2026-03-29', city: 'Pune', severity: 'Low' },
  { id: 'CL-3842', workerId: 'WK-1004', workerName: 'Sunita Devi', trigger: 'Heavy Rainfall', amount: 2800, status: 'Approved', date: '2026-03-28', city: 'Delhi', severity: 'High' },
];

export default function Claims() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const filtered = mockClaims.filter(c =>
    (statusFilter === 'All' || c.status === statusFilter) &&
    (c.workerName.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
  );

  const severityColor = { High: '#f87171', Medium: '#fbbf24', Low: '#4ade80' };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h2 className="text-xl font-bold text-white">Claims Management</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {mockClaims.filter(c => c.status === 'Pending').length} claims pending review
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 anim-fade-up delay-100">
        <div className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-md"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
          <input type="text" placeholder="Search claims..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: statusFilter === s ? 'var(--color-bg-elevated)' : 'transparent', color: statusFilter === s ? '#fff' : 'var(--color-text-dim)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="gs-card overflow-hidden anim-fade-up delay-200">
        <table className="gs-table">
          <thead>
            <tr>{['Claim ID', 'Worker', 'City', 'Trigger', 'Severity', 'Amount', 'Date', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {/* 🔌 GET /api/v1/claims → Replace mockClaims with API data */}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{c.id}</td>
                <td className="font-medium text-white">{c.workerName}</td>
                <td>{c.city}</td>
                <td><span className="gs-badge gs-badge-accent">{c.trigger}</span></td>
                <td><span className="gs-badge" style={{ background: severityColor[c.severity] + '12', color: severityColor[c.severity] }}>{c.severity}</span></td>
                <td className="font-semibold text-white">₹{c.amount.toLocaleString()}</td>
                <td>{c.date}</td>
                <td>
                  <span className={`gs-badge ${c.status === 'Approved' ? 'gs-badge-success' : c.status === 'Pending' ? 'gs-badge-warning' : 'gs-badge-danger'}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.status === 'Pending' && (
                    <div className="flex items-center gap-1">
                      {/* 🔌 PUT /api/v1/claims/{id} → Approve claim */}
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)' }} title="Approve">
                        <CheckCircle size={14} />
                      </button>
                      {/* 🔌 PUT /api/v1/claims/{id} → Reject claim */}
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)' }} title="Reject">
                        <XCircle size={14} />
                      </button>
                    </div>
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
