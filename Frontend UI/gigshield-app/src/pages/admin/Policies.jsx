import { useState } from 'react';
import Modal from '../../components/shared/Modal';
import { Plus, Search, Filter } from 'lucide-react';

// 🔌 GET    /api/v1/policies                → Get all policies
// 🔌 POST   /api/v1/policies                → Create policy
// 🔌 GET    /api/v1/policies?workerId={id}   → Get policies by worker
// 🔌 PUT    /api/v1/policies/{id}            → Update policy
// 🔌 DELETE /api/v1/policies/{id}            → Delete policy

const mockPolicies = [
  { id: 'POL-001', workerName: 'Rajesh Kumar', type: 'Weather Shield', premium: 299, coverage: 50000, startDate: '2026-01-15', endDate: '2027-01-15', status: 'Active' },
  { id: 'POL-002', workerName: 'Priya Sharma', type: 'Heat Guard', premium: 199, coverage: 30000, startDate: '2026-02-01', endDate: '2027-02-01', status: 'Active' },
  { id: 'POL-003', workerName: 'Arun Patel', type: 'Weather Shield', premium: 299, coverage: 50000, startDate: '2025-11-20', endDate: '2026-11-20', status: 'Active' },
  { id: 'POL-004', workerName: 'Sunita Devi', type: 'Full Coverage', premium: 499, coverage: 100000, startDate: '2026-03-01', endDate: '2027-03-01', status: 'Active' },
  { id: 'POL-005', workerName: 'Mohammed Iqbal', type: 'Weather Shield', premium: 299, coverage: 50000, startDate: '2025-08-10', endDate: '2026-08-10', status: 'Expired' },
  { id: 'POL-006', workerName: 'Kavita Reddy', type: 'AQI Protector', premium: 249, coverage: 40000, startDate: '2026-01-01', endDate: '2027-01-01', status: 'Active' },
];

export default function Policies() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const filtered = mockPolicies.filter(p => p.workerName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h2 className="text-xl font-bold text-white">Policy Management</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{mockPolicies.length} total policies</p>
        </div>
        <button onClick={() => setShowModal(true)} className="gs-btn gs-btn-primary"><Plus size={16} /> New Policy</button>
      </div>

      <div className="flex items-center gap-3 anim-fade-up delay-100">
        <div className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-md"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
          <input type="text" placeholder="Search policies..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1" />
        </div>
        <button className="gs-btn gs-btn-secondary"><Filter size={14} /> Filter</button>
      </div>

      <div className="gs-card overflow-hidden anim-fade-up delay-200">
        <table className="gs-table">
          <thead><tr>{['Policy ID', 'Worker', 'Plan Type', 'Premium', 'Coverage', 'Start', 'End', 'Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {/* 🔌 GET /api/v1/policies → Replace mockPolicies with API data */}
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>{p.id}</td>
                <td className="font-medium text-white">{p.workerName}</td>
                <td><span className="gs-badge gs-badge-info">{p.type}</span></td>
                <td className="font-semibold text-white">₹{p.premium}/mo</td>
                <td>₹{p.coverage.toLocaleString()}</td>
                <td>{p.startDate}</td>
                <td>{p.endDate}</td>
                <td><span className={`gs-badge ${p.status === 'Active' ? 'gs-badge-success' : 'gs-badge-danger'}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Policy">
        {/* 🔌 POST /api/v1/policies → Submit form data to create policy */}
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
          <div><label className="gs-label">Worker ID</label><input className="gs-input" placeholder="WK-XXXX" required /></div>
          <div><label className="gs-label">Plan Type</label>
            <select className="gs-select"><option>Weather Shield</option><option>Heat Guard</option><option>AQI Protector</option><option>Full Coverage</option></select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="gs-label">Premium (₹/mo)</label><input className="gs-input" type="number" placeholder="299" /></div>
            <div><label className="gs-label">Coverage (₹)</label><input className="gs-input" type="number" placeholder="50000" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="gs-btn gs-btn-secondary flex-1">Cancel</button>
            <button type="submit" className="gs-btn gs-btn-primary flex-1">Create Policy</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
