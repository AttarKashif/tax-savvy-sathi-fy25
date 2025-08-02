
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator, ChartBar, HelpCircle, Lightbulb, TrendingDown, Receipt, Home } from 'lucide-react';
import { IncomeData, DeductionData, TDSData, TCSData, HousePropertyData, CarryForwardLoss, calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';
import { TaxComparison } from './TaxComparison';
import { IncomeEntry } from './IncomeEntry';
import { DeductionEntry } from './DeductionEntry';
import { CapitalGainsEntry } from './CapitalGainsEntry';
import { TDSTCSEntry } from './TDSEntry';
import { CarryForwardLossEntry } from './CarryForwardLossEntry';
import { HousePropertyEntry } from './HousePropertyEntry';
import { HelpManual } from './HelpManual';
import { SmartInsights } from './SmartInsights';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TaxCalculator = () => {
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
    <div className="uniform-page-container">
      <div className="uniform-content-wrapper">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Tax Calculator</h1>
                <p className="text-sm text-muted-foreground">FY 2024-25 with AI-powered insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="keyboard-shortcut">Ctrl+Enter</span>
              <span>to calculate</span>
            </div>
          </div>
        </div>

        {/* Smart Alerts */}
        {(anomalies.length > 0 || suggestions.length > 0) && (
          <div className="mb-6 space-y-3">
            {anomalies.length > 0 && (
              <Alert className="uniform-alert-warning border-l-4 border-l-yellow-500">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium flex items-center gap-2">
                      ⚠️ Potential Issues Detected
                    </div>
                    {anomalies.map((anomaly, index) => (
                      <div key={index} className="text-sm pl-6">• {anomaly}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {suggestions.length > 0 && (
              <Alert className="uniform-alert-info border-l-4 border-l-blue-500">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium flex items-center gap-2">
                      💡 Smart Recommendations
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm pl-6">• {suggestion}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-8 bg-muted/50 p-1 h-auto">
            <TabsTrigger value="income" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Calculator className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Income</span>
            </TabsTrigger>
            <TabsTrigger value="house-property" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Home className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Property</span>
            </TabsTrigger>
            <TabsTrigger value="capital-gains" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Calculator className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Capital</span>
            </TabsTrigger>
            <TabsTrigger value="deductions" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Calculator className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Deductions</span>
            </TabsTrigger>
            <TabsTrigger value="tds-tcs" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Receipt className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">TDS/TCS</span>
            </TabsTrigger>
            <TabsTrigger value="losses" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Losses</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!hasValidIncome} className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm disabled:opacity-50">
              <ChartBar className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <HelpCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Help</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="uniform-tab-content">
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle className="flex items-center gap-3">
                  <Calculator className="w-5 h-5" />
                  Personal & Income Details
                </CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="uniform-form-grid mb-6">
                  <div className="uniform-input-group">
                    <Label htmlFor="age" className="uniform-input-label">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age || ''}
                      onChange={(e) => handleAgeUpdate(Number(e.target.value) || 0)}
                      min="18"
                      max="100"
                      placeholder="Enter your age"
                      className="uniform-focus-input"
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

          <TabsContent value="house-property" className="uniform-tab-content">
            <HousePropertyEntry 
              houseProperty={income.houseProperty} 
              setHouseProperty={(data) => setIncome({...income, houseProperty: data})} 
            />
          </TabsContent>

          <TabsContent value="capital-gains" className="uniform-tab-content">
            <CapitalGainsEntry 
              capitalGains={income.capitalGains} 
              setCapitalGains={(gains) => setIncome({...income, capitalGains: gains})} 
            />
          </TabsContent>

          <TabsContent value="deductions" className="uniform-tab-content">
            <DeductionEntry 
              deductions={deductions} 
              setDeductions={handleDeductionsUpdate} 
              income={income} 
              onCalculate={handleCalculate} 
              hasValidIncome={hasValidIncome} 
              age={age} 
            />
          </TabsContent>

          <TabsContent value="tds-tcs" className="uniform-tab-content">
            <TDSTCSEntry 
              tdsData={tdsData} 
              setTDSData={setTDSData}
              tcsData={tcsData}
              setTCSData={setTCSData}
            />
          </TabsContent>

          <TabsContent value="losses" className="uniform-tab-content">
            <CarryForwardLossEntry 
              carryForwardLosses={carryForwardLosses} 
              setCarryForwardLosses={setCarryForwardLosses} 
            />
          </TabsContent>

          <TabsContent value="insights" className="uniform-tab-content">
            <SmartInsights 
              income={income} 
              deductions={deductions} 
              age={age} 
              oldRegimeResult={oldRegimeResult} 
              newRegimeResult={newRegimeResult} 
            />
          </TabsContent>

          <TabsContent value="results" className="uniform-tab-content">
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

          <TabsContent value="help" className="uniform-tab-content">
            <HelpManual />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
