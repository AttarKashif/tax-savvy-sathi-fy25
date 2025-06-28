
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator, Bot, ChartBar, HelpCircle, LogOut, User } from 'lucide-react';
import { IncomeData, DeductionData, calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';
import { AIChat } from './AIChat';
import { TaxComparison } from './TaxComparison';
import { IncomeEntry } from './IncomeEntry';
import { DeductionEntry } from './DeductionEntry';
import { HelpManual } from './HelpManual';
import { useAuth } from '@/hooks/useAuth';

export const TaxCalculator = () => {
  const { user, profile, signOut } = useAuth();
  const [age, setAge] = useState<number>(30);
  const [taxpayerName, setTaxpayerName] = useState<string>('');
  const [income, setIncome] = useState<IncomeData>({
    salary: 0,
    basicSalary: 0,
    businessIncome: 0,
    capitalGainsShort: 0,
    capitalGainsLong: 0,
    otherSources: 0
  });
  
  const [deductions, setDeductions] = useState<DeductionData>({
    section80C: 0,
    section80D: 0,
    hra: 0,
    lta: 0,
    homeLoanInterest: 0,
    section80TTA: 0,
    nps: 0,
    professionalTax: 0,
    section80E: 0,
    section80G: 0,
    section80EE: 0,
    section80EEA: 0,
    section80U: 0,
    section80DDB: 0,
    section80CCG: 0,
    section80CCC: 0,
    section80CCD: 0,
    gratuity: 0,
    leaveEncashment: 0
  });

  const [activeTab, setActiveTab] = useState('chat');
  const [showResults, setShowResults] = useState(false);

  const handleIncomeUpdate = useCallback((newIncome: IncomeData) => {
    setIncome(newIncome);
  }, []);

  const handleDeductionsUpdate = useCallback((newDeductions: DeductionData) => {
    setDeductions(newDeductions);
  }, []);

  const handleAgeUpdate = useCallback((newAge: number) => {
    setAge(newAge);
  }, []);

  const handleTaxpayerNameUpdate = useCallback((newName: string) => {
    setTaxpayerName(newName);
  }, []);

  const oldRegimeResult = calculateOldRegimeTax(income, deductions, age);
  const newRegimeResult = calculateNewRegimeTax(income, deductions, age);
  const recommendation = getOptimalRegime(oldRegimeResult, newRegimeResult);

  const handleCalculate = useCallback(() => {
    setShowResults(true);
    setActiveTab('results');
  }, []);

  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;
  const hasValidIncome = totalIncome > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#222222] bg-[#111111]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Tax Calculator</h1>
                <p className="text-sm text-gray-400">FY 2024-25</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{profile?.full_name || user?.email}</span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-[#111111] border border-[#222222]">
              <TabsTrigger 
                value="chat" 
                className="flex items-center gap-2 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger 
                value="income" 
                className="flex items-center gap-2 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400"
              >
                <Calculator className="w-4 h-4" />
                Income Entry
              </TabsTrigger>
              <TabsTrigger 
                value="deductions" 
                className="flex items-center gap-2 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400"
              >
                <Calculator className="w-4 h-4" />
                Deductions
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex items-center gap-2 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400" 
                disabled={!hasValidIncome}
              >
                <ChartBar className="w-4 h-4" />
                Tax Comparison
              </TabsTrigger>
              <TabsTrigger 
                value="help" 
                className="flex items-center gap-2 data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white text-gray-400"
              >
                <HelpCircle className="w-4 h-4" />
                User Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <AIChat
                income={income}
                setIncome={handleIncomeUpdate}
                deductions={deductions}
                setDeductions={handleDeductionsUpdate}
                age={age}
                setAge={handleAgeUpdate}
                onCalculate={handleCalculate}
              />
            </TabsContent>

            <TabsContent value="income" className="space-y-6">
              <Card className="bg-[#111111] border-[#222222]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    Income Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age" className="text-gray-300">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age || ''}
                        onChange={(e) => handleAgeUpdate(Number(e.target.value) || 0)}
                        min="18"
                        max="100"
                        className="mt-1 bg-[#1A1A1A] border-[#333333] text-white focus:border-blue-500"
                        placeholder="Enter your age"
                      />
                    </div>
                  </div>
                  
                  <IncomeEntry 
                    income={income} 
                    setIncome={handleIncomeUpdate}
                    taxpayerName={taxpayerName}
                    setTaxpayerName={handleTaxpayerNameUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-6">
              <DeductionEntry 
                deductions={deductions} 
                setDeductions={handleDeductionsUpdate}
                income={income}
                onCalculate={handleCalculate}
                hasValidIncome={hasValidIncome}
                age={age}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {showResults && hasValidIncome && (
                <TaxComparison
                  oldRegimeResult={oldRegimeResult}
                  newRegimeResult={newRegimeResult}
                  recommendation={recommendation}
                  age={age}
                  income={income}
                  deductions={deductions}
                  taxpayerName={taxpayerName}
                />
              )}
            </TabsContent>

            <TabsContent value="help" className="space-y-6">
              <HelpManual />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
