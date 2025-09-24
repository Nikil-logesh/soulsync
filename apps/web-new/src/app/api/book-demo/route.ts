import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { collegeName, designation, adminEmail, servicesNeeded, demoEmails, accessDuration } = body;
    
    if (!collegeName || !designation || !adminEmail || !servicesNeeded || !demoEmails || !accessDuration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      return NextResponse.json(
        { error: 'Invalid admin email format' },
        { status: 400 }
      );
    }

    // Parse demo emails (support both comma-separated and newline-separated)
    const emailList = demoEmails
      .split(/[\n,]/)
      .map((email: string) => email.trim())
      .filter((email: string) => email && emailRegex.test(email));

    if (emailList.length === 0) {
      return NextResponse.json(
        { error: 'No valid demo email addresses provided' },
        { status: 400 }
      );
    }

    if (emailList.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 demo users allowed per request' },
        { status: 400 }
      );
    }

    // Calculate expiration date
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (parseInt(accessDuration) * 24 * 60 * 60 * 1000));

    // Create demo request document
    const demoRequest = {
      collegeName,
      designation,
      adminEmail: adminEmail.toLowerCase(),
      servicesNeeded,
      demoEmails: emailList,
      accessDuration: parseInt(accessDuration),
      status: 'pending',
      createdAt: now,
      expiresAt,
      requestId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Save to Firestore
    const docRef = await db.collection('demoRequests').add(demoRequest);

    // Log the request for admin review
    console.log('New demo request created:', {
      id: docRef.id,
      college: collegeName,
      admin: adminEmail,
      userCount: emailList.length,
      services: servicesNeeded.length
    });

    return NextResponse.json({
      success: true,
      requestId: demoRequest.requestId,
      message: 'Demo request submitted successfully',
      details: {
        college: collegeName,
        adminEmail,
        userCount: emailList.length,
        duration: `${accessDuration} days`,
        expiresAt: expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error creating demo request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit demo request',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint can be used by admins to list pending demo requests
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    
    const snapshot = await db
      .collection('demoRequests')
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const demoRequests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || null
    }));

    return NextResponse.json({
      success: true,
      requests: demoRequests,
      count: demoRequests.length
    });

  } catch (error) {
    console.error('Error fetching demo requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500 }
    );
  }
}