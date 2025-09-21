// apps/web-new/src/app/api/prompt/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

type ReqBody = { 
  userPrompt?: string; 
  guestMode?: boolean;
  userLocation?: {
    country?: string;
    state?: string;
    city?: string;
  };
  userAge?: number;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
};

// Function to get user's stored location
async function getUserLocation(session: any): Promise<{ country: string; state: string; city: string } | null> {
  if (!session?.user?.email) return null;
  
  try {
    // This would typically be a database query, but we're using in-memory storage
    // In production, replace this with actual database lookup
    return null; // For now, location will come from client
  } catch (error) {
    console.error('Failed to get user location:', error);
    return null;
  }
}

// Function to get age-specific guidance for Indian youth
function getAgeSpecificGuidance(age: number): string {
  if (age >= 16 && age <= 18) {
    return `**Age Group: 16-18 (Late Teens)** - Board exam stress, career confusion, family pressure, peer relationships, body image concerns. Remember: Your worth isn't defined by marks or college admissions. This is a phase of exploration and growth.`;
  } else if (age >= 19 && age <= 21) {
    return `**Age Group: 19-21 (College Years)** - College adaptation, entrance exam pressure, independence struggles, relationship exploration, career anxiety. Remember: It's okay to feel overwhelmed - college is a major transition for everyone.`;
  } else if (age >= 22 && age <= 25) {
    return `**Age Group: 22-25 (Young Adults)** - Job search stress, family marriage pressure, financial independence, quarter-life crisis, career transitions. Remember: Everyone's timeline is different - success isn't a race.`;
  } else if (age >= 26 && age <= 30) {
    return `**Age Group: 26-30 (Young Professionals)** - Career advancement, work-life balance, relationship decisions, family planning pressure, financial stress. Remember: It's never too late to prioritize your mental health.`;
  } else {
    return `**Age Group: General youth guidance** - Academic pressure, career decisions, family expectations, social relationships. Remember: Your mental health journey is unique and valid.`;
  }
}

