import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Navbar } from './components/Navbar/Navbar';
import { OfflineBanner } from './components/Offline/OfflineBanner';
import { LoadingSpinner } from './components/Loading/LoadingSpinner';

const HomePage = lazy(() => import('./pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const EmergencyInputPage = lazy(() => import('./pages/EmergencyInput/EmergencyInputPage').then((m) => ({ default: m.EmergencyInputPage })));
const AnalysisResultPage = lazy(() => import('./pages/AnalysisResult/AnalysisResultPage').then((m) => ({ default: m.AnalysisResultPage })));
const GuidesPage = lazy(() => import('./pages/Guides/GuidesPage').then((m) => ({ default: m.GuidesPage })));
const ContactsPage = lazy(() => import('./pages/Contacts/ContactsPage').then((m) => ({ default: m.ContactsPage })));
const HistoryPage = lazy(() => import('./pages/History/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const AppFallback: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <LoadingSpinner message="Loading CrisisMate..." />
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] font-sans flex flex-col">
            <OfflineBanner />
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<AppFallback />}>
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
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
