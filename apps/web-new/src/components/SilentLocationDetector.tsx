// apps/web-new/src/components/SilentLocationDetector.tsx
"use client";

import { useEffect } from "react";
import { useSafeAuth } from '../contexts/useSafeAuth';
import { useLocation } from "../hooks/useLocation";

interface LocationData {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function SilentLocationDetector() {
  const { user, loading } = useSafeAuth();
  const { location, saveLocation } = useLocation();

  // Silent reverse geocoding function using our proxy API
  const silentReverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      const response = await fetch(
        `/api/geocode?lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Content-Type': 'application/json'
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
        accuracy: 0
      };
    } catch (error) {
      // Silent fallback using timezone
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

  // Silent location detection
  const detectLocationSilently = async () => {
    if (!navigator.geolocation) {
      return; // Silently fail if geolocation not supported
    }

    try {
      // Check if permission is already granted
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          return; // Silently exit if permission denied
        }
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // Shorter timeout for silent operation
        maximumAge: 600000 // 10 minutes cache
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            
            // Get address details silently
            const locationData = await silentReverseGeocode(latitude, longitude);
            locationData.accuracy = accuracy;
            
            // Auto-save only for authenticated users
            if (user) {
              await saveLocation(locationData);
            }
            // Remove guest location storage - guests don't get location detection
            
          } catch (error) {
            // Silent error handling - no user notification
            console.debug('Silent location processing failed:', error);
          }
        },
        (error) => {
          // Silent error handling based on error type
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.debug('Location permission denied by user');
              break;
            case error.POSITION_UNAVAILABLE:
              console.debug('Location information unavailable');
              break;
            case error.TIMEOUT:
              console.debug('Location request timed out');
              break;
            default:
              console.debug('Unknown location error:', error);
              break;
          }
        },
        options
      );
    } catch (error) {
      console.debug('Silent location detection error:', error);
    }
  };

  // Auto-detect location when component mounts and when user logs in
  useEffect(() => {
    if (loading) return;
    
    // Only detect location for authenticated users
    if (user || !user) return;
    
    // Don't detect if location already exists
    if (location) return;

    // Small delay to avoid blocking initial page load
    const timer = setTimeout(() => {
      detectLocationSilently();
    }, 2000); // 2 second delay for better UX

    return () => clearTimeout(timer);
  }, [user, location]);

  // Re-detect if user logs in and no location is saved
  useEffect(() => {
    if (user && !location) {
      // Remove guest location transfer since guests don't have location detection
      // Detect fresh location for new authenticated user
      setTimeout(detectLocationSilently, 1000);
    }
  }, [user, location, saveLocation]);

  // This component renders nothing - it's purely for background functionality
  return null;
}
