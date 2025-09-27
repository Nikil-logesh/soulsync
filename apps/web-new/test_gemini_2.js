// Test Gemini 2.0 Flash API key
const testGemini20Flash = async () => {
  const fs = require('fs');
  const path = require('path');
  
  // Try to read API key from .env.local (check both locations)
  const envPath = path.join(__dirname, '../../.env.local');
  let apiKey = null;
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
    if (match) {
      apiKey = match[1].trim();
    }
  } catch (err) {
    console.log('Could not read .env.local file');
  }
  
  if (!apiKey || apiKey === 'PASTE_YOUR_NEW_API_KEY_HERE') {
    console.log('❌ Please update your API key in .env.local first');
    console.log('Replace PASTE_YOUR_NEW_API_KEY_HERE with your actual key');
    return;
  }
  
  console.log('🧪 Testing Gemini 2.0 Flash with your API key...');
  console.log('API Key:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-4)}`);
  
  // Test Gemini 2.0 Flash models
  const models = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite', 
    'gemini-1.5-flash-8b'  // Fallback
  ];
  
  for (const model of models) {
    console.log(`\n=== Testing ${model} ===`);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello! Please respond with "API test successful" if you can see this message.'
            }]
          }],
          generationConfig: {
            maxOutputTokens: 50,
            temperature: 0.1
          }
        })
      });
      
      console.log(`Response Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates[0]?.content?.parts[0]?.text;
        
        console.log('✅ SUCCESS! API key works!');
        console.log('Model Response:', reply);
        console.log(`🎯 Use this model: ${model}`);
        
        // Success - stop testing other models
        console.log('\n🚀 Your Gemini API is working perfectly!');
        console.log('Your mental wellness app will now have intelligent AI responses.');
        return;
        
      } else {
        const errorText = await response.text();
        const error = JSON.parse(errorText);
        
        if (error.error?.code === 429) {
          console.log('❌ Rate limit exceeded - wait a moment and try again');
        } else if (error.error?.code === 403) {
          console.log('❌ Access denied - check API key permissions');  
        } else if (error.error?.code === 400) {
          console.log('❌ Bad request - model might not support this format');
        } else {
          console.log('❌ Error:', error.error?.message || 'Unknown error');
        }
      }
      
    } catch (error) {
      console.log('❌ Network Error:', error.message);
    }
  }
  
  console.log('\n❌ All models failed. Check your API key and try again.');
};

testGemini20Flash();