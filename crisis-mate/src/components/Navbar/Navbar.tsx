import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signInWithGoogle, logout } = useAuth();

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
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight">
          <span className="text-2xl">🚨</span>
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            CrisisMate
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-[#2d2d44] pl-2 sm:pl-3">
              <span className="text-xs text-gray-300 font-medium hidden sm:inline">
                {user.displayName || user.email || 'User'}
              </span>
              <button
                onClick={() => logout()}
                className="px-2.5 py-1 bg-[#1a1a2e] hover:bg-red-950/80 border border-[#2d2d44] text-xs font-semibold text-gray-300 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>🔑</span>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
