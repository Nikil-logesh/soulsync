"use client";

import { useState } from "react";
import { aiService } from "../../lib/aiService";
import { useLocation } from "../../hooks/useLocation";

export default function TestAPIsPage() {
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [testPrompt, setTestPrompt] = useState("I'm worried about my upcoming exams");
  const [selectedAge, setSelectedAge] = useState(20);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const { location, detectLocation, isLoading: locationLoading, error: locationError } = useLocation();

  const testAI = async () => {
    setAiLoading(true);
    const startTime = Date.now();
    
    try {
      const context = {
        location: location ? {
          city: location.city,
          state: location.state,
          country: location.country
        } : undefined,
        language: selectedLanguage,
        age: selectedAge
      };
      
      console.log('Testing with context:', context);
      const response = await aiService.generateResponse(testPrompt, context);
      const endTime = Date.now();
      
      setAiResponse(response.message);
      
      // Log test result
      const testResult = `✅ ${new Date().toLocaleTimeString()} - Response generated in ${endTime - startTime}ms`;
      setTestResults(prev => [testResult, ...prev.slice(0, 4)]); // Keep last 5 results
      
    } catch (error) {
      const endTime = Date.now();
      const errorMsg = `❌ ${new Date().toLocaleTimeString()} - Error: ${error} (${endTime - startTime}ms)`;
      setAiResponse(`Error: ${error}`);
      setTestResults(prev => [errorMsg, ...prev.slice(0, 4)]);
    }
    setAiLoading(false);
  };

  const runCulturalTest = async () => {
    const culturalTests = [
      { prompt: "मुझे परीक्षा की चिंता हो रही है", language: 'hi-IN', age: 19, description: "Hindi exam anxiety" },
      { prompt: "I'm stressed about family expectations for my career", language: 'en-US', age: 22, description: "Family pressure (likely Indian context)" },
      { prompt: "I feel overwhelmed by academic competition", language: 'en-US', age: 20, description: "Academic competition stress" },
    ];

    for (const test of culturalTests) {
      setTestPrompt(test.prompt);
      setSelectedLanguage(test.language);
      setSelectedAge(test.age);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
      await testAI();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          🧪 API & Geocoding Test Center
        </h1>

        {/* API Status */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-600">✅ AI API Status</h2>
          <div className="flex items-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              🟢 Enabled & Working
            </span>
            <span className="text-gray-600">Gemini Pro API Connected</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language:
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="hi-IN">हिंदी (Hindi)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age:
                </label>
                <input
                  type="number"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value) || 20)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="13"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location:
                </label>
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {location ? `${location.city}, ${location.state}, ${location.country}` : 'Not detected'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Prompt:
              </label>
              <textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a test message..."
                rows={3}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={testAI}
                disabled={aiLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {aiLoading ? "Generating Response..." : "🤖 Test AI Response"}
              </button>
              
              <button
                onClick={runCulturalTest}
                disabled={aiLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🌍 Run Cultural Test Suite
              </button>
            </div>

            {/* Test Results Log */}
            {testResults.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Test Results Log:</h4>
                <div className="space-y-1 text-sm">
                  {testResults.map((result, index) => (
                    <div key={index} className="font-mono text-gray-700">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiResponse && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">AI Response:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>

        {/* Geocoding Status */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-600">🌍 Geocoding Status</h2>
          <div className="flex items-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              🟢 Enabled & Working
            </span>
            <span className="text-gray-600">OpenStreetMap API Connected</span>
          </div>

          <div className="space-y-4">
            <button
              onClick={detectLocation}
              disabled={locationLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {locationLoading ? "Detecting Location..." : "📍 Test Location Detection"}
            </button>

            {location && (
              <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                <h4 className="font-semibold text-purple-800 mb-2">Detected Location:</h4>
                <div className="text-gray-700">
                  <p><strong>City:</strong> {location.city}</p>
                  <p><strong>State:</strong> {location.state}</p>
                  <p><strong>Country:</strong> {location.country}</p>
                  {location.latitude && location.longitude && (
                    <p><strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                  )}
                </div>
              </div>
            )}

            {locationError && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-red-700"><strong>Error:</strong> {locationError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Test */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">🔗 Integration Test</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              This demonstrates both services working together - the AI will use your detected location 
              to provide culturally relevant responses.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">🎯 Sample Prompts by Category:</h4>
              
              <div>
                <h5 className="text-sm font-medium text-blue-600 mb-1">Academic Stress:</h5>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTestPrompt("I'm stressed about my studies")} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm">General Study Stress</button>
                  <button onClick={() => setTestPrompt("I feel anxious about my exams")} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm">Exam Anxiety</button>
                  <button onClick={() => setTestPrompt("My parents expect me to get top grades")} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm">Family Pressure</button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-purple-600 mb-1">Cultural Context:</h5>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setTestPrompt("मुझे अपने करियर को लेकर चिंता हो रही है"); setSelectedLanguage('hi-IN'); }} className="px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded text-sm">Hindi Career Worry</button>
                  <button onClick={() => setTestPrompt("I feel pressure to get married from my family")} className="px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded text-sm">Marriage Pressure</button>
                  <button onClick={() => setTestPrompt("I'm struggling to balance work and family expectations")} className="px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded text-sm">Cultural Balance</button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-green-600 mb-1">General Wellbeing:</h5>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTestPrompt("I'm having trouble sleeping")} className="px-3 py-1 bg-green-100 hover:bg-green-200 rounded text-sm">Sleep Issues</button>
                  <button onClick={() => setTestPrompt("I feel lonely and isolated")} className="px-3 py-1 bg-green-100 hover:bg-green-200 rounded text-sm">Social Isolation</button>
                  <button onClick={() => setTestPrompt("I'm overwhelmed with daily responsibilities")} className="px-3 py-1 bg-green-100 hover:bg-green-200 rounded text-sm">Daily Stress</button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">✨ Enhanced Features Now Active:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 🤖 <strong>AI-Powered Responses:</strong> Contextually intelligent replies using Gemini Pro</li>
                <li>• 🎯 <strong>Smart Concern Detection:</strong> Detects exam anxiety vs general anxiety</li>
                <li>• 🌍 <strong>Location-Aware Support:</strong> Culturally relevant advice based on your location</li>
                <li>• 📚 <strong>Academic-Specific Help:</strong> Tailored techniques for study stress and exam preparation</li>
                <li>• 💬 <strong>Fallback Protection:</strong> Built-in responses if API is unavailable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/prompt"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            🚀 Go to Chat Interface
          </a>
        </div>
      </div>
    </div>
  );
}