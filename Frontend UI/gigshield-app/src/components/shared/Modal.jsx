export default function Modal({ isOpen, onClose, title, children, maxWidth = 520 }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: 'var(--color-text-dim)', background: 'var(--color-bg-elevated)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
