
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Mail, Calculator } from 'lucide-react';

interface AccessPendingProps {
  onSignOut: () => void;
  userEmail: string;
}

export const AccessPending: React.FC<AccessPendingProps> = ({ onSignOut, userEmail }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Tax Calculator</h1>
          </div>
        </div>

        <Card className="bg-[#111111] border-[#222222]">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Access Pending</h2>
                <p className="text-gray-400 mb-4">
                  Your account is awaiting admin approval. You'll receive access once an administrator reviews your request.
                </p>
              </div>

              <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333333]">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Account</span>
                </div>
                <p className="text-white font-medium">{userEmail}</p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={onSignOut}
                  variant="outline"
                  className="w-full bg-transparent border-[#333333] text-gray-300 hover:bg-[#1A1A1A] hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};
