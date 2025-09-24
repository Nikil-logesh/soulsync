import { NextRequest, NextResponse } from 'next/server';
import { rejectDemoRequest } from '@/lib/demoApproval';

export async function POST(request: NextRequest) {
  try {
    const { requestId, reason } = await request.json();
    
    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const result = await rejectDemoRequest(requestId, reason);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error in reject-demo API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reject demo request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}