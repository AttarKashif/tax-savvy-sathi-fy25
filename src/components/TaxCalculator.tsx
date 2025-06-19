
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Bot, ChartBar } from 'lucide-react';
import { IncomeData, DeductionData, calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';
import { AIChat } from './AIChat';
import { TaxComparison } from './TaxComparison';
import { IncomeEntry } from './IncomeEntry';
import { DeductionEntry } from './DeductionEntry';

export const TaxCalculator = () => {
  const [age, setAge] = useState<number>(30);
  const [income, setIncome] = useState<IncomeData>({
    salary: 0, // Total annual salary including all allowances
    basicSalary: 0, // Basic salary component only (for HRA calculation)
    businessIncome: 0,
    capitalGainsShort: 0,
    capitalGainsLong: 0,
    otherSources: 0
  });
  
  const [deductions, setDeductions] = useState<DeductionData>({
    section80C: 0,
    section80D: 0,
    hra: 0, // Only applicable to old regime
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

  const oldRegimeResult = calculateOldRegimeTax(income, deductions, age);
  const newRegimeResult = calculateNewRegimeTax(income, deductions, age);
  const recommendation = getOptimalRegime(oldRegimeResult, newRegimeResult);

  const handleCalculate = () => {
    setShowResults(true);
    setActiveTab('results');
  };

  const hasValidIncome = Object.values(income).some(value => value > 0);

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
            <TabsList className="grid w-full grid-cols-4 mb-6">
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
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <AIChat
                income={income}
                setIncome={setIncome}
                deductions={deductions}
                setDeductions={setDeductions}
                age={age}
                setAge={setAge}
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
                        onChange={(e) => setAge(Number(e.target.value) || 0)}
                        min="18"
                        max="100"
                        className="mt-1"
                        placeholder="Enter your age"
                      />
                    </div>
                  </div>
                  
                  <IncomeEntry income={income} setIncome={setIncome} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-6">
              <DeductionEntry 
                deductions={deductions} 
                setDeductions={setDeductions}
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
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