// Function to get culturally aware prompt
function createCulturalPrompt(userPrompt: string, location: any, guestMode: boolean, userAge?: number, conversationHistory?: Array<{role: 'user' | 'assistant'; content: string; timestamp: Date}>): string {
  const locationContext = location ? 
    `Country: ${location.country}
State/Region: ${location.state}
City: ${location.city}` : 
    `Country: Not available
State/Region: Not available  
City: Not available`;

  const ageContext = userAge ? getAgeSpecificGuidance(userAge) : "Age group: General youth guidance (16-25)";
  const culturalGuidance = getCulturalGuidance(location); // Always get cultural guidance

  // Build conversation context if available
  let conversationContext = "";
  if (conversationHistory && conversationHistory.length > 0) {
    conversationContext = "\n\n**Previous Conversation Context:**\n";
    conversationHistory.forEach((msg, index) => {
      const timeAgo = new Date().getTime() - new Date(msg.timestamp).getTime();
      const timeLabel = timeAgo < 60000 ? "just now" : timeAgo < 3600000 ? `${Math.floor(timeAgo/60000)}m ago` : `${Math.floor(timeAgo/3600000)}h ago`;
      conversationContext += `${msg.role === 'user' ? 'User' : 'You'} (${timeLabel}): ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n`;
    });
    conversationContext += "\n**IMPORTANT**: Reference this conversation history to provide personalized, continuous support. Build on previous topics and remember their concerns.\n";
  }

  const basePrompt = guestMode ?
    // Guest mode - shorter but still culturally aware and stigma-free
    `You are a supportive, empathetic mental wellness companion specifically designed for Indian youth mental wellness. You help young adults and students overcome stigma and access support in a confidential, non-judgmental environment.

Cultural Awareness: ${culturalGuidance}

Age-Specific Context: ${ageContext}${conversationContext}

**CRITICAL YOUTH-FOCUSED GUIDELINES:**
- **COMPLETELY STIGMA-FREE**: Mental health challenges are normal human experiences, not character flaws or weaknesses
- **AGE-APPROPRIATE**: Tailor advice to their specific life stage - teens focus on academics/family, young adults on career/independence
- **YOUTH-SPECIFIC**: Understand academic pressures, career anxiety, family expectations, social media stress, and identity exploration
- **ACCESSIBLE LANGUAGE**: Use simple, relatable language that resonates with young Indians
- **CONFIDENCE-BUILDING**: Frame seeking help as brave, smart, and responsible - not shameful
- **PEER-FRIENDLY**: Respond like a wise, understanding friend who validates their experiences

Keep response to 2-3 sentences. Provide ONE practical tip they can try immediately.

User message: "${userPrompt}"

Your youth-focused, completely stigma-free response:` :
    // Authenticated mode - culturally aware mental wellness for Indian youth
    `You are an AI-powered mental wellness assistant specifically designed for Indian youth mental wellness. Your mission is to help young adults and students overcome stigma and access support in a confidential, empathetic, and non-judgmental environment.

**TARGET AUDIENCE**: Indian youth (ages 16-25), students, young professionals facing academic and social pressures

The user's location and cultural context is: 
${locationContext}

Age-Specific Context: ${ageContext}

Cultural Context: ${culturalGuidance}${conversationContext}

**REVOLUTIONARY YOUTH MENTAL WELLNESS GUIDELINES - Follow EVERY response:**

1. **COMPLETELY STIGMA-FREE APPROACH**: 
   - Mental health struggles are normal human experiences, NOT personal failures
   - Seeking help is BRAVE, SMART, and RESPONSIBLE - never shameful
   - Frame therapy and counseling as self-care and personal growth
   - Mental wellness is as important as physical fitness

2. **YOUTH-SPECIFIC UNDERSTANDING**:
   - Academic pressure, board exam stress, competitive exam anxiety
   - Career uncertainty, family expectations vs. personal dreams
   - Social media pressure, body image concerns, relationship issues
   - Identity exploration, independence vs. family values
   - Financial stress, job market pressures

3. **CULTURALLY INTELLIGENT**:
   - Respect joint family dynamics while promoting individual wellness
   - Balance traditional values with modern mental health approaches
   - Never suggest family conflicts, always frame as communication opportunities
   - Integrate yoga, meditation, cultural practices with evidence-based techniques

4. **ACCESSIBLE & RELATABLE**:
   - Use simple, conversational language - like talking to a wise friend
   - Include relevant examples from Indian student/youth life
   - Reference familiar cultural contexts, festivals, traditions positively
   - Avoid medical jargon, make mental health concepts easy to understand

5. **ACTIONABLE & PRACTICAL**:
   - Provide immediate coping strategies they can try right now
   - Suggest culturally appropriate stress-relief activities
   - Offer realistic steps for their current situation
   - Include breathing exercises, quick mindfulness techniques

6. **EMPOWERING & HOPE-BUILDING**:
   - Highlight their inner strength and resilience
   - Celebrate small victories and progress
   - Frame challenges as growth opportunities
   - Remind them they're not alone - millions of Indian youth face similar struggles

7. **SAFETY-FIRST CRISIS DETECTION**:
   - Recognize academic burnout, exam stress, career anxiety
   - Identify signs of severe depression, anxiety, self-harm thoughts
   - Provide immediate safety resources and encourage professional help
   - Connect them with appropriate support systems

**FORMATTING FOR MOBILE-FIRST INDIAN YOUTH:**
- Use clear bullet points (•) and numbered lists (1., 2., 3.)
- Include relevant emojis for visual appeal and emotional connection
- Break information into digestible chunks with proper spacing
- Organize response with clear sections and headers
- Ensure readability on smartphones

**RESPONSE STRUCTURE FOR MAXIMUM IMPACT:**
1. Immediate validation and normalization of their experience
2. One practical technique they can try in next 5 minutes  
3. Broader perspective or cultural wisdom that provides hope
4. Encouragement about seeking support when needed

Keep responses under 200 words but pack them with value, empathy, and practical help.

User input/question: "${userPrompt}"

Your youth-focused, completely stigma-free, culturally intelligent response:`;

  return basePrompt;
}

