import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex flex-col flex-1 min-w-0" style={{ background: 'var(--color-bg-base)' }}>
        <Navbar activePage={activePage} />
        <main className="flex-1 overflow-y-auto anim-page-enter" style={{ padding: '48px' }} key={activePage}>
          {typeof children === 'function' ? children({ activePage, setActivePage }) : children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
