import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickScenario = (promptText: string) => {
    navigate('/emergency', { state: { prefill: promptText } });
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-8 max-w-4xl mx-auto flex flex-col justify-between space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <span>🚨</span> Gemini Crisis Decision Engine
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Crisis<span className="text-red-500">Mate</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
          Converts panic and confusion during an emergency into clear, prioritized, actionable steps.
        </p>
      </section>

      {/* Primary Call to Action */}
      <section className="bg-gradient-to-b from-[#1a1a2e] to-[#121224] border border-red-500/40 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Experiencing an Emergency?</h2>
          <p className="text-sm text-gray-300">
            Describe what is happening in your own words. CrisisMate will analyze the situation and provide immediate action steps.
          </p>
        </div>

        <button
          onClick={() => navigate('/emergency')}
          className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-lg sm:text-xl rounded-xl shadow-lg hover:shadow-red-600/50 transition-all flex items-center justify-center gap-3 mx-auto border border-red-400/30 cursor-pointer"
        >
          <span>🚨</span>
          <span>Describe Emergency Now</span>
        </button>
      </section>

      {/* Example Quick-Pick Scenarios */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Example Emergencies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickScenario('There is a fire in my hostel room and heavy smoke is filling the hallway.')}
            className="p-4 bg-[#1a1a2e] hover:bg-[#252542] border border-[#2d2d44] rounded-xl text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm font-bold text-red-400 group-hover:text-red-300 flex items-center gap-2">
              <span>🔥</span> Hostel Room Fire & Smoke
            </div>
            <p className="text-xs text-gray-400 mt-1">Immediate fire evacuation and smoke inhalation precautions.</p>
          </button>

          <button
            onClick={() => handleQuickScenario('My friend suddenly collapsed and is not responding to calls.')}
            className="p-4 bg-[#1a1a2e] hover:bg-[#252542] border border-[#2d2d44] rounded-xl text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm font-bold text-pink-400 group-hover:text-pink-300 flex items-center gap-2">
              <span>🏥</span> Unresponsive Medical Collapse
            </div>
            <p className="text-xs text-gray-400 mt-1">Airway, CPR, and immediate emergency medical escalation.</p>
          </button>

          <button
            onClick={() => handleQuickScenario('There are sparks coming from an electrical socket near water.')}
            className="p-4 bg-[#1a1a2e] hover:bg-[#252542] border border-[#2d2d44] rounded-xl text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-2">
              <span>⚡</span> Electrical Socket Sparks
            </div>
            <p className="text-xs text-gray-400 mt-1">Circuit breaker disconnect and electrocution hazard avoidance.</p>
          </button>

          <button
            onClick={() => handleQuickScenario('Water is rapidly entering our house after heavy rain.')}
            className="p-4 bg-[#1a1a2e] hover:bg-[#252542] border border-[#2d2d44] rounded-xl text-left transition-colors cursor-pointer group"
          >
            <div className="text-sm font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-2">
              <span>🌊</span> Rapid Water Flooding
            </div>
            <p className="text-xs text-gray-400 mt-1">High ground evacuation and submersed electrical hazards.</p>
          </button>
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/guides"
          className="p-4 bg-[#1a1a2e] border border-[#2d2d44] rounded-xl hover:border-gray-500 transition-colors block text-center space-y-1"
        >
          <div className="text-2xl">📖</div>
          <div className="font-bold text-white text-sm">Emergency Guides</div>
          <div className="text-xs text-gray-400">Offline preparedness steps</div>
        </Link>

        <Link
          to="/contacts"
          className="p-4 bg-[#1a1a2e] border border-[#2d2d44] rounded-xl hover:border-gray-500 transition-colors block text-center space-y-1"
        >
          <div className="text-2xl">📞</div>
          <div className="font-bold text-white text-sm">Trusted Contacts</div>
          <div className="text-xs text-gray-400">Firebase Integration Ready</div>
        </Link>

        <Link
          to="/history"
          className="p-4 bg-[#1a1a2e] border border-[#2d2d44] rounded-xl hover:border-gray-500 transition-colors block text-center space-y-1"
        >
          <div className="text-2xl">📜</div>
          <div className="font-bold text-white text-sm">Emergency History</div>
          <div className="text-xs text-gray-400">Past session logs</div>
        </Link>
      </section>
    </div>
  );
};
