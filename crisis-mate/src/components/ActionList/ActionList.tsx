import React from 'react';

interface ActionListProps {
  actions: string[];
  title?: string;
}

export const ActionList: React.FC<ActionListProps> = ({
  actions,
  title = 'WHAT TO DO NOW',
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="w-full bg-[#1a1a2e] border border-green-500/30 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
        <span>⚡</span> {title}
      </h3>
      <ol className="space-y-3">
        {actions.map((action, index) => (
          <li
            key={index}
            className="flex items-start gap-3 bg-[#0f0f1a] border border-[#2d2d44] p-3.5 rounded-lg text-gray-100 font-medium text-base leading-snug"
          >
            <span className="flex items-center justify-center bg-green-900/80 text-green-300 font-extrabold rounded-full w-7 h-7 min-w-[1.75rem] text-sm border border-green-500/40">
              {index + 1}
            </span>
            <span className="pt-0.5">{action}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
