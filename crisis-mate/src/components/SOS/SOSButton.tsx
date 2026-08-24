import React, { useState, useEffect } from 'react';
import type { CrisisAnalysis } from '../../types/crisis';
import type { SOSEvent } from '../../types/sos';
import { useAuth } from '../../context/AuthContext';
import { getContacts } from '../../services/firebase/contactService';
import { getCurrentLocation } from '../../services/location/locationService';
import { createSOSEvent } from '../../services/sos/sosService';
import { SOSConfirmationModal } from './SOSConfirmationModal';
import type { Contact } from '../../types/contact';

interface SOSButtonProps {
  analysis: CrisisAnalysis;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ analysis }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sosStatus, setSosStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [sosEventResult, setSosEventResult] = useState<SOSEvent | null>(null);

  useEffect(() => {
    if (user) {
      getContacts(user.uid)
        .then(setContacts)
        .catch(() => setContacts([]));
    }
  }, [user]);

  const handleOpenConfirmation = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSOS = async () => {
    setIsModalOpen(false);
    setSosStatus('processing');

    // Step 1: Request Geolocation for SOS
    const locResult = await getCurrentLocation();
    const coords = locResult.success ? locResult.coords : undefined;

    // Step 2: Create SOS Event in Firestore
    const event = await createSOSEvent({
      userId: user?.uid,
      analysis,
      location: coords,
      contacts,
    });

    setSosEventResult(event);
    setSosStatus('completed');
  };

  return (
    <div className="bg-[#1a1a2e] border border-red-500/40 rounded-xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
          <span>📡</span> Emergency SOS Activation
        </h3>
        <span className="text-xs bg-red-950 border border-red-500/40 text-red-300 px-2.5 py-1 rounded-full font-mono">
          User Confirmation Required
        </span>
      </div>

      <p className="text-xs text-gray-300">
        Package current crisis data and GPS coordinates into an official SOS record in Firestore.
      </p>

      {sosStatus === 'idle' && (
        <button
          onClick={handleOpenConfirmation}
          className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🚨</span> Trigger SOS Alert
        </button>
      )}

      {sosStatus === 'processing' && (
        <div className="p-4 bg-[#0f0f1a] border border-red-500/40 rounded-lg text-center space-y-2">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-red-300 font-semibold">Recording SOS event in Firestore...</p>
        </div>
      )}

      {sosStatus === 'completed' && sosEventResult && (
        <div className="p-4 bg-[#0f0f1a] border border-green-500/40 rounded-lg space-y-2 text-xs">
          <div className="font-extrabold text-green-400 flex items-center gap-1.5">
            <span>✓</span> SOS Event Recorded (ID: {sosEventResult.id})
          </div>
          <p className="text-gray-300">{sosEventResult.deliveryMessage}</p>
          {sosEventResult.location && (
            <div className="text-[11px] text-gray-400 font-mono">
              GPS: {sosEventResult.location.latitude.toFixed(4)}, {sosEventResult.location.longitude.toFixed(4)}
            </div>
          )}
          <button
            onClick={() => setSosStatus('idle')}
            className="px-3 py-1 bg-gray-800 text-gray-300 font-semibold rounded text-[11px]"
          >
            Reset SOS State
          </button>
        </div>
      )}

      <SOSConfirmationModal
        isOpen={isModalOpen}
        contacts={contacts}
        onConfirm={handleConfirmSOS}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};