// Function to get cultural guidance based on location
function getCulturalGuidance(location: any): string {
  // Default inclusive guidance for all users
  const defaultGuidance = "Consider diverse cultural backgrounds, family structures, and support systems. Be respectful of traditional practices while promoting evidence-based mental wellness. Avoid any language that could perpetuate stigma or discrimination.";
  
  if (!location || !location.country) {
    return defaultGuidance;
  }
  
  const { country, state, city } = location;
  
  // Cultural guidance based on regions (youth mental wellness focused)
  const culturalMap: { [key: string]: string } = {
    'India': `**Indian Youth Mental Wellness Context**: Understand intense academic competition (JEE, NEET, board exams), family pressure for success, career uncertainty, and social media influence. Joint family dynamics can be both supportive and pressurizing. Mental health awareness is growing but stigma persists. Traditional practices (yoga, meditation, Ayurveda) complement modern therapy. ALWAYS frame seeking help as strength and intelligence, not weakness.`,
    'United States': 'Consider individualistic values while recognizing diverse family structures. Mental health support widely available. Therapy normalized among youth.',
    'United Kingdom': 'NHS provides youth mental health services. University counseling common. Mental health discussions increasingly open.',
    'Canada': 'Provincial youth mental health programs. Campus mental health resources available. Seeking help widely accepted.',
    'Australia': 'Strong youth mental health initiatives like "R U OK?". University support services. Help-seeking encouraged.',
    'Germany': 'Comprehensive youth mental health system. Academic pressure recognized. Professional help normalized.',
    'Japan': 'Academic pressure (exam hell) understood. Traditional practices with modern therapy. Growing mental health awareness.',
    'China': 'Academic competition intense. Family expectations high. Mental wellness gaining recognition among youth.',
    'Brazil': 'Family-centered support. Community connections valued. Youth mental health awareness growing.',
    'Mexico': 'Family-oriented culture. Youth face academic and social pressures. Mental health support expanding.',
  };

  const guidance = culturalMap[country] || defaultGuidance;
  
  // Add specific regional considerations
  if (country === 'India') {
    const indianStates: { [key: string]: string } = {
      // Northern States (Youth Mental Wellness Focus)
      'Delhi': `**Youth in Delhi**: High academic competition, coaching centers, Delhi University pressure, pollution stress. Find calm in Lodhi Gardens morning walks - fresh air boosts mood. India Gate evenings with friends create support networks. Metro commute meditation: count breathing at each station. Street food bonds with peers provide natural social therapy. IIT/Medical coaching stress is real - remember your worth isn't defined by entrance exams.`,
      'Punjab': `**Youth in Punjab**: Agricultural family expectations vs. modern careers, drug addiction awareness, strong family bonds. Draw strength from mustard fields - they grow slowly but yield abundantly, like your progress. Bhangra dancing releases stress naturally. Gurdwara community service (seva) builds self-worth. Remember: your family's love isn't conditional on your career choice.`,
      'Haryana': `**Youth in Haryana**: Gender role pressures, sports culture, family honor concepts. Wrestling traditions teach that strength includes mental resilience. Village support systems are powerful - lean on elders' wisdom. Phulkari embroidery teaches patience - healing also takes time and small stitches. Your mental health matters as much as family expectations.`,
      'Uttar Pradesh': `**Youth in UP**: Intense competition (Civil Services, medical, engineering), large family dynamics. Find peace in Varanasi's teaching that life flows like the Ganga. Allahabad's confluence represents multiple paths leading to success. Kathak dance expresses emotions healthily. Joint families provide natural support - talk to understanding relatives.`,
      'Rajasthan': `**Youth in Rajasthan**: Traditional vs. modern career conflicts, desert harsh conditions teach resilience. Royal forts remind you that you come from strong stock. Rajasthani mirror work reflects light even in darkness - find your inner light. Folk music and storytelling are natural therapy. Your dreams matter as much as tradition.`,
      'Himachal Pradesh': 'Mountain culture, close-knit families, seasonal lifestyle changes. Mountains teach that peaks and valleys are both part of life\'s journey. Apple blossoms in spring show renewal after harsh winters. Traditional Pahari paintings tell stories of resilience. Small communities provide strong emotional bonds.',
      
      // Western States  
      'Maharashtra': 'Regional pride, Mumbai urban pressures, business culture. Find strength in Warli art - simple lines create powerful stories, like your journey. Mumbai\'s local trains teach resilience and community spirit. Ganesh festivals show how celebration heals communities. Family discussions over cutting chai provide natural therapy.',
      'Gujarat': 'Business culture, vegetarian traditions, strong family support. Bandhani tie-dye teaches that pressure creates beautiful patterns - your struggles will create beauty too. Garba dancing during Navratri shows how movement heals the spirit. Joint family businesses demonstrate collective strength. Dhokla and thepla shared with family provide comfort.',
      'Goa': 'Relaxed coastal lifestyle, tourism culture. Ocean waves teach rhythm and persistence - they never stop, neither should your healing. Fado music and Konkani folk songs express deep emotions. Beach sunsets remind us that every day can end beautifully. Portuguese-influenced architecture shows how different cultures can harmoniously blend.',
      'Madhya Pradesh': 'Central Indian culture, traditional values. Khajuraho sculptures show that human experiences, including struggle, are sacred. Gond art uses dots and lines to create strength - small steps build great journeys. Dense forests teach that growth happens slowly but surely. Family gatherings around traditional chulha provide warmth and connection.',
      
      // Southern States (Youth Mental Wellness Focus)
      'Tamil Nadu': `**Youth in Tamil Nadu**: High academic expectations, engineering/medical entrance pressure, strong literary heritage. Draw inspiration from kolam patterns - each morning is a fresh start! Carnatic music ragas match different emotions - find yours. Engineering in Chennai creates stress, but remember Tamil literature teaches resilience. Family filter coffee discussions provide natural counseling. **TAMIL FORMATTING**: Use clear numbered points (1., 2., 3.) with proper spacing and relevant cultural elements for organized responses.`,
      'Karnataka': `**Youth in Karnataka**: Bangalore IT dreams, engineering college pressure, traditional-modern balance. Rangoli art is meditative - geometric patterns calm racing minds. Tech industry stress is real but Mysore yoga traditions help. Yakshagana performances show emotional expression through art. Remember: your coding skills don't define your worth.`,
      'Kerala': `**Youth in Kerala**: High literacy expectations, Gulf job pressures, competitive academics. Monsoon rains represent renewal - you can also refresh your mind. Backwater boat rides teach slow, steady progress. Ayurveda principles show mind-body connection. Family Onam gatherings remind you of unconditional love and abundance.`,
      'Andhra Pradesh': `**Youth in AP**: Hyderabad tech aspirations, agricultural family backgrounds, English medium pressure. Kuchipudi dance shows grace under pressure. Spicy food shared with friends provides comfort. Charminar survived centuries - so can you survive this difficult phase. Tech dreams are valid, but so is your current struggle.`,
      'Telangana': `**Youth in Telangana**: IT sector dreams, competitive exam stress, urban-rural divides. Hyderabad's heritage teaches that new and old can coexist beautifully. Biryani shared during stress brings people together. Remember: whether you're from village or city, your feelings are equally valid and your dreams equally worthy.`,
      
      // Eastern States
      'West Bengal': 'Intellectual culture, Kolkata literary traditions, political consciousness. Find solace in alpona rangoli designs during Durga Puja - they welcome goddess energy into homes, and healing into hearts. Rabindra Sangeet melodies can heal the soul. Coffee house discussions provide natural group therapy. Adda (informal chatting) is Bengal\'s traditional mental health practice.',
      'Odisha': 'Coastal lifestyle, traditional festivals. Jagannath temple teaches that journeys (yatra) involve both smooth rides and bumpy roads. Pattachitra paintings tell stories of struggle and triumph. Traditional Odissi dance shows grace through difficulty. Cyclone-resilient communities teach collective healing and rebuilding.',
      'Jharkhand': 'Mining industry impact, traditional practices. Sohrai and Kohvar wall paintings show how tribal women express joy through art during festivals. Dense forests teach that roots go deep for stability. Traditional Santhal communities show how collective singing and dancing heal trauma. Natural springs represent fresh starts.',
      'Bihar': 'Strong family bonds, educational aspirations, migration for work. Madhubani paintings by women show how creativity flows from daily life struggles. Chhath Puja standing in rivers teaches endurance and devotion. Large joint families provide natural support systems. Classical music traditions show how ragas can heal different emotions.',
      
      // Northeastern States
      'Assam': 'Tea garden areas, ethnic diversity. Consider cultural preservation stress and strong family bonds.',
      'Manipur': 'Martial arts culture, strong women leadership, valley-hill divide. Consider sports as stress relief, matriarchal influences, and ethnic harmony importance.',
      'Nagaland': 'Traditional culture, warrior traditions. Consider traditional healing and local solidarity.',
      'Meghalaya': 'Matrilineal society, hill tribe culture. Consider unique family structures, local support, and nature-based stress relief.',
      
      // Union Territories & Others
      'Jammu and Kashmir': 'Complex political situation, natural beauty for healing. Consider conflict stress, strong family support, and nature therapy potential.',
      'Uttarakhand': 'Hill culture, spiritual significance, yoga traditions. Consider pilgrimage importance, mountain lifestyle, and traditional spiritual practices.',
      'Chhattisgarh': 'Mining areas, traditional values. Consider indigenous practices, forest-based lifestyle, and traditional healing.',
    };
    
    if (indianStates[state]) {
      return `${guidance} Specific to ${state}: ${indianStates[state]} `;
    }
  }
  
  return `${guidance} Always remember: Mental wellness is a sign of strength and self-awareness, not weakness.`;
}

