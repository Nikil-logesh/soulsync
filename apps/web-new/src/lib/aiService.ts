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
  private modelName: string;
  private conversationHistory: Array<{userPrompt: string, aiResponse: string, timestamp: Date}> = [];
  
  constructor() {
    // Get API key from environment or use hardcoded for now (should be restricted by domain)
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBIH0iIv31peP2p2iChW03Mqx53f0ZzUOw';
    this.modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash';
    console.log('🔧 AI Service Debug Info:');
    console.log('Environment API Key:', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? `${process.env.NEXT_PUBLIC_GEMINI_API_KEY.substring(0, 10)}...${process.env.NEXT_PUBLIC_GEMINI_API_KEY.substring(-4)}` : 'NOT FOUND');
    console.log('Final API Key Used:', this.apiKey ? `${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length-4)}` : 'Not found');
    console.log('Using model:', this.modelName);
  }
  
  async generateResponse(userPrompt: string, context: UserContext = {}): Promise<AIResponse> {
    console.log('🗣️ Generating AI response for:', userPrompt);
    console.log('🌍 Location detected:', context.location);
    console.log('🗣️ Language detected:', context.language);
    console.log('📱 Full context:', context);
    
    // Check for crisis situations first
    if (this.detectCrisis(userPrompt)) {
      return {
        action: "popup",
        message: "I notice you might be going through a really difficult time right now. Your safety and wellbeing are the top priority. Please consider reaching out to a mental health professional or crisis hotline immediately.",
        severity: "crisis",
        resources: [
          "National Suicide Prevention Lifeline: 988",
          "Crisis Text Line: Text HOME to 741741",
          "International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/"
        ]
      };
    }

    // Try to use AI API first, fallback to enhanced CBT responses if it fails
    try {
      return await this.generateAIResponse(userPrompt, context);
    } catch (error) {
      console.error('AI API failed, using enhanced CBT responses:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Rate limit exceeded')) {
        console.log('⚡ Flash model rate limit hit - switching to enhanced CBT intelligence');
      } else if (errorMessage.includes('access denied')) {
        console.log('🔐 API access issue - using secure CBT responses');
      } else {
        console.log('🔄 API temporarily unavailable - using enhanced CBT fallback system');
      }
      
      console.log('✅ Users get CBT-based, culturally-aware therapeutic responses');
      return this.generateEnhancedResponse(userPrompt, context);
    }
  }

  private async generateAIResponse(userPrompt: string, context: UserContext): Promise<AIResponse> {
    const { location, language = 'en-US', age, guestMode = false } = context;
    
    // Analyze concern type for context
    const concernType = this.analyzeConcernType(userPrompt);
    
    // Create contextual prompt for AI
    const systemPrompt = this.createSystemPrompt(concernType, context);
    const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;

    try {
      console.log('Making API request to Gemini with model:', this.modelName);
      
      // Try multiple API endpoint versions (v1beta is the correct one for Gemini)
      const apiEndpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`,
      ];
      
      let response: Response | null = null;
      let lastError: any = null;
      
      for (const apiUrl of apiEndpoints) {
        try {
          console.log('Trying API URL:', apiUrl.replace(this.apiKey, '[API_KEY_HIDDEN]'));
          
          response = await fetch(apiUrl, {
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
                maxOutputTokens: 1000,
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

          if (response.ok) {
            console.log('Successfully connected to:', apiUrl.replace(this.apiKey, '[API_KEY_HIDDEN]'));
            break; // Success, exit the loop
          } else if (response.status === 429) {
            console.log('Rate limit exceeded (429). Using enhanced fallback responses.');
            lastError = new Error('Rate limit exceeded - using intelligent fallback responses');
          } else if (response.status === 403) {
            console.log('API key access denied (403). Check API key permissions.');
            lastError = new Error('API key access denied - using intelligent fallback responses');
          } else {
            console.log(`API endpoint failed with status ${response.status}:`, apiUrl.replace(this.apiKey, '[API_KEY_HIDDEN]'));
            lastError = new Error(`API request failed: ${response.status} ${response.statusText}`);
          }
        } catch (endpointError) {
          console.log('Endpoint error:', endpointError);
          lastError = endpointError;
          response = null;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All API endpoints failed');
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response structure');
      }

      const aiMessage = data.candidates[0].content.parts[0].text;

      // Store in conversation history
      this.conversationHistory.push({
        userPrompt,
        aiResponse: aiMessage,
        timestamp: new Date()
      });

      return {
        action: "response",
        message: aiMessage,
        severity: this.assessSeverity(userPrompt)
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      throw error; // Re-throw to trigger fallback
    }
  }

  private createSystemPrompt(concernType: string, context: UserContext): string {
    const { language = 'en-US', age, location } = context;
    
    // Enhanced cultural and regional context
    const culturalContext = this.getCulturalContext(location, language);
    
    let systemPrompt = `You are a compassionate, professionally trained mental health support assistant specializing in culturally sensitive care. Your responses should be:

1. Empathetic and validating of the user's feelings
2. Based on evidence-based therapeutic approaches (CBT, mindfulness, etc.)
3. Culturally sensitive and age-appropriate for their specific region
4. Focused on providing practical coping strategies
5. Encouraging professional help when appropriate
6. Respectful of cultural, religious, and social contexts

User Context:
- Concern Type: ${concernType}
- Language: ${language}
- Age: ${age || 'Not specified'}
- Cultural Context: ${culturalContext}

IMPORTANT: Never mention the user's location explicitly in your response. Use cultural context to provide relevant suggestions silently.

Specific Guidelines for ${concernType}:`;

    const guidelines: Record<string, string> = {
      'exam-anxiety': 'Focus on academic stress management, study techniques, and exam preparation strategies. Acknowledge the pressure students face while providing practical anxiety management tools.',
      'academic-stress': 'Address study-related stress with time management techniques, workload management, and academic coping strategies. Emphasize that academic struggles don\'t define worth.',
      'academic-general': 'Provide balanced academic support focusing on both educational goals and mental health. Include study tips and stress management.',
      'anxiety': 'Use proven anxiety management techniques like grounding exercises, breathing techniques, and cognitive restructuring. Be validating and reassuring.',
      'depression': 'Be extra empathetic. Focus on small, manageable steps and encourage professional support. Avoid toxic positivity.',
      'stress': 'Provide stress management techniques, lifestyle adjustments, and coping strategies. Focus on building resilience.',
      'general': 'Be supportive and ask clarifying questions if needed. Provide general mental health support and validation.'
    };

    systemPrompt += guidelines[concernType] || guidelines['general'];

    // Add cultural and language-specific guidance
    const culturalGuidance = this.getCulturalGuidance(location, language);
    if (culturalGuidance) {
      systemPrompt += `\n\nCultural Considerations: ${culturalGuidance}`;
    }

    systemPrompt += '\n\nAlways end with practical, actionable advice. Keep response length reasonable (200-400 words). If the situation seems serious, gently encourage professional help.';

    return systemPrompt;
  }

  private getCulturalContext(location: any, language: string): string {
    if (!location) return 'Global/International context';
    
    const country = location.country?.toLowerCase();
    
    const culturalContexts: Record<string, string> = {
      'india': 'Indian cultural context - Consider joint family systems, academic pressure, arranged marriages, religious diversity, respect for elders',
      'united states': 'American cultural context - Individual achievement focus, diverse backgrounds, work-life balance challenges',
      'united kingdom': 'British cultural context - Reserved communication style, class considerations, multicultural society',
      'canada': 'Canadian cultural context - Multicultural inclusivity, healthcare accessibility, seasonal affective considerations',
      'australia': 'Australian cultural context - Work-life balance, outdoor lifestyle, immigrant integration',
      'germany': 'German cultural context - Direct communication, work efficiency, structured approaches',
      'france': 'French cultural context - Intellectual discussions, family meals importance, philosophical approach to life',
      'japan': 'Japanese cultural context - Harmony maintenance, group consensus, respectful communication, pressure for conformity',
      'china': 'Chinese cultural context - Family honor, academic achievement pressure, collective responsibility',
      'brazil': 'Brazilian cultural context - Family-oriented, expressive communication, community support systems',
      'south africa': 'South African cultural context - Ubuntu philosophy, community healing, diverse cultural backgrounds',
      'default': 'International context with respect for diverse cultural backgrounds'
    };

    return culturalContexts[country] || culturalContexts['default'];
  }

  private getCulturalGuidance(location: any, language: string): string {
    if (!location) return '';
    
    const country = location.country?.toLowerCase();
    const state = location.state?.toLowerCase();
    
    const guidanceMap: Record<string, string> = {
      'india': this.getIndianCulturalGuidance(state, language),
      'united states': 'Address individualistic pressure and achievement culture. Consider work-life balance issues. Be inclusive of diverse backgrounds and immigration stress.',
      'united kingdom': 'Respect reserved communication preferences. Consider class and social mobility stress. Address seasonal depression common in UK climate.',
      'canada': 'Consider seasonal affective disorder due to long winters. Address multicultural identity challenges. Be aware of healthcare system accessibility.',
      'australia': 'Consider isolation from family due to immigration. Address work visa and permanent residency stress. Acknowledge outdoor lifestyle as coping mechanism.',
      'germany': 'Appreciate direct communication style. Consider work-life balance and efficiency pressure. Address refugee integration challenges if applicable.',
      'france': 'Respect intellectual and philosophical approach to problems. Consider long lunch culture and work-life separation. Address bureaucratic stress.',
      'japan': 'Be extremely sensitive to shame and honor concepts. Address work pressure (karoshi culture). Consider group harmony over individual needs. Respect indirect communication.',
      'china': 'Address family expectations and filial piety pressure. Consider academic competition stress. Be mindful of one-child policy effects on family dynamics.',
      'brazil': 'Leverage family and community support systems. Consider economic stress and social inequality. Address carnival culture vs daily life balance.',
      'south africa': 'Consider post-apartheid social dynamics. Address economic inequality stress. Leverage Ubuntu community philosophy for healing.'
    };

    if (language === 'hi-IN' || country === 'india') {
      return guidanceMap['india'] + ' Respond in Hindi if user prefers Hindi communication.';
    }

    return guidanceMap[country] || '';
  }

  private getIndianCulturalGuidance(state: string, language: string): string {
    const baseGuidance = 'Consider family dynamics and social expectations. Respect religious and cultural practices. Address academic pressure common in Indian education system. Be mindful of arranged marriage expectations and joint family stress.';
    
    if (state && (state.includes('tamil') || state === 'tn')) {
      return baseGuidance + ' Tamil cultural context: Suggest traditional calming activities like drawing kolam patterns, having filter coffee with family, visiting nearby temples for peace, enjoying evening walks, and connecting with community during festivals. Incorporate concepts of inner peace (அமைதி) and family support (குடும்ப ஆதரவு).';
    }
    
    return baseGuidance;
  }

  private generateBasicResponse(userPrompt: string, context: UserContext): AIResponse {
    const { location, language = 'en-US', age, guestMode = false } = context;
    
    // Analyze prompt content to determine the type of concern
    const concernType = this.analyzeConcernType(userPrompt);
    
    // Generate context-specific responses based on user details and concern type
    const generateContextualResponse = (): string => {
      const baseResponse = this.getTargetedResponse(concernType, language);
      const ageContext = this.getAgeSpecificContext(age, language);
      const locationContext = this.getLocationSpecificContext(location, language);
      const specificTechnique = this.getTargetedTechnique(concernType, language);
      
      // Combine different elements to create a contextually relevant response
      const responseElements = [
        baseResponse,
        ageContext,
        locationContext,
        specificTechnique
      ].filter(Boolean);
      
      return responseElements.join('\n\n');
    };

    return {
      action: "response",
      message: generateContextualResponse(),
      severity: this.assessSeverity(userPrompt)
    };
  }

  private async generateEnhancedResponse(userPrompt: string, context: UserContext): Promise<AIResponse> {
    try {
      // Use the enhanced CBT API endpoint
      const response = await fetch('/api/enhanced-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt,
          userLocation: context.location,
          language: context.language || 'en-US',
          age: context.age,
          guestMode: context.guestMode
        }),
      });

      if (!response.ok) {
        throw new Error(`Enhanced chat API failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Enhanced response failed, falling back to basic response:', error);
      // Fallback to basic response if enhanced API fails
      return this.generateBasicResponse(userPrompt, context);
    }
  }

  private analyzeConcernType(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Academic and exam-related concerns
    const examKeywords = ['exam', 'test', 'grade', 'marks', 'score', 'result', 'performance', 'academic', 'study', 'studies', 'semester', 'assignment', 'homework', 'report'];
    const stressKeywords = ['stress', 'pressure', 'overwhelmed', 'burden', 'workload'];
    const anxietyKeywords = ['anxious', 'nervous', 'worried', 'fear', 'panic', 'anxiety'];
    const depressionKeywords = ['sad', 'depressed', 'hopeless', 'empty', 'down', 'low'];
    const relationshipKeywords = ['friend', 'relationship', 'family', 'lonely', 'social', 'isolated'];
    const sleepKeywords = ['sleep', 'insomnia', 'tired', 'exhausted', 'rest'];
    
    // Priority order: more specific concerns first
    if (examKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      if (anxietyKeywords.some(keyword => lowerPrompt.includes(keyword))) {
        return 'exam-anxiety';
      } else if (stressKeywords.some(keyword => lowerPrompt.includes(keyword))) {
        return 'academic-stress';
      } else {
        return 'academic-general';
      }
    } else if (anxietyKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'anxiety';
    } else if (depressionKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'depression';
    } else if (stressKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'stress';
    } else if (relationshipKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'relationship';
    } else if (sleepKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'sleep';
    } else {
      return 'general';
    }
  }

  private getTargetedResponse(concernType: string, language: string = 'en-US'): string {
    const responses: Record<string, Record<string, string[]>> = {
      'en-US': {
        'exam-anxiety': [
          "I understand how overwhelming exam concerns can feel. It's completely normal to feel anxious about your academic performance - this shows you care about your education.",
          "Exam worries are incredibly common among students. Your feelings about your results are valid, and there are effective ways to manage this academic anxiety.",
          "I can sense the pressure you're feeling about your exams. Academic stress is real, and it's important to address both your emotional wellbeing and study strategies."
        ],
        'academic-stress': [
          "Academic pressure can feel intense, and I want you to know that struggling with your studies doesn't define your worth or potential.",
          "The stress you're experiencing with your academic work is something many students face. Let's focus on both managing this stress and finding practical study strategies.",
          "I hear that you're dealing with academic challenges. Remember that learning is a process, and setbacks are opportunities for growth, not failures."
        ],
        'academic-general': [
          "Academic concerns are a significant part of student life. Whether it's about performance, grades, or study habits, these worries deserve attention and support.",
          "I'm glad you're reaching out about your academic concerns. Your education is important, and so is your mental health while pursuing it.",
          "Academic challenges can affect our overall wellbeing. Let's explore ways to support both your educational goals and your emotional health."
        ],
        'anxiety': [
          "I can sense the anxiety you're experiencing, and I want you to know that what you're feeling is real and manageable with the right support and techniques.",
          "Anxiety can feel overwhelming, but you've taken an important step by acknowledging it. There are proven methods to help reduce these feelings.",
          "Thank you for sharing about your anxiety. These feelings, while difficult, are treatable, and you don't have to face them alone."
        ],
        'stress': [
          "Stress is your body's way of responding to challenges, and while it's normal, chronic stress needs attention. I'm here to help you find healthy coping strategies.",
          "I understand you're dealing with stress right now. Recognizing and addressing stress is crucial for your overall wellbeing and daily functioning.",
          "Stress affects everyone differently, and what you're experiencing is valid. Let's explore some techniques to help you manage these feelings more effectively."
        ],
        'general': [
          "I'm genuinely glad you decided to reach out today. Whatever you're going through, your feelings matter, and seeking support shows real strength.",
          "Thank you for trusting me with what's on your mind. Every person's experience is unique, and I'm here to provide support tailored to your needs.",
          "It takes courage to open up about personal challenges. I want you to know that you're not alone, and there are resources available to help you."
        ]
      },
      'hi-IN': {
        'exam-anxiety': [
          "मैं समझता हूं कि परीक्षा की चिंता कितनी भारी लग सकती है। अपने शैक्षणिक प्रदर्शन को लेकर चिंतित होना बिल्कुल सामान्य है।",
          "परीक्षा की चिंता छात्रों में बहुत आम है। आपकी भावनाएं वैध हैं, और इस शैक्षणिक तनाव को संभालने के प्रभावी तरीके हैं।"
        ],
        'academic-stress': [
          "शैक्षणिक दबाव गहरा लग सकता है। पढ़ाई में संघर्ष आपकी योग्यता या क्षमता को परिभाषित नहीं करता।",
          "आपका शैक्षणिक तनाव कई छात्र महसूस करते हैं। आइए इस तनाव को संभालने और अध्ययन रणनीतियों पर ध्यान दें।"
        ],
        'general': [
          "मुझे खुशी है कि आपने आज संपर्क किया। आप जो कुछ भी झेल रहे हैं, आपकी भावनाएं महत्वपूर्ण हैं।",
          "आपका मन की बात साझा करना साहस दिखाता है। आप अकेले नहीं हैं।"
        ]
      }
    };

    const languageResponses = responses[language] || responses['en-US'];
    const typeResponses = languageResponses[concernType] || languageResponses['general'];
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  }

  private getTargetedTechnique(concernType: string, language: string = 'en-US'): string {
    const techniques: Record<string, Record<string, string[]>> = {
      'en-US': {
        'exam-anxiety': [
          "For exam anxiety, try the '3-3-3 rule': Name 3 things you can see, 3 sounds you can hear, and move 3 parts of your body. This grounds you in the present moment.",
          "Create a realistic study schedule and break large topics into smaller, manageable chunks. Remember: preparation reduces anxiety, and progress is more important than perfection.",
          "Practice positive self-talk: Replace 'I'm going to fail' with 'I'm prepared and will do my best.' Visualization techniques can also help - imagine yourself calmly taking the exam.",
          "Try progressive muscle relaxation before studying: tense and release each muscle group for 5 seconds. This helps reduce physical tension associated with exam stress."
        ],
        'academic-stress': [
          "Implement the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. This prevents burnout and maintains focus throughout your study sessions.",
          "Create a priority matrix for your academic tasks: urgent/important, important/not urgent, etc. This helps you focus on what truly matters and reduces overwhelm.",
          "Set SMART goals for your studies: Specific, Measurable, Achievable, Relevant, Time-bound. Small wins build momentum and confidence.",
          "Practice the 'two-minute rule': If a study task takes less than two minutes, do it immediately. For larger tasks, break them into two-minute components."
        ],
        'academic-general': [
          "Develop a consistent study routine that includes regular breaks, proper nutrition, and adequate sleep. Your brain needs these foundations to perform optimally.",
          "Use active learning techniques: summarize information in your own words, teach concepts to others, or create mind maps. Engagement improves retention and understanding.",
          "Join study groups or find an accountability partner. Collaborative learning can provide new perspectives and keep you motivated.",
          "Remember that academic success is not just about grades - it's about growth, learning, and developing critical thinking skills that will serve you throughout life."
        ],
        'anxiety': [
          "Practice the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and promotes calm.",
          "Try grounding techniques when anxiety peaks: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
          "Challenge anxious thoughts by asking: 'Is this thought realistic? What would I tell a friend in this situation? What's the worst that could realistically happen?'",
          "Consider keeping an anxiety journal to identify triggers and patterns. Understanding your anxiety can help you develop personalized coping strategies."
        ],
        'stress': [
          "Practice time management: Use tools like calendars and to-do lists to organize your responsibilities. Feeling in control reduces stress significantly.",
          "Engage in regular physical activity, even just a 10-minute walk. Exercise is one of the most effective stress relievers and mood boosters available.",
          "Try progressive muscle relaxation: Starting from your toes, tense and release each muscle group for 5 seconds. This releases physical tension stored in your body.",
          "Establish boundaries: It's okay to say no to additional commitments when you're already stressed. Protecting your mental energy is essential for your wellbeing."
        ],
        'general': [
          "Practice mindful breathing: Focus on your breath for just 2-3 minutes. When your mind wanders, gently bring attention back to breathing. This builds mental resilience over time.",
          "Try journaling for 5-10 minutes each day. Writing about your thoughts and feelings can provide clarity and emotional release.",
          "Connect with supportive people in your life. Social connection is fundamental to mental health and can provide perspective during difficult times.",
          "Remember: seeking help is a sign of strength, not weakness. Professional counselors, therapists, and support groups are valuable resources for your mental health journey."
        ]
      },
      'hi-IN': {
        'exam-anxiety': [
          "परीक्षा की चिंता के लिए '3-3-3 नियम' आज़माएं: 3 चीजें देखें, 3 आवाजें सुनें, और शरीर के 3 हिस्से हिलाएं।",
          "एक वास्तविक अध्ययन समय सारणी बनाएं और बड़े विषयों को छोटे भागों में बांटें। तैयारी चिंता को कम करती है।"
        ],
        'academic-stress': [
          "पोमोडोरो तकनीक का उपयोग करें: 25 मिनट पढ़ें, फिर 5 मिनट का ब्रेक लें। यह बर्नआउट को रोकता है।",
          "अपने शैक्षणिक कार्यों के लिए प्राथमिकता मैट्रिक्स बनाएं: तत्काल/महत्वपूर्ण, महत्वपूर्ण/तत्काल नहीं।"
        ],
        'general': [
          "माइंडफुल सांस लेने का अभ्यास करें: सिर्फ 2-3 मिनट अपनी सांस पर ध्यान दें।",
          "सहायक लोगों से जुड़ें। सामाजिक संपर्क मानसिक स्वास्थ्य के लिए मौलिक है।"
        ]
      }
    };

    const languageTechniques = techniques[language] || techniques['en-US'];
    const typeTechniques = languageTechniques[concernType] || languageTechniques['general'];
    return typeTechniques[Math.floor(Math.random() * typeTechniques.length)];
  }



  private getAgeSpecificContext(age?: number, language: string = 'en-US'): string {
    if (!age) return '';

    const contexts: Record<string, Record<string, string>> = {
      'en-US': {
        'teen': "Being a teenager comes with unique pressures and changes. What you're experiencing is part of navigating this important time in your life.",
        'young-adult': "Young adulthood brings its own set of challenges as you're building your identity and future. These feelings are more common than you might think.",
        'adult': "Adult life can feel overwhelming with all its responsibilities. It's completely normal to need support during difficult times.",
        'senior': "Life experiences bring wisdom, but they can also bring unique challenges. Your feelings and experiences are valuable and worth addressing."
      },
      'hi-IN': {
        'teen': "किशोरावस्था अपने अनूठे दबाव और बदलाव लेकर आती है। आप जो अनुभव कर रहे हैं वह इस महत्वपूर्ण समय को संभालने का हिस्सा है।",
        'young-adult': "युवावस्था अपनी चुनौतियां लेकर आती है। ये भावनाएं आपको लगने से कहीं अधिक सामान्य हैं।",
        'adult': "वयस्क जीवन अपनी जिम्मेदारियों के साथ भारी लग सकता है। कठिन समय में सहारे की जरूरत होना बिल्कुल सामान्य है।",
        'senior': "जीवन के अनुभव ज्ञान लाते हैं, लेकिन वे अनूठी चुनौतियां भी ला सकते हैं।"
      }
    };

    let ageGroup = 'adult';
    if (age < 18) ageGroup = 'teen';
    else if (age < 25) ageGroup = 'young-adult';
    else if (age > 60) ageGroup = 'senior';

    return contexts[language]?.[ageGroup] || contexts['en-US'][ageGroup];
  }

  private getLocationSpecificContext(location?: any, language: string = 'en-US'): string {
    if (!location) return '';

    const country = location?.country?.toLowerCase() || 'default';
    const state = location?.state;
    const city = location?.city;

    const contexts: Record<string, Record<string, string>> = {
      'en-US': {
        'india': `I understand the unique cultural pressures in India, especially around academic achievement, family expectations, and social relationships. These challenges can vary across different regions, and I'm here to provide culturally sensitive support.`,
        'united states': `Living in the United States comes with its own set of challenges. The American culture of individual achievement and success can create significant pressure. You're not alone in these feelings.`,
        'united kingdom': `I recognize the cultural context of living in the UK. The British approach to mental health is evolving, and it's completely valid to seek support for your wellbeing.`,
        'canada': `Living in Canada, there are unique challenges including weather-related mood changes and multicultural integration stress. Canadian healthcare supports mental health, and reaching out is encouraged.`,
        'australia': `Living in Australia can involve challenges like isolation from family (if you've immigrated) or seasonal factors. Australians are increasingly open about mental health support.`,
        'germany': `In Germany, the cultural approach values efficiency and structure, which can sometimes create pressure. It's important to balance achievement with self-care.`,
        'france': `French culture values intellectual discussion and family time. You might face unique stressors, but seeking mental health support is increasingly accepted.`,
        'japan': `Living in Japan involves navigating complex social expectations and work-life balance. Your feelings are valid in the context of Japanese society's unique pressures.`,
        'china': `In Chinese culture, there are significant academic and family pressures. Mental health awareness is growing, and your wellbeing matters.`,
        'brazil': `Brazilian culture emphasizes family and community support. You can leverage these strong social connections while addressing your mental health needs.`,
        'south africa': `South African communities have strong Ubuntu principles of interconnectedness. Your struggles are shared by your community, and healing happens together.`,
        'default': `These feelings are valid and support is available regardless of where you are. Cultural context matters, and your experience is unique to your environment.`
      },
      'hi-IN': {
        'india': `मैं भारत के सांस्कृतिक दबावों को समझता हूं, विशेषकर शैक्षणिक उपलब्धि, पारिवारिक अपेक्षाओं और सामाजिक रिश्तों के बारे में। ये चुनौतियां अलग-अलग क्षेत्रों में अलग हो सकती हैं।`,
        'default': `आपकी भावनाएं वैध हैं और सहारा उपलब्ध है। सांस्कृतिक संदर्भ मायने रखता है।`
      }
    };

    const languageContext = contexts[language] || contexts['en-US'];
    return languageContext[country] || languageContext['default'] || '';
  }



  private assessSeverity(prompt: string): string {
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself'];
    const highSeverityKeywords = ['depressed', 'hopeless', 'can\'t cope', 'overwhelmed', 'panic'];
    
    const lowerPrompt = prompt.toLowerCase();
    
    if (crisisKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'crisis';
    } else if (highSeverityKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return 'high';
    } else {
      return 'moderate';
    }
  }

  private detectCrisis(prompt: string): boolean {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself',
      'want to die', 'better off dead', 'end my life', 'self harm'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return crisisKeywords.some(keyword => lowerPrompt.includes(keyword));
  }
}

export const aiService = new AIService();