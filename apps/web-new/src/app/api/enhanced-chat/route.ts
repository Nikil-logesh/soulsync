// Enhanced Cultural Chatbot API with CBT and Location-based responses
import { NextRequest, NextResponse } from 'next/server';

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

interface CBTTechnique {
  name: string;
  description: string;
  steps: string[];
  culturalAdaptation?: string;
}

// CBT Techniques database with cultural adaptations
const getCBTTechniques = (concernType: string, culturalContext: string): CBTTechnique[] => {
  const baseTemplates: Record<string, CBTTechnique[]> = {
    'anxiety': [
      {
        name: 'Cognitive Restructuring',
        description: 'Challenge and change negative thought patterns',
        steps: [
          'Identify the anxious thought',
          'Examine the evidence for and against it',
          'Develop a more balanced perspective',
          'Practice the new thought pattern'
        ],
        culturalAdaptation: culturalContext === 'india' ? 'Consider family and societal expectations while reframing thoughts' : undefined
      },
      {
        name: 'Progressive Muscle Relaxation',
        description: 'Systematically tense and relax muscle groups',
        steps: [
          'Find a quiet, comfortable space',
          'Start with your feet and work upward',
          'Tense each muscle group for 5 seconds',
          'Release and notice the relaxation'
        ],
        culturalAdaptation: culturalContext === 'india' ? 'Can be combined with traditional practices like yoga or pranayama' : undefined
      }
    ],
    'depression': [
      {
        name: 'Behavioral Activation',
        description: 'Gradually increase meaningful activities',
        steps: [
          'List activities you used to enjoy',
          'Start with small, manageable tasks',
          'Schedule activities into your day',
          'Track your mood and energy levels'
        ],
        culturalAdaptation: culturalContext === 'india' ? 'Include family activities and traditional celebrations that bring joy' : undefined
      },
      {
        name: 'Thought Record',
        description: 'Track and challenge depressive thoughts',
        steps: [
          'Write down the triggering situation',
          'Note your emotions and their intensity',
          'Identify automatic negative thoughts',
          'Challenge these thoughts with evidence'
        ],
        culturalAdaptation: culturalContext === 'india' ? 'Consider dharmic principles and family values in thought evaluation' : undefined
      }
    ],
    'stress': [
      {
        name: 'Problem-Solving Therapy',
        description: 'Systematic approach to managing stressors',
        steps: [
          'Define the problem clearly',
          'Brainstorm possible solutions',
          'Evaluate pros and cons of each',
          'Implement and monitor the chosen solution'
        ],
        culturalAdaptation: culturalContext === 'india' ? 'Involve family elders or community leaders in solution brainstorming when appropriate' : undefined
      }
    ]
  };

  return baseTemplates[concernType] || baseTemplates['stress'];
};

