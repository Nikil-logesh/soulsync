// API route for handling user prompts - integrates with the AI service
import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '../../../lib/aiService';

interface UserContext {
  location?: {
    country: string;
    state: string;
    city: string;
  };
  language?: string;
  age?: number;
  guestMode?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { userPrompt, userLocation, language = 'en-US', age, guestMode = false } = await request.json();

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    // Build context for AI service
    const context: UserContext = {
      location: userLocation,
      language,
      age,
      guestMode
    };

    console.log('Processing prompt:', userPrompt);
    console.log('User context:', context);

    // Use the existing AI service to generate response
    const aiResponse = await aiService.generateResponse(userPrompt, context);

    // Format response based on action type
    if (aiResponse.action === 'popup') {
      return NextResponse.json({
        action: 'popup',
        message: aiResponse.message,
        severity: aiResponse.severity || 'moderate',
        resources: aiResponse.resources || []
      });
    } else {
      // Regular response
      return NextResponse.json({
        reply: aiResponse.message,
        severity: aiResponse.severity || 'moderate',
        action: 'response'
      });
    }

  } catch (error) {
    console.error('Error in /api/prompt:', error);
    
    // Return a fallback response
    return NextResponse.json({
      reply: "I'm here to support you. While I'm processing your request, please know that your feelings are valid and seeking help is a sign of strength. If you're in crisis, please reach out to a mental health professional immediately.",
      severity: 'moderate',
      action: 'response'
    }, { status: 200 }); // Return 200 to avoid frontend errors
  }
}