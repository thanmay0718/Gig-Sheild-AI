import { useState, useEffect } from 'react';
import { workersAPI } from '../../api/config';
import Modal from '../../components/shared/Modal';
import { Search, Filter, Eye, Trash2, Loader2, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';

// 🔌 GET    /api/v1/workers       → Get all workers (LIVE)
// 🔌 GET    /api/v1/workers/{id}  → Get worker by ID (LIVE)
// 🔌 DELETE /api/v1/workers/{id}  → Delete worker (LIVE)

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [viewWorker, setViewWorker] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workersAPI.getAll(); // 🔌 GET /api/v1/workers
      setWorkers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleViewWorker = async (id) => {
    setDetailLoading(true);
    try {
      const data = await workersAPI.getById(id); // 🔌 GET /api/v1/workers/{id}
      setViewWorker(data);
    } catch (err) {
      alert(err.message || 'Failed to fetch worker details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!confirm('Are you sure you want to delete this worker?')) return;
    setDeletingId(id);
    try {
      await workersAPI.delete(id); // 🔌 DELETE /api/v1/workers/{id}
      setWorkers(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete worker');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = workers.filter(w =>
    (w.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (w.area || '').toLowerCase().includes(search.toLowerCase()) ||
    (w.deliverySegment || '').toLowerCase().includes(search.toLowerCase())
  );

  const segmentColors = { FOOD: '#fb923c', ECOMMERCE: '#a78bfa', GROCERY: '#4ade80' };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h2 className="text-xl font-bold text-white">Worker Management</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {loading ? 'Loading...' : `${workers.length} registered workers`}
          </p>
        </div>
        <button onClick={fetchWorkers} className="gs-btn gs-btn-secondary" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 anim-fade-up delay-100">
        <div className="flex items-center gap-2 px-4 h-10 rounded-xl flex-1 max-w-md"
          style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-dim)' }} />
          <input type="text" placeholder="Search by email, area, segment..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="gs-card p-16 flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin" style={{ color: '#c8ff00' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading workers from database...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="gs-card p-8 flex flex-col items-center gap-4"
          style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
          <AlertCircle size={32} style={{ color: '#f87171' }} />
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
          <button onClick={fetchWorkers} className="gs-btn gs-btn-secondary">Try Again</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && workers.length === 0 && (
        <div className="gs-card p-16 flex flex-col items-center gap-4">
          <UserCheck size={40} style={{ color: 'var(--color-text-dim)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No workers have completed their profile yet.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && workers.length > 0 && (
        <div className="gs-card overflow-hidden anim-fade-up delay-200">
          <table className="gs-table">
            <thead>
              <tr>
                {['Worker ID', 'Email', 'Area', 'Pincode', 'Segment', 'Avg. Income', 'PAN', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
                    WK-{String(w.id).padStart(4, '0')}
                  </td>
                  <td className="text-sm text-white">{w.email || '—'}</td>
                  <td>{w.area || '—'}</td>
                  <td>{w.pincode || '—'}</td>
                  <td>
                    <span className="gs-badge" style={{
                      background: (segmentColors[w.deliverySegment] || '#c8ff00') + '12',
                      color: segmentColors[w.deliverySegment] || '#c8ff00'
                    }}>
                      {w.deliverySegment || 'N/A'}
                    </span>
                  </td>
                  <td className="font-semibold text-white">
                    {w.avgIncome ? `₹${Number(w.avgIncome).toLocaleString()}` : '—'}
                  </td>
                  <td className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
                    {w.panNumber || '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewWorker(w.id)}
                        title="View Details"
                        disabled={detailLoading}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                        style={{ color: '#c8ff00' }}>
                        {detailLoading ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => handleDeleteWorker(w.id)}
                        title="Delete Worker"
                        disabled={deletingId === w.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
                        style={{ color: '#f87171' }}>
                        {deletingId === w.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Worker Detail Modal */}
      <Modal isOpen={!!viewWorker} onClose={() => setViewWorker(null)} title={`Worker Details — WK-${String(viewWorker?.id || '').padStart(4, '0')}`}>
        {viewWorker && (
          <div className="space-y-4">
            {[
              { label: 'Email', val: viewWorker.email },
              { label: 'Area', val: viewWorker.area },
              { label: 'Pincode', val: viewWorker.pincode },
              { label: 'Address', val: viewWorker.address },
              { label: 'Delivery Segment', val: viewWorker.deliverySegment },
              { label: 'Monthly Avg. Income', val: viewWorker.avgIncome ? `₹${Number(viewWorker.avgIncome).toLocaleString()}` : '—' },
              { label: 'Aadhaar Number', val: viewWorker.aadhaarNumber },
              { label: 'PAN Number', val: viewWorker.panNumber },
              { label: 'Bank Account', val: viewWorker.bankAccountNumber },
              { label: 'Bank Name', val: viewWorker.bankName },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{row.label}</span>
                <span className="text-xs font-medium text-white text-right max-w-[60%]">{row.val || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
