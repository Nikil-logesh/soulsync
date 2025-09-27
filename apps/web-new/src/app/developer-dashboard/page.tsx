'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeAuth } from '../../contexts/useSafeAuth';
import { supabase, CampusRequest, StudentRequest } from '../../lib/supabase';

export default function DeveloperDashboard() {
  const router = useRouter();
  const { user, userRole, signOut } = useSafeAuth();
  
  const [campusRequests, setCampusRequests] = useState<CampusRequest[]>([]);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || userRole !== 'developer') {
      router.push('/signin');
      return;
    }
    
    fetchRequests();
  }, [user, userRole, router]);

  const fetchRequests = async () => {
    try {
      // Fetch campus requests
      const { data: campusData, error: campusError } = await supabase
        .from('campus_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (campusError) throw campusError;

      // Fetch student requests
      const { data: studentData, error: studentError } = await supabase
        .from('student_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentError) throw studentError;

      setCampusRequests(campusData || []);
      setStudentRequests(studentData || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
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

  const approveCampusRequest = async (requestId: number, adminEmail: string) => {
    try {
      // Update campus request status
      const { error: updateError } = await supabase
        .from('campus_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Add college admin to login credentials
      const { error: insertError } = await supabase
        .from('login_credentials')
        .insert([
          {
            email: adminEmail,
            password: 'welcome@123',
            role: 'college_admin'
          }
        ]);

      if (insertError && insertError.code !== '23505') { // Ignore duplicate email error
        throw insertError;
      }

      // Refresh data
      fetchRequests();
      alert('Campus request approved! College admin can now login.');
    } catch (error) {
      console.error('Error approving campus request:', error);
      alert('Error approving request. Please try again.');
    }
  };

  const approveStudentRequest = async (requestId: number, studentEmail: string) => {
    try {
      // Update student request status
      const { error: updateError } = await supabase
        .from('student_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Add student to login credentials
      const { error: insertError } = await supabase
        .from('login_credentials')
        .insert([
          {
            email: studentEmail,
            password: 'welcome@123',
            role: 'student'
          }
        ]);

      if (insertError && insertError.code !== '23505') { // Ignore duplicate email error
        throw insertError;
      }

      // Refresh data
      fetchRequests();
      alert('Student request approved! Student can now login.');
    } catch (error) {
      console.error('Error approving student request:', error);
      alert('Error approving request. Please try again.');
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
              <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
              <p className="text-gray-600">Manage campus and student requests</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campus Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Campus Integration Requests ({campusRequests.filter(r => r.status === 'pending').length})
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campusRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.college_name}</div>
                          <div className="text-sm text-gray-500">{request.student_count} students</div>
                          <div className="text-sm text-gray-500">{request.college_address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.admin_name}</div>
                          <div className="text-sm text-gray-500">{request.admin_email}</div>
                          <div className="text-sm text-gray-500">{request.contact_number}</div>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => approveCampusRequest(request.id!, request.admin_email)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Student Requests */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Student Access Requests ({studentRequests.filter(r => r.status === 'pending').length})
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.student_name}</div>
                          <div className="text-sm text-gray-500">{request.student_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.college_admin_email}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => approveStudentRequest(request.id!, request.student_email)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}