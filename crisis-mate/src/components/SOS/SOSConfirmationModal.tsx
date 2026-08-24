import React from 'react';
import type { Contact } from '../../types/contact';

interface SOSConfirmationModalProps {
  isOpen: boolean;
  contacts: Contact[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const SOSConfirmationModal: React.FC<SOSConfirmationModalProps> = ({
  isOpen,
  contacts,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] border-2 border-red-500/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 text-red-500">
          <span className="text-3xl animate-pulse">🚨</span>
          <h2 className="text-2xl font-black tracking-tight text-white">Activate SOS Alert?</h2>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">
          This will record an official SOS emergency event in Firestore and package your current GPS location and crisis analysis.
        </p>

        <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg space-y-1 text-xs">
          <div className="font-bold text-gray-300">Configured Emergency Contacts ({contacts.length}):</div>
          {contacts.length === 0 ? (
            <div className="text-amber-400 font-semibold">⚠️ No trusted contacts configured.</div>
          ) : (
            <ul className="text-gray-400 list-disc list-inside">
              {contacts.map((c) => (
                <li key={c.id}>
                  {c.name} ({c.phone})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-semibold rounded-lg">
          ⚠️ Truthful Status: SOS event will be stored in Firestore. Live SMS dispatch is pending server integration.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/50 cursor-pointer flex items-center gap-1.5"
          >
            <span>🚨</span> Activate SOS
          </button>
        </div>
      </div>
    </div>
  );
};
