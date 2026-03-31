import { useState } from 'react';
import Modal from '../../components/shared/Modal';
import { Plus, Search } from 'lucide-react';

// 🔌 GET  /api/v1/claims/worker/{workerId}   → Get worker's claims
// 🔌 POST /api/v1/claims                     → File manual claim

const mockClaims = [
  { id: 'CL-3001', trigger: 'Heavy Rainfall', amount: 2400, status: 'Approved', date: '2026-03-28', payoutDate: '2026-03-29', details: 'Rainfall 48mm in Hyderabad zone' },
  { id: 'CL-3002', trigger: 'Extreme Heat', amount: 1800, status: 'Approved', date: '2026-03-22', payoutDate: '2026-03-23', details: 'Temp 44°C recorded' },
  { id: 'CL-3003', trigger: 'High AQI', amount: 3200, status: 'Approved', date: '2026-03-15', payoutDate: '2026-03-16', details: 'AQI 220 in delivery zone' },
  { id: 'CL-3004', trigger: 'Heavy Rainfall', amount: 2400, status: 'Pending', date: '2026-03-10', payoutDate: '—', details: 'Under review' },
  { id: 'CL-3005', trigger: 'Manual Claim', amount: 2600, status: 'Rejected', date: '2026-03-05', payoutDate: '—', details: 'Insufficient documentation' },
];

export default function MyClaims() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = mockClaims.filter(c => c.trigger.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h2 className="text-xl font-bold text-white">My Claims</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Track your parametric claims and payouts</p>
        </div>
        {/* 🔌 POST /api/v1/claims → Manual claim submission */}
        <button onClick={() => setShowModal(true)} className="gs-btn gs-btn-primary"><Plus size={16} /> File Claim</button>
      </div>

      <div className="flex items-center gap-3 anim-fade-up delay-100">
        <div className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-md"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
          <input type="text" placeholder="Search claims..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1" />
        </div>
      </div>

      <div className="gs-card overflow-hidden anim-fade-up delay-200">
        <table className="gs-table">
          <thead><tr>{['Claim ID', 'Trigger', 'Amount', 'Status', 'Filed', 'Payout Date', 'Details'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 GET /api/v1/claims/worker/{workerId} → Replace mockClaims with API data */}
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{c.id}</td>
                <td><span className="gs-badge gs-badge-accent">{c.trigger}</span></td>
                <td className="font-semibold text-white">₹{c.amount.toLocaleString()}</td>
                <td><span className={`gs-badge ${c.status === 'Approved' ? 'gs-badge-success' : c.status === 'Pending' ? 'gs-badge-warning' : 'gs-badge-danger'}`}>{c.status}</span></td>
                <td>{c.date}</td>
                <td>{c.payoutDate}</td>
                <td className="text-xs">{c.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="File Manual Claim">
        {/* 🔌 POST /api/v1/claims → Submit manual claim data */}
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
          <div><label className="gs-label">Trigger Type</label>
            <select className="gs-select"><option>Heavy Rainfall</option><option>Extreme Heat</option><option>High AQI</option><option>Other</option></select></div>
          <div><label className="gs-label">Description</label><textarea className="gs-input" rows="3" placeholder="Describe the situation..." required /></div>
          <div><label className="gs-label">Estimated Loss (₹)</label><input className="gs-input" type="number" placeholder="2000" required /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="gs-btn gs-btn-secondary flex-1">Cancel</button>
            <button type="submit" className="gs-btn gs-btn-primary flex-1">Submit Claim</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
