import React from 'react';
import { Link } from 'react-router-dom';
import { useNetworkStatus } from '../../utils/network';

export const OfflineBanner: React.FC = () => {
  const isOnlineState = useNetworkStatus();

  if (isOnlineState) return null;

  return (
    <div className="bg-amber-950/90 border-b border-amber-500/50 px-4 py-2 text-amber-200 text-xs font-semibold flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span>OFFLINE MODE — AI analysis is unavailable offline. Showing local emergency guides.</span>
      </div>
      <Link
        to="/guides"
        className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded text-[11px] font-bold"
      >
        Open Guides 📖
      </Link>
    </div>
  );
};
