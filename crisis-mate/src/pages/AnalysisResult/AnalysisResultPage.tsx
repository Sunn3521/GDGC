import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { CrisisAnalysis } from '../../types/crisis';
import { SeverityBadge } from '../../components/SeverityBadge/SeverityBadge';
import { ActionList } from '../../components/ActionList/ActionList';
import { AvoidList } from '../../components/CrisisCard/AvoidList';
import { formatEmergencyType, getEmergencyEmoji, formatConfidence } from '../../utils/formatting';
import { INDIA_EMERGENCY_NUMBERS, UNIVERSAL_EMERGENCY } from '../../types/contact';
import { useAuth } from '../../context/AuthContext';
import { saveEmergencySession } from '../../services/firebase/historyService';
import { NearbyHelp } from '../../components/Map/NearbyHelp';
import { SOSButton } from '../../components/SOS/SOSButton';

export const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const state = location.state as { analysis?: CrisisAnalysis; userMessage?: string } | null;
  const analysis = state?.analysis;
  const userMessage = state?.userMessage || 'Emergency reported.';

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-2xl font-extrabold text-white">No Analysis Data Available</h2>
        <p className="text-gray-400 text-sm">Please describe your emergency situation to generate guidance.</p>
        <Link
          to="/emergency"
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-colors"
        >
          Go to Emergency Input
        </Link>
      </div>
    );
  }

  const handleSaveSession = async () => {
    if (!user) return;
    setSaveStatus('saving');
    setSaveError(null);

    try {
      await saveEmergencySession(user.uid, analysis, userMessage);
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
      setSaveError('Your emergency analysis is available, but we couldn\'t save the session to Firestore.');
    }
  };

  const emoji = getEmergencyEmoji(analysis.emergencyType);
  const typeLabel = formatEmergencyType(analysis.emergencyType);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Fallback Warning Banner if AI Failed */}
      {analysis.isFallback && (
        <div className="p-4 bg-amber-950/90 border border-amber-500/50 rounded-xl text-amber-200 text-sm font-medium space-y-1">
          <div className="font-extrabold text-amber-400 flex items-center gap-2">
            <span>⚠️</span> AI Analysis Temporarily Unavailable
          </div>
          <p className="text-xs text-amber-300">
            Showing verified safe basic guidance. Prioritize immediate personal safety and local emergency services.
          </p>
        </div>
      )}

      {/* CRITICAL Emergency Banner */}
      {(analysis.severity === 'CRITICAL' || analysis.escalationRequired) && (
        <div className="p-5 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-2 border-red-500 rounded-xl text-white shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🚨</span>
            <div>
              <h2 className="text-xl font-black tracking-wide text-red-200 uppercase">
                THIS MAY BE AN IMMEDIATE EMERGENCY
              </h2>
              <p className="text-xs text-red-300">
                Contact professional emergency services immediately. Do not delay evacuation or rescue.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 border-t border-red-500/40 text-xs font-bold">
            <span className="bg-red-900/90 px-3 py-1.5 rounded-lg border border-red-400/40">
              📞 Emergency Hotline: {UNIVERSAL_EMERGENCY} / {INDIA_EMERGENCY_NUMBERS.ambulance} (Ambulance) / {INDIA_EMERGENCY_NUMBERS.fire} (Fire)
            </span>
          </div>
        </div>
      )}

      {/* Header Summary Card */}
      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d2d44] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h1 className="text-2xl font-black text-white">{typeLabel}</h1>
              <span className="text-xs text-gray-400">{formatConfidence(analysis.confidence)}</span>
            </div>
          </div>
          <SeverityBadge severity={analysis.severity} size="lg" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Situation Summary</h3>
          <p className="text-lg text-white font-medium leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Immediate Risks */}
        {analysis.immediateRisks && analysis.immediateRisks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#2d2d44]">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <span>⚠️</span> Immediate Risks Identified
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.immediateRisks.map((risk, index) => (
                <span
                  key={index}
                  className="bg-orange-950/60 border border-orange-500/30 text-orange-200 text-xs px-3 py-1.5 rounded-lg font-semibold"
                >
                  {risk}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prioritized Actions List */}
      <ActionList actions={analysis.immediateActions} />

      {/* Avoid List */}
      <AvoidList avoidItems={analysis.avoid} />

      {/* Nearby Emergency Services Component (Surface when needsLocation is true or HIGH/CRITICAL) */}
      {(analysis.needsLocation || analysis.severity === 'HIGH' || analysis.severity === 'CRITICAL') && (
        <NearbyHelp />
      )}

      {/* SOS System Activation Component */}
      <SOSButton analysis={analysis} />

      {/* Firebase History Save Banner */}
      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {user ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-300">Save session to your private Firestore emergency history log.</span>
            <button
              onClick={handleSaveSession}
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Session Saved' : '💾 Save Session'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-400">Sign in to save this emergency session to your history.</span>
            <button
              onClick={() => signInWithGoogle()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
            >
              Sign In to Save
            </button>
          </div>
        )}
      </div>

      {saveError && (
        <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold rounded-lg">
          ⚠️ {saveError}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#2d2d44]">
        <button
          onClick={() => navigate('/emergency')}
          className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🚨</span> New Emergency Analysis
        </button>

        <Link
          to="/history"
          className="w-full sm:w-auto px-6 py-3 bg-[#1a1a2e] hover:bg-[#252542] border border-[#2d2d44] text-gray-200 font-bold rounded-xl transition-colors text-center"
        >
          View Emergency History 📜
        </Link>
      </div>
    </div>
  );
};
