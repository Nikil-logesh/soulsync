// Test the enhanced cultural AI responses
const testCulturalAI = async () => {
  console.log('🧪 Testing Enhanced Cultural AI with Location-Specific Activities...\n');

  const testCases = [
    {
      location: { country: 'India', state: 'Tamil Nadu', city: 'Chennai' },
      prompt: 'I am feeling stressed today',
      expected: 'Should include Tamil greetings, kolam, temple visits, coffee/chai'
    },
    {
      location: { country: 'India', state: 'Kerala', city: 'Kochi' },
      prompt: 'I feel anxious',
      expected: 'Should include Malayalam greetings, coconut trees, backwaters'
    },
    {
      location: { country: 'United States', state: 'California', city: 'San Francisco' },
      prompt: 'I need help with stress',
      expected: 'Should include local parks, community activities'
    }
  ];

  for (const testCase of testCases) {
    try {
      const response = await fetch('http://localhost:3000/api/enhanced-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: testCase.prompt,
          userLocation: testCase.location,
          language: 'en-US'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`📍 Location: ${testCase.location.city}, ${testCase.location.state}, ${testCase.location.country}`);
        console.log(`💭 Prompt: "${testCase.prompt}"`);
        console.log(`🎯 Expected: ${testCase.expected}`);
        console.log(`📝 Response (first 300 chars):\n${data.message.substring(0, 300)}...\n`);
        console.log('---\n');
      } else {
        console.log(`❌ Error for ${testCase.location.country}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Network error: ${error.message}`);
    }
  }
};

testCulturalAI();