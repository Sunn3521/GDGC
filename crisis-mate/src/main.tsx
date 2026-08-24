/**
 * CrisisMate — React Application Entry Point
 *
 * Initializes React DOM root and registers Service Worker for PWA offline capabilities.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register PWA Service Worker in production / browser environment
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[CrisisMate PWA] Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('[CrisisMate PWA] Service Worker registration failed:', err);
      });
  });
}
