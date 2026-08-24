import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { OfflineBanner } from './components/Offline/OfflineBanner';
import { HomePage } from './pages/Home/HomePage';
import { EmergencyInputPage } from './pages/EmergencyInput/EmergencyInputPage';
import { AnalysisResultPage } from './pages/AnalysisResult/AnalysisResultPage';
import { GuidesPage } from './pages/Guides/GuidesPage';
import { ContactsPage } from './pages/Contacts/ContactsPage';
import { HistoryPage } from './pages/History/HistoryPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] font-sans flex flex-col">
          <OfflineBanner />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/emergency" element={<EmergencyInputPage />} />
              <Route path="/analysis" element={<AnalysisResultPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
