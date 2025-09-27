'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeAuth } from '../../contexts/useSafeAuth';

interface WellnessResource {
  id: string;
  title: string;
  description: string;
  category: 'meditation' | 'therapy' | 'assessment' | 'community';
  icon: string;
}

const wellnessResources: WellnessResource[] = [
  {
    id: '1',
    title: 'Guided Meditation',
    description: 'Start your day with a calming 10-minute meditation session',
    category: 'meditation',
    icon: '🧘‍♀️'
  },
  {
    id: '2',
    title: 'Mood Assessment',
    description: 'Track your daily mood and mental wellness patterns',
    category: 'assessment',
    icon: '📊'
  },
  {
    id: '3',
    title: 'Virtual Therapy Session',
    description: 'Connect with licensed therapists for professional support',
    category: 'therapy',
    icon: '💬'
  },
  {
    id: '4',
    title: 'Peer Support Groups',
    description: 'Join discussions with other students facing similar challenges',
    category: 'community',
    icon: '👥'
  },
  {
    id: '5',
    title: 'Stress Management Tools',
    description: 'Learn practical techniques to manage academic stress',
    category: 'meditation',
    icon: '🌱'
  },
  {
    id: '6',
    title: 'Sleep Wellness',
    description: 'Improve your sleep quality with guided relaxation',
    category: 'meditation',
    icon: '😴'
  }
];

export default function StudentDashboard() {
  const router = useRouter();
  const { user, userRole, signOut } = useSafeAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!user || userRole !== 'student') {
      router.push('/signin');
      return;
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [user, userRole, router]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meditation': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'therapy': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'assessment': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'community': return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  const userName = user.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">SoulSync</h1>
              <p className="text-gray-600">Your Mental Wellness Companion</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting}, {userName}! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Welcome to your personalized wellness journey. Take a moment to explore our resources and prioritize your mental health.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-gray-600">Days Active</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-gray-600">Sessions Completed</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">8.2</div>
              <div className="text-gray-600">Wellness Score</div>
            </div>
          </div>
        </div>

        {/* Wellness Resources */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Wellness Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessResources.map((resource) => (
              <div
                key={resource.id}
                className={`${getCategoryColor(resource.category)} border-2 rounded-xl p-6 cursor-pointer transition duration-200`}
              >
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                  Start Session
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Focus */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Focus: Mindful Breathing</h3>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-1">
              <p className="text-gray-600 mb-4">
                Take 5 minutes to practice mindful breathing. This simple technique can help reduce stress, 
                improve focus, and promote emotional well-being.
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                  Start Now (5 min)
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="text-8xl">🌬️</div>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🚨</div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-800">Need Immediate Support?</h4>
              <p className="text-red-600">
                If you're experiencing a mental health crisis, help is available 24/7.
              </p>
            </div>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
              Get Help Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}