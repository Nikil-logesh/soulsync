// Client-side AI service for static hosting
interface AIResponse {
  action: string;
  message: string;
  severity?: string;
  resources?: string[];
}

interface UserContext {
  location?: any;
  language?: string;
  age?: number;
  guestMode?: boolean;
}

export class AIService {
  private apiKey: string;
  private conversationHistory: Array<{userPrompt: string, aiResponse: string, timestamp: Date}> = [];
  
  constructor() {
    // Get API key from environment or use hardcoded for now (should be restricted by domain)
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDapjfkIhzytwTUKubTJNYeE3gZx0398tw';
    console.log('AI Service initialized with API key:', this.apiKey ? 'Found' : 'Not found');
  }
  
  async generateResponse(userPrompt: string, context: UserContext = {}): Promise<AIResponse> {
    console.log('Generating AI response for:', userPrompt);
    console.log('Using API key:', this.apiKey ? 'Available' : 'Missing');
    console.log('User context:', context);
    
    // Always try the API first
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\n\nAI:`;
      
      console.log('Making API request to Gemini...');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue generating a response.';
      
      console.log('Generated AI message:', aiMessage);
      
      // Store in conversation memory to avoid repetition
      this.conversationHistory.push({
        userPrompt,
        aiResponse: aiMessage,
        timestamp: new Date()
      });
      
      // Keep only last 10 conversations
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }
      
      // Check for crisis indicators
      if (this.detectCrisis(userPrompt)) {
        return {
          action: "popup",
          message: "I'm concerned about your safety. Please reach out for immediate help:",
          resources: [
            "National Suicide Prevention Lifeline: 988",
            "Tele MANAS (India): 14416", 
            "Crisis Text Line: Text HOME to 741741",
            "Emergency Services: 911/108"
          ]
        };
      }
      
      return {
        action: "response",
        message: aiMessage,
        severity: this.assessSeverity(userPrompt)
      };
      
    } catch (error) {
      console.error('AI API Error:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      // Fallback to basic responses on error
      console.log('Falling back to basic responses...');
      return this.generateBasicResponse(userPrompt, context);
    }
  }
  
  private buildSystemPrompt(context: UserContext): string {
    const { location, language = 'en-US', age, guestMode = false } = context;
    
    // Language mapping for response language
    const languageMap: Record<string, { name: string, code: string, greeting: string, cbtTerms: any }> = {
      'en-US': { 
        name: 'English', 
        code: 'en-US',
        greeting: 'Hello',
        cbtTerms: {
          thoughts: 'thoughts',
          feelings: 'feelings', 
          behaviors: 'behaviors',
          mindfulness: 'mindfulness',
          gratitude: 'gratitude'
        }
      },
      'en-GB': { 
        name: 'English', 
        code: 'en-GB',
        greeting: 'Hello',
        cbtTerms: {
          thoughts: 'thoughts',
          feelings: 'feelings',
          behaviors: 'behaviours', 
          mindfulness: 'mindfulness',
          gratitude: 'gratitude'
        }
      },
      'hi-IN': { 
        name: 'Hindi', 
        code: 'hi-IN',
        greeting: 'नमस्ते',
        cbtTerms: {
          thoughts: 'विचार',
          feelings: 'भावनाएं',
          behaviors: 'व्यवहार',
          mindfulness: 'दिमागीपन',
          gratitude: 'कृतज्ञता'
        }
      },
      'ta-IN': { 
        name: 'Tamil', 
        code: 'ta-IN',
        greeting: 'வணக்கம்',
        cbtTerms: {
          thoughts: 'எண்ணங்கள்',
          feelings: 'உணர்வுகள்',
          behaviors: 'நடத்தைகள்',
          mindfulness: 'நினைவாற்றல்',
          gratitude: 'நன்றியுணர்வு'
        }
      },
      'te-IN': { 
        name: 'Telugu', 
        code: 'te-IN',
        greeting: 'నమస్కారం',
        cbtTerms: {
          thoughts: 'ఆలోచనలు',
          feelings: 'భావనలు',
          behaviors: 'ప్రవర్తనలు',
          mindfulness: 'మనస్సుపూర్వకత',
          gratitude: 'కృతజ్ఞత'
        }
      },
      'kn-IN': { 
        name: 'Kannada', 
        code: 'kn-IN',
        greeting: 'ನಮಸ್ಕಾರ',
        cbtTerms: {
          thoughts: 'ಆಲೋಚನೆಗಳು',
          feelings: 'ಭಾವನೆಗಳು',
          behaviors: 'ನಡವಳಿಕೆಗಳು',
          mindfulness: 'ಮನಃಪೂರ್ವಕತೆ',
          gratitude: 'ಕೃತಜ್ಞತೆ'
        }
      },
      'ml-IN': { 
        name: 'Malayalam', 
        code: 'ml-IN',
        greeting: 'നമസ്കാരം',
        cbtTerms: {
          thoughts: 'ചിന്തകൾ',
          feelings: 'വികാരങ്ങൾ',
          behaviors: 'പെരുമാറ്റങ്ങൾ',
          mindfulness: 'മനഃസാന്നിധ്യം',
          gratitude: 'കൃതജ്ഞത'
        }
      },
      'bn-IN': { 
        name: 'Bengali', 
        code: 'bn-IN',
        greeting: 'নমস্কার',
        cbtTerms: {
          thoughts: 'চিন্তাভাবনা',
          feelings: 'অনুভূতি',
          behaviors: 'আচরণ',
          mindfulness: 'মননশীলতা',
          gratitude: 'কৃতজ্ঞতা'
        }
      },
      'gu-IN': { 
        name: 'Gujarati', 
        code: 'gu-IN',
        greeting: 'નમસ્તે',
        cbtTerms: {
          thoughts: 'વિચારો',
          feelings: 'લાગણીઓ',
          behaviors: 'વર્તણૂકો',
          mindfulness: 'સાવધાનતા',
          gratitude: 'કૃતજ્ઞતા'
        }
      },
      'mr-IN': { 
        name: 'Marathi', 
        code: 'mr-IN',
        greeting: 'नमस्कार',
        cbtTerms: {
          thoughts: 'विचार',
          feelings: 'भावना',
          behaviors: 'वर्तन',
          mindfulness: 'जागरूकता',
          gratitude: 'कृतज्ञता'
        }
      }
    };

    const langInfo = languageMap[language] || languageMap['en-US'];
    
    // Age-based customization
    let ageContext = '';
    if (age) {
      if (age >= 13 && age <= 17) {
        ageContext = `
AGE CONTEXT: You're speaking with a teenager (${age} years old). Use relatable language about school stress, peer pressure, identity exploration, academic pressure, family expectations, and future planning. Reference age-appropriate coping strategies and emphasize that seeking help is normal and brave.`;
      } else if (age >= 18 && age <= 25) {
        ageContext = `
AGE CONTEXT: You're speaking with a young adult (${age} years old). Address concerns about college, career choices, independence, relationships, financial stress, future uncertainty, and finding one's path. Use mature but supportive language.`;
      } else if (age >= 26 && age <= 35) {
        ageContext = `
AGE CONTEXT: You're speaking with a young professional (${age} years old). Address work-life balance, career growth, relationships, marriage pressures, family planning decisions, financial responsibilities, and establishing independence.`;
      } else if (age > 35) {
        ageContext = `
AGE CONTEXT: You're speaking with an adult (${age} years old). Address career transitions, family responsibilities, aging parents, health concerns, life purpose, and long-term planning. Use respectful, mature language.`;
      }
    }

    let prompt = `You are SoulSync, a highly personalized AI mental health companion. Provide UNIQUE, NON-REPETITIVE responses based on the specific user context.

CRITICAL: AVOID GENERIC RESPONSES. Each response must be DIFFERENT and SPECIFIC to the user's exact situation.

🌍 LANGUAGE & CULTURAL ADAPTATION:
- Respond primarily in ${langInfo.name} (${langInfo.code})
- Use "${langInfo.greeting}" as a warm, personal greeting
- NEVER repeat the same phrases - vary your language each time
- Include specific cultural references relevant to the user's background

🧠 THERAPEUTIC APPROACH:
Integrate CBT techniques NATURALLY into your response without labels:
- Help identify SPECIFIC negative thought patterns naturally in conversation
- Address EXACT emotions mentioned by the user
- Suggest CONCRETE actionable steps that feel like friendly advice
- Provide BRIEF mindfulness exercises (30 seconds max) as natural suggestions
- Ask about gratitude in a conversational way

RESPONSE STYLE - NATURAL INTEGRATION:
Write ONE flowing, conversational response that naturally includes:
1. Personal acknowledgment of their specific concern
2. Practical advice that happens to use CBT principles (NO LABELS)
3. Culturally relevant suggestions woven into the conversation
4. One thoughtful follow-up question

IMPORTANT: NO TECHNICAL LABELS like "CBT Technique" or "Cultural Coping Strategy"
- Just give advice naturally like a wise, culturally-aware friend would
- Make therapeutic techniques feel like everyday wisdom
- Blend cultural suggestions seamlessly into the conversation

MAKE EVERY RESPONSE UNIQUE BY:
- Using different opening phrases each time
- Providing different CBT techniques
- Varying the cultural references
- Asking different types of questions
- Changing the tone slightly (while remaining supportive)`;

    // Add very specific age-based context
    if (age) {
      if (age >= 13 && age <= 17) {
        prompt += `\n\n🎓 TEEN CONTEXT (${age} years): 
- Address: Board exam pressure, coaching classes, parent expectations, peer comparison
- Reference: School friend groups, social media stress, career confusion, body image
- Suggest: Study breaks, talking to school counselor, time with friends
- Cultural: Respect for parents while asserting independence, academic competition in India`;
      } else if (age >= 18 && age <= 25) {
        prompt += `\n\n🎓 YOUNG ADULT CONTEXT (${age} years):
- Address: College admission, JEE/NEET stress, relationship issues, future uncertainty
- Reference: Campus life, hostel problems, first job anxiety, marriage pressure
- Suggest: Career counseling, joining clubs, internships, skill development
- Cultural: Balancing modern aspirations with family traditions, financial independence`;
      } else if (age >= 26 && age <= 35) {
        prompt += `\n\n💼 PROFESSIONAL CONTEXT (${age} years):
- Address: Work pressure, promotion anxiety, marriage decisions, EMI stress
- Reference: Corporate culture, work-life balance, buying home, starting family
- Suggest: Weekend hobbies, exercise routine, financial planning, couple counseling
- Cultural: Joint family responsibilities, caring for aging parents, societal expectations`;
      } else if (age > 35) {
        prompt += `\n\n🌟 MATURE ADULT CONTEXT (${age} years):
- Address: Mid-life transitions, children's education, health concerns, career stagnation
- Reference: Property investments, retirement planning, family obligations, health checkups
- Suggest: Regular exercise, hobby classes, spiritual practices, family time
- Cultural: Elder care duties, mentoring younger family members, community involvement`;
      }
    }

    // Add very specific location and cultural context
    if (location && !guestMode) {
      const country = location.country || 'India';
      const state = location.state || '';
      const city = location.city || '';
      
      prompt += `\n\n📍 LOCATION CONTEXT: ${city ? city + ', ' : ''}${state ? state + ', ' : ''}${country}`;
      
      if (country.toLowerCase() === 'india') {
        // Add state-specific context
        if (state.toLowerCase().includes('maharashtra')) {
          prompt += `\n🏙️ MAHARASHTRA CONTEXT: Reference Mumbai's fast-paced life, Pune's IT culture, local festivals like Ganpati, vada pav breaks, local trains stress, Marathi cultural values`;
        } else if (state.toLowerCase().includes('karnataka')) {
          prompt += `\n🏙️ KARNATAKA CONTEXT: Reference Bangalore's tech industry, traffic issues, filter coffee culture, Mysore traditions, Kannada pride, garden city lifestyle`;
        } else if (state.toLowerCase().includes('tamil')) {
          prompt += `\n🏙️ TAMIL NADU CONTEXT: Reference Chennai's heat, temple visits, classical music/dance, Tamil literature, filter coffee, family traditions, education importance`;
        } else if (state.toLowerCase().includes('kerala')) {
          prompt += `\n🏙️ KERALA CONTEXT: Reference backwaters peace, Ayurveda practices, coconut-based food, monsoon blues, literacy pride, boat races, spice gardens`;
        } else if (state.toLowerCase().includes('delhi')) {
          prompt += `\n🏙️ DELHI CONTEXT: Reference metro travel, pollution concerns, historical monuments, street food, competitive job market, winter fog, cultural diversity`;
        } else if (state.toLowerCase().includes('gujarat')) {
          prompt += `\n🏙️ GUJARAT CONTEXT: Reference business culture, vegetarian lifestyle, Navratri celebrations, entrepreneurial spirit, Gujarati thali, joint family values`;
        } else if (state.toLowerCase().includes('west bengal')) {
          prompt += `\n🏙️ WEST BENGAL CONTEXT: Reference intellectual discussions, fish-rice culture, Durga Puja, adda sessions, artistic heritage, sweet tooth, cultural festivals`;
        } else {
          prompt += `\n🇮🇳 GENERAL INDIAN CONTEXT: Reference local festivals, family gatherings, street food, monsoon seasons, cricket matches, Bollywood, spiritual practices`;
        }
        
        prompt += `\n\n🕉️ INDIAN CULTURAL ELEMENTS TO INCLUDE:
- Traditional practices: yoga, meditation, pranayama, Ayurveda
- Family dynamics: respect for elders, joint family decisions, arranged marriages
- Festivals & celebrations: local festivals, religious observances, community gatherings
- Food culture: comfort foods, regional specialties, home-cooked meals
- Social aspects: neighborhood connections, extended family support, community harmony
- Modern challenges: work pressure, urban lifestyle, changing values, technology balance`;
      }
    }
    
    if (guestMode) {
      prompt += `\n\n👤 GUEST MODE: Provide helpful CBT-based advice but mention SoulSync's full features require sign-up.`;
    }
    
    // Add conversation memory to avoid repetition
    if (this.conversationHistory.length > 0) {
      const recentResponses = this.conversationHistory.slice(-3).map(h => h.aiResponse);
      prompt += `\n\n🔄 AVOID REPETITION: You previously responded with these patterns: ${recentResponses.join(' | ')}. 
      Make this response COMPLETELY DIFFERENT in tone, approach, and specific advice.`;
    }
    
    prompt += `\n\n⚡ FINAL INSTRUCTION: Create a UNIQUE, PERSONALIZED response. NO generic phrases. Be specific to this exact user and situation.`;
    
    return prompt;
  }
  
  private detectCrisis(prompt: string): boolean {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'hurt myself', 'self harm', 
      'die', 'death', 'want to die', 'better off dead', 'no point living'
    ];
    
    const lowercasePrompt = prompt.toLowerCase();
    return crisisKeywords.some(keyword => lowercasePrompt.includes(keyword));
  }
  
  private assessSeverity(prompt: string): string {
    const lowercasePrompt = prompt.toLowerCase();
    
    const severeKeywords = ['suicide', 'self harm', 'want to die', 'hopeless', 'can\'t go on'];
    const moderateKeywords = ['depressed', 'anxiety', 'panic', 'overwhelmed', 'stressed'];
    
    if (severeKeywords.some(keyword => lowercasePrompt.includes(keyword))) {
      return 'severe';
    } else if (moderateKeywords.some(keyword => lowercasePrompt.includes(keyword))) {
      return 'moderate';
    }
    
    return 'mild';
  }
  
  private generateBasicResponse(userPrompt: string, context: UserContext): AIResponse {
    const { location, language = 'en-US', age, guestMode = false } = context;
    
    // Generate context-specific responses based on user details
    const generateContextualResponse = (): string => {
      const baseResponses = this.getBaseResponsesByLanguage(language);
      const ageContext = this.getAgeSpecificContext(age, language);
      const locationContext = this.getLocationSpecificContext(location, language);
      const cbtTechnique = this.getRandomCBTTechnique(language);
      
      // Combine different elements to create a unique response
      const responseElements = [
        baseResponses[Math.floor(Math.random() * baseResponses.length)],
        ageContext,
        locationContext,
        cbtTechnique
      ].filter(Boolean);
      
      return responseElements.join('\n\n');
    };

    return {
      action: "response",
      message: generateContextualResponse(),
      severity: this.assessSeverity(userPrompt)
    };
  }

  private getBaseResponsesByLanguage(language: string): string[] {
    const responses: Record<string, string[]> = {
      'en-US': [
        "I can sense you're going through something challenging right now, and I want you to know that reaching out shows real courage.",
        "What you're sharing with me matters deeply. Your feelings are completely valid, and you deserve support.",
        "I'm genuinely glad you decided to open up about this. Taking care of your mental health is just as important as your physical health.",
        "Thank you for trusting me with what's on your heart. Every feeling you're experiencing is important and worthy of attention.",
        "I hear the weight in your words, and I want you to know that you're not alone in feeling this way.",
        "Your willingness to share these feelings shows incredible self-awareness and strength."
      ],
      'hi-IN': [
        "मैं समझ सकता हूं कि आप किसी मुश्किल दौर से गुजर रहे हैं, और मदद मांगना आपके साहस को दिखाता है।",
        "आपकी हर बात मेरे लिए महत्वपूर्ण है। आपकी भावनाएं बिल्कुल सही हैं।",
        "आपने मुझसे अपनी समस्या साझा की, इससे मुझे खुशी हुई। मानसिक स्वास्थ्य का ख्याल रखना जरूरी है।",
        "मैं आपकी परेशानी को समझ रहा हूं। आप अकेले नहीं हैं।",
        "आपका मुझ पर भरोसा करना मेरे लिए गर्व की बात है।",
        "आपकी हिम्मत देखकर मैं प्रभावित हूं। यह दिखाता है कि आप मजबूत हैं।"
      ],
      'ta-IN': [
        "நீங்கள் கடினமான சூழ்நிலையை எதிர்கொள்கிறீர்கள் என்பதை என்னால் உணர முடிகிறது, உதவி கேட்பது உங்கள் தைரியத்தைக் காட்டுகிறது.",
        "நீங்கள் பகிர்ந்து கொள்வது எனக்கு மிகவும் முக்கியம். உங்கள் உணர்வுகள் முற்றிலும் சரியானவை.",
        "நீங்கள் என்னிடம் இதைப் பகிர்ந்ததில் மகிழ்ச்சி. மனநலம் உடல்நலம் போலவே முக்கியம்.",
        "உங்கள் வார்த்தைகளில் உள்ள எடையை என்னால் உணர முடிகிறது, நீங்கள் தனியாக இல்லை.",
        "என்னிடம் நம்பிக்கை வைத்ததற்கு நன்றி. உங்கள் எல்லா உணர்வுகளும் முக்கியம்.",
        "இந்த உணர்வுகளைப் பகிர்ந்து கொள்ள உங்களுக்கு இருக்கும் தைரியம் பாராட்டத்தக்கது."
      ],
      'te-IN': [
        "మీరు కష్టమైన పరిస్థితిని ఎదుర్కొంటున్నారని నేను గ్రహించగలను, సహాయం అడగడం మీ ధైర్యాన్ని చూపిస్తుంది.",
        "మీరు పంచుకున్నది నాకు చాలా ముఖ్యం. మీ భావనలు పూర్తిగా సరైనవి.",
        "మీరు నాతో దీన్ని పంచుకున్నందుకు సంతోషం. మానసిక ఆరోగ్యం శారీరక ఆరోగ్యం వలె ముఖ్యం.",
        "మీ మాటల్లోని భారాన్ని నేను అనుభవించగలను, మీరు ఒంటరిగా లేరు.",
        "నన్ను నమ్మినందుకు ధన్యవాదాలు. మీ అన్ని భావాలు ముఖ్యమైనవి.",
        "ఈ భావాలను పంచుకోవడానికి మీకున్న అంతర్గత శక్తి అభినందనీయం."
      ],
      'kn-IN': [
        "ನೀವು ಕಠಿಣ ಪರಿಸ್ಥಿತಿಯನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ, ಸಹಾಯ ಕೇಳುವುದು ನಿಮ್ಮ ಧೈರ್ಯವನ್ನು ತೋರಿಸುತ್ತದೆ.",
        "ನೀವು ಹಂಚಿಕೊಂಡಿದ್ದು ನನಗೆ ಬಹಳ ಮುಖ್ಯ. ನಿಮ್ಮ ಭಾವನೆಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಸರಿಯಾಗಿವೆ.",
        "ನೀವು ನನ್ನೊಂದಿಗೆ ಇದನ್ನು ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕೆ ಸಂತೋಷ. ಮಾನಸಿಕ ಆರೋಗ್ಯವು ದೈಹಿಕ ಆರೋಗ್ಯದಷ್ಟೇ ಮುಖ್ಯ.",
        "ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿನ ಭಾರವನ್ನು ನಾನು ಅನುಭವಿಸಬಲ್ಲೆ, ನೀವು ಏಕಾಂಗಿಯಾಗಿಲ್ಲ.",
        "ನನ್ನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಎಲ್ಲಾ ಭಾವನೆಗಳು ಮುಖ್ಯವಾಗಿವೆ.",
        "ಈ ಭಾವನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ನಿಮಗಿರುವ ಧೈರ್ಯ ಶ್ಲಾಘನೀಯ."
      ]
    };
    
    return responses[language] || responses['en-US'];
  }

  private getAgeSpecificContext(age?: number, language: string = 'en-US'): string {
    if (!age) return '';
    
    const contexts: Record<string, Record<string, string>> = {
      'en-US': {
        teen: "As a teenager, you're navigating so many changes - academically, socially, and personally. These feelings are completely normal during this transformative time.",
        youngAdult: "This phase of life often brings uncertainty about the future, career choices, and relationships. Many young adults experience similar feelings.",
        professional: "Balancing work, relationships, and personal growth can be overwhelming. You're managing multiple responsibilities, and it's understandable to feel this way.",
        mature: "Life transitions at this stage can bring unique challenges. Your experiences and wisdom are valuable, and these feelings deserve attention."
      },
      'hi-IN': {
        teen: "किशोरावस्था में पढ़ाई, दोस्तों और भविष्य की चिंता होना सामान्य है। आपकी उम्र में ये भावनाएं होना स्वाभाविक है।",
        youngAdult: "इस उम्र में करियर और रिश्तों को लेकर परेशानी होना आम बात है। कई युवा इसी तरह महसूस करते हैं।",
        professional: "काम, घर और रिश्तों के बीच संतुलन बनाना मुश्किल हो सकता है। इस उम्र में ये दबाव होना समझ में आता है।",
        mature: "इस उम्र में जीवन के नए मोड़ आते हैं। आपका अनुभव कीमती है, और ये भावनाएं महत्वपूर्ण हैं।"
      }
    };
    
    const langContexts = contexts[language] || contexts['en-US'];
    
    if (age >= 13 && age <= 17) return langContexts.teen;
    if (age >= 18 && age <= 25) return langContexts.youngAdult;
    if (age >= 26 && age <= 35) return langContexts.professional;
    if (age > 35) return langContexts.mature;
    
    return '';
  }

  private getLocationSpecificContext(location?: any, language: string = 'en-US'): string {
    if (!location || !location.country) return '';
    
    const contexts: Record<string, Record<string, string>> = {
      'en-US': {
        mumbai: "Living in Mumbai's fast-paced environment can be both exciting and exhausting. The city's energy is infectious, but it's also okay to need moments of calm.",
        bangalore: "Bangalore's tech culture and traffic can sometimes feel overwhelming. Remember to take breaks and enjoy the city's pleasant weather and parks.",
        delhi: "Delhi's dynamic environment offers many opportunities, but the pace and pollution can sometimes affect our mental well-being.",
        chennai: "Chennai's rich cultural heritage and warm community can be comforting during difficult times. Consider connecting with local traditions for peace.",
        general: "India's rich cultural traditions offer many ways to find peace - through yoga, meditation, family support, and community connections."
      },
      'hi-IN': {
        mumbai: "मुंबई की तेज़ जिंदगी कभी-कभी थका देती है। यहां के सपनों के शहर में अपना ख्याल रखना भी जरूरी है।",
        bangalore: "बैंगलोर के IT culture और ट्रैफिक में कभी-कभी परेशानी हो सकती है। शहर के पार्कों में वक्त बिताएं।",
        delhi: "दिल्ली के व्यस्त माहौल में अपने लिए शांत वक्त निकालना जरूरी है। यहां के इतिहास से प्रेरणा लें।",
        chennai: "चेन्नई की सांस्कृतिक धरोहर और समुदायिक भावना मुश्किल वक्त में सहारा दे सकती है।",
        general: "भारत की परंपराओं में योग, ध्यान और पारिवारिक सहयोग के जरिए शांति मिल सकती है।"
      }
    };
    
    const langContexts = contexts[language] || contexts['en-US'];
    const city = location.city?.toLowerCase() || '';
    
    if (city.includes('mumbai') || city.includes('bombay')) return langContexts.mumbai;
    if (city.includes('bangalore') || city.includes('bengaluru')) return langContexts.bangalore;
    if (city.includes('delhi')) return langContexts.delhi;
    if (city.includes('chennai')) return langContexts.chennai;
    
    return langContexts.general;
  }

  private getRandomCBTTechnique(language: string = 'en-US'): string {
    const techniques: Record<string, string[]> = {
      'en-US': [
        "Try this quick grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
        "Take a moment to breathe deeply. Inhale for 4 counts, hold for 4, exhale for 6. This can help calm your nervous system.",
        "Write down one negative thought you're having, then challenge it: Is this thought helpful? Is it based on facts or assumptions?",
        "Practice gratitude: Can you think of one small thing that went well today, even if the rest was difficult?",
        "Try progressive muscle relaxation: Tense your shoulders for 5 seconds, then release. Notice the difference between tension and relaxation."
      ],
      'hi-IN': [
        "ये ग्राउंडिंग तकनीक आजमाएं: 5 चीजें देखें, 4 को छुएं, 3 सुनें, 2 को सूंघें, और 1 का स्वाद लें।",
        "गहरी सांस लें: 4 गिनती में सांस अंदर लें, 4 तक रोकें, 6 में छोड़ें। यह तनाव कम करेगा।",
        "एक नकारात्मक विचार लिखें, फिर सवाल करें: क्या ये विचार सहायक है? क्या ये तथ्य पर आधारित है?",
        "कृतज्ञता का अभ्यास करें: आज कोई एक छोटी अच्छी बात के बारे में सोचें।",
        "मांसपेशियों को तनावमुक्त करें: कंधों को 5 सेकंड तक सिकोड़ें, फिर छोड़ें। फर्क महसूस करें।"
      ]
    };
    
    const langTechniques = techniques[language] || techniques['en-US'];
    return langTechniques[Math.floor(Math.random() * langTechniques.length)];
  }
}

// Export singleton instance
export const aiService = new AIService();