// apps/web-new/src/app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

interface LocationData {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UserLocationRecord {
  userId: string;
  encryptedLocation: string;
  lastUpdated: string;
  ipAddress: string;
  userAgent: string;
}

// Simple encryption for location data (in production, use proper encryption)
function encryptLocation(data: LocationData, key: string): string {
  try {
    const jsonString = JSON.stringify(data);
    // In production: use crypto.createCipher or similar
    const encoded = Buffer.from(jsonString).toString('base64');
    return encoded;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt location data');
  }
}

function decryptLocation(encryptedData: string, key: string): LocationData {
  try {
    // In production: use crypto.createDecipher or similar
    const decoded = Buffer.from(encryptedData, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt location data');
  }
}

// In-memory storage for demo (replace with database in production)
const locationStorage = new Map<string, UserLocationRecord>();

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const { location }: { location: LocationData } = await request.json();

    // Validate location data
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json(
        { error: "Invalid location data" },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (location.latitude < -90 || location.latitude > 90 || 
        location.longitude < -180 || location.longitude > 180) {
      return NextResponse.json(
        { error: "Invalid coordinate values" },
        { status: 400 }
      );
    }

    // Get client info for security logging
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Encrypt location data
    const encryptionKey = process.env.LOCATION_ENCRYPTION_KEY || 'fallback-key-change-in-production';
    const encryptedLocation = encryptLocation(location, encryptionKey);

    // Store encrypted location
    const locationRecord: UserLocationRecord = {
      userId,
      encryptedLocation,
      lastUpdated: new Date().toISOString(),
      ipAddress: clientIP,
      userAgent
    };

    locationStorage.set(userId, locationRecord);

    // Log for security (remove sensitive data)
    console.log(`Location updated for user ${userId.substring(0, 3)}... from IP ${clientIP.substring(0, 7)}...`);

    return NextResponse.json({
      success: true,
      message: "Location saved securely",
      timestamp: locationRecord.lastUpdated,
      location: {
        country: location.country,
        state: location.state,
        city: location.city,
        // Don't return exact coordinates for privacy
        accuracy: location.accuracy > 1000 ? 'Low' : location.accuracy > 100 ? 'Medium' : 'High'
      }
    });

  } catch (error) {
    console.error('Location storage error:', error);
    return NextResponse.json(
      { error: "Failed to save location" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const locationRecord = locationStorage.get(userId);

    if (!locationRecord) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    // Decrypt location data
    const encryptionKey = process.env.LOCATION_ENCRYPTION_KEY || 'fallback-key-change-in-production';
    const location = decryptLocation(locationRecord.encryptedLocation, encryptionKey);

    return NextResponse.json({
      success: true,
      location: {
        country: location.country,
        state: location.state,
        city: location.city,
        lastUpdated: locationRecord.lastUpdated,
        // Don't return exact coordinates unless specifically needed
        hasCoordinates: !!(location.latitude && location.longitude),
        accuracy: location.accuracy > 1000 ? 'Low' : location.accuracy > 100 ? 'Medium' : 'High'
      }
    });

  } catch (error) {
    console.error('Location retrieval error:', error);
    return NextResponse.json(
      { error: "Failed to retrieve location" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    
    // Delete user's location data
    const deleted = locationStorage.delete(userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Location data not found" },
        { status: 404 }
      );
    }

    console.log(`Location data deleted for user ${userId.substring(0, 3)}...`);

    return NextResponse.json({
      success: true,
      message: "Location data deleted successfully"
    });

  } catch (error) {
    console.error('Location deletion error:', error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}