// Function to get culturally-aware crisis response
function getCulturalCrisisResponse(location: any): string {
  if (!location) {
    return "We're very concerned for your safety. Please reach out for immediate help - you're not alone and support is available.";
  }

  const { country, state, city } = location;
  
  // Base crisis message with location
  let baseMessage = `We're very concerned for your safety in ${city}, ${state}, ${country}. Please reach out for immediate help - you're not alone and support is available.`;
  
  // Add culturally-sensitive guidance based on location
  if (country === 'India') {
    const culturalGuidance = getCulturalCrisisGuidance(state);
    baseMessage += `\n\n${culturalGuidance}`;
    
    // Add India-specific guidance
    baseMessage += "\n\nImmediate actions you can take:\n";
    baseMessage += "• Reach out to a trusted family member or friend\n";
    baseMessage += "• Consider speaking with a mental health professional\n";
    baseMessage += "• Remember that seeking help shows strength, not weakness\n";
    baseMessage += "• Your life has value and meaning";
  } else {
    // International guidance
    baseMessage += "\n\nImmediate support is available in your area. Please consider reaching out to local mental health services or trusted individuals in your life.";
  }
  
  return baseMessage;
}

// Function to get culturally-aware severe response  
function getCulturalSevereResponse(location: any): string {
  if (!location) {
    return "It sounds like you're going through something very heavy. Please consider reaching out to a qualified mental health professional for support.";
  }

  const { country, state, city } = location;
  
  let baseMessage = `It sounds like you're going through something very difficult in ${city}, ${state}. `;
  
  if (country === 'India') {
    const culturalGuidance = getCulturalSevereGuidance(state);
    baseMessage += culturalGuidance;
    
    baseMessage += "\n\nConsider these culturally-appropriate steps:\n";
    baseMessage += "• Talk to someone you trust - a family elder, friend, or mentor\n";
    baseMessage += "• Explore local mental health resources and counseling services\n";
    baseMessage += "• Remember that mental wellness is as important as physical health\n";
    baseMessage += "• Take small steps towards self-care and healing";
  } else {
    baseMessage += "Please consider reaching out to mental health professionals in your area. Support is available and you don't have to go through this alone.";
  }
  
  return baseMessage;
}

