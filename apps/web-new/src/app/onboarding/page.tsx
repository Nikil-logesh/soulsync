"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface OnboardingData {
  age: number | null;
  gender: string;
  preferredLanguage: string;
  institution: string;
  country: string;
  state: string;
  city: string;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<OnboardingData>({
    age: null,
    gender: '',
    preferredLanguage: 'en',
    institution: '',
    country: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    // Redirect if already onboarded
    if (session?.user?.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );
          
          if (response.ok) {
            const locationData = await response.json();
            const address = locationData.address || {};
            
            setFormData(prev => ({
              ...prev,
              country: address.country || '',
              state: address.state || address.region || '',
              city: address.city || address.town || address.village || ''
            }));
          }
        } catch (error) {
          console.error('Failed to get location details:', error);
          setError('Failed to detect location. Please enter manually.');
        }
      },
      () => {
        setError('Location access denied. Please enter location manually.');
      }
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.age || formData.age < 13 || formData.age > 100) {
      setError('Please enter a valid age between 13 and 100');
      return;
    }

    if (!formData.gender) {
      setError('Please select your gender');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Update session with new user data
        await update();
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save profile information');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age && formData.age >= 13 && formData.age <= 100 && formData.gender;
      case 2:
        return formData.preferredLanguage;
      case 3:
        return formData.country && formData.state;
      default:
        return false;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-white text-2xl">🌟</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SoulSync</h1>
          <p className="text-gray-600 text-sm">Let's personalize your mental wellness journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || null }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age"
                />
                <p className="text-xs text-gray-500 mt-1">You must be at least 13 years old to use this platform</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution (Optional)</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., University, Company, School"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Language Preference */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Language Preference</h2>
            
            <div className="space-y-3">
              {languages.map((lang) => (
                <label
                  key={lang.code}
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.preferredLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={formData.preferredLanguage === lang.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{lang.name}</span>
                      <span className="text-gray-600 ml-2">({lang.nativeName})</span>
                    </div>
                    {formData.preferredLanguage === lang.code && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Location</h2>
            
            <div className="space-y-4">
              <div className="text-center">
                <button
                  onClick={detectLocation}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  📍 Auto-detect Location
                </button>
                <p className="text-xs text-gray-500 mt-2">This helps us provide culturally relevant content</p>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Region *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Tamil Nadu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City (Optional)</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Chennai"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {step === 3 ? 'Complete Setup' : 'Next'}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 Your privacy is important to us. This information helps us provide personalized mental wellness support while keeping your data secure and anonymous.
          </p>
        </div>
      </motion.div>
    </div>
  );
}