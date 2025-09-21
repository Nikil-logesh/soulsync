'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../hooks/useLocation';

interface Helpline {
  name: string;
  phone: string;
  description: string;
  type: 'crisis' | 'counseling' | 'youth' | 'general';
  available: string;
  languages?: string[];
}

interface StateResource {
  state: string;
  region: string;
  helplines: Helpline[];
  localResources?: {
    hospitals: string[];
    counselingCenters: string[];
    youthPrograms: string[];
  };
}

const indianStateHelplines: StateResource[] = [
  {
    state: 'Delhi',
    region: 'Northern India',
    helplines: [
      {
        name: 'Delhi Government Mental Health Helpline',
        phone: '011-23389090',
        description: 'Free mental health counseling and crisis support for Delhi residents',
        type: 'crisis',
        available: '24/7',
        languages: ['Hindi', 'English', 'Punjabi']
      },
      {
        name: 'Mental Health Foundation Delhi',
        phone: '011-26851468',
        description: 'Professional counseling and therapy services',
        type: 'counseling',
        available: '9 AM - 6 PM',
        languages: ['Hindi', 'English']
      },
      {
        name: 'Youth Helpline Delhi',
        phone: '011-25704732',
        description: 'Specialized support for students and young adults',
        type: 'youth',
        available: '10 AM - 8 PM',
        languages: ['Hindi', 'English']
      }
    ],
    localResources: {
      hospitals: ['AIIMS Delhi', 'Safdarjung Hospital', 'Lady Hardinge Medical College'],
      counselingCenters: ['Delhi Psychiatric Centre', 'Vimhans Hospital'],
      youthPrograms: ['Delhi University Counseling Cell', 'Youth Mental Health Initiative Delhi']
    }
  },
  {
    state: 'Maharashtra',
    region: 'Western India',
    helplines: [
      {
        name: 'Connecting Trust Mumbai',
        phone: '022-26750000',
        description: '24/7 emotional support and crisis intervention',
        type: 'crisis',
        available: '24/7',
        languages: ['Hindi', 'English', 'Marathi']
      },
      {
        name: 'Samaritans Mumbai',
        phone: '022-32473267',
        description: 'Suicide prevention and emotional support',
        type: 'crisis',
        available: '24/7',
        languages: ['Hindi', 'English', 'Marathi']
      },
      {
        name: 'Maharashtra Youth Counseling',
        phone: '022-24157777',
        description: 'Academic stress and career guidance for youth',
        type: 'youth',
        available: '9 AM - 9 PM',
        languages: ['Hindi', 'English', 'Marathi']
      }
    ],
    localResources: {
      hospitals: ['KEM Hospital Mumbai', 'Sion Hospital', 'JJ Hospital'],
      counselingCenters: ['Tata Institute of Social Sciences', 'Masina Hospital Mental Health'],
      youthPrograms: ['Mumbai University Student Counseling', 'Youth for Mental Health Mumbai']
    }
  },
  {
    state: 'Tamil Nadu',
    region: 'Southern India',
    helplines: [
      {
        name: 'Sneha Chennai',
        phone: '044-24640050',
        description: 'Suicide prevention helpline serving Tamil Nadu',
        type: 'crisis',
        available: '24/7',
        languages: ['Tamil', 'English', 'Hindi']
      },
      {
        name: 'Parivarthan Coimbatore',
        phone: '0422-2544042',
        description: 'Mental health counseling and support',
        type: 'counseling',
        available: '8 AM - 8 PM',
        languages: ['Tamil', 'English']
      },
      {
        name: 'Tamil Nadu Youth Mental Health',
        phone: '044-28512345',
        description: 'Specialized support for Tamil youth and students',
        type: 'youth',
        available: '10 AM - 7 PM',
        languages: ['Tamil', 'English']
      }
    ],
    localResources: {
      hospitals: ['Government General Hospital Chennai', 'Madras Medical College', 'Apollo Hospitals'],
      counselingCenters: ['Institute of Mental Health Chennai', 'Schizophrenia Research Foundation'],
      youthPrograms: ['Anna University Counseling Cell', 'Tamil Nadu Student Mental Health Initiative']
    }
  },
  {
    state: 'Karnataka',
    region: 'Southern India',
    helplines: [
      {
        name: 'Sahayavani Bangalore',
        phone: '080-25497777',
        description: 'Crisis helpline for mental health emergencies',
        type: 'crisis',
        available: '24/7',
        languages: ['Kannada', 'English', 'Hindi']
      },
      {
        name: 'NIMHANS Helpline',
        phone: '080-26995000',
        description: 'Professional mental health support and guidance',
        type: 'counseling',
        available: '9 AM - 5 PM',
        languages: ['Kannada', 'English', 'Hindi']
      },
      {
        name: 'Bangalore Youth Crisis Line',
        phone: '080-22222222',
        description: 'Support for IT professionals and students in Bangalore',
        type: 'youth',
        available: '6 PM - 10 PM',
        languages: ['Kannada', 'English', 'Hindi']
      }
    ],
    localResources: {
      hospitals: ['NIMHANS Bangalore', 'Victoria Hospital', 'St. Johns Medical College'],
      counselingCenters: ['Centre for Mental Health Law & Policy', 'Spandana Mental Health Center'],
      youthPrograms: ['IISc Student Counseling', 'Bangalore IT Employee Mental Health Program']
    }
  },
  {
    state: 'Kerala',
    region: 'Southern India',
    helplines: [
      {
        name: 'Maithri Helpline Kochi',
        phone: '0484-2540530',
        description: 'Emotional support and crisis intervention',
        type: 'crisis',
        available: '24/7',
        languages: ['Malayalam', 'English', 'Hindi']
      },
      {
        name: 'Thanal Calicut',
        phone: '0495-2760000',
        description: 'Mental health counseling and support',
        type: 'counseling',
        available: '9 AM - 6 PM',
        languages: ['Malayalam', 'English']
      },
      {
        name: 'Kerala Youth Mental Wellness',
        phone: '0471-2315555',
        description: 'Youth-focused mental health support',
        type: 'youth',
        available: '10 AM - 8 PM',
        languages: ['Malayalam', 'English']
      }
    ],
    localResources: {
      hospitals: ['Government Medical College Thiruvananthapuram', 'Medical College Calicut'],
      counselingCenters: ['Institute of Mental Health & Neurosciences Kerala'],
      youthPrograms: ['Kerala University Student Counseling', 'Kerala Youth Mental Health Initiative']
    }
  },
  {
    state: 'West Bengal',
    region: 'Eastern India',
    helplines: [
      {
        name: 'Kolkata Crisis Helpline',
        phone: '033-24637401',
        description: 'Crisis intervention and emotional support',
        type: 'crisis',
        available: '24/7',
        languages: ['Bengali', 'English', 'Hindi']
      },
      {
        name: 'Mental Health Foundation Kolkata',
        phone: '033-22875000',
        description: 'Counseling and therapy services',
        type: 'counseling',
        available: '9 AM - 7 PM',
        languages: ['Bengali', 'English', 'Hindi']
      },
      {
        name: 'Bengal Youth Support Line',
        phone: '033-25551234',
        description: 'Support for students and young professionals',
        type: 'youth',
        available: '2 PM - 9 PM',
        languages: ['Bengali', 'English']
      }
    ],
    localResources: {
      hospitals: ['SSKM Hospital Kolkata', 'Medical College Kolkata', 'Institute of Psychiatry'],
      counselingCenters: ['Centre for Cognitive & Behavioural Therapy'],
      youthPrograms: ['Calcutta University Student Counseling', 'West Bengal Youth Mental Health']
    }
  }
];

