// apps/web-new/src/components/LocationDetector.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationData {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationDetectorProps {
  onLocationDetected: (location: LocationData) => void;
  onLocationError: (error: string) => void;
  onPermissionDenied: () => void;
  showUI?: boolean;
}

export default function LocationDetector({ 
  onLocationDetected, 
  onLocationError, 
  onPermissionDenied,
  showUI = true 
}: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied" | "unknown">("unknown");

  // Reverse geocoding function to convert coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      // Using OpenStreetMap Nominatim API (free and privacy-friendly)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SoulSync-MentalWellness-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (!data || !data.address) {
        throw new Error('Unable to determine location details');
      }

      const address = data.address;
      
      return {
        country: address.country || 'Unknown',
        state: address.state || address.region || address.province || 'Unknown',
        city: address.city || address.town || address.village || address.municipality || 'Unknown',
        latitude: lat,
        longitude: lng,
        accuracy: 0 // Will be set from GPS
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      
      // Fallback: Try to determine country from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const country = timezone.split('/')[0] || 'Unknown';
      
      return {
        country: country,
        state: 'Unknown',
        city: 'Unknown',
        latitude: lat,
        longitude: lng,
        accuracy: 0
      };
    }
  };

  // Check geolocation permission status
  const checkPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        return permission.state;
      } catch (error) {
        console.error('Permission check failed:', error);
        return 'unknown';
      }
    }
    return 'unknown';
  };

  // Main location detection function
  const detectLocation = async () => {
    if (!navigator.geolocation) {
      onLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);
    setStatus("Requesting location permission...");

    // Check permission first
    const permission = await checkPermission();
    
    if (permission === 'denied') {
      setIsDetecting(false);
      onPermissionDenied();
      return;
    }

    setStatus("Detecting your location...");

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds timeout
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setStatus("Processing location data...");
          
          const { latitude, longitude, accuracy } = position.coords;
          
          // Reverse geocode to get address details
          const locationData = await reverseGeocode(latitude, longitude);
          locationData.accuracy = accuracy;
          
          setStatus("Location detected successfully!");
          setIsDetecting(false);
          
          // Securely pass location data to parent
          onLocationDetected(locationData);
          
        } catch (error) {
          console.error('Location processing error:', error);
          setIsDetecting(false);
          onLocationError('Failed to process location data');
        }
      },
      (error) => {
        setIsDetecting(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionStatus('denied');
            onPermissionDenied();
            break;
          case error.POSITION_UNAVAILABLE:
            onLocationError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            onLocationError('Location request timed out');
            break;
          default:
            onLocationError('An unknown error occurred while detecting location');
            break;
        }
      },
      options
    );
  };

  // Auto-detect on component mount if permission is already granted
  useEffect(() => {
    const autoDetect = async () => {
      const permission = await checkPermission();
      if (permission === 'granted') {
        // Auto-detect if permission already granted
        detectLocation();
      }
    };
    
    autoDetect();
  }, []);

  if (!showUI) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence>
        {permissionStatus !== 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-4"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Location for Better Support</h3>
                <p className="text-sm text-blue-600">Help us provide region-specific mental health resources</p>
              </div>
            </div>

            {isDetecting ? (
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
                />
                <p className="text-blue-700 font-medium">{status}</p>
                <p className="text-sm text-blue-600 mt-2">This may take a few seconds...</p>
              </div>
            ) : (
              <div>
                <p className="text-blue-700 mb-4 text-sm">
                  We'll automatically detect your location to provide local mental health resources and crisis support. 
                  Your location data is encrypted and kept private.
                </p>
                
                <button
                  onClick={detectLocation}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1011.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Detect My Location
                </button>
                
                <div className="mt-3 text-xs text-blue-600 space-y-1">
                  <p>🔒 Your location is encrypted and stored securely</p>
                  <p>🌍 Used only for local resource recommendations</p>
                  <p>⚙️ You can change this anytime in settings</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {permissionStatus === 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-4"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Location Access Needed</h3>
                <p className="text-sm text-yellow-600">To provide the best support experience</p>
              </div>
            </div>
            
            <p className="text-yellow-700 mb-4 text-sm">
              Location access was denied. You can still use SoulSync, but we won't be able to provide 
              local mental health resources and emergency contacts specific to your area.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}