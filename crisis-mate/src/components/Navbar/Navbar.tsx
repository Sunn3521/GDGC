import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/emergency', label: 'Emergency Input', icon: '🚨' },
    { path: '/guides', label: 'Guides', icon: '📖' },
    { path: '/contacts', label: 'Contacts', icon: '📞' },
    { path: '/history', label: 'History', icon: '📜' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f1a]/95 backdrop-blur-md border-b border-[#2d2d44] px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight">
          <span className="text-2xl">🚨</span>
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            CrisisMate
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-red-600/90 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a2e]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
