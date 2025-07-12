
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator, ChartBar, HelpCircle, LogOut, User, Library, AlertTriangle, Lightbulb, TrendingDown, Receipt, Home } from 'lucide-react';
import { IncomeData, DeductionData, TDSData, TCSData, HousePropertyData, CarryForwardLoss, calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';
import { TaxComparison } from './TaxComparison';
import { IncomeEntry } from './IncomeEntry';
import { DeductionEntry } from './DeductionEntry';
import { CapitalGainsEntry } from './CapitalGainsEntry';
import { TDSTCSEntry } from './TDSEntry';
import { CarryForwardLossEntry } from './CarryForwardLossEntry';
import { HousePropertyEntry } from './HousePropertyEntry';
import { HelpManual } from './HelpManual';
import { TaxLibrary } from './TaxLibrary';
import { SmartInsights } from './SmartInsights';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TaxCalculator = () => {
  const { user, profile, signOut } = useAuth();
  
  const [age, setAge] = useState<number>(30);
  const [taxpayerName, setTaxpayerName] = useState<string>('');
  const [income, setIncome] = useState<IncomeData>({
    salary: 0,
    basicSalary: 0,
    businessIncome: 0,
    capitalGains: [],
    otherSources: 0,
    houseProperty: {
      annualRentReceived: 0,
      municipalTaxes: 0,
      repairMaintenance: 0,
      interestOnLoan: 0,
      otherExpenses: 0,
      isLetOut: false,
      selfOccupiedCount: 1
    }
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

  const [tdsData, setTDSData] = useState<TDSData>({
    salary: 0,
    professionalServices: 0,
    interestFromBank: 0,
    rentReceived: 0,
    otherTDS: 0
  });

  const [tcsData, setTCSData] = useState<TCSData>({
    saleOfGoods: 0,
    foreignRemittance: 0,
    motorVehicles: 0,
    jewelryPurchase: 0,
    hotelBills: 0,
    otherTCS: 0
  });

  const [carryForwardLosses, setCarryForwardLosses] = useState<CarryForwardLoss[]>([]);
  const [activeTab, setActiveTab] = useState('income');
  const [showResults, setShowResults] = useState(false);
  const [anomalies, setAnomalies] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleIncomeUpdate = useCallback((newIncome: IncomeData) => {
    setIncome(newIncome);
    
    // Smart validation and anomaly detection
    const newAnomalies = [];
    const newSuggestions = [];

    const totalCapitalGains = newIncome.capitalGains.reduce((sum, gain) => sum + gain.amount, 0);

    // Anomaly detection
    if (newIncome.salary > 1000000 && deductions.section80C < 100000) {
      newAnomalies.push("High salary detected but Section 80C investments seem low");
    }
    if (newIncome.basicSalary > 0 && deductions.hra === 0 && newIncome.salary > 300000) {
      newAnomalies.push("You might be eligible for HRA deduction");
    }
    if (newIncome.salary > 500000 && deductions.section80D === 0) {
      newSuggestions.push("Consider health insurance for Section 80D benefits");
    }
    if (totalCapitalGains > 100000 && tdsData.salary === 0) {
      newSuggestions.push("Consider advance tax payment for capital gains");
    }

    setAnomalies(newAnomalies);
    setSuggestions(newSuggestions);
  }, [deductions, tdsData]);

  const handleDeductionsUpdate = useCallback((newDeductions: DeductionData) => {
    setDeductions(newDeductions);
  }, []);

  const handleAgeUpdate = useCallback((newAge: number) => {
    setAge(newAge);
  }, []);

  const handleTaxpayerNameUpdate = useCallback((newName: string) => {
    setTaxpayerName(newName);
  }, []);

  const oldRegimeResult = calculateOldRegimeTax(income, deductions, age, tdsData, tcsData, carryForwardLosses);
  const newRegimeResult = calculateNewRegimeTax(income, deductions, age, tdsData, tcsData, carryForwardLosses);
  const recommendation = getOptimalRegime(oldRegimeResult, newRegimeResult);

  const handleCalculate = useCallback(() => {
    setShowResults(true);
    setActiveTab('results');
  }, []);

  const totalIncome = income.salary + income.businessIncome + 
                     income.capitalGains.reduce((sum, gain) => sum + gain.amount, 0) + 
                     income.otherSources + Math.max(0, oldRegimeResult.housePropertyIncome);
  const hasValidIncome = totalIncome > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Smart Tax Calculator Pro</h1>
                <p className="text-sm text-slate-400">FY 2024-25 • AI-Powered • Comprehensive Tax Planning</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-600/30">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
              </div>
              <Button 
                onClick={signOut} 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-2xl px-4 py-2 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Smart Alerts */}
          {anomalies.length > 0 && (
            <Alert className="mb-6 bg-amber-500/10 border-amber-500/20 rounded-2xl">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-200">
                <div className="space-y-1">
                  {anomalies.map((anomaly, index) => (
                    <div key={index}>• {anomaly}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {suggestions.length > 0 && (
            <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 rounded-2xl">
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <div key={index}>💡 {suggestion}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-9 mb-8 bg-slate-800/50 border border-slate-600/30 rounded-2xl p-1 backdrop-blur-sm">
              <TabsTrigger value="income" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Calculator className="w-4 h-4" />
                Income
              </TabsTrigger>
              <TabsTrigger value="house-property" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Home className="w-4 h-4" />
                Property
              </TabsTrigger>
              <TabsTrigger value="capital-gains" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Calculator className="w-4 h-4" />
                Capital Gains
              </TabsTrigger>
              <TabsTrigger value="deductions" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Calculator className="w-4 h-4" />
                Deductions
              </TabsTrigger>
              <TabsTrigger value="tds-tcs" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Receipt className="w-4 h-4" />
                TDS/TCS
              </TabsTrigger>
              <TabsTrigger value="losses" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <TrendingDown className="w-4 h-4" />
                Losses
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <Lightbulb className="w-4 h-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!hasValidIncome} className="flex items-center gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300">
                <ChartBar className="w-4 h-4" />
                Results
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
                    <div className="w-8 h-8 bg-slate-600 rounded-2xl flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    Personal & Income Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-slate-300 font-medium">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age || ''}
                        onChange={(e) => handleAgeUpdate(Number(e.target.value) || 0)}
                        min="18"
                        max="100"
                        className="bg-slate-700/50 border-slate-600/50 text-white rounded-2xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200"
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

            <TabsContent value="house-property" className="space-y-6">
              <HousePropertyEntry 
                houseProperty={income.houseProperty} 
                setHouseProperty={(data) => setIncome({...income, houseProperty: data})} 
              />
            </TabsContent>

            <TabsContent value="capital-gains" className="space-y-6">
              <CapitalGainsEntry 
                capitalGains={income.capitalGains} 
                setCapitalGains={(gains) => setIncome({...income, capitalGains: gains})} 
              />
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

            <TabsContent value="tds-tcs" className="space-y-6">
              <TDSTCSEntry 
                tdsData={tdsData} 
                setTDSData={setTDSData}
                tcsData={tcsData}
                setTCSData={setTCSData}
              />
            </TabsContent>

            <TabsContent value="losses" className="space-y-6">
              <CarryForwardLossEntry 
                carryForwardLosses={carryForwardLosses} 
                setCarryForwardLosses={setCarryForwardLosses} 
              />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <SmartInsights 
                income={income} 
                deductions={deductions} 
                age={age} 
                oldRegimeResult={oldRegimeResult} 
                newRegimeResult={newRegimeResult} 
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
