import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Info, TrendingUp } from 'lucide-react';
import { DeductionData } from '@/utils/taxCalculations';
import { 
  calculateMaxHRA, 
  calculateSection80C, 
  calculateSection80D,
  calculateHomeLoanInterest,
  calculateSection80TTA,
  calculateNPSDeduction,
  HRACalculationData,
  Section80COptions,
  Section80DOptions
} from '@/utils/deductionCalculations';

interface DeductionCalculatorProps {
  onDeductionsUpdate: (deductions: DeductionData) => void;
  currentDeductions: DeductionData;
  basicSalary?: number;
}

export const DeductionCalculator: React.FC<DeductionCalculatorProps> = ({ 
  onDeductionsUpdate, 
  currentDeductions,
  basicSalary = 0 
}) => {
  // HRA State
  const [hraData, setHraData] = useState<HRACalculationData>({
    basicSalary,
    hraReceived: 0,
    rentPaid: 0,
    isMetroCity: false
  });

  // Section 80C State
  const [section80C, setSection80C] = useState<Section80COptions>({
    ppf: 0,
    elss: 0,
    lic: 0,
    nsc: 0,
    taxSaverFD: 0,
    tuitionFees: 0,
    homeLoanPrincipal: 0,
    sukanyaSamriddhi: 0
  });

  // Section 80D State
  const [section80D, setSection80D] = useState<Section80DOptions>({
    selfAndFamily: 0,
    parents: 0,
    preventiveHealthCheckup: 0,
    isParentSenior: false,
    isSelfSenior: false
  });

  // Other deductions
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);
  const [savingsInterest, setSavingsInterest] = useState(0);
  const [npsContribution, setNpsContribution] = useState(0);
  const [lta, setLta] = useState(0);
  const [userAge, setUserAge] = useState(30);

  // Update basic salary when it changes
  useEffect(() => {
    setHraData(prev => ({ ...prev, basicSalary }));
  }, [basicSalary]);

  // Calculate and update deductions whenever inputs change
  useEffect(() => {
    const hraDeduction = calculateMaxHRA(hraData);
    const section80CResult = calculateSection80C(section80C);
    const section80DResult = calculateSection80D(section80D);
    const homeLoanDeduction = calculateHomeLoanInterest(homeLoanInterest);
    const savingsDeduction = calculateSection80TTA(savingsInterest, userAge);
    const npsDeduction = calculateNPSDeduction(npsContribution);

    const newDeductions: DeductionData = {
      section80C: section80CResult.total,
      section80D: section80DResult.total,
      hra: hraDeduction,
      lta: lta,
      homeLoanInterest: homeLoanDeduction,
      section80TTA: savingsDeduction,
      nps: npsDeduction
    };

    onDeductionsUpdate(newDeductions);
  }, [hraData, section80C, section80D, homeLoanInterest, savingsInterest, npsContribution, lta, userAge, onDeductionsUpdate]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const calculations = {
    hraDeduction: calculateMaxHRA(hraData),
    section80CResult: calculateSection80C(section80C),
    section80DResult: calculateSection80D(section80D),
    homeLoanDeduction: calculateHomeLoanInterest(homeLoanInterest),
    savingsDeduction: calculateSection80TTA(savingsInterest, userAge),
    npsDeduction: calculateNPSDeduction(npsContribution),
    totalDeductions: currentDeductions.hra + currentDeductions.section80C + currentDeductions.section80D + 
                    currentDeductions.homeLoanInterest + currentDeductions.section80TTA + (currentDeductions.nps || 0) + currentDeductions.lta
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Smart Deduction Calculator (FY 2024-25)
        </h2>
        <p className="text-blue-700">Calculate maximum eligible deductions according to Indian Income Tax Act</p>
      </div>

      <Tabs defaultValue="hra" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hra">HRA</TabsTrigger>
          <TabsTrigger value="80c">Section 80C</TabsTrigger>
          <TabsTrigger value="80d">Section 80D</TabsTrigger>
          <TabsTrigger value="others">Others</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="hra" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <TrendingUp className="w-5 h-5" />
                House Rent Allowance (HRA) - Applicable for Both Regimes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-lg text-sm">
                <p className="text-amber-800">
                  <strong>Note:</strong> HRA exemption is available in both Old and New Tax Regimes. 
                  The exemption is minimum of: Actual HRA received, 50%/40% of basic salary, or Rent paid minus 10% of basic salary.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basicSalary">Basic Salary (Annual)</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={hraData.basicSalary || ''}
                    onChange={(e) => setHraData(prev => ({ ...prev, basicSalary: Number(e.target.value) || 0 }))}
                    placeholder="Enter basic salary"
                  />
                </div>
                <div>
                  <Label htmlFor="hraReceived">HRA Received (Annual)</Label>
                  <Input
                    id="hraReceived"
                    type="number"
                    value={hraData.hraReceived || ''}
                    onChange={(e) => setHraData(prev => ({ ...prev, hraReceived: Number(e.target.value) || 0 }))}
                    placeholder="Enter HRA received"
                  />
                </div>
                <div>
                  <Label htmlFor="rentPaid">Rent Paid (Annual)</Label>
                  <Input
                    id="rentPaid"
                    type="number"
                    value={hraData.rentPaid || ''}
                    onChange={(e) => setHraData(prev => ({ ...prev, rentPaid: Number(e.target.value) || 0 }))}
                    placeholder="Enter rent paid"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={hraData.isMetroCity}
                    onCheckedChange={(checked) => setHraData(prev => ({ ...prev, isMetroCity: checked }))}
                  />
                  <Label>Metro City (Mumbai, Delhi, Chennai, Kolkata)</Label>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">HRA Calculation Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <p>• Actual HRA received: {formatCurrency(hraData.hraReceived)}</p>
                  <p>• {hraData.isMetroCity ? '50%' : '40%'} of basic salary: {formatCurrency(hraData.basicSalary * (hraData.isMetroCity ? 0.5 : 0.4))}</p>
                  <p>• Rent paid minus 10% of basic: {formatCurrency(Math.max(0, hraData.rentPaid - hraData.basicSalary * 0.1))}</p>
                </div>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Maximum HRA Exemption: {formatCurrency(calculations.hraDeduction)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="80c" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Section 80C - Investment Deductions (Max: ₹1.5 Lakh) - Old Regime Only</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(section80C).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <Input
                      id={key}
                      type="number"
                      value={value || ''}
                      onChange={(e) => setSection80C(prev => ({ ...prev, [key]: Number(e.target.value) || 0 }))}
                      placeholder={`Enter ${key} amount`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Section 80C Summary</h3>
                <p className="text-lg">Total Investments: {formatCurrency(Object.values(section80C).reduce((sum, val) => sum + val, 0))}</p>
                <p className="text-lg font-bold text-blue-600">
                  Eligible Deduction: {formatCurrency(calculations.section80CResult.total)}
                  {calculations.section80CResult.maxReached && <span className="text-green-600 ml-2">✓ Maximum limit reached</span>}
                </p>
                {!calculations.section80CResult.maxReached && (
                  <p className="text-sm text-gray-600">
                    You can invest {formatCurrency(150000 - calculations.section80CResult.total)} more to reach the maximum limit
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="80d" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Section 80D - Medical Insurance - Old Regime Only</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="selfFamily">Self & Family Premium</Label>
                  <Input
                    id="selfFamily"
                    type="number"
                    value={section80D.selfAndFamily || ''}
                    onChange={(e) => setSection80D(prev => ({ ...prev, selfAndFamily: Number(e.target.value) || 0 }))}
                    placeholder="Premium for self and family"
                  />
                </div>
                <div>
                  <Label htmlFor="parents">Parents Premium</Label>
                  <Input
                    id="parents"
                    type="number"
                    value={section80D.parents || ''}
                    onChange={(e) => setSection80D(prev => ({ ...prev, parents: Number(e.target.value) || 0 }))}
                    placeholder="Premium for parents"
                  />
                </div>
                <div>
                  <Label htmlFor="healthCheckup">Preventive Health Checkup</Label>
                  <Input
                    id="healthCheckup"
                    type="number"
                    value={section80D.preventiveHealthCheckup || ''}
                    onChange={(e) => setSection80D(prev => ({ ...prev, preventiveHealthCheckup: Number(e.target.value) || 0 }))}
                    placeholder="Health checkup expenses"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section80D.isSelfSenior}
                    onCheckedChange={(checked) => setSection80D(prev => ({ ...prev, isSelfSenior: checked }))}
                  />
                  <Label>You are Senior Citizen (60+)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section80D.isParentSenior}
                    onCheckedChange={(checked) => setSection80D(prev => ({ ...prev, isParentSenior: checked }))}
                  />
                  <Label>Parents are Senior Citizens</Label>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Section 80D Summary</h3>
                <div className="space-y-1 text-sm">
                  <p>• Self & Family: {formatCurrency(calculations.section80DResult.breakdown.selfAndFamily)} (Limit: {formatCurrency(calculations.section80DResult.limits.selfLimit)})</p>
                  <p>• Parents: {formatCurrency(calculations.section80DResult.breakdown.parents)} (Limit: {formatCurrency(calculations.section80DResult.limits.parentLimit)})</p>
                  <p>• Health Checkup: {formatCurrency(calculations.section80DResult.breakdown.preventiveHealthCheckup)} (Limit: {formatCurrency(calculations.section80DResult.limits.healthCheckupLimit)})</p>
                </div>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Total Deduction: {formatCurrency(calculations.section80DResult.total)}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="others" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Home Loan Interest (Section 24b) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="homeLoan">Annual Interest (Max: ₹2 Lakh for self-occupied)</Label>
                <Input
                  id="homeLoan"
                  type="number"
                  value={homeLoanInterest || ''}
                  onChange={(e) => setHomeLoanInterest(Number(e.target.value) || 0)}
                  placeholder="Enter home loan interest"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Eligible: {formatCurrency(calculations.homeLoanDeduction)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-600">Savings Interest (80TTA/80TTB) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="savings">Annual Savings Interest</Label>
                <Input
                  id="savings"
                  type="number"
                  value={savingsInterest || ''}
                  onChange={(e) => setSavingsInterest(Number(e.target.value) || 0)}
                  placeholder="Enter savings account interest"
                />
                <div className="mt-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userAge || ''}
                    onChange={(e) => setUserAge(Number(e.target.value) || 30)}
                    placeholder="Enter your age"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Limit: {formatCurrency(userAge >= 60 ? 50000 : 10000)} | Eligible: {formatCurrency(calculations.savingsDeduction)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">NPS (80CCD-1B) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="nps">Additional NPS Contribution (Max: ₹50,000)</Label>
                <Input
                  id="nps"
                  type="number"
                  value={npsContribution || ''}
                  onChange={(e) => setNpsContribution(Number(e.target.value) || 0)}
                  placeholder="Enter additional NPS contribution"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Eligible: {formatCurrency(calculations.npsDeduction)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-teal-600">Leave Travel Allowance (LTA) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="lta">LTA Exemption</Label>
                <Input
                  id="lta"
                  type="number"
                  value={lta || ''}
                  onChange={(e) => setLta(Number(e.target.value) || 0)}
                  placeholder="Enter LTA exemption"
                />
                <p className="text-sm text-gray-600 mt-2">
                  As per actual bills for domestic travel
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Total Deductions Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-600">Applicable to Both Regimes:</h3>
                  <div className="flex justify-between">
                    <span>HRA Exemption:</span>
                    <span className="font-semibold">{formatCurrency(calculations.hraDeduction)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-yellow-600">Old Regime Only:</h3>
                  <div className="flex justify-between">
                    <span>Section 80C:</span>
                    <span className="font-semibold">{formatCurrency(calculations.section80CResult.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section 80D:</span>
                    <span className="font-semibold">{formatCurrency(calculations.section80DResult.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home Loan Interest:</span>
                    <span className="font-semibold">{formatCurrency(calculations.homeLoanDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Savings Interest:</span>
                    <span className="font-semibold">{formatCurrency(calculations.savingsDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NPS (80CCD-1B):</span>
                    <span className="font-semibold">{formatCurrency(calculations.npsDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LTA:</span>
                    <span className="font-semibold">{formatCurrency(lta)}</span>
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>Total Deductions:</span>
                <span>{formatCurrency(calculations.totalDeductions)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
