
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Bot, ChartBar, HelpCircle } from 'lucide-react';
import { IncomeData, DeductionData, calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';
import { AIChat } from './AIChat';
import { TaxComparison } from './TaxComparison';
import { IncomeEntry } from './IncomeEntry';
import { DeductionEntry } from './DeductionEntry';
import { HelpManual } from './HelpManual';

export const TaxCalculator = () => {
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

  // Calculate total income correctly (excluding basic salary as it's part of annual salary)
  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;
  const hasValidIncome = totalIncome > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Tax Calculator FY 2024-25
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized tax advice and compare Old vs New tax regimes with our intelligent AI assistant
          </p>
          <div className="mt-4 text-sm">
            <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full mr-2">Old Regime Only</span>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full">Both Regimes</span>
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Income Entry
              </TabsTrigger>
              <TabsTrigger value="deductions" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Deductions
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2" disabled={!hasValidIncome}>
                <ChartBar className="w-4 h-4" />
                Tax Comparison
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Income Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age || ''}
                        onChange={(e) => handleAgeUpdate(Number(e.target.value) || 0)}
                        min="18"
                        max="100"
                        className="mt-1"
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
