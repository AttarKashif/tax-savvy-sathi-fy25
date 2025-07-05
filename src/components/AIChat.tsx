
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send } from 'lucide-react';
import { IncomeData, DeductionData } from '@/utils/taxCalculations';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
  deductions: DeductionData;
  setDeductions: (deductions: DeductionData) => void;
  age: number;
  setAge: (age: number) => void;
  onCalculate: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  income,
  setIncome,
  deductions,
  setDeductions,
  age,
  setAge,
  onCalculate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Tax Assistant for FY 2024-25. I'll help you calculate your income tax and find the best regime for you. Let's start with some basic information. What's your age?",
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState('age');
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

  const processUserInput = (userInput: string) => {
    addMessage(userInput, 'user');
    
    const input = userInput.toLowerCase().trim();
    const numericValue = parseFloat(userInput.replace(/[^\d.]/g, ''));

    switch (currentStep) {
      case 'age':
        if (numericValue && numericValue >= 18 && numericValue <= 100) {
          setAge(numericValue);
          addMessage(`Great! I've noted your age as ${numericValue}. Now, let's talk about your income. What's your annual salary income for FY 2024-25? (Enter in ₹)`, 'ai');
          setCurrentStep('salary');
        } else {
          addMessage("Please enter a valid age between 18 and 100.", 'ai');
        }
        break;

      case 'salary':
        if (numericValue >= 0) {
          setIncome({ ...income, salary: numericValue });
          if (numericValue > 0) {
            addMessage(`Perfect! I've recorded your salary as ₹${numericValue.toLocaleString('en-IN')}. Do you have any business or professional income? If yes, enter the amount, otherwise type 0.`, 'ai');
          } else {
            addMessage(`I see you don't have salary income. Do you have any business or professional income? If yes, enter the amount, otherwise type 0.`, 'ai');
          }
          setCurrentStep('business');
        } else {
          addMessage("Please enter a valid salary amount (enter 0 if no salary income).", 'ai');
        }
        break;

      case 'business':
        if (numericValue >= 0) {
          setIncome({ ...income, businessIncome: numericValue });
          if (numericValue > 0) {
            addMessage(`Noted! Business income: ₹${numericValue.toLocaleString('en-IN')}. Do you have any capital gains from investments? Enter short-term capital gains amount (or 0 if none).`, 'ai');
          } else {
            addMessage(`No business income noted. Do you have any capital gains from investments? Enter short-term capital gains amount (or 0 if none).`, 'ai');
          }
          setCurrentStep('capitalShort');
        } else {
          addMessage("Please enter a valid business income amount (enter 0 if no business income).", 'ai');
        }
        break;

      case 'capitalShort':
        if (numericValue >= 0) {
          // Add short-term capital gain to the capitalGains array
          const newCapitalGains = [...income.capitalGains];
          if (numericValue > 0) {
            newCapitalGains.push({
              assetType: 'equity_shares',
              isLongTerm: false,
              amount: numericValue
            });
          }
          setIncome({ ...income, capitalGains: newCapitalGains });
          addMessage(`Short-term capital gains: ₹${numericValue.toLocaleString('en-IN')}. Now enter your long-term capital gains amount (or 0 if none).`, 'ai');
          setCurrentStep('capitalLong');
        } else {
          addMessage("Please enter a valid short-term capital gains amount (enter 0 if none).", 'ai');
        }
        break;

      case 'capitalLong':
        if (numericValue >= 0) {
          // Add long-term capital gain to the capitalGains array
          const newCapitalGains = [...income.capitalGains];
          if (numericValue > 0) {
            newCapitalGains.push({
              assetType: 'equity_shares',
              isLongTerm: true,
              amount: numericValue
            });
          }
          setIncome({ ...income, capitalGains: newCapitalGains });
          addMessage(`Long-term capital gains: ₹${numericValue.toLocaleString('en-IN')}. Finally, do you have income from other sources like interest, dividends etc.? Enter the amount (or 0 if none).`, 'ai');
          setCurrentStep('otherIncome');
        } else {
          addMessage("Please enter a valid long-term capital gains amount (enter 0 if none).", 'ai');
        }
        break;

      case 'otherIncome':
        if (numericValue >= 0) {
          setIncome({ ...income, otherSources: numericValue });
          addMessage(`Other income: ₹${numericValue.toLocaleString('en-IN')}. Now let's discuss deductions for the Old Tax Regime. Do you have investments under Section 80C like PPF, ELSS, LIC etc.? Enter the total amount (max ₹1.5 lakh benefit).`, 'ai');
          setCurrentStep('section80C');
        } else {
          addMessage("Please enter a valid amount for other income (enter 0 if none).", 'ai');
        }
        break;

      case 'section80C':
        if (numericValue >= 0) {
          setDeductions({ ...deductions, section80C: Math.min(numericValue, 150000) });
          addMessage(`Section 80C investments: ₹${Math.min(numericValue, 150000).toLocaleString('en-IN')}. Do you pay medical insurance premiums? Enter Section 80D amount (max ₹25,000 for regular, ₹50,000 for senior citizens).`, 'ai');
          setCurrentStep('section80D');
        } else {
          addMessage("Please enter a valid Section 80C amount (enter 0 if none).", 'ai');
        }
        break;

      case 'section80D':
        if (numericValue >= 0) {
          const maxLimit = age >= 60 ? 50000 : 25000;
          setDeductions({ ...deductions, section80D: Math.min(numericValue, maxLimit) });
          addMessage(`Medical insurance (80D): ₹${Math.min(numericValue, maxLimit).toLocaleString('en-IN')}. Do you pay house rent and claim HRA? Enter your annual HRA exemption amount (or 0 if not applicable).`, 'ai');
          setCurrentStep('hra');
        } else {
          addMessage("Please enter a valid Section 80D amount (enter 0 if none).", 'ai');
        }
        break;

      case 'hra':
        if (numericValue >= 0) {
          setDeductions({ ...deductions, hra: numericValue });
          addMessage(`HRA exemption: ₹${numericValue.toLocaleString('en-IN')}. Perfect! I have all the information needed. Let me calculate your tax liability under both Old and New regimes and recommend the best option for you.`, 'ai');
          setCurrentStep('complete');
          setTimeout(() => {
            onCalculate();
          }, 2000);
        } else {
          addMessage("Please enter a valid HRA amount (enter 0 if not applicable).", 'ai');
        }
        break;

      case 'complete':
        addMessage("I've already calculated your taxes! Please check the 'Tax Comparison' tab to see the detailed analysis and my recommendation.", 'ai');
        break;

      default:
        addMessage("I didn't understand that. Could you please provide a valid number?", 'ai');
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
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Tax Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
