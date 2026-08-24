/**
 * CrisisMate — Geolocation Service
 *
 * Requests user location on-demand via Geolocation API.
 * Privacy-focused: Never continuously tracks user.
 */

import type { LocationResult, UserCoordinates, LocationErrorCode } from '../../types/location';

let _mockLocation: UserCoordinates | null = null;
let _mockLocationError: string | null = null;

/**
 * Set mock location for unit testing or fallback scenarios.
 */
export function setMockLocation(coords: UserCoordinates | null, errorMsg?: string): void {
  _mockLocation = coords;
  _mockLocationError = errorMsg || null;
}

/**
 * Get user's current coordinates using browser Geolocation API.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  if (_mockLocationError) {
    return {
      success: false,
      error: { code: 'PERMISSION_DENIED', message: _mockLocationError },
    };
  }

  if (_mockLocation) {
    return {
      success: true,
      coords: _mockLocation,
    };
  }

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      error: {
        code: 'UNSUPPORTED',
        message: 'Geolocation is not supported by your browser.',
      },
    };
  }

  return new Promise((resolve) => {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10s timeout
      maximumAge: 30000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString(),
          },
        });
      },
      (error) => {
        let code: LocationErrorCode = 'UNKNOWN';
        let message = 'An unknown location error occurred.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            code = 'PERMISSION_DENIED';
            message = 'Location permission was denied. Please allow location access to find nearby help.';
            break;
          case error.POSITION_UNAVAILABLE:
            code = 'POSITION_UNAVAILABLE';
            message = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            code = 'TIMEOUT';
            message = 'Location request timed out. Please try again.';
            break;
        }

        resolve({
          success: false,
          error: { code, message },
        });
      },
      options
    );
  });
}
