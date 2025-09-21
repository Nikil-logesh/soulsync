"use client";

import { useState, useEffect } from 'react';
import { useSafeAuth } from '../../contexts/useSafeAuth';

interface ScreeningHistory {
  id: string;
  screeningType: string;
  totalScore: number;
  severity: string;
  interpretation: string;
  completedAt: string;
  nextTestRecommended: string;
  canRetakeNow: boolean;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useSafeAuth();
  const [screeningHistory, setScreeningHistory] = useState<ScreeningHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchScreeningHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchScreeningHistory = async () => {
    try {
      setLoading(true);
      
      // Get screening history from localStorage instead of API
      const storedResults = localStorage.getItem('soulsync_screening_results');
      if (storedResults) {
        const allResults = JSON.parse(storedResults);
        const userResults = allResults.filter((result: any) => result.userEmail === user?.email);
        setScreeningHistory(userResults);
      } else {
        setScreeningHistory([]);
      }
    } catch (error) {
      console.error('Error fetching screening history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your mental health profile and screening history.</p>
          <a 
            href="/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Mental Health Profile</h1>
          <p className="text-gray-600">Track your wellness journey and progress over time</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Screening History</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your screening history...</p>
            </div>
          ) : screeningHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Screenings Yet</h3>
              <p className="text-gray-500 mb-6">Take your first mental health assessment to start tracking your wellness journey.</p>
              <a 
                href="/screening"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take First Screening
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {screeningHistory.map((screening) => (
                <div
                  key={screening.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{screening.screeningType}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(screening.completedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-1">
                        {screening.totalScore}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {screening.severity}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{screening.interpretation}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Next test recommended: {new Date(screening.nextTestRecommended).toLocaleDateString()}
                    </span>
                    {screening.canRetakeNow && (
                      <a 
                        href="/screening"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Retake Now 
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/screening"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take New Screening
            </a>
            <a 
              href="/emergency"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Emergency Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
