import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="h-12 flex items-center justify-between px-8 shrink-0"
      style={{ background: 'var(--color-bg-base)', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-2">
        <Shield size={12} style={{ color: 'var(--color-text-dim)' }} />
        <span className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>
          © 2026 GigShield AI. All rights reserved.
        </span>
      </div>
      <div className="flex items-center gap-4">
        {['Privacy', 'Terms', 'Documentation', 'Support'].map(link => (
          <a
            key={link}
            href="#"
            className="text-[11px] transition-colors hover:text-white"
            style={{ color: 'var(--color-text-dim)' }}
          >
            {link}
          </a>
        ))}
        <span className="text-[10px] px-2 py-0.5 rounded-md"
          style={{ color: 'var(--color-accent)', background: 'var(--color-accent-mute)' }}>
          v1.0.0
        </span>
      </div>
    </footer>
  );
}
