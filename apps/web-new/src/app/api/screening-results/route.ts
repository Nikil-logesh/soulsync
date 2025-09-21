import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Mock database for development
const mockDatabase = {
  screeningResults: [] as any[],
  userProgress: [] as any[]
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to save results" }, 
        { status: 401 }
      );
    }

    const { 
      screeningType, 
      totalScore, 
      answers, 
      interpretation, 
      severity, 
      recommendations,
      culturalRecommendations,
      completedAt
    } = await request.json();

    // Validate required fields
    if (!screeningType || totalScore === undefined || !answers || !interpretation || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate screening type
    const validTypes = ['PHQ-9', 'GAD-7', 'GHQ-12'];
    if (!validTypes.includes(screeningType)) {
      return NextResponse.json({ error: "Invalid screening type" }, { status: 400 });
    }

    // Check if user can retake this test (prevent too frequent testing)
    const canRetake = checkRetakeEligibility(session.user.email, screeningType);
    if (!canRetake.eligible) {
      return NextResponse.json({ 
        error: "Too soon to retake this test",
        message: `Please wait until ${new Date(canRetake.nextAllowedDate).toLocaleDateString()} to retake ${screeningType}`,
        nextAllowedDate: canRetake.nextAllowedDate
      }, { status: 429 });
    }

    // Create screening result object
    const screeningResult = {
      id: Date.now().toString(),
      userEmail: session.user.email,
      screeningType,
      totalScore,
      answers: JSON.stringify(answers),
      interpretation,
      severity,
      recommendations: JSON.stringify(recommendations),
      culturalRecommendations: JSON.stringify(culturalRecommendations || []),
      completedAt: completedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Store in mock database (replace with real database in production)
    mockDatabase.screeningResults.push(screeningResult);
    
    // Calculate next test recommendations
    const nextTestDate = calculateNextTestDate(screeningType, severity);
    const retakeEligibleDate = calculateRetakeDate(screeningType);

    return NextResponse.json({
      success: true,
      message: "Screening result saved successfully",
      data: {
        id: screeningResult.id,
        nextTestRecommended: nextTestDate,
        canRetakeAfter: retakeEligibleDate,
        retestingAdvice: getRetestingAdvice(severity, screeningType)
      }
    });

  } catch (error) {
    console.error("Error saving screening result:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const screeningType = searchParams.get('type');

    // Get user's screening history from mock database
    let userResults = mockDatabase.screeningResults.filter(
      result => result.userEmail === session.user.email
    );

    if (screeningType) {
      userResults = userResults.filter(result => result.screeningType === screeningType);
    }

    // Sort by completion date (newest first)
    userResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    // Apply limit
    userResults = userResults.slice(0, limit);

    // Add next test eligibility info
    const resultsWithNextTest = userResults.map(result => ({
      ...result,
      nextTestRecommended: calculateNextTestDate(result.screeningType, result.severity),
      canRetakeNow: checkRetakeEligibility(session.user.email!, result.screeningType).eligible
    }));

    return NextResponse.json({
      success: true,
      data: resultsWithNextTest,
      pagination: {
        total: userResults.length,
        limit,
        hasMore: userResults.length === limit
      }
    });

  } catch (error) {
    console.error("Error fetching screening results:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Helper Functions

function checkRetakeEligibility(userEmail: string, screeningType: string): { eligible: boolean; nextAllowedDate: string } {
  const userResults = mockDatabase.screeningResults.filter(
    result => result.userEmail === userEmail && result.screeningType === screeningType
  );

  if (userResults.length === 0) {
    return { eligible: true, nextAllowedDate: new Date().toISOString() };
  }

  // Get most recent test
  const lastTest = userResults.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];

  const lastTestDate = new Date(lastTest.completedAt);
  const now = new Date();
  
  // Minimum 3 days between tests
  const minRetakeDate = new Date(lastTestDate);
  minRetakeDate.setDate(minRetakeDate.getDate() + 3);

  return {
    eligible: now >= minRetakeDate,
    nextAllowedDate: minRetakeDate.toISOString()
  };
}

function calculateNextTestDate(screeningType: string, severity: string): string {
  const now = new Date();
  let weeksToAdd = 4; // Default 1 month

  // Adjust frequency based on severity
  switch (severity.toLowerCase()) {
    case 'severe':
    case 'significant distress':
      weeksToAdd = 1; // 1 week for severe cases
      break;
    case 'moderately_severe':
    case 'moderate distress':
    case 'moderate':
      weeksToAdd = 2; // 2 weeks for moderate cases
      break;
    case 'mild':
    case 'mild distress':
      weeksToAdd = 4; // 1 month for mild cases
      break;
    default:
      weeksToAdd = 8; // 2 months for minimal/good cases
  }

  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + (weeksToAdd * 7));
  return nextDate.toISOString();
}

function calculateRetakeDate(screeningType: string): string {
  const now = new Date();
  const retakeDate = new Date(now);
  
  // Minimum 3 days before retaking
  retakeDate.setDate(retakeDate.getDate() + 3);
  
  return retakeDate.toISOString();
}

function getRetestingAdvice(severity: string, screeningType: string): string {
  switch (severity.toLowerCase()) {
    case 'severe':
    case 'significant distress':
      return `Given your ${screeningType} results, we recommend retesting weekly to monitor your progress. Please also consider professional support.`;
    case 'moderate':
    case 'moderate distress':
      return `Your ${screeningType} results suggest retesting in 2 weeks to track improvement. Continue with recommended activities.`;
    case 'mild':
    case 'mild distress':
      return `Retesting monthly will help track your mental wellness journey. Keep up the good work with self-care.`;
    default:
      return `You're doing well! Consider retesting every 2 months to maintain awareness of your mental health.`;
  }
}

function generatePersonalizedRecommendations(
  screeningType: string, 
  severity: string, 
  user: any
): string[] {
  const recommendations: string[] = [];

  // Base recommendations by severity
  if (severity === 'severe' || severity === 'moderately_severe') {
    recommendations.push("Consider scheduling an appointment with a mental health professional");
    recommendations.push("Reach out to your support system - family, friends, or trusted individuals");
    recommendations.push("Explore our crisis support resources and emergency contacts");
  } else if (severity === 'moderate') {
    recommendations.push("Consider speaking with a counselor or therapist");
    recommendations.push("Explore our guided meditation and mindfulness resources");
    recommendations.push("Join our community support groups or forums");
  } else {
    recommendations.push("Continue your current wellness practices");
    recommendations.push("Explore our preventive mental health resources");
    recommendations.push("Consider incorporating mindfulness into your daily routine");
  }

  // Screening-specific recommendations
  if (screeningType === 'PHQ-9') {
    recommendations.push("Access our depression education videos and articles");
    recommendations.push("Try our mood tracking tools to monitor your progress");
  } else if (screeningType === 'GAD-7') {
    recommendations.push("Explore our anxiety management techniques and breathing exercises");
    recommendations.push("Access our collection of calming audio resources");
  }

  // Cultural recommendations based on user location
  if (user.locationData?.country === 'India') {
    recommendations.push("Explore culturally-relevant wellness practices from your region");
    if (user.locationData.state === 'Tamil Nadu') {
      recommendations.push("Consider traditional Tamil healing practices alongside modern approaches");
    }
  }

  return recommendations;
}