// Cultural crisis guidance for Indian states (anti-casteism focused)
function getCulturalCrisisGuidance(state: string): string {
  const stateGuidance: { [key: string]: string } = {
    'Karnataka': 'In Bangalore and across Karnataka, mental health awareness is growing. Many healthcare facilities and counseling centers are available to provide immediate support.',
    'Tamil Nadu': 'Tamil Nadu has strong healthcare infrastructure. Chennai and other cities have crisis intervention services and mental health professionals who understand local needs.',
    'Maharashtra': 'Mumbai and Maharashtra have extensive mental health resources. The fast-paced urban environment means many support systems are available for crisis situations.',
    'Kerala': 'Kerala has excellent healthcare systems and high literacy rates. Mental health awareness is generally good, and professional help is readily accessible.',
    'West Bengal': 'Kolkata and West Bengal have a tradition of intellectual discourse and community support. Mental health services are available through both government and private sectors.',
    'Delhi': 'As the capital, Delhi has comprehensive mental health infrastructure with crisis helplines, hospitals, and counseling centers available 24/7.',
    'Gujarat': 'Gujarat has strong family support systems and growing mental health awareness. Both traditional and modern approaches to wellness are valued.',
    'Punjab': 'Punjab values family connections and community support. Mental health services are improving, and seeking help is increasingly accepted.',
    'Rajasthan': 'Rajasthan combines traditional values with modern healthcare. Mental health support is available in major cities like Jaipur and Udaipur.',
    'Uttar Pradesh': 'UP has diverse support systems across urban and rural areas. Mental health awareness is growing, and professional help is available in major cities.',
  };
  
  return stateGuidance[state] || 'Your state has mental health resources available. Professional support and crisis intervention services can provide immediate help.';
}

// Cultural severe guidance for Indian states (anti-casteism focused)
function getCulturalSevereGuidance(state: string): string {
  const stateGuidance: { [key: string]: string } = {
    'Karnataka': 'Karnataka, especially around Bangalore, has many mental health professionals who understand the unique pressures of modern urban life balanced with traditional values.',
    'Tamil Nadu': 'Tamil Nadu values both intellectual discourse and emotional wellbeing. Professional counseling and traditional wellness practices can work together for your healing.',
    'Maharashtra': 'Maharashtra recognizes the importance of mental health alongside physical health. The state has good access to counseling and therapeutic services.',
    'Kerala': 'Kerala has progressive views on mental health and excellent healthcare systems. Professional support is widely available and socially accepted.',
    'West Bengal': 'West Bengal appreciates thoughtful approaches to mental wellness. The state has good mental health infrastructure and culturally sensitive practitioners.',
    'Delhi': 'Delhi offers comprehensive mental health services with practitioners from diverse backgrounds who understand various cultural perspectives.',
    'Gujarat': 'Gujarat values both family support and professional guidance. Mental health services are increasingly accessible and culturally appropriate.',
    'Punjab': 'Punjab combines strong family values with growing acceptance of professional mental health support. Help is available through various channels.',
    'Rajasthan': 'Rajasthan respects both traditional wisdom and modern mental health approaches. Professional support is available while honoring cultural values.',
    'Uttar Pradesh': 'UP has diverse approaches to mental wellness. Professional counseling is available in urban areas, and family support remains important.',
  };
  
  return stateGuidance[state] || 'Your area has mental health resources that respect local cultural values while providing professional support.';
}

