import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Analyzing your emergency situation with Gemini...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping"></div>
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white tracking-wide">{message}</h3>
        <p className="text-sm text-gray-400">Please remain calm. Prioritizing immediate safety steps.</p>
      </div>
    </div>
  );
};
