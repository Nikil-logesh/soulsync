'use client';

import { useSafeAuth } from '../../contexts/useSafeAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DebugPage() {
  const { user, loading } = useSafeAuth();
  const router = useRouter();

  useEffect(() => {
    // Temporarily disable redirect to debug auth issues
    // if (!user && !loading) {
    //   router.push('/signin');
    // }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug: Your Login Information</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Raw Session Data */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔍 Raw Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ user, firebaseAuth: true }, null, 2)}
          </pre>
        </div>

        {/* Processed Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Processed Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Real Name:</label>
              <p className="text-lg text-gray-400 italic">[Hidden for Privacy]</p>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Email:</label>
              <p className="text-lg text-gray-400 italic">[Hidden for Privacy]</p>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Email Domain:</label>
              <p className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                {user.email?.split('@')[1] || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Anonymous Name:</label>
              <p className="text-lg font-bold text-blue-600">
                {user.displayName || user.email?.split('@')[0] || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Institution Detection:</label>
              {(() => {
                const emailDomain = user.email?.split('@')[1];
                const domainMap: { [key: string]: string } = {
                  'sairamtap.edu.in': 'Sairam Engineering College',
                  'iitm.ac.in': 'IIT Madras',
                  'anna.edu.in': 'Anna University',
                  'vit.edu.in': 'VIT University',
                };
                const institution = emailDomain && domainMap[emailDomain] ? domainMap[emailDomain] : 'Individual';
                const type = emailDomain && domainMap[emailDomain] ? 'Educational' : 'Personal';
                
                return (
                  <div>
                    <p className="text-lg font-semibold text-purple-600">{institution}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      type === 'Educational' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {type} Account
                    </span>
                  </div>
                );
              })()}
            </div>

            <div>
              <label className="block font-medium text-gray-700">Profile Photo:</label>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-xs text-gray-500 mt-1">[Not displayed for privacy]</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Storage Information */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">💾 Where This Data Is Stored</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Browser:</strong> Encrypted session cookie (httpOnly, secure)</p>
          <p><strong>Server:</strong> Session data in memory (resets on server restart)</p>
          <p><strong>Google:</strong> Your basic profile info (name, email, photo)</p>
          <p><strong>Database:</strong> Not yet implemented (we can add this)</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🚀 Next Steps Available</h2>
        <ul className="space-y-2 text-sm">
          <li>• Add database storage (Firebase, MongoDB, PostgreSQL)</li>
          <li>• Store user preferences and wellness data</li>
          <li>• Create college-specific communities</li>
          <li>• Mental health screening and assessments</li>
          <li>• Anonymous group discussions</li>
        </ul>
      </div>
    </div>
  );
}