
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {}

export const AIChat: React.FC<AIChatProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Tax Assistant powered by Gemini. I can help you with tax calculations, ITR filing guidance, compliance queries, and general tax advice. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const connectToGemini = () => {
    if (apiKey.trim()) {
      setIsConnected(true);
      addMessage("Great! I'm now connected to Gemini AI. I can help you with comprehensive tax advice, calculations, and compliance guidance. What would you like to know?", 'ai');
    }
  };

  const processUserInput = async (userInput: string) => {
    if (!isConnected) {
      addMessage("Please connect your Gemini API key first to start chatting.", 'ai');
      return;
    }

    addMessage(userInput, 'user');
    setIsLoading(true);

    try {
      // Mock Gemini API call - replace with actual implementation
      const response = await mockGeminiCall(userInput);
      addMessage(response, 'ai');
    } catch (error) {
      addMessage("I apologize, but I encountered an error processing your request. Please try again.", 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  const mockGeminiCall = async (input: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on input
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('tax') && lowerInput.includes('calculate')) {
      return "I can help you calculate your taxes! Please provide:\n1. Your annual income\n2. Your age category\n3. Investment details for deductions\n\nYou can also use the Tax Calculator tab for detailed calculations.";
    } else if (lowerInput.includes('itr') || lowerInput.includes('return')) {
      return "For ITR filing, I can guide you through:\n• Choosing the right ITR form (1-7)\n• Understanding required documents\n• Pre-filling from Form 26AS/AIS\n• Common deductions and exemptions\n\nWhat specific aspect would you like help with?";
    } else if (lowerInput.includes('deduction')) {
      return "Here are key deductions for FY 2024-25:\n• Section 80C: ₹1.5 lakh (PPF, ELSS, LIC)\n• Section 80D: ₹25,000-50,000 (Health insurance)\n• Section 24: Home loan interest\n• HRA exemption\n\nWhich deduction would you like details about?";
    } else if (lowerInput.includes('tds')) {
      return "For TDS matters:\n• TDS rates vary by income type\n• Form 16/16A for TDS certificates\n• Quarterly TDS returns (24Q, 26Q, 27Q)\n• TRACES portal for e-filing\n\nWhat specific TDS query do you have?";
    } else {
      return "I'm here to help with all your tax-related questions! I can assist with:\n• Tax calculations and planning\n• ITR filing guidance\n• Deduction optimization\n• TDS/TCS queries\n• Compliance requirements\n\nPlease ask me anything specific about Indian taxation.";
    }
  };

  const handleSend = () => {
    if (currentInput.trim()) {
      processUserInput(currentInput.trim());
      setCurrentInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="uniform-page-container">
      <div className="uniform-content-wrapper">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="uniform-section-title">AI Tax Assistant</h1>
            <p className="uniform-section-subtitle">Powered by Google Gemini - Your intelligent tax advisor</p>
          </div>
        </div>

        {!isConnected && (
          <Card className="uniform-card mb-6">
            <CardHeader className="uniform-card-header">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Connect Gemini API
              </CardTitle>
            </CardHeader>
            <CardContent className="uniform-card-content">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To use the AI assistant, please provide your Google Gemini API key. 
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    Get your API key here
                  </a>
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="apiKey" className="uniform-input-label">Gemini API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                  />
                </div>
                <Button onClick={connectToGemini} disabled={!apiKey.trim()} className="mt-6">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="uniform-card">
          <CardHeader className="uniform-card-header">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Chat with AI Assistant
              {isConnected && <Badge variant="secondary" className="ml-auto">Connected</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="uniform-card-content">
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-muted/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-card-foreground border'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-card text-card-foreground border rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected ? "Ask me anything about taxes..." : "Connect API key first"}
                  className="flex-1"
                  disabled={!isConnected}
                />
                <Button onClick={handleSend} size="icon" disabled={!isConnected || !currentInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
