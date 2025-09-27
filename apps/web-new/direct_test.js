// Direct test with your API key
const testAPI = async () => {
  const apiKey = 'AIzaSyBIH0iIv31peP2p2iChW03Mqx53f0ZzUOw';
  const model = 'gemini-2.0-flash';
  
  console.log('🧪 Testing Gemini 2.0 Flash API...');
  console.log('API Key:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-4)}`);
  console.log('Model:', model);
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! Please respond with "API test successful" to confirm you are working.'
          }]
        }],
        generationConfig: {
          maxOutputTokens: 50,
          temperature: 0.1
        }
      })
    });
    
    console.log(`\nResponse Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      const reply = data.candidates[0]?.content?.parts[0]?.text;
      
      console.log('✅ SUCCESS! Your API key works perfectly!');
      console.log('AI Response:', reply);
      console.log('\n🚀 Your mental wellness app now has working AI responses!');
      console.log('🎯 Model confirmed: gemini-2.0-flash');
      
    } else {
      const errorText = await response.text();
      const error = JSON.parse(errorText);
      
      console.log('❌ API Error:');
      console.log('Code:', error.error?.code);
      console.log('Message:', error.error?.message);
      
      if (error.error?.code === 429) {
        console.log('\n💡 Solution: Rate limit - wait a few minutes');
      } else if (error.error?.code === 403) {
        console.log('\n💡 Solution: Check API key permissions in Google Cloud Console');
      }
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
};

testAPI();