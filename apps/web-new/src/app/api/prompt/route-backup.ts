// apps/web-new/src/app/api/prompt/route.ts
import { NextResponse } from "next/server";

type ReqBody = { userPrompt?: string };

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

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      console.log("GEMINI_API_KEY not configured, providing enhanced fallback response");
      
      // Enhanced fallback with crisis detection
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
        return NextResponse.json({
          action: "popup",
          severity: "CRISIS",
          message: "We're very concerned for your safety. Please reach out for immediate help - you're not alone and support is available.",
          resources: [
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
          ],
        });
      }

      if (isSevere) {
        return NextResponse.json({
          action: "popup",
          severity: "SEVERE", 
          message: "It sounds like you're going through something very heavy. Please consider reaching out to a qualified mental-health professional or counselor for support.",
          resources: [
            {
              name: "Find a counsellor",
              url: "/counsellors",
            },
            {
              name: "Mental Health Resources",
              url: "https://www.mentalhealth.gov/get-help",
            }
          ],
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

    const cbtPrompt = `You are a supportive mental wellness companion trained in Cognitive Behavioral Therapy (CBT). 
Your role is to act like a caring peer who guides the user step by step through CBT exercises, 
not as a doctor or psychiatrist. 
You must never give medical diagnoses, prescriptions, or encourage harmful actions. 
If the user expresses self-harm or suicidal thoughts, respond with empathy and redirect them 
to immediate human help (e.g., helpline numbers).

Your approach:
1. Listen empathetically. Reflect the user’s emotions with warmth and care.
2. Use CBT techniques step by step:
   - Identify: Ask the user to describe the troubling thought, feeling, or situation.
   - Challenge: Help them gently question the thought (evidence for/against, alternative views).
   - Reframe: Guide them to find a more balanced or constructive perspective.
   - Act: Suggest a small, achievable activity or coping strategy.
3. Always validate their feelings before moving to the next step.
4. Keep your tone friendly, safe, non-judgmental, and youth-appropriate.
5. If the user shows signs of crisis (mentions self-harm, suicide, abuse, or hopelessness):
   - Express care.
   - Remind them they are not alone.
   - Encourage them to reach out to a trusted adult or professional.
   - Provide relevant crisis hotline information if available.

Example response style:
- "I hear that you're feeling really anxious right now. That must be tough."
- "Let’s slow down together. What thought was in your mind when you started to feel anxious?"
- "What evidence supports this thought? And what might go against it?"
- "If your best friend felt this way, what would you say to them?"
- "As a small step, maybe you could try writing down one thing that went well today. Would you like to try that?"

User prompt:
${userPrompt}
    `.trim();

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const payload = {
      // match the REST shape used in docs: contents -> parts -> text
      contents: [
        {
          parts: [
            { text: cbtPrompt }
          ]
        }
      ]
      // You can add other model params here (temperature, maxOutputTokens) if needed.
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // pass API key server-side (do not expose in client)
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(payload),
    });

    const j = await r.json();

    if (!r.ok) {
      console.error("Gemini API error:", j);
      // forward meaningful message if present
      const msg = j?.error?.message || j?.message || "Gemini API error";
      return NextResponse.json({ error: msg }, { status: r.status });
    }

    // Robust extraction of text (API responses may vary slightly by client/version)
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
      // try the nested output patterns
      const cand = j?.candidates?.[0] || j?.response?.candidates?.[0];
      if (cand && cand.content) {
        const parts = cand.content.parts || (Array.isArray(cand.content) ? cand.content : []);
        if (parts?.[0]?.text) reply = parts[0].text;
      }
    }

    return NextResponse.json({ reply });
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




