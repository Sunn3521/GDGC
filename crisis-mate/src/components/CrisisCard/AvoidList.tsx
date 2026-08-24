import React from 'react';

interface AvoidListProps {
  avoidItems: string[];
}

export const AvoidList: React.FC<AvoidListProps> = ({ avoidItems }) => {
  if (!avoidItems || avoidItems.length === 0) return null;

  return (
    <div className="w-full bg-[#1a1a2e] border border-red-500/30 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
        <span>🛑</span> THINGS TO AVOID
      </h3>
      <ul className="space-y-2.5">
        {avoidItems.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg text-gray-200 text-sm leading-relaxed"
          >
            <span className="text-red-500 font-bold text-base min-w-[1.25rem] text-center">❌</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
