// apps/web-new/src/hooks/useLocation.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface LocationData {
  country: string;
  state: string;
  city: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  lastUpdated: string | null;
}

interface UseLocationReturn extends LocationState {
  detectLocation: () => Promise<void>;
  saveLocation: (location: LocationData) => Promise<void>;
  clearLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const { data: session, status } = useSession();
  
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    hasPermission: false,
    lastUpdated: null
  });

  // Save location to server
  const saveLocation = useCallback(async (location: LocationData) => {
    if (!session?.user) {
      setState(prev => ({ ...prev, error: "Authentication required" }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save location');
      }

      setState(prev => ({
        ...prev,
        location: {
          country: location.country,
          state: location.state,
          city: location.city
        },
        isLoading: false,
        lastUpdated: data.timestamp,
        hasPermission: true
      }));

      // Store in localStorage for quick access
      localStorage.setItem('soulsync_location', JSON.stringify({
        country: location.country,
        state: location.state,
        city: location.city,
        lastUpdated: data.timestamp
      }));

    } catch (error) {
      console.error('Save location error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to save location'
      }));
    }
  }, [session]);

  // Detect location using browser GPS
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check permission first
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Location permission denied',
            hasPermission: false 
          }));
          return;
        }
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;

      // Reverse geocode
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SoulSync-MentalWellness-App/1.0'
          }
        }
      );

      if (!geoResponse.ok) {
        throw new Error('Failed to get location details');
      }

      const geoData = await geoResponse.json();
      const address = geoData.address || {};

      const locationData: LocationData = {
        country: address.country || 'Unknown',
        state: address.state || address.region || address.province || 'Unknown',
        city: address.city || address.town || address.village || address.municipality || 'Unknown',
        latitude,
        longitude,
        accuracy
      };

      // Auto-save if user is logged in
      if (session?.user) {
        await saveLocation(locationData);
      } else {
        // Store temporarily for guest users
        setState(prev => ({
          ...prev,
          location: locationData,
          isLoading: false,
          hasPermission: true
        }));
      }

    } catch (error) {
      console.error('Location detection error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to detect location',
        hasPermission: false
      }));
    }
  }, [session, saveLocation]);

  // Load saved location from server
  const refreshLocation = useCallback(async () => {
    if (!session?.user) {
      // No location loading for guest users
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/location');
      
      if (response.status === 404) {
        // No location saved yet
        setState(prev => ({ ...prev, isLoading: false, location: null }));
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load location');
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        location: data.location,
        isLoading: false,
        lastUpdated: data.location.lastUpdated,
        hasPermission: true
      }));

      // Update localStorage
      localStorage.setItem('soulsync_location', JSON.stringify(data.location));

    } catch (error) {
      console.error('Refresh location error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load location'
      }));
    }
  }, [session]);

  // Clear location data
  const clearLocation = useCallback(async () => {
    if (session?.user) {
      try {
        await fetch('/api/location', { method: 'DELETE' });
      } catch (error) {
        console.error('Failed to delete server location:', error);
      }
    }

    // Clear local storage (only authenticated user data)
    localStorage.removeItem('soulsync_location');
    
    setState(prev => ({
      ...prev,
      location: null,
      lastUpdated: null,
      error: null
    }));
  }, [session]);

  // Load location on session change
  useEffect(() => {
    if (status === 'loading') return;
    
    refreshLocation();
  }, [status, refreshLocation]);

  return {
    ...state,
    detectLocation,
    saveLocation,
    clearLocation,
    refreshLocation
  };
}