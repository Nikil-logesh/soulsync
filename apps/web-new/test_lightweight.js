// Test lightweight models that should work with free tier
const testLightweightModels = async () => {
  const apiKey = 'AIzaSyAkJVAGcrQlcVoGMzozLC13s9hA9RToPUk';
  
  // Test smaller models that should have better quota limits
  const lightweightModels = [
    'gemini-1.5-flash-8b',           // Smaller 8B model
    'gemini-1.5-flash-8b-latest',   // Latest 8B 
    'gemini-2.5-flash-lite',        // Lite version
    'gemini-2.0-flash-lite',        // Another lite version
    'gemma-3-1b-it',                // Very small 1B model
    'gemma-3-4b-it'                 // Small 4B model
  ];
  
  for (const model of lightweightModels) {
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
              text: 'Hi'
            }]
          }],
          generationConfig: {
            maxOutputTokens: 50,  // Very small to save quota
            temperature: 0.1
          }
        })
      });
      
      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! This model works!');
        console.log('Response:', data.candidates[0]?.content?.parts[0]?.text);
        console.log('🎯 USE THIS MODEL:', model);
        return model; // Return first working model
      } else {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        
        if (errorData.error?.code === 429) {
          console.log('❌ Quota exceeded (429)');
        } else if (errorData.error?.code === 403) {
          console.log('❌ Access denied (403) - API key issue');
        } else {
          console.log('❌ Error:', errorData.error?.message || errorText);
        }
      }
    } catch (error) {
      console.log('❌ Network Error:', error.message);
    }
  }
  
  console.log('\n🚨 All models failed. This indicates quota/billing issues.');
  console.log('Solutions:');
  console.log('1. Wait for quota reset (usually hourly/daily)');
  console.log('2. Enable billing on your Google Cloud project');  
  console.log('3. Get a new API key from a different project');
};

testLightweightModels();