# AI Integration Security Notes

## Gemini API Key Security

Since this is a static site, the Gemini API key is exposed on the client side. To secure it:

1. **Go to Google Cloud Console** (https://console.cloud.google.com)
2. **Navigate to APIs & Services > Credentials**
3. **Find your Gemini API key**
4. **Click "Edit" and add HTTP referrers restrictions:**
   - Add: `https://soulsync-sanzzzworks.web.app/*`
   - Add: `http://localhost:3000/*` (for development)

This ensures the API key only works from your authorized domains.

## Current AI Features

The app now uses Google's Gemini AI for:
- ✅ Contextual mental health responses
- ✅ Cultural sensitivity for Indian users
- ✅ Crisis detection and intervention
- ✅ Location-based advice
- ✅ Different responses for guest vs authenticated users
- ✅ Varied, intelligent conversations (no more repetitive responses)

## Fallback System

If the AI service fails, the app automatically falls back to enhanced basic responses to ensure users always get support.