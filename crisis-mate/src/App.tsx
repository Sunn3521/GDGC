/**
 * CrisisMate — Root Application Component
 *
 * Sets up React Router with placeholder routes.
 * Member 2 (Frontend) will fill in the actual page components.
 *
 * Routes:
 *   /          → Home (emergency input)
 *   /result    → Emergency Result (analysis display)
 *   /history   → Emergency History
 *   /contacts  → Emergency Contacts
 *   /settings  → Settings
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ─── Placeholder page components ──────────────────────────────────────────────
// Member 2 will replace these with fully designed components.

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      minHeight: '100vh',
      background: '#0f0f1a',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      gap: '1rem',
    }}
  >
    <div style={{ fontSize: '3rem' }}>🚨</div>
    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>CrisisMate</h1>
    <p style={{ color: '#9999bb', fontSize: '1rem', margin: 0 }}>
      AI-powered Emergency Decision Engine
    </p>
    <div
      style={{
        background: '#1a1a2e',
        border: '1px solid #2d2d44',
        borderRadius: '0.75rem',
        padding: '1rem 2rem',
        marginTop: '1rem',
      }}
    >
      <p style={{ color: '#6666aa', margin: 0 }}>Page: {title}</p>
      <p style={{ color: '#555577', margin: 0, fontSize: '0.875rem' }}>
        Frontend implementation in progress by Member 2
      </p>
    </div>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlaceholderPage title="Home — Emergency Input" />} />
        <Route path="/result" element={<PlaceholderPage title="Emergency Result" />} />
        <Route path="/history" element={<PlaceholderPage title="Emergency History" />} />
        <Route path="/contacts" element={<PlaceholderPage title="Emergency Contacts" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
