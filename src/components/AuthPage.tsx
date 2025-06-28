
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calculator } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        setMessage('Please check your email to confirm your account. After confirmation, an admin will approve your access.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-400">FY 2024-25</p>
        </div>

        <Card className="bg-[#111111] border-[#222222]">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="bg-[#1A1A1A] border-[#333333] text-white focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#1A1A1A] border-[#333333] text-white focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#1A1A1A] border-[#333333] text-white focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <Alert className="bg-red-900/20 border-red-800">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="bg-green-900/20 border-green-800">
                  <AlertDescription className="text-green-400">{message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Access is subject to admin approval after signup
          </p>
        </div>
      </div>
    </div>
  );
};