const nationalHelplines: Helpline[] = [
  {
    name: 'Vandrevala Foundation',
    phone: '1860-2662-345',
    description: 'Free 24/7 mental health support across India',
    type: 'crisis',
    available: '24/7',
    languages: ['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati']
  },
  {
    name: 'iCall Psychosocial Helpline',
    phone: '9152987821',
    description: 'Professional counseling and emotional support',
    type: 'counseling',
    available: '10 AM - 8 PM',
    languages: ['Hindi', 'English', 'Marathi']
  },
  {
    name: 'AASRA Suicide Prevention',
    phone: '91-22-2754-6669',
    description: 'Suicide prevention and crisis intervention',
    type: 'crisis',
    available: '24/7',
    languages: ['Hindi', 'English']
  }
];

export default function HelplinesPage() {
  const { user } = useAuth();
  const { location } = useLocation();
  const [selectedState, setSelectedState] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (location?.state) {
      setSelectedState(location.state);
    }
  }, [location]);

  const stateOptions = indianStateHelplines.map(resource => resource.state);
  const selectedStateData = indianStateHelplines.find(resource => resource.state === selectedState);

  const filteredHelplines = (helplines: Helpline[]) => {
    if (filterType === 'all') return helplines;
    return helplines.filter(helpline => helpline.type === filterType);
  };

  const typeFilters = [
    { id: 'all', name: 'All Types', icon: '📞' },
    { id: 'crisis', name: 'Crisis Support', icon: '🚨' },
    { id: 'counseling', name: 'Counseling', icon: '💬' },
    { id: 'youth', name: 'Youth Support', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mental Health Helplines Directory 📞
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find immediate mental health support across India. All helplines are confidential, 
            non-judgmental, and specifically trained to help Indian youth overcome stigma and access care.
          </p>
          {location && (
            <p className="text-sm text-green-600 mt-2">
              📍 Your location: {location.city}, {location.state} - Showing local resources
            </p>
          )}
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              🚨 In Crisis? Call Immediately
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nationalHelplines.map((helpline, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">{helpline.name}</h3>
                  <a
                    href={`tel:${helpline.phone}`}
                    className="block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                  >
                    📞 {helpline.phone}
                  </a>
                  <p className="text-xs text-red-600 mt-2">{helpline.available}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* State Selection and Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Your State</option>
            {stateOptions.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <div className="flex gap-2">
            {typeFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === filter.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
                }`}
              >
                {filter.icon} {filter.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* National Helplines */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              🇮🇳 National Helplines
            </h2>
            <p className="text-gray-600 mb-6">Available from anywhere in India</p>
            
            <div className="space-y-4">
              {filteredHelplines(nationalHelplines).map((helpline, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{helpline.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{helpline.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⏰ {helpline.available}</span>
                        <span>🗣️ {helpline.languages?.join(', ')}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${helpline.phone}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium ml-4"
                    >
                      📞 Call
                    </a>
                  </div>
                  <div className="mt-2">
                    <a
                      href={`tel:${helpline.phone}`}
                      className="text-green-600 font-mono font-semibold hover:text-green-700"
                    >
                      {helpline.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State-Specific Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedStateData ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  📍 {selectedStateData.state} Resources
                </h2>
                <p className="text-gray-600 mb-6">Local mental health support in {selectedStateData.region}</p>
                
                <div className="space-y-4 mb-6">
                  {filteredHelplines(selectedStateData.helplines).map((helpline, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{helpline.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{helpline.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>⏰ {helpline.available}</span>
                            <span>🗣️ {helpline.languages?.join(', ')}</span>
                          </div>
                        </div>
                        <a
                          href={`tel:${helpline.phone}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium ml-4"
                        >
                          📞 Call
                        </a>
                      </div>
                      <div className="mt-2">
                        <a
                          href={`tel:${helpline.phone}`}
                          className="text-blue-600 font-mono font-semibold hover:text-blue-700"
                        >
                          {helpline.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedStateData.localResources && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">🏥 Local Resources</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Hospitals:</span>
                        <p className="text-gray-600">{selectedStateData.localResources.hospitals.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Counseling Centers:</span>
                        <p className="text-gray-600">{selectedStateData.localResources.counselingCenters.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Youth Programs:</span>
                        <p className="text-gray-600">{selectedStateData.localResources.youthPrograms.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📍 Select Your State
                </h2>
                <p className="text-gray-600 mb-6">
                  Choose your state from the dropdown above to see local mental health resources and helplines.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Tip:</strong> Even if your state isn't listed, the national helplines above are available to you 24/7.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            💙 Important Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">✅ What to Expect:</h4>
              <ul className="space-y-1">
                <li>• Confidential and non-judgmental support</li>
                <li>• Trained counselors who understand Indian culture</li>
                <li>• Free or low-cost services</li>
                <li>• Support in multiple Indian languages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔒 Your Privacy:</h4>
              <ul className="space-y-1">
                <li>• All calls are completely confidential</li>
                <li>• No caller ID or recording without consent</li>
                <li>• You can remain anonymous</li>
                <li>• Information is not shared with family/school</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-blue-800 font-medium">
              🌟 Remember: Seeking help is a sign of strength, not weakness. Mental health care is healthcare, and you deserve support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}