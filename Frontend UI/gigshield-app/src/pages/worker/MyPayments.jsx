// 🔌 GET /api/v1/payments/worker/{workerId} → Get worker's payment history

const mockPayments = [
  { id: 'PAY-201', claimId: 'CL-3001', amount: 2400, method: 'UPI', status: 'Success', date: '2026-03-29', ref: 'RZP_8x7f3k2' },
  { id: 'PAY-200', claimId: 'CL-3002', amount: 1800, method: 'UPI', status: 'Success', date: '2026-03-23', ref: 'RZP_7y6g4l3' },
  { id: 'PAY-199', claimId: 'CL-3003', amount: 3200, method: 'Bank Transfer', status: 'Success', date: '2026-03-16', ref: 'RZP_6z5h3m4' },
  { id: 'PAY-198', claimId: 'CL-3004', amount: 2400, method: 'UPI', status: 'Pending', date: '—', ref: '—' },
];

export default function MyPayments() {
  const total = mockPayments.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="anim-fade-up">
        <h2 className="text-xl font-bold text-white">My Payments</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Track all your insurance payouts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 anim-fade-up delay-100">
        <div className="gs-card p-5">
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>Total Received</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#4ade80' }}>₹{total.toLocaleString()}</p>
        </div>
        <div className="gs-card p-5">
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>Pending</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#fbbf24' }}>{mockPayments.filter(p => p.status === 'Pending').length}</p>
        </div>
        <div className="gs-card p-5">
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>Avg. Processing Time</p>
          <p className="text-2xl font-bold mt-1 text-white">24h</p>
        </div>
      </div>

      <div className="gs-card overflow-hidden anim-fade-up delay-200">
        <table className="gs-table">
          <thead><tr>{['Payment ID', 'Claim', 'Amount', 'Method', 'Reference', 'Date', 'Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 GET /api/v1/payments/worker/{workerId} → Replace mockPayments with API data */}
            {mockPayments.map(p => (
              <tr key={p.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{p.id}</td>
                <td className="font-mono text-xs">{p.claimId}</td>
                <td className="font-semibold text-white">₹{p.amount.toLocaleString()}</td>
                <td><span className="gs-badge gs-badge-neutral">{p.method}</span></td>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{p.ref}</td>
                <td>{p.date}</td>
                <td><span className={`gs-badge ${p.status === 'Success' ? 'gs-badge-success' : 'gs-badge-warning'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
