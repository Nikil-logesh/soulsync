// Test location and language detection  
console.log('🧪 Testing Location & Language Detection...\n');

const testCases = [
  {
    name: 'English voice from actual location',
    prompt: 'I am feeling work stress',
    location: null, // Will use actual detected location
    language: 'en-US'
  },
  {
    name: 'Tamil voice from Tamil Nadu', 
    prompt: 'வேலை அழுத்தம் இருக்கு',
    location: { country: 'India', state: 'Tamil Nadu', city: 'Chennai' },
    language: 'ta-IN'
  },
  {
    name: 'English voice from other state',
    prompt: 'Work is stressing me out',
    location: { country: 'India', state: 'Maharashtra', city: 'Mumbai' }, 
    language: 'en-US'
  }
];

async function testLanguageAndLocation() {
  for (const test of testCases) {
    try {
      console.log(`📝 Test: ${test.name}`);
      console.log(`🗣️ Language: ${test.language}`);
      console.log(`📍 Location: ${test.location ? `${test.location.city}, ${test.location.state}` : 'Auto-detect'}`);
      
      const response = await fetch('http://localhost:3001/api/enhanced-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: test.prompt,
          userLocation: test.location,
          language: test.language
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response preview: ${data.message.substring(0, 200)}...`);
        
        // Check for issues
        if (data.message.includes('Tamil Nadu') && !test.location?.state?.includes('Tamil')) {
          console.log('⚠️  WARNING: Mentions Tamil Nadu but not in Tamil Nadu!');
        }
        if (test.language === 'ta-IN' && data.message.includes('English')) {
          console.log('⚠️  WARNING: Tamil input but English mixed in response!'); 
        }
        if (test.language === 'en-US' && data.message.match(/[அ-ஹ]/)) {
          console.log('⚠️  WARNING: English input but Tamil text in response!');
        }
      } else {
        console.log(`❌ Error: ${response.status}`);
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.log(`❌ Network error: ${error.message}\n`);
    }
  }
}

testLanguageAndLocation();