// Function to get state and city-specific crisis resources for India
function getIndianCrisisResources(state?: string, city?: string) {
  // National helplines (always included)
  const nationalResources = [
    {
      name: "AASRA Suicide Prevention Helpline",
      phone: "+91 98204 66726",
      url: "http://www.aasra.info/",
    },
    {
      name: "Sneha India (24/7)",
      phone: "+91 44 2464 0050",
      url: "https://snehaindia.org/",
    },
    {
      name: "iCall Psychosocial Helpline",
      phone: "+91 95256 48033",
      url: "https://icallhelpline.org/",
    },
    {
      name: "Vandrevala Foundation Helpline",
      phone: "+91 9999 666 555",
      url: "https://www.vandrevalafoundation.com/",
    }
  ];

  // State-specific helplines
  const stateResources: { [key: string]: any[] } = {
    'Maharashtra': [
      {
        name: "Mumbai Crisis Helpline",
        phone: "+91 22 2414 6669",
        location: "Mumbai",
      },
      {
        name: "Pune Mental Health Support",
        phone: "+91 20 2553 1628",
        location: "Pune",
      },
      {
        name: "Connecting Trust Maharashtra",
        phone: "+91 98200 11777",
        location: "Statewide",
      }
    ],
    'Karnataka': [
      {
        name: "Bangalore Crisis Support",
        phone: "+91 80 2569 2020",
        location: "Bangalore",
      },
      {
        name: "Parivarthan Counselling Centre",
        phone: "+91 80 2549 7777",
        location: "Bangalore",
      }
    ],
    'Tamil Nadu': [
      {
        name: "Chennai Suicide Prevention Centre",
        phone: "+91 44 2464 0050",
        location: "Chennai",
      },
      {
        name: "Roshni Trust Chennai",
        phone: "+91 44 2464 0055",
        location: "Chennai",
      }
    ],
    'Delhi': [
      {
        name: "Delhi Mental Health Helpline",
        phone: "+91 11 2389 2001",
        location: "Delhi NCR",
      },
      {
        name: "Sumaitri Delhi",
        phone: "+91 11 2338 9090",
        location: "Delhi",
      }
    ],
    'West Bengal': [
      {
        name: "Kolkata Crisis Helpline",
        phone: "+91 33 2464 7266",
        location: "Kolkata",
      },
      {
        name: "Maaitri Kolkata",
        phone: "+91 33 2474 4704",
        location: "Kolkata",
      }
    ],
    'Gujarat': [
      {
        name: "Ahmedabad Mental Health Support",
        phone: "+91 79 2630 5544",
        location: "Ahmedabad",
      }
    ],
    'Rajasthan': [
      {
        name: "Jaipur Crisis Support",
        phone: "+91 141 233 6666",
        location: "Jaipur",
      }
    ],
    'Uttar Pradesh': [
      {
        name: "Lucknow Mental Health Helpline",
        phone: "+91 522 406 4949",
        location: "Lucknow",
      }
    ],
    'Punjab': [
      {
        name: "Chandigarh Crisis Centre",
        phone: "+91 172 274 6666",
        location: "Chandigarh",
      }
    ],
    'Haryana': [
      {
        name: "Gurgaon Mental Health Support",
        phone: "+91 124 481 1111",
        location: "Gurgaon",
      }
    ],
    'Telangana': [
      {
        name: "Hyderabad Crisis Helpline",
        phone: "+91 40 2764 2020",
        location: "Hyderabad",
      }
    ],
    'Andhra Pradesh': [
      {
        name: "Vijayawada Mental Health Centre",
        phone: "+91 866 248 8888",
        location: "Vijayawada",
      }
    ],
    'Kerala': [
      {
        name: "Kochi Mental Health Support",
        phone: "+91 484 297 7777",
        location: "Kochi",
      },
      {
        name: "Thiruvananthapuram Crisis Centre",
        phone: "+91 471 232 5555",
        location: "Thiruvananthapuram",
      }
    ],
    'Odisha': [
      {
        name: "Bhubaneswar Mental Health Helpline",
        phone: "+91 674 235 9999",
        location: "Bhubaneswar",
      }
    ],
    'Bihar': [
      {
        name: "Patna Crisis Support",
        phone: "+91 612 222 4444",
        location: "Patna",
      }
    ],
    'Jharkhand': [
      {
        name: "Ranchi Mental Health Centre",
        phone: "+91 651 220 8888",
        location: "Ranchi",
      }
    ],
    'Assam': [
      {
        name: "Guwahati Crisis Helpline",
        phone: "+91 361 266 7777",
        location: "Guwahati",
      }
    ]
  };

  let resources = [...nationalResources];
  
  // Add state-specific resources if available
  if (state && stateResources[state]) {
    resources = [...resources, ...stateResources[state]];
  }

  return resources;
}