// Location-specific cultural activities
const getLocationSpecificActivities = (country: string, state: string, city: string) => {
  const activities = {
    greeting: '',
    activities: ''
  };

  if (country === 'india') {
    // Only mention Tamil Nadu if actually detected in Tamil Nadu
    if (state.includes('tamil') || city.includes('chennai') || city.includes('madurai') || city.includes('coimbatore')) {
      activities.greeting = 'நீங்கள் தமிழ் நாட்டில் இருப்பதால், உங்கள் பாரம்பரிய வழிகளை பயன்படுத்தலாம்.';
      activities.activities = `
🌅 **வெளியே சென்று வானத்தைப் பாருங்கள்** (Go outside and look at the sky)
   - காலை சூரிய உதயத்தை அல்லது மாலை அழகை ரசியுங்கள்

🎨 **கோலம் போடுங்கள்** (Draw kolam)  
   - வீட்டு வாசலில் அல்லது முற்றத்தில் சிறிய கோலம் போடுங்கள்
   - இது மனதை அமைதிப்படுத்தும் தியானம் போன்றது

🙏 **கோவிலுக்கு செல்லுங்கள்** (Visit the temple)
   - அருகிலுள்ள கோவிலுக்கு சென்று சில நிமிடங்கள் அமைதியாக இருங்கள்

🌿 **துளசி செடி பராமரிக்கலாம்** (You can tend to a tulsi plant)
   - துளசி செடியை தண்ணீர் ஊற்றி பராமரிக்கலாம்

🫖 **சுடு சுடு காபி/சாய் குடிங்க** (Have hot coffee/chai)
   - ஒரு கப் சூடான காபி அல்லது சாய் அருந்துங்கள்`;
    } else if (state.includes('kerala')) {
      activities.greeting = 'നമസ്കാരം! കേരളത്തിലെ പ്രകൃതി സൗന്ദര്യം ഉപയോഗിക്കാം. (Namaskaram! Let us use Kerala\'s natural beauty.)';
      activities.activities = `
🌴 **കൊക്കിന്റെ ചുവട്ടിൽ ഇരുന്നു ധ്യാനിക്കുക** (Sit under coconut trees and meditate)
🌿 **ബാക്ക്‌വാട്ടര്‍ കാണാൻ പോവുക** (Visit backwaters)
🎭 **കഥകളി അല്ലെങ്കിൽ മോഹിനിയാട്ടം കാണുക** (Watch Kathakali or Mohiniyattam)
☔ **മഴ കേൾക്കുക** (Listen to the rain)`;
    } else if (state.includes('maharashtra')) {
      activities.greeting = 'नमस्कार! महाराष्ट्राच्या संस्कृतीचा वापर करू या. (Namaskar! Let us use Maharashtra\'s culture.)';
      activities.activities = `
🏔️ **सह्याद्रीच्या डोंगराकडे पहा** (Look at the Sahyadri mountains)
🎵 **लावणी किंवा भजन ऐका** (Listen to Lavani or bhajans)  
🙏 **गणपती बाप्पाला प्रार्थना करा** (Pray to Ganpati Bappa)
🌺 **फुलांची माळ बनवा** (Make flower garlands)`;
    } else {
      // General India (when specific state not detected)
      activities.greeting = 'I understand you\'re in India. Let\'s use some traditional approaches.';
      activities.activities = `
🌅 **Go outside and look at the sky** - Connect with nature around you
🧘‍♀️ **Practice yoga and pranayama** - Traditional breathing exercises
🙏 **Visit a local temple or pray at home** - Find spiritual grounding  
🌿 **Tend to plants** - Caring for tulsi or other plants
🫖 **Have tea and talk with family** - Connect with your support system
🎵 **Listen to devotional music** - Bhajans or classical music for peace`;
    }
  } else if (country === 'united states') {
    activities.greeting = 'Hello! Let\'s connect with your local American community and nature.';
    activities.activities = `
🌲 **Visit your local park or trail** - Take a mindful walk in nature
🏛️ **Explore local museums or community centers** - Connect with your city's culture
🛍️ **Visit a local farmers market** - Ground yourself in community activity
☕ **Sit in a local coffee shop** - Practice mindful observation of daily life
🎵 **Attend local community events** - Music, festivals, or gatherings`;
  } else if (country === 'japan') {
    activities.greeting = 'こんにちは！日本の美しい伝統を使いましょう。(Hello! Let us use Japan\'s beautiful traditions.)';
    activities.activities = `
🌸 **桜を見る** (Sakura wo miru - Look at cherry blossoms)
🍵 **茶道を楽しむ** (Sadou wo tanoshimu - Enjoy tea ceremony)
🏯 **神社に参拝** (Jinja ni sanpai - Visit a shrine)  
🌊 **枯山水を観察** (Karesansui wo kansatsu - Observe zen gardens)
📿 **座禅瞑想** (Zazen meisou - Zen meditation)`;
  }

  return activities;
};

// Cultural response adaptation
const getCulturalResponse = (concernType: string, location: any, language: string = 'en-US'): string => {
  const country = location?.country?.toLowerCase() || 'global';
  const state = location?.state?.toLowerCase() || '';
  const city = location?.city?.toLowerCase() || '';
  
  // Get location-specific activities
  const localActivities = getLocationSpecificActivities(country, state, city);
  
  // Determine response language based on input language
  const isEnglish = language.startsWith('en');
  const isTamil = language.includes('ta') || language.includes('hi-IN');
  
  // Build culturally rich response with specific local activities
  if (country === 'india') {
    if (isEnglish) {
      // Pure English response for India
      return `${localActivities.greeting}

I understand you're feeling stressed. This is completely normal given the pressures we face. Let me suggest some traditional and local ways that can help:

${localActivities.activities}

These activities will help calm your mind and connect you to your cultural roots. Take your time and do what feels right for you.`;
    } else if (isTamil && state.includes('tamil')) {
      // Pure Tamil response for Tamil Nadu
      return `${localActivities.greeting}

நீங்கள் மன அழுத்தம் உணர்கிறீர்கள், இது மிகவும் சகஜமான விஷயம். நம்ம பாரம்பரிய வழிகளில் சில உதவும்:

${localActivities.activities}

இந்த செயல்பாடுகள் உங்கள் மனதை அமைதிப்படுத்தி, உங்கள் வேர்களுடன் இணைக்க உதவும். உங்களுக்கு நல்லதாக தோன்றுவதை செய்யுங்கள்.`;
    } else {
      // Hindi for other Indian states
      return `${localActivities.greeting}

आप तनाव महसूस कर रहे हैं, यह बिल्कुल सामान्य बात है। आइए कुछ पारंपरिक तरीकों से इसे कम करते हैं:

${localActivities.activities}

ये गतिविधियां आपके मन को शांत करने और आपको अपनी जड़ों से जोड़ने में मदद करेंगी।`;
    }
  } else if (country === 'united states') {
    return `${localActivities.greeting} I understand you're experiencing stress.

Here are some locally-grounded activities that can help you feel more centered:

${localActivities.activities}

These activities will help you connect with your local community and environment, providing both mental relief and a sense of belonging.`;
  } else if (country === 'japan') {
    return `${localActivities.greeting}

ストレスを感じることは自然なことです。日本の美しい伝統を活用してみましょう：
(Feeling stress is natural. Let's utilize Japan's beautiful traditions:)

${localActivities.activities}

これらの伝統的な活動は、心の平安をもたらし、日本の美しい文化とのつながりを深めるでしょう。
(These traditional activities will bring peace to your heart and deepen your connection with Japan's beautiful culture.)`;
  }
  
  // Default for other countries
  return `I understand you're feeling stressed. Here are some culturally-aware approaches that respect your background:

🌍 **Connect with nature in your area** - Step outside and observe your local environment
🏛️ **Explore local cultural sites** - Museums, heritage sites, or community centers
☕ **Engage in local social customs** - Coffee shops, community gatherings, or local markets
📱 **Connect with your cultural community** - Online or in-person groups from your background

Your cultural identity is a source of strength. Use it to ground yourself during difficult times.`;
};

