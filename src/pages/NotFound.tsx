
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tax Calculator
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