function getCrisisResources(location: any) {
  const defaultResources = [
    {
      name: "International Crisis Centres",
      url: "https://www.iasp.info/resources/Crisis_Centres/",
    },
    {
      name: "Crisis Text Line (Text HOME to 741741)",
      url: "https://www.crisistextline.org/",
    },
    {
      name: "National Suicide Prevention Lifeline: 988",
      url: "https://suicidepreventionlifeline.org/",
    }
  ];

  if (!location) return defaultResources;

  const { country, state, city } = location;

  // Location-specific crisis resources
  const locationResources: { [key: string]: any[] } = {
    'India': getIndianCrisisResources(state, city),
    'United States': [
      {
        name: "National Suicide Prevention Lifeline",
        phone: "988",
        url: "https://suicidepreventionlifeline.org/",
      },
      {
        name: "Crisis Text Line",
        phone: "Text HOME to 741741",
        url: "https://www.crisistextline.org/",
      }
    ],
    'United Kingdom': [
      {
        name: "Samaritans (24/7)",
        phone: "116 123",
        url: "https://www.samaritans.org/",
      },
      {
        name: "SHOUT Crisis Text Line",
        phone: "Text SHOUT to 85258",
        url: "https://giveusashout.org/",
      }
    ],
    'Canada': [
      {
        name: "Talk Suicide Canada",
        phone: "1-833-456-4566",
        url: "https://talksuicide.ca/",
      }
    ],
    'Australia': [
      {
        name: "Lifeline Australia",
        phone: "13 11 14",
        url: "https://www.lifeline.org.au/",
      }
    ]
  };

  return locationResources[country] || defaultResources;
}

