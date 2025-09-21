"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, GlobeAltIcon, ClockIcon, UsersIcon, HeartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Helpline {
  name: string;
  number: string;
  description: string;
  languages: string[];
  availability: string;
  type: 'national' | 'state' | 'international';
  country?: string;
  state?: string;
}

const INDIAN_HELPLINES: Helpline[] = [
  {
    name: "KIRAN National Helpline",
    number: "1800-599-0019",
    description: "National toll-free helpline with mental health experts",
    languages: ["Hindi", "English", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Gujarati", "Marathi", "Punjabi", "Assamese", "Odia", "Urdu"],
    availability: "24x7",
    type: "national"
  },
  {
    name: "Tele Manas (Government of India)",
    number: "14416 / 1800 891 4416",
    description: "Free mental health counseling by Government of India",
    languages: ["20+ Indian Languages"],
    availability: "24x7",
    type: "national"
  },
  {
    name: "Vandrevala Foundation Crisis Helpline",
    number: "+91 9999 666 555",
    description: "Professional crisis counseling and support",
    languages: ["Hindi", "English"],
    availability: "24x7",
    type: "national"
  },
  {
    name: "NIMHANS Helpline",
    number: "080-46110007",
    description: "Medical advice, counseling, and rehabilitation",
    languages: ["English", "Hindi", "Kannada"],
    availability: "9 AM - 5 PM",
    type: "national"
  },
  {
    name: "Kerala - Anuyatra Help Desk",
    number: "1800 120 1001",
    description: "Kerala state mental health support",
    languages: ["Malayalam", "English"],
    availability: "24x7",
    type: "state",
    state: "Kerala"
  },
  {
    name: "Tamil Nadu - Chennai Helpline",
    number: "18004250111",
    description: "Tamil Nadu state mental health services",
    languages: ["Tamil", "English"],
    availability: "24x7",
    type: "state",
    state: "Tamil Nadu"
  },
  {
    name: "Rajasthan - Jan Soochna Helpline",
    number: "1800-180-6127",
    description: "Rajasthan government helpline services",
    languages: ["Hindi", "English"],
    availability: "24x7",
    type: "state",
    state: "Rajasthan"
  },
  {
    name: "Gujarat - Jeevan Astha",
    number: "1800-233-3330",
    description: "Gujarat mental health support services",
    languages: ["Gujarati", "Hindi", "English"],
    availability: "24x7",
    type: "state",
    state: "Gujarat"
  },
  {
    name: "Telangana - State Helpline for PwDs",
    number: "1800-572-8980",
    description: "Support for persons with disabilities and mental health",
    languages: ["Telugu", "Hindi", "English"],
    availability: "9 AM - 6 PM",
    type: "state",
    state: "Telangana"
  }
];

const INTERNATIONAL_HELPLINES: Helpline[] = [
  {
    name: "NAMI HelpLine (USA)",
    number: "1-800-950-NAMI (6264)",
    description: "National Alliance on Mental Illness peer support",
    languages: ["English", "Spanish"],
    availability: "Mon-Fri 10 AM - 10 PM ET",
    type: "international",
    country: "United States"
  },
  {
    name: "Samaritans (UK)",
    number: "116 123",
    description: "Free emotional support for anyone in distress",
    languages: ["English"],
    availability: "24x7",
    type: "international",
    country: "United Kingdom"
  },
  {
    name: "Lifeline (Australia)",
    number: "13 11 14",
    description: "Crisis support and suicide prevention",
    languages: ["English"],
    availability: "24x7",
    type: "international",
    country: "Australia"
  },
  {
    name: "Crisis Text Line (USA/UK/CA)",
    number: "Text HOME to 741741",
    description: "Free crisis counseling via text message",
    languages: ["English"],
    availability: "24x7",
    type: "international",
    country: "USA/UK/Canada"
  }
];

const VIDEO_RESOURCES = [
  {
    title: "TeleManas YouTube Series",
    description: "Mental health awareness and professional advice",
    url: "https://www.youtube.com/c/telemanas",
    language: "Hindi, English",
    type: "Educational"
  },
  {
    title: "NIMHANS Mental Health Videos",
    description: "Expert-led mental health education content",
    url: "https://www.youtube.com/c/nimhans",
    language: "English, Kannada",
    type: "Medical"
  },
  {
    title: "Mindfulness.org Meditation Guides",
    description: "Guided meditation and mindfulness practices",
    url: "https://www.mindfulness.org",
    language: "Multiple Languages",
    type: "Meditation"
  },
  {
    title: "Vandrevala Foundation Resources",
    description: "Mental health awareness and self-help videos",
    url: "https://www.vandrevalafoundation.com",
    language: "Hindi, English",
    type: "Self-Help"
  }
];

export default function EmergencyPage() {
  const [activeTab, setActiveTab] = useState<'national' | 'state' | 'international'>('national');
  const [searchLocation, setSearchLocation] = useState('');

  const filteredHelplines = () => {
    const helplines = activeTab === 'international' ? INTERNATIONAL_HELPLINES : 
                     INDIAN_HELPLINES.filter(h => h.type === activeTab);
    
    if (!searchLocation) return helplines;
    
    return helplines.filter(h => 
      h.state?.toLowerCase().includes(searchLocation.toLowerCase()) ||
      h.country?.toLowerCase().includes(searchLocation.toLowerCase()) ||
      h.name.toLowerCase().includes(searchLocation.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Emergency Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-800">Emergency Support</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            If you're in crisis or need immediate support, these helplines are available 24/7. 
            You're not alone - professional help is just a call away.
          </p>
        </motion.div>

        {/* Crisis Warning */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-100 border-l-4 border-red-500 p-6 mb-8 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <HeartIcon className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">If you're having thoughts of self-harm</h3>
              <p className="text-red-700">Please call emergency services (112) or go to your nearest emergency room immediately.</p>
            </div>
          </div>
        </motion.div>

        {/* Helpline Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'national', label: 'National (India)', icon: '🇮🇳' },
              { key: 'state', label: 'State-wise (India)', icon: '🏛️' },
              { key: 'international', label: 'International', icon: '🌍' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-red-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Location Search */}
          {activeTab === 'state' && (
            <input
              type="text"
              placeholder="Search by state name..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Helplines Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredHelplines().map((helpline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <PhoneIcon className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{helpline.name}</h3>
                  {helpline.state && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {helpline.state}
                    </span>
                  )}
                  {helpline.country && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {helpline.country}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <a
                    href={`tel:${helpline.number}`}
                    className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    {helpline.number}
                  </a>
                </div>

                <p className="text-gray-600 text-sm">{helpline.description}</p>

                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{helpline.availability}</span>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <GlobeAltIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-600">
                    {helpline.languages.join(', ')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <UsersIcon className="w-7 h-7 text-blue-500" />
            Mental Health Video Resources
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {VIDEO_RESOURCES.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-gray-800 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full mr-2">
                      {resource.type}
                    </span>
                    {resource.language}
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">More Resources</h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Global Directory</h3>
              <a href="https://www.helpguide.org/find-help" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-200 hover:text-white">
                HelpGuide.org →
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Crisis Lines by Country</h3>
              <a href="https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines" target="_blank" rel="noopener noreferrer"
                 className="text-blue-200 hover:text-white">
                Wikipedia Directory →
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Find a Helpline</h3>
              <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer"
                 className="text-blue-200 hover:text-white">
                FindAHelpline.com →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}