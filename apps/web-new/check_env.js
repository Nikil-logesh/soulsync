// Test with manual .env loading
const fs = require('fs');

// Read .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');

let apiKey = null;
let model = null;

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_GEMINI_MODEL=')) {
    model = line.split('=')[1].trim();
  }
});

console.log('=== .env.local File Check ===');
console.log('API Key found:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-4)}` : 'NOT FOUND');
console.log('Model:', model || 'NOT FOUND');

if (apiKey && apiKey !== 'PASTE_YOUR_NEW_API_KEY_HERE') {
  console.log('✅ API key is properly set in .env.local');
  console.log('🎯 Your Next.js app should now use the new API key');
  console.log('\n📋 Next steps:');
  console.log('1. Go to http://localhost:3000/prompt');
  console.log('2. Try asking: "I need help with stress"');
  console.log('3. Check browser console for the correct API key being used');
} else {
  console.log('❌ API key still shows placeholder');
}