// Enhanced CBT response generator
const generateCBTResponse = (userPrompt: string, context: UserContext): string => {
  const { location, language = 'en-US' } = context;
  
  // Analyze concern type
  const lowerPrompt = userPrompt.toLowerCase();
  let concernType = 'stress';
  
  if (lowerPrompt.includes('anxious') || lowerPrompt.includes('worry') || lowerPrompt.includes('panic')) {
    concernType = 'anxiety';
  } else if (lowerPrompt.includes('depressed') || lowerPrompt.includes('sad') || lowerPrompt.includes('hopeless')) {
    concernType = 'depression';
  }

  // Get cultural context
  const culturalContext = location?.country?.toLowerCase() || 'global';
  const culturalResponse = getCulturalResponse(concernType, location, language);
  
  // Get appropriate CBT techniques
  const cbtTechniques = getCBTTechniques(concernType, culturalContext);
  const selectedTechnique = cbtTechniques[Math.floor(Math.random() * cbtTechniques.length)];

  // Build integrated cultural response (the culturalResponse already contains the activities)
  let response = culturalResponse;
  
  // Add a gentle transition to CBT techniques
  response += `\n\n💭 **मानसिक स्वास्थ्य तकनीक (Mental Health Technique):**\n`;
  response += `${selectedTechnique.description}\n\n`;
  
  // Add practical steps
  response += `**आसान तरीके (Easy Steps):**\n`;
  selectedTechnique.steps.forEach((step, index) => {
    response += `${index + 1}. ${step}\n`;
  });

  // Add cultural adaptation if available (in natural language)
  if (selectedTechnique.culturalAdaptation) {
    response += `\n🌸 **आपके सांस्कृतिक संदर्भ में (In your cultural context):** ${selectedTechnique.culturalAdaptation}\n`;
  }

  // Add location-specific resources in natural language
  const locationResources = getLocationResources(location);
  if (locationResources) {
    response += `\nIf you'd like additional support, ${locationResources}`;
  }

  return response;
};

// Location-specific mental health resources
const getLocationResources = (location: any): string => {
  if (!location) return '';
  
  const country = location.country?.toLowerCase();
  
  const resources: Record<string, string> = {
    'india': 'Consider reaching out to NIMHANS, iCALL helpline (9152987821), or local counselors familiar with Indian cultural contexts.',
    'united states': 'National Suicide Prevention Lifeline: 988, Psychology Today therapist finder, or your local community mental health center.',
    'united kingdom': 'NHS mental health services, Samaritans: 116 123, or Mind charity for support.',
    'japan': 'TELL Japan: 03-5774-0992, local mental health centers, or university counseling services.',
    'canada': 'Canada Suicide Prevention Service: 1-833-456-4566, or provincial mental health services.',
    'australia': 'Lifeline: 13 11 14, Beyond Blue: 1300 22 4636, or local GP for mental health care plans.'
  };

  return resources[country] || 'Consider reaching out to local mental health services, community counselors, or trusted healthcare providers.';
};

export async function POST(request: NextRequest) {
  try {
    const { userPrompt, userLocation, language = 'en-US', age, guestMode = false } = await request.json();

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    // Build context
    const context: UserContext = {
      location: userLocation,
      language,
      age,
      guestMode
    };

    // Check for crisis situations first
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self harm', 'want to die'];
    const hasCrisis = crisisKeywords.some(keyword => userPrompt.toLowerCase().includes(keyword));

    if (hasCrisis) {
      return NextResponse.json({
        action: 'popup',
        message: 'I notice you might be going through a really difficult time right now. Your safety and wellbeing are the top priority. Please consider reaching out to a mental health professional or crisis hotline immediately.',
        severity: 'crisis',
        resources: [
          'National Suicide Prevention Lifeline: 988 (US)',
          'Crisis Text Line: Text HOME to 741741',
          'Emergency Services: 911',
          'International: https://www.iasp.info/resources/Crisis_Centres/'
        ]
      });
    }

    // Generate CBT-enhanced cultural response
    const response = generateCBTResponse(userPrompt, context);

    return NextResponse.json({
      action: 'response',
      message: response,
      severity: 'moderate',
      cbtTechnique: true,
      culturallyAdapted: true
    });

  } catch (error) {
    console.error('Enhanced chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}