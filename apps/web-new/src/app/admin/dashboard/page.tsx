'use client';

import { useState, useEffect } from 'react';

interface DemoRequest {
  id: string;
  requestId: string;
  collegeName: string;
  designation: string;
  adminEmail: string;
  servicesNeeded: string[];
  demoEmails: string[];
  accessDuration: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  expiresAt: string;
}

export default function AdminDashboard() {
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchDemoRequests(activeTab);
  }, [activeTab]);

  const fetchDemoRequests = async (status: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      console.log(`Fetching ${status} demo requests`);
      
      // Mock data for testing
      const mockRequests: DemoRequest[] = [
        {
          id: '1',
          requestId: 'demo_123456789_abc',
          collegeName: 'Stanford University',
          designation: 'Dean of Student Affairs',
          adminEmail: 'admin@stanford.edu',
          servicesNeeded: ['mental-health-screening', 'crisis-detection'],
          demoEmails: ['student1@stanford.edu', 'student2@stanford.edu'],
          accessDuration: 15,
          status: status as any,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setDemoRequests(mockRequests);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDemo = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      // TODO: Add actual API call
      console.log('Approving demo:', requestId);
      alert(`Demo ${requestId} approved! (This is a mock - full implementation pending)`);
      fetchDemoRequests(activeTab);
    } catch (error: any) {
      alert(`Error approving demo: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectDemo = async (requestId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    setProcessingId(requestId);
    
    try {
      // TODO: Add actual API call
      console.log('Rejecting demo:', requestId, 'Reason:', reason);
      alert(`Demo ${requestId} rejected! (This is a mock - full implementation pending)`);
      fetchDemoRequests(activeTab);
    } catch (error: any) {
      alert(`Error rejecting demo: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading demo requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage demo requests and user access</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Simple Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-md max-w-md">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Requests */}
        <div className="space-y-6">
          {demoRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <p className="text-gray-500">No {activeTab} demo requests found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {demoRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm">🏢</span>
                          </div>
                          <h3 className="text-xl font-semibold">{request.collegeName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            <span className="mr-1">{getStatusEmoji(request.status)}</span>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Request ID: {request.requestId}
                        </p>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveDemo(request.requestId)}
                            disabled={processingId === request.requestId}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleRejectDemo(request.requestId)}
                            disabled={processingId === request.requestId}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Admin Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">📧</span>
                          <span className="font-medium">Admin:</span>
                          <span>{request.adminEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">👤</span>
                          <span className="font-medium">Designation:</span>
                          <span>{request.designation}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">📅</span>
                          <span className="font-medium">Duration:</span>
                          <span>{request.accessDuration} days</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">⏰</span>
                          <span className="font-medium">Expires:</span>
                          <span>{new Date(request.expiresAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-gray-500">⚙️</span>
                        <span className="font-medium text-sm">Services Requested:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {request.servicesNeeded.map((service) => (
                          <span key={service} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Demo Users */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-gray-500">👥</span>
                        <span className="font-medium text-sm">
                          Demo Users ({request.demoEmails.length}):
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <div className="text-xs space-y-1">
                          {request.demoEmails.map((email, index) => (
                            <div key={index} className="text-gray-700">{email}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="text-xs text-gray-500 pt-4 border-t">
                      <div>Requested: {new Date(request.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}