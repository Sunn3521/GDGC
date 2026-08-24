import React from 'react';

export const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>📜</span> Emergency Session History
        </h1>
        <p className="text-sm text-gray-400">
          View past crisis analyses, timestamps, and resolutions.
        </p>
      </div>

      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-6 text-center space-y-3 shadow-lg">
        <div className="text-4xl">🔥</div>
        <h2 className="text-lg font-bold text-white">Firestore Persistence Ready</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Past emergency sessions will automatically sync to Firestore upon user authentication.
        </p>
        <div className="inline-block text-xs bg-purple-950/80 border border-purple-500/40 text-purple-300 px-3 py-1 rounded-full font-mono">
          Firebase Member 3 Integration Ready
        </div>
      </div>
    </div>
  );
};
