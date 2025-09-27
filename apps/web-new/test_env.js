// Test API key loading in Next.js environment
console.log('=== Environment Variable Check ===');
console.log('NEXT_PUBLIC_GEMINI_API_KEY:', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? `${process.env.NEXT_PUBLIC_GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('NEXT_PUBLIC_GEMINI_MODEL:', process.env.NEXT_PUBLIC_GEMINI_MODEL || 'NOT FOUND');

// Test API call with environment variables
const testEnvAPI = async () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash';
  
  if (!apiKey) {
    console.log('❌ API key not found in environment');
    return;
  }
  
  console.log('\n🧪 Testing API with environment variables...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Environment test - please respond briefly'
          }]
        }],
        generationConfig: {
          maxOutputTokens: 30
        }
      })
    });
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Environment API test successful!');
      console.log('Response:', data.candidates[0]?.content?.parts[0]?.text);
    } else {
      const error = await response.json();
      console.log('❌ API Error:', error.error?.message);
    }
    
  } catch (err) {
    console.log('❌ Network Error:', err.message);
  }
};

testEnvAPI();