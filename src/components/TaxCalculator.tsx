
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator, ChartBar, HelpCircle, LogOut, User, Library } from 'lucide-react';
import { IncomeData, DeductionData, calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';
import { TaxComparison } from './TaxComparison';
import { IncomeEntry } from './IncomeEntry';
import { DeductionEntry } from './DeductionEntry';
import { HelpManual } from './HelpManual';
import { TaxLibrary } from './TaxLibrary';
import { useAuth } from '@/hooks/useAuth';

export const TaxCalculator = () => {
  const {
    user,
    profile,
    signOut
  } = useAuth();
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
  const [activeTab, setActiveTab] = useState('income');
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
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Modern Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Tax Calculator</h1>
                <p className="text-sm text-slate-400">FY 2024-25</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-600/30">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
              </div>
              <Button onClick={signOut} variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full px-4 py-2 transition-all duration-200">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-800/50 border border-slate-600/30 rounded-2xl p-1 backdrop-blur-sm">
              <TabsTrigger value="income" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Calculator className="w-4 h-4" />
                Income Entry
              </TabsTrigger>
              <TabsTrigger value="deductions" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Calculator className="w-4 h-4" />
                Deductions
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!hasValidIncome} className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <ChartBar className="w-4 h-4" />
                Tax Comparison
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Library className="w-4 h-4" />
                Library
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <HelpCircle className="w-4 h-4" />
                Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="income" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    Income Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-slate-300 font-medium">Age</Label>
                      <Input id="age" type="number" value={age || ''} onChange={e => handleAgeUpdate(Number(e.target.value) || 0)} min="18" max="100" className="bg-slate-700/50 border-slate-600/50 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200" placeholder="Enter your age" />
                    </div>
                  </div>
                  
                  <IncomeEntry income={income} setIncome={handleIncomeUpdate} taxpayerName={taxpayerName} setTaxpayerName={handleTaxpayerNameUpdate} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-6">
              <DeductionEntry deductions={deductions} setDeductions={handleDeductionsUpdate} income={income} onCalculate={handleCalculate} hasValidIncome={hasValidIncome} age={age} />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {showResults && hasValidIncome && <TaxComparison oldRegimeResult={oldRegimeResult} newRegimeResult={newRegimeResult} recommendation={recommendation} age={age} income={income} deductions={deductions} taxpayerName={taxpayerName} />}
            </TabsContent>

            <TabsContent value="library" className="space-y-6">
              <TaxLibrary />
            </TabsContent>

            <TabsContent value="help" className="space-y-6">
              <HelpManual />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
