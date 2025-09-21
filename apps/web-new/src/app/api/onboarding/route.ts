import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { age, gender, preferredLanguage, institution, country, state, city } = await request.json();

    // Validate required fields
    if (!age || age < 13 || age > 100) {
      return NextResponse.json({ error: "Valid age is required (13-100)" }, { status: 400 });
    }

    if (!gender) {
      return NextResponse.json({ error: "Gender is required" }, { status: 400 });
    }

    if (!country || !state) {
      return NextResponse.json({ error: "Country and state are required" }, { status: 400 });
    }

    // In a real application, you would save this to a database
    // For now, we'll simulate the database save and return success
    
    // Here's where you would typically:
    // 1. Connect to your database (PostgreSQL, MongoDB, etc.)
    // 2. Insert/update user record with onboarding data
    // 3. Set onboarding_completed = true

    /*
    Example database operation:
    
    await db.users.upsert({
      where: { email: session.user.email },
      update: {
        age,
        gender,
        preferred_language: preferredLanguage,
        institution,
        location_country: country,
        location_state: state,
        location_city: city,
        onboarding_completed: true,
        updated_at: new Date()
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        age,
        gender,
        preferred_language: preferredLanguage,
        institution,
        location_country: country,
        location_state: state,
        location_city: city,
        onboarding_completed: true
      }
    });
    */

    // Simulate successful save
    console.log('Onboarding data received:', {
      email: session.user.email,
      age,
      gender,
      preferredLanguage,
      institution,
      country,
      state,
      city
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully" 
    });

  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save profile information" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real application, fetch user profile from database
    // For now, return mock data to indicate onboarding status
    
    /*
    Example database query:
    
    const user = await db.users.findUnique({
      where: { email: session.user.email },
      select: {
        age: true,
        gender: true,
        preferred_language: true,
        institution: true,
        location_country: true,
        location_state: true,
        location_city: true,
        onboarding_completed: true
      }
    });
    */

    // Mock response - in real app this would come from database
    const mockUser = {
      age: null,
      gender: null,
      preferredLanguage: 'en',
      institution: null,
      country: null,
      state: null,
      city: null,
      onboardingCompleted: false
    };

    return NextResponse.json(mockUser);

  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile information" },
      { status: 500 }
    );
  }
}