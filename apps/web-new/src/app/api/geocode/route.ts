// Server-side geocoding API to avoid CORS issues
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Use OpenStreetMap Nominatim API from server-side (no CORS issues)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SoulSync-MentalWellness-App/1.0 (server-side)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    const address = data.address || {};

    const locationData = {
      country: address.country || 'Unknown',
      state: address.state || address.region || address.province || 'Unknown',
      city: address.city || address.town || address.village || address.municipality || 'Unknown',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    );
  }
}