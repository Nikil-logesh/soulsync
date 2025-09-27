'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeAuth } from '../../contexts/useSafeAuth';
import { supabase, StudentRequest } from '../../lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, userRole, signOut } = useSafeAuth();
  
  const [studentEmails, setStudentEmails] = useState<string[]>(['']);
  const [submittedRequests, setSubmittedRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || userRole !== 'college_admin') {
      router.push('/signin');
      return;
    }
    
    fetchSubmittedRequests();
    setLoading(false);
  }, [user, userRole, router]);

  const fetchSubmittedRequests = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('student_requests')
        .select('*')
        .eq('college_admin_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmittedRequests(data || []);
    } catch (error) {
      console.error('Error fetching submitted requests:', error);
    }
  };

  const addEmailField = () => {
    if (studentEmails.length < 10) {
      setStudentEmails([...studentEmails, '']);
    }
  };

  const removeEmailField = (index: number) => {
    const newEmails = studentEmails.filter((_, i) => i !== index);
    setStudentEmails(newEmails.length > 0 ? newEmails : ['']);
  };

  const updateEmail = (index: number, email: string) => {
    const newEmails = [...studentEmails];
    newEmails[index] = email;
    setStudentEmails(newEmails);
  };

  const submitStudentRequests = async () => {
    if (!user?.email) return;

    const validEmails = studentEmails.filter(email => 
      email.trim() && email.includes('@')
    );

    if (validEmails.length === 0) {
      alert('Please enter at least one valid email address.');
      return;
    }

    setSubmitting(true);
    
    try {
      // Create student requests for each email
      const requests = validEmails.map(email => ({
        student_name: email.split('@')[0], // Use email prefix as name
        student_email: email.trim(),
        college_admin_email: user.email,
        status: 'pending' as const
      }));

      const { error } = await supabase
        .from('student_requests')
        .insert(requests);

      if (error) throw error;

      // Reset form
      setStudentEmails(['']);
      
      // Refresh submitted requests
      fetchSubmittedRequests();
      
      alert(`Successfully submitted ${validEmails.length} student access requests!`);
    } catch (error) {
      console.error('Error submitting requests:', error);
      alert('Error submitting requests. Some emails may already be requested.');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">College Admin Dashboard</h1>
              <p className="text-gray-600">Manage student access requests (max 10 students)</p>
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Email Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Request Student Access
          </h2>
          <p className="text-gray-600 mb-6">
            Enter up to 10 student email addresses to request access to the Mental Wellness platform.
          </p>
          
          <div className="space-y-4">
            {studentEmails.map((email, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Email {index + 1}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {studentEmails.length > 1 && (
                  <button
                    onClick={() => removeEmailField(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={addEmailField}
              disabled={studentEmails.length >= 10}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Email ({studentEmails.length}/10)
            </button>
            
            <button
              onClick={submitStudentRequests}
              disabled={submitting || studentEmails.every(email => !email.trim())}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Requests'}
            </button>
          </div>
        </div>

        {/* Submitted Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Submitted Requests ({submittedRequests.length})
            </h2>
          </div>
          
          {submittedRequests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No requests submitted</h3>
              <p className="mt-1 text-sm text-gray-500">
                Submit student email addresses above to request platform access.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submittedRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.student_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.created_at!).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}