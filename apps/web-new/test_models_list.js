// List available Gemini models and test free ones
const testAvailableModels = async () => {
  const apiKey = 'AIzaSyAkJVAGcrQlcVoGMzozLC13s9hA9RToPUk';
  
  console.log('=== Listing Available Models ===');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name} (Display: ${model.displayName})`);
        console.log(`  Supported: ${model.supportedGenerationMethods.join(', ')}`);
      });
    } else {
      console.error('Error listing models:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  console.log('\n=== Testing Free Tier Models ===');
  
  // Test some free models that should work
  const freeModels = [
    'gemini-pro',
    'text-bison-001',
    'chat-bison-001'
  ];
  
  for (const model of freeModels) {
    console.log(`\n--- Testing ${model} ---`);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello briefly'
            }]
          }]
        })
      });
      
      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS!');
        console.log('Response:', data.candidates[0]?.content?.parts[0]?.text);
      } else {
        const errorText = await response.text();
        console.log('❌ Error:', errorText);
      }
    } catch (error) {
      console.log('❌ Fetch Error:', error);
    }
  }
};

testAvailableModels();