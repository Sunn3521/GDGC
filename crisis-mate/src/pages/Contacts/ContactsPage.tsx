import React from 'react';
import { INDIA_EMERGENCY_NUMBERS, UNIVERSAL_EMERGENCY } from '../../types/contact';

export const ContactsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>📞</span> Emergency Contacts
        </h1>
        <p className="text-sm text-gray-400">
          Official national emergency numbers and trusted personal contact configuration.
        </p>
      </div>

      {/* Official Emergency Hotlines */}
      <div className="bg-[#1a1a2e] border border-red-500/30 rounded-xl p-5 shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
          <span>🚨</span> Official National Hotlines ({INDIA_EMERGENCY_NUMBERS.country})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3.5 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Universal Emergency Number</div>
              <div className="font-bold text-white text-base">National Helpline</div>
            </div>
            <a
              href={`tel:${UNIVERSAL_EMERGENCY}`}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-lg"
            >
              📞 {UNIVERSAL_EMERGENCY}
            </a>
          </div>

          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3.5 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Medical Ambulance</div>
              <div className="font-bold text-white text-base">Emergency Ambulance</div>
            </div>
            <a
              href={`tel:${INDIA_EMERGENCY_NUMBERS.ambulance}`}
              className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-sm rounded-lg"
            >
              📞 {INDIA_EMERGENCY_NUMBERS.ambulance}
            </a>
          </div>

          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3.5 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Police Hotline</div>
              <div className="font-bold text-white text-base">Police Control Room</div>
            </div>
            <a
              href={`tel:${INDIA_EMERGENCY_NUMBERS.police}`}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-lg"
            >
              📞 {INDIA_EMERGENCY_NUMBERS.police}
            </a>
          </div>

          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3.5 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Fire Services</div>
              <div className="font-bold text-white text-base">Fire Control Room</div>
            </div>
            <a
              href={`tel:${INDIA_EMERGENCY_NUMBERS.fire}`}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-lg"
            >
              📞 {INDIA_EMERGENCY_NUMBERS.fire}
            </a>
          </div>
        </div>
      </div>

      {/* Personal Contacts Firebase Integration State */}
      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👥</span> Trusted Personal Contacts
          </h2>
          <span className="text-xs bg-purple-950 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-full font-mono">
            Firebase Firestore Integration Ready
          </span>
        </div>

        <p className="text-xs text-gray-400">
          Personal contacts will be saved to your Firestore user profile and notified automatically during SOS alerts.
        </p>

        <div className="p-4 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-center text-sm text-gray-400">
          Firebase Authentication & Contact Storage will connect here in Member 3 integration phase.
        </div>
      </div>
    </div>
  );
};
