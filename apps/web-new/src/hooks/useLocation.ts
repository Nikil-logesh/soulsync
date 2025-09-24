// apps/web-new/src/hooks/useLocation.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSafeAuth } from "../contexts/useSafeAuth";

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
  const { user, loading } = useSafeAuth();
  
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    hasPermission: false,
    lastUpdated: null
  });

  // Save location to localStorage only (no server API)
  const saveLocation = useCallback(async (location: LocationData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Store directly in localStorage
      const locationData = {
        country: location.country,
        state: location.state,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        lastUpdated: Date.now()
      };

      localStorage.setItem('soulsync_location', JSON.stringify(locationData));

      setState(prev => ({
        ...prev,
        location: {
          country: location.country,
          state: location.state,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        },
        isLoading: false,
        lastUpdated: new Date(locationData.lastUpdated).toISOString(),
        hasPermission: true
      }));

    } catch (error) {
      console.error('Save location error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to save location'
      }));
    }
  }, [user]);

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
      if (user) {
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
  }, [user, saveLocation]);

  // Load saved location from localStorage only
  const refreshLocation = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Load from localStorage
      const stored = localStorage.getItem('soulsync_location');
      if (!stored) {
        setState(prev => ({ ...prev, isLoading: false, location: null }));
        return;
      }

      const data = JSON.parse(stored);
      
      setState(prev => ({
        ...prev,
        location: {
          country: data.country,
          state: data.state,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy
        },
        isLoading: false,
        lastUpdated: new Date(data.lastUpdated).toISOString(),
        hasPermission: true
      }));

    } catch (error) {
      console.error('Refresh location error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load location'
      }));
    }
  }, []);

  // Clear location data from localStorage only
  const clearLocation = useCallback(async () => {
    // Clear local storage
    localStorage.removeItem('soulsync_location');
    
    setState(prev => ({
      ...prev,
      location: null,
      lastUpdated: null,
      error: null
    }));
  }, [user]);

  // Load location on session change
  useEffect(() => {
    if (loading) return;
    
    refreshLocation();
  }, [loading, refreshLocation]);

  return {
    ...state,
    detectLocation,
    saveLocation,
    clearLocation,
    refreshLocation
  };
}
