import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { EmergencySession } from '../../types/emergency';
import { getEmergencyHistory, deleteEmergencySession } from '../../services/firebase/historyService';
import { SeverityBadge } from '../../components/SeverityBadge/SeverityBadge';
import { formatEmergencyType, getEmergencyEmoji, formatTimestamp } from '../../utils/formatting';

export const HistoryPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();

  const [history, setHistory] = useState<EmergencySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEmergencyHistory(user.uid);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load emergency history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (sessionId: string) => {
    if (!user) return;
    if (!window.confirm('Delete this emergency session record?')) return;

    try {
      await deleteEmergencySession(user.uid, sessionId);
      await fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session log.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>📜</span> Emergency History
        </h1>
        <p className="text-sm text-gray-400">
          Saved emergency analysis logs and past session details.
        </p>
      </div>

      {!user ? (
        <div className="p-8 bg-[#1a1a2e] border border-[#2d2d44] rounded-2xl text-center space-y-4 shadow-xl">
          <div className="text-4xl">🔐</div>
          <h2 className="text-xl font-extrabold text-white">Sign In to Access History</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Emergency analysis history is securely synced to your private Firestore profile.
          </p>
          <button
            onClick={() => signInWithGoogle()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="text-center p-8 text-sm text-gray-400">Loading emergency history from Firestore...</div>
          ) : history.length === 0 ? (
            <div className="p-8 bg-[#1a1a2e] border border-[#2d2d44] rounded-2xl text-center space-y-2">
              <div className="text-3xl">📂</div>
              <h3 className="text-lg font-bold text-white">No Saved Emergency History</h3>
              <p className="text-xs text-gray-400">
                Analyzed crisis sessions will appear here when saved.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => {
                const emergencyType = session.emergencyType || session.analysis?.emergencyType || 'OTHER';
                const severity = session.severity || session.analysis?.severity || 'MEDIUM';
                const summary = session.summary || session.analysis?.summary || 'Emergency session recorded.';
                const actions = session.immediateActions || session.analysis?.immediateActions || [];
                const emoji = getEmergencyEmoji(emergencyType);
                const typeLabel = formatEmergencyType(emergencyType);

                return (
                  <div
                    key={session.id}
                    className="p-5 bg-[#1a1a2e] border border-[#2d2d44] rounded-xl space-y-3 shadow-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d2d44] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emoji}</span>
                        <div>
                          <div className="font-bold text-white text-base">{typeLabel}</div>
                          <div className="text-xs text-gray-400">
                            {session.timestamp || session.startedAt ? formatTimestamp(session.timestamp || session.startedAt || '') : 'Saved session'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={severity} size="sm" />
                        <button
                          onClick={() => session.id && handleDelete(session.id)}
                          className="p-1.5 text-xs text-red-400 hover:text-red-300 bg-[#0f0f1a] rounded border border-[#2d2d44]"
                          title="Delete Session Log"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-200 font-medium">{summary}</p>

                    {actions && actions.length > 0 && (
                      <div className="text-xs bg-[#0f0f1a] p-3 rounded-lg border border-[#2d2d44] space-y-1">
                        <div className="font-bold text-green-400">Priority Actions Taken:</div>
                        <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                          {actions.slice(0, 3).map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
