// Test Gemini API connectivity
const testGeminiAPI = async () => {
  const apiKey = 'AIzaSyAkJVAGcrQlcVoGMzozLC13s9hA9RToPUk';
  
  // Try different model versions
  const models = [
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-001', 
    'gemini-1.5-flash',
    'gemini-1.5-pro-002',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro'
  ];
  
  for (const model of models) {
    console.log(`\n=== Testing model: ${model} ===`);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
    console.log('API URL:', apiUrl.replace(apiKey, '[API_KEY_HIDDEN]'));
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test message. Please respond briefly.'
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error Response:', errorText);
        continue; // Try next model
      }
      
      const data = await response.json();
      console.log('✅ SUCCESS! Model works:', model);
      console.log('Generated text:', data.candidates[0].content.parts[0].text);
      return model; // Return working model
      
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  console.log('❌ No working models found');
};testGeminiAPI();