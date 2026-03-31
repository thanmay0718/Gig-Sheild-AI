import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

// 🔌 GET   /api/v1/payments                             → Get all payments
// 🔌 GET   /api/v1/payments/worker/{workerId}            → Get payments by worker
// 🔌 GET   /api/v1/payments/status/{status}              → Get payments by status
// 🔌 PATCH /api/v1/payments/{id}/status?status=SUCCESS   → Update payment status

const mockPayments = [
  { id: 'PAY-501', claimId: 'CL-3845', workerName: 'Arun Patel', amount: 3200, method: 'UPI', status: 'Success', date: '2026-03-30', ref: 'RZP_8x7f3k2' },
  { id: 'PAY-500', claimId: 'CL-3844', workerName: 'Kavita Reddy', amount: 2400, method: 'Bank Transfer', status: 'Success', date: '2026-03-29', ref: 'RZP_9y8g4l3' },
  { id: 'PAY-499', claimId: 'CL-3842', workerName: 'Sunita Devi', amount: 2800, method: 'UPI', status: 'Success', date: '2026-03-28', ref: 'RZP_7z6h5m4' },
  { id: 'PAY-498', claimId: 'CL-3847', workerName: 'Rajesh Kumar', amount: 2400, method: 'UPI', status: 'Pending', date: '2026-03-31', ref: '—' },
  { id: 'PAY-497', claimId: 'CL-3846', workerName: 'Priya Sharma', amount: 1800, method: 'Bank Transfer', status: 'Pending', date: '2026-03-30', ref: '—' },
  { id: 'PAY-496', claimId: 'CL-3843', workerName: 'Deepak Singh', amount: 1500, method: 'UPI', status: 'Failed', date: '2026-03-29', ref: 'RZP_ERR_001' },
];

export default function Payments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = mockPayments.filter(p =>
    (statusFilter === 'All' || p.status === statusFilter) &&
    (p.workerName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const total = mockPayments.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h2 className="text-xl font-bold text-white">Payment Management</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Total disbursed: ₹{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 anim-fade-up delay-100">
        {[
          { label: 'Total Disbursed', value: `₹${total.toLocaleString()}`, color: '#4ade80' },
          { label: 'Pending', value: mockPayments.filter(p => p.status === 'Pending').length, color: '#fbbf24' },
          { label: 'Failed', value: mockPayments.filter(p => p.status === 'Failed').length, color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="gs-card p-5">
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 anim-fade-up delay-200">
        <div className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-md"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
          <input type="text" placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          {['All', 'Success', 'Pending', 'Failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: statusFilter === s ? 'var(--color-bg-elevated)' : 'transparent', color: statusFilter === s ? '#fff' : 'var(--color-text-dim)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="gs-card overflow-hidden anim-fade-up delay-300">
        <table className="gs-table">
          <thead><tr>{['Payment ID', 'Claim ID', 'Worker', 'Amount', 'Method', 'Reference', 'Date', 'Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 GET /api/v1/payments → Replace mockPayments with API data */}
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{p.id}</td>
                <td className="font-mono text-xs">{p.claimId}</td>
                <td className="font-medium text-white">{p.workerName}</td>
                <td className="font-semibold text-white">₹{p.amount.toLocaleString()}</td>
                <td><span className="gs-badge gs-badge-neutral">{p.method}</span></td>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{p.ref}</td>
                <td>{p.date}</td>
                <td>
                  <span className={`gs-badge ${p.status === 'Success' ? 'gs-badge-success' : p.status === 'Pending' ? 'gs-badge-warning' : 'gs-badge-danger'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
