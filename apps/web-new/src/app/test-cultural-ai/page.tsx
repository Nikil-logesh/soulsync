// apps/web-new/src/app/test-cultural-ai/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TestCulturalAI() {
  const [testPrompt, setTestPrompt] = useState("");
  const [testLocation, setTestLocation] = useState({
    country: "India",
    state: "Tamil Nadu", 
    city: "Chennai"
  });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const testScenarios = [
    {
      prompt: "I'm feeling stressed about my family expectations",
      location: { country: "India", state: "Tamil Nadu", city: "Chennai" }
    },
    {
      prompt: "I'm struggling with work-life balance",
      location: { country: "United States", state: "California", city: "San Francisco" }
    },
    {
      prompt: "I feel pressure from my parents about career choices",
      location: { country: "Japan", state: "Tokyo", city: "Tokyo" }
    },
    {
      prompt: "I'm dealing with social anxiety",
      location: { country: "United Kingdom", state: "England", city: "London" }
    }
  ];

  const handleTest = async (prompt: string, location: any) => {
    setLoading(true);
    setResponse("");
    
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userPrompt: prompt,
          userLocation: location,
          guestMode: false
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        if (data.action === "popup") {
          setResponse(`[${data.severity}] ${data.message}\n\nResources: ${data.resources.map((r: any) => r.name).join(', ')}`);
        } else {
          setResponse(data.reply);
        }
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (err) {
      setResponse("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomTest = async () => {
    if (!testPrompt.trim()) return;
    await handleTest(testPrompt, testLocation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          🌍 Cultural AI Response Testing
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Test Scenarios</h2>
          <div className="grid gap-4">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">"{scenario.prompt}"</p>
                  <span className="text-sm text-gray-500">
                    📍 {scenario.location.city}, {scenario.location.country}
                  </span>
                </div>
                <button
                  onClick={() => handleTest(scenario.prompt, scenario.location)}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Test Response
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Custom Test</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Message</label>
              <textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={3}
                placeholder="Enter a message to test cultural AI response..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location Context</label>
              <div className="space-y-2">
                <select
                  value={testLocation.country}
                  onChange={(e) => setTestLocation({...testLocation, country: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Japan">Japan</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
                <input
                  type="text"
                  value={testLocation.state}
                  onChange={(e) => setTestLocation({...testLocation, state: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="State/Region"
                />
                <input
                  type="text"
                  value={testLocation.city}
                  onChange={(e) => setTestLocation({...testLocation, city: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="City"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCustomTest}
            disabled={loading || !testPrompt.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Getting Response..." : "Test Custom Response"}
          </button>
        </div>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">AI Response:</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {response}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}