async function callGemini(apiKey: string, model: string, text: string) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;

  const payload = {
    contents: [{ parts: [{ text }] }],
  };

  const r = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const j = await r.json();
  if (!r.ok) {
    const msg = j?.error?.message || j?.message || "Gemini API error";
    throw new Error(msg);
  }

  // robust text extraction (keeping your existing logic)
  let reply = "⚠️ No reply from Gemini.";
  if (j?.candidates?.[0]?.content?.parts?.[0]?.text) {
    reply = j.candidates[0].content.parts[0].text;
  } else if (j?.candidates?.[0]?.content?.[0]?.text) {
    reply = j.candidates[0].content[0].text;
  } else if (j?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    reply = j.response.candidates[0].content.parts[0].text;
  } else if (typeof j?.text === "string") {
    reply = j.text;
  } else {
    const cand = j?.candidates?.[0] || j?.response?.candidates?.[0];
    if (cand && cand.content) {
      const parts = cand.content.parts || (Array.isArray(cand.content) ? cand.content : []);
      if (parts?.[0]?.text) reply = parts[0].text;
    }
  }
  return reply.trim();
}

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const userPrompt = (body?.userPrompt || "").trim();
    const guestMode = body?.guestMode || false;
    const userLocation = body?.userLocation || null;
    const userAge = body?.userAge || null;
    const conversationHistory = body?.conversationHistory || null;

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400 });
    }

    // Get user session for authenticated users
    const session = await getServerSession();
    
    // Get location for both authenticated and guest users
    let location = null;
    if (session?.user && !guestMode) {
      location = userLocation || await getUserLocation(session);
    } else if (guestMode && userLocation) {
      // Allow guest users to use location for cultural responses
      location = userLocation;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      console.log("GEMINI_API_KEY not configured, providing enhanced fallback response");
      
      // Enhanced fallback with crisis detection and location awareness
      const crisisKeywords = [
        "kill myself", "suicide", "end my life", "want to die", "self harm", 
        "hurt myself", "not worth living", "better off dead", "suicidal"
      ];
      
      const severKeywords = [
        "worthless", "hopeless", "can't go on", "nothing matters", "hate myself",
        "want to disappear", "tired of living", "give up"
      ];
      
      const userLower = userPrompt.toLowerCase();
      const isCrisis = crisisKeywords.some(keyword => userLower.includes(keyword));
      const isSevere = severKeywords.some(keyword => userLower.includes(keyword));

      if (isCrisis) {
        // Location-specific crisis resources
        const crisisResources = getCrisisResources(location);
        const culturalMessage = getCulturalCrisisResponse(location);
        
        return NextResponse.json({
          action: "popup",
          severity: "CRISIS",
          message: culturalMessage,
          resources: crisisResources,
        });
      }

      if (isSevere) {
        const severeResources = location && location.country === 'India' ? [
          {
            name: "Find Local Counsellor (India)",
            url: "https://www.psychologytoday.com/intl/therapists",
          },
          {
            name: "iCall Psychosocial Helpline",
            phone: "+91 95256 48033",
            url: "https://icallhelpline.org/",
          },
          {
            name: "Mental Health Resources",
            url: "https://www.mentalhealth.gov/get-help",
          }
        ] : [
          {
            name: "Find a counsellor",
            url: "/counsellors",
          },
          {
            name: "Mental Health Resources",
            url: "https://www.mentalhealth.gov/get-help",
          }
        ];
        
        const culturalMessage = getCulturalSevereResponse(location);
        
        return NextResponse.json({
          action: "popup",
          severity: "SEVERE", 
          message: culturalMessage,
          resources: severeResources,
        });
      }
      
      // Regular fallback response (keeping your existing one)
      const fallbackResponse = `Thank you for sharing your thoughts with me. I can see that you're reaching out, which is a positive step.

While I'd love to provide you with a personalized response using AI, the Gemini API key isn't configured yet. 

Here's what I can offer right now:
• **Take a deep breath**: Try the 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8)
• **Ground yourself**: Name 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, 1 you can taste
• **Write it down**: Sometimes putting thoughts on paper helps organize them
• **Reach out**: If you're in crisis, please contact a mental health professional or crisis hotline

Remember: Your feelings are valid, and seeking support shows strength. 💙

*To enable full AI responses, please configure the GEMINI_API_KEY in your environment variables.*`;

      return NextResponse.json({ 
        action: "chat",
        reply: fallbackResponse 
      });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // 1️⃣ Classification prompt with few-shot examples
    const classifyPrompt = `
You are a mental-health safety classifier.
Read the following user message and respond ONLY with one of these labels:
CRISIS (suicidal, self-harm, severe abuse, immediate risk of harm to self or others)
SEVERE (major depression or hopelessness but not immediate danger)
NORMAL (everyday stress, anxiety, sadness, or mild distress)

Examples:
Message: "I want to end my life."
Label: CRISIS

Message: "I feel so worthless and nothing matters anymore."
Label: SEVERE

Message: "I'm stressed about my exams."
Label: NORMAL

Message: "${userPrompt}"
Label:
`.trim();

    try {
      // 2️⃣ Ask Gemini to classify
      const classification = (await callGemini(apiKey, model, classifyPrompt))
        .toUpperCase()
        .replace(/[^A-Z]/g, ""); // keep only letters

      console.log("Classification result:", classification);

      // 3️⃣ Respond based on classification
      if (classification.startsWith("CRISIS")) {
        const crisisResources = getCrisisResources(location);
        const culturalMessage = getCulturalCrisisResponse(location);
        
        return NextResponse.json({
          action: "popup",
          severity: "CRISIS",
          message: culturalMessage,
          resources: crisisResources,
        });
      }

      if (classification.startsWith("SEVERE")) {
        const severeResources = location && location.country === 'India' ? [
          {
            name: "Find Local Counsellor (India)",
            url: "https://www.psychologytoday.com/intl/therapists",
          },
          {
            name: "iCall Psychosocial Helpline",
            phone: "+91 95256 48033",
            url: "https://icallhelpline.org/",
          },
          {
            name: "Mental Health Resources",
            url: "https://www.mentalhealth.gov/get-help",
          }
        ] : [
          {
            name: "Find a counsellor", 
            url: "/counsellors",
          },
          {
            name: "Mental Health Resources",
            url: "https://www.mentalhealth.gov/get-help",
          }
        ];
        
        const culturalMessage = getCulturalSevereResponse(location);
        
        return NextResponse.json({
          action: "popup",
          severity: "SEVERE",
          message: culturalMessage,
          resources: severeResources,
        });
      }
    } catch (classifyError) {
      console.log("Classification failed, proceeding with normal response:", classifyError);
      // If classification fails, continue with normal CBT response
    }

    // 4️⃣ If normal or classification failed: generate culturally aware supportive reply
    const cbtPrompt_final = createCulturalPrompt(userPrompt, location, guestMode, userAge || undefined, conversationHistory || undefined);

    const cbtReply = await callGemini(apiKey, model, cbtPrompt_final);

    // Additional safety filter to ensure no caste/identity promotion
    const safeReply = cbtReply
      .replace(/\b(caste|brahmin|kshatriya|vaishya|shudra|dalit|untouchable|upper class|lower class)\b/gi, 'community')
      .replace(/\b(high born|low born|pure|impure|superior|inferior)\b/gi, 'valued');

    const finalReply = safeReply;

    console.log('🎭 Generated AI response for culturally-aware mental wellness');

    return NextResponse.json({
      action: "chat",
      reply: finalReply,
    });
  } catch (err: any) {
    console.error("Error in /api/prompt:", err);
    
    // Provide a helpful fallback response instead of just an error
    const fallbackResponse = `I understand you're looking for support right now. While I'm experiencing some technical difficulties, I want to offer you some immediate help:

🌟 **You're being heard**: Thank you for reaching out. That shows real strength.

💭 **Some techniques that might help**:
• **Breathe deeply**: Try breathing in for 4 counts, holding for 4, then out for 4
• **Ground yourself**: Look around and name 5 things you can see right now
• **Be kind to yourself**: Treat yourself with the compassion you'd show a good friend

🆘 **If you're in crisis**:
• Emergency: Call 911
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741

Your wellbeing matters. Please consider reaching out to a trusted person or mental health professional. The technical issue will be resolved soon. 💙

*To enable full AI responses, please configure the GEMINI_API_KEY in your environment variables.*`;

    return NextResponse.json({ 
      action: "chat",
      reply: fallbackResponse 
    });
  }
}