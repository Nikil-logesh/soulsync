'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function IntegrateCampusPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    collegeName: '',
    adminName: '',
    adminEmail: '',
    collegeAddress: '',
    studentCount: '',
    contactNumber: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.collegeName || !formData.adminName || !formData.adminEmail || 
          !formData.collegeAddress || !formData.studentCount || !formData.contactNumber) {
        throw new Error('Please fill in all fields');
      }

      if (!formData.adminEmail.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const studentCountNum = parseInt(formData.studentCount);
      if (isNaN(studentCountNum) || studentCountNum < 1) {
        throw new Error('Please enter a valid student count');
      }

      console.log('Submitting campus request:', {
        college_name: formData.collegeName,
        admin_name: formData.adminName,
        admin_email: formData.adminEmail,
        college_address: formData.collegeAddress,
        student_count: studentCountNum,
        contact_number: formData.contactNumber,
        status: 'pending'
      });

      // Submit to Supabase
      const { data: insertData, error: insertError } = await supabase
        .from('campus_requests')
        .insert([
          {
            college_name: formData.collegeName,
            admin_name: formData.adminName,
            admin_email: formData.adminEmail,
            college_address: formData.collegeAddress,
            student_count: studentCountNum,
            contact_number: formData.contactNumber,
            status: 'pending'
          }
        ])
        .select();

      console.log('Supabase insert result:', { insertData, insertError });

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw insertError;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Request Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in SoulSync! We've received your campus integration request and will review it within 2-3 business days.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong><br />
              1. Our team will review your request<br />
              2. You'll receive approval via email<br />
              3. We'll provide admin login credentials<br />
              4. You can then add up to 10 students
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/signin')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">SoulSync</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Campus Integration Request</h2>
          <p className="text-gray-600">
            Join the SoulSync platform to provide mental wellness support to your students
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">College Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/University Name *
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    placeholder="e.g., Springfield University"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Address *
                  </label>
                  <textarea
                    name="collegeAddress"
                    value={formData.collegeAddress}
                    onChange={handleInputChange}
                    placeholder="Full address including city, state, zip code"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approximate Student Count *
                  </label>
                  <input
                    type="number"
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrator Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrator Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    placeholder="Full name of the college administrator"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrator Email *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    placeholder="admin@college.edu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used for your admin login after approval
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Benefits Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">What you'll get with SoulSync:</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>✅ Dedicated admin dashboard for managing student access</li>
                <li>✅ Up to 10 initial student accounts (expandable)</li>
                <li>✅ Mental health resources and tools for students</li>
                <li>✅ Mood tracking and wellness analytics</li>
                <li>✅ Professional therapist connections</li>
                <li>✅ 24/7 crisis support resources</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:support@soulsync.com" className="text-blue-600 hover:underline">
              support@soulsync.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}