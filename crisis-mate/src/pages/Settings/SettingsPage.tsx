import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>⚙️</span> Settings & Configuration
        </h1>
        <p className="text-sm text-gray-400">
          Application parameters, model settings, and safety options.
        </p>
      </div>

      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-white border-b border-[#2d2d44] pb-2">
          AI Engine Status
        </h2>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Model Engine</span>
          <span className="font-mono text-xs bg-green-950 border border-green-500/40 text-green-300 px-2.5 py-1 rounded-full">
            Gemini 1.5 Flash (Active)
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Timeout Policy</span>
          <span className="font-mono text-xs text-gray-400">15 Seconds</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Retry Attempts</span>
          <span className="font-mono text-xs text-gray-400">Max 2 Retries</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Fallback Protection</span>
          <span className="font-mono text-xs text-green-400">Enabled (Non-crashing)</span>
        </div>
      </div>
    </div>
  );
};
