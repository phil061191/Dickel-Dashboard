import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/events', label: 'Live Events', icon: '🕐' },
    { path: '/pending', label: 'Fehler/Pending', icon: '⚠️' },
    { path: '/mitarbeiter', label: 'Mitarbeiter', icon: '👥' },
    { path: '/kunden', label: 'Kunden', icon: '🏢' },
    { path: '/servicescheine', label: 'Servicescheine', icon: '📋' },
    { path: '/material', label: 'Material', icon: '📦' },
    { path: '/diktate', label: 'Diktate', icon: '🎤' },
    { path: '/system', label: 'System/Logs', icon: '⚙️' },
  ];

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Dickel Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
