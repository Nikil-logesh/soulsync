// Quick test for new API key
const testNewAPIKey = async () => {
  // Read API key from environment or prompt user
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  console.log('Current API key from env:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');
  
  if (!apiKey) {
    console.log('❌ No API key found in environment variables');
    console.log('Please update .env.local file first');
    return;
  }
  
  // Test with a lightweight model
  const models = [
    'gemini-1.5-flash-8b',     // Smallest model
    'gemini-2.5-flash-lite',   // Lite version  
    'gemini-1.5-flash',        // Standard flash
  ];
  
  for (const model of models) {
    console.log(`\n🧪 Testing ${model}...`);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello! Just testing if you work.'
            }]
          }],
          generationConfig: {
            maxOutputTokens: 30,
            temperature: 0.1
          }
        })
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates[0]?.content?.parts[0]?.text;
        console.log(`✅ SUCCESS! Model ${model} works!`);
        console.log(`Response: ${reply}`);
        
        // Update environment recommendation
        console.log(`\n🎯 RECOMMENDATION: Use model "${model}"`);
        console.log(`Update NEXT_PUBLIC_GEMINI_MODEL=${model} in .env.local`);
        
        break; // Stop at first working model
        
      } else {
        const errorText = await response.text();
        const error = JSON.parse(errorText);
        
        if (error.error?.code === 429) {
          console.log('❌ Still quota exceeded - try waiting or different key');
        } else if (error.error?.code === 403) {
          console.log('❌ API key access denied - check permissions');
        } else {
          console.log(`❌ Error: ${error.error?.message}`);
        }
      }
    } catch (err) {
      console.log('❌ Network error:', err.message);
    }
  }
  
  rl.close();
};

testNewAPIKey();