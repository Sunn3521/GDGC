import React, { useState } from 'react';
import type { NearbyService, UserCoordinates, EmergencyServiceType } from '../../types/location';
import { getCurrentLocation } from '../../services/location/locationService';
import { searchNearbyServices } from '../../services/location/mapsService';

interface NearbyHelpProps {
  initialServiceType?: EmergencyServiceType;
}

export const NearbyHelp: React.FC<NearbyHelpProps> = ({ initialServiceType = 'ALL' }) => {
  const [status, setStatus] = useState<'idle' | 'locating' | 'searching' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);
  const [services, setServices] = useState<NearbyService[]>([]);
  const [filter, setFilter] = useState<EmergencyServiceType>(initialServiceType);

  const handleFindHelp = async () => {
    setStatus('locating');
    setErrorMessage(null);

    // Step 1: Request Geolocation
    const locResult = await getCurrentLocation();
    if (!locResult.success || !locResult.coords) {
      setStatus('error');
      setErrorMessage(locResult.error?.message || 'Unable to retrieve location.');
      return;
    }

    setUserCoords(locResult.coords);
    setStatus('searching');

    // Step 2: Search Nearby Services
    try {
      const results = await searchNearbyServices(locResult.coords, filter);
      setServices(results);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to load nearby services.');
    }
  };

  const handleFilterChange = async (newFilter: EmergencyServiceType) => {
    setFilter(newFilter);
    if (userCoords) {
      const results = await searchNearbyServices(userCoords, newFilter);
      setServices(results);
    }
  };

  return (
    <div className="bg-[#1a1a2e] border border-blue-500/30 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
          <span>📍</span> Nearby Emergency Services
        </h3>
        {status === 'success' && (
          <span className="text-xs bg-blue-950 border border-blue-500/40 text-blue-300 px-2.5 py-1 rounded-full font-mono">
            {services.length} Services Found
          </span>
        )}
      </div>

      {status === 'idle' && (
        <div className="text-center p-4 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg space-y-3">
          <p className="text-xs text-gray-300">
            Your location is needed to find nearby hospitals, police stations, and fire stations.
          </p>
          <button
            onClick={handleFindHelp}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-colors cursor-pointer flex items-center gap-2 mx-auto"
          >
            <span>🧭</span> Find Nearby Emergency Help
          </button>
        </div>
      )}

      {(status === 'locating' || status === 'searching') && (
        <div className="text-center p-6 space-y-2">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-blue-300 font-semibold">
            {status === 'locating' ? 'Requesting GPS location...' : 'Searching nearby hospitals and police stations...'}
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-950/80 border border-red-500/40 rounded-lg text-center space-y-3">
          <div className="text-xs text-red-300 font-semibold">⚠️ {errorMessage}</div>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleFindHelp}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
            >
              Try Again 🔄
            </button>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-1.5 bg-gray-800 text-gray-300 text-xs font-bold rounded-lg"
            >
              Continue Without Location
            </button>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          {/* Category Filter Buttons */}
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => handleFilterChange('ALL')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-[#0f0f1a] text-gray-400 border border-[#2d2d44]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('HOSPITAL')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filter === 'HOSPITAL' ? 'bg-pink-600 text-white' : 'bg-[#0f0f1a] text-gray-400 border border-[#2d2d44]'
              }`}
            >
              🏥 Hospitals
            </button>
            <button
              onClick={() => handleFilterChange('POLICE')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filter === 'POLICE' ? 'bg-blue-600 text-white' : 'bg-[#0f0f1a] text-gray-400 border border-[#2d2d44]'
              }`}
            >
              🚔 Police
            </button>
            <button
              onClick={() => handleFilterChange('FIRE_STATION')}
              className={`px-3 py-1 rounded-lg font-bold ${
                filter === 'FIRE_STATION' ? 'bg-orange-600 text-white' : 'bg-[#0f0f1a] text-gray-400 border border-[#2d2d44]'
              }`}
            >
              🔥 Fire
            </button>
          </div>

          {/* Service Cards List */}
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-3.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>
                      {service.type === 'HOSPITAL'
                        ? '🏥'
                        : service.type === 'POLICE'
                        ? '🚔'
                        : '🔥'}
                    </span>
                    <span>{service.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                    <span>{service.address}</span>
                    <span>•</span>
                    <span className="text-blue-300 font-mono">{service.distanceMeters}m away</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {service.phone && (
                    <a
                      href={`tel:${service.phone}`}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg flex-1 sm:flex-none text-center"
                    >
                      📞 Call
                    </a>
                  )}
                  <a
                    href={service.navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex-1 sm:flex-none text-center"
                  >
                    🗺️ Open Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
