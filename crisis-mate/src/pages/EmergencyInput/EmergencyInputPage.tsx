import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeCrisis } from '../../services/gemini/geminiService';
import { validateEmergencyMessage } from '../../utils/validation';
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner';

export const EmergencyInputPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as { prefill?: string }).prefill) {
      setMessage((location.state as { prefill: string }).prefill);
    }
  }, [location.state]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validation = validateEmergencyMessage(message);
    if (!validation.isValid) {
      setError(validation.error || 'Please describe your emergency.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeCrisis(message);
      setIsAnalyzing(false);
      navigate('/analysis', { state: { analysis, userMessage: message } });
    } catch (err) {
      setIsAnalyzing(false);
      setError('An unexpected error occurred while analyzing the emergency. Returning safe fallback.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const setExamplePrompt = (text: string) => {
    setMessage(text);
    setError(null);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <LoadingSpinner message="Analyzing emergency with Gemini 1.5 Flash..." />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>🚨</span> Describe Emergency
        </h1>
        <p className="text-sm text-gray-400">
          State what is happening as clearly as possible. Focus on immediate dangers, injuries, or hazards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. There is a fire in my hostel room and heavy smoke is filling the hallway..."
            className="w-full h-44 p-4 bg-[#1a1a2e] border border-[#2d2d44] focus:border-red-500 rounded-xl text-white placeholder-gray-500 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40"
            maxLength={2000}
            aria-label="Emergency description input"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono">
            {message.length} / 2000
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-300 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-gray-400 hidden sm:inline">
            Press <kbd className="bg-[#1a1a2e] border border-gray-600 px-1.5 py-0.5 rounded text-white">Ctrl + Enter</kbd> to submit
          </span>

          <button
            type="submit"
            disabled={message.trim().length === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              message.trim().length > 0
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>⚡</span> Analyze Crisis
          </button>
        </div>
      </form>

      {/* Suggested Prompts */}
      <div className="space-y-2.5 pt-4 border-t border-[#2d2d44]">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Example Emergency Scenarios</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExamplePrompt('There is a fire in my hostel room and heavy smoke is filling the hallway.')}
            className="text-xs bg-[#1a1a2e] hover:bg-[#282845] border border-[#2d2d44] text-gray-300 px-3 py-2 rounded-lg text-left transition-colors"
          >
            🔥 Hostel Room Fire
          </button>
          <button
            type="button"
            onClick={() => setExamplePrompt('My friend suddenly collapsed and is not responding.')}
            className="text-xs bg-[#1a1a2e] hover:bg-[#282845] border border-[#2d2d44] text-gray-300 px-3 py-2 rounded-lg text-left transition-colors"
          >
            🏥 Unresponsive Collapse
          </button>
          <button
            type="button"
            onClick={() => setExamplePrompt('There are sparks coming from an electrical socket.')}
            className="text-xs bg-[#1a1a2e] hover:bg-[#282845] border border-[#2d2d44] text-gray-300 px-3 py-2 rounded-lg text-left transition-colors"
          >
            ⚡ Electrical Sparks
          </button>
          <button
            type="button"
            onClick={() => setExamplePrompt('Water is rapidly entering our house after heavy rain.')}
            className="text-xs bg-[#1a1a2e] hover:bg-[#282845] border border-[#2d2d44] text-gray-300 px-3 py-2 rounded-lg text-left transition-colors"
          >
            🌊 House Flooding
          </button>
        </div>
      </div>
    </div>
  );
};
