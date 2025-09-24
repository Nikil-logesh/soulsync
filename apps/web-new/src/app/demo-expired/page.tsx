'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, RefreshCw } from 'lucide-react';

export default function DemoExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-600">Demo Access Expired</CardTitle>
          <CardDescription>
            Your demo access to the mental wellness platform has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for trying our mental wellness platform! Your demo period has ended, 
            but you can request extended access or get information about full licensing.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-blue-900 mb-2">What's next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Contact your institution's admin for extended access</li>
              <li>• Request a new demo with additional features</li>
              <li>• Learn about our full licensing options</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button onClick={() => window.location.href = '/book-demo'} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Request New Demo
            </Button>
            <Button 
              onClick={() => window.location.href = 'mailto:support@soulsync.com?subject=Demo Extension Request'} 
              className="w-full" 
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="ghost" className="w-full">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}