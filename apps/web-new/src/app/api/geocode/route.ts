import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Use OpenStreetMap Nominatim API via our server (no CORS issues)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SoulSync Mental Wellness App/1.0'
        }
      }
    );

    if (!response.ok) {
      // Fallback to a simple location format if API fails
      return NextResponse.json({
        display_name: `Location: ${lat}, ${lon}`,
        address: {
          country: 'Unknown',
          state: 'Unknown',
          city: 'Unknown'
        }
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    
    // Return fallback location data
    return NextResponse.json({
      display_name: 'Location services temporarily unavailable',
      address: {
        country: 'Unknown',
        state: 'Unknown', 
        city: 'Unknown'
      }
    });
  }
}