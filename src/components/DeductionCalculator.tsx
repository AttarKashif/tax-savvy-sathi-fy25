import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Info, TrendingUp, Shield, Heart, GraduationCap, Home, Gift, Building, Car } from 'lucide-react';
import { DeductionData } from '@/utils/taxCalculations';
import { 
  calculateMaxHRA, 
  calculateSection80C, 
  calculateSection80D,
  calculateSection80DDB,
  calculateSection80DD,
  calculateSection80U,
  calculateSection80E,
  calculateSection80EE,
  calculateSection80EEA,
  calculateSection80G,
  calculateSection80GG,
  calculateSection80TTA,
  calculateHomeLoanInterest,
  calculateNPSDeduction,
  calculateChildEducationAllowance,
  calculateChildHostelAllowance,
  calculateMealVouchers,
  calculateGratuity,
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
    sukanyaSamriddhi: 0,
    epf: 0,
    ulip: 0
  });

  // Section 80D State
  const [section80D, setSection80D] = useState<Section80DOptions>({
    selfAndFamily: 0,
    parents: 0,
    preventiveHealthCheckup: 0,
    isParentSenior: false,
    isSelfSenior: false
  });

  // Other Section 80 Deductions
  const [section80DDB, setSection80DDB] = useState(0);
  const [section80DD, setSection80DD] = useState({ amount: 0, isSevere: false });
  const [section80U, setSection80U] = useState({ amount: 0, isSevere: false });
  const [section80E, setSection80E] = useState(0);
  const [section80EE, setSection80EE] = useState(0);
  const [section80EEA, setSection80EEA] = useState(0);
  const [section80G, setSection80G] = useState(0);
  const [section80GG, setSection80GG] = useState({ rentPaid: 0, totalIncome: 0 });
  const [section80TTA, setSection80TTA] = useState(0);
  const [section80CCG, setSection80CCG] = useState(0);
  const [section80CCC, setSection80CCC] = useState(0);
  const [section80CCD, setSection80CCD] = useState(0);

  // Salary Exemptions
  const [lta, setLta] = useState(0);
  const [childEducation, setChildEducation] = useState(0);
  const [childHostel, setChildHostel] = useState(0);
  const [mealVouchers, setMealVouchers] = useState(0);
  const [professionalTax, setProfessionalTax] = useState(0);

  // Other deductions
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);
  const [npsContribution, setNpsContribution] = useState(0);
  const [gratuity, setGratuity] = useState({ salary: 0, years: 0, actual: 0 });
  const [leaveEncashment, setLeaveEncashment] = useState(0);
  const [userAge, setUserAge] = useState(30);

  // Update basic salary when it changes
  useEffect(() => {
    setHraData(prev => ({ ...prev, basicSalary }));
  }, [basicSalary]);

  // Memoized calculations
  const calculations = useMemo(() => {
    const hraDeduction = calculateMaxHRA(hraData);
    const section80CResult = calculateSection80C(section80C);
    const section80DResult = calculateSection80D(section80D);
    const section80DDBResult = calculateSection80DDB(section80DDB, userAge);
    const section80DDResult = section80DD.amount > 0 ? calculateSection80DD(section80DD.isSevere) : 0;
    const section80UResult = section80U.amount > 0 ? calculateSection80U(section80U.isSevere) : 0;
    const section80EResult = calculateSection80E(section80E);
    const section80EEResult = calculateSection80EE(section80EE);
    const section80EEAResult = calculateSection80EEA(section80EEA);
    const section80GResult = calculateSection80G(section80G, 1000000); // Assuming 10L income for calculation
    const section80GGResult = calculateSection80GG(section80GG.rentPaid, section80GG.totalIncome);
    const section80TTAResult = calculateSection80TTA(section80TTA, userAge);
    const homeLoanDeduction = calculateHomeLoanInterest(homeLoanInterest);
    const npsDeduction = calculateNPSDeduction(npsContribution);
    const childEducationDeduction = calculateChildEducationAllowance(childEducation);
    const childHostelDeduction = calculateChildHostelAllowance(childHostel);
    const mealVoucherDeduction = calculateMealVouchers(mealVouchers);
    const gratuityDeduction = calculateGratuity(gratuity.salary, gratuity.years, gratuity.actual);
    
    return {
      hraDeduction,
      section80CResult,
      section80DResult,
      section80DDBResult,
      section80DDResult,
      section80UResult,
      section80EResult,
      section80EEResult,
      section80EEAResult,
      section80GResult,
      section80GGResult,
      section80TTAResult,
      homeLoanDeduction,
      npsDeduction,
      childEducationDeduction,
      childHostelDeduction,
      mealVoucherDeduction,
      gratuityDeduction
    };
  }, [hraData, section80C, section80D, section80DDB, section80DD, section80U, section80E, section80EE, 
      section80EEA, section80G, section80GG, section80TTA, homeLoanInterest, npsContribution, 
      childEducation, childHostel, mealVouchers, gratuity, userAge]);

  // Update deductions when calculations change
  useEffect(() => {
    const newDeductions: DeductionData = {
      section80C: calculations.section80CResult.total,
      section80D: calculations.section80DResult.total,
      hra: calculations.hraDeduction,
      lta: lta,
      homeLoanInterest: calculations.homeLoanDeduction,
      section80TTA: calculations.section80TTAResult,
      nps: calculations.npsDeduction,
      professionalTax,
      section80E: calculations.section80EResult,
      section80G: calculations.section80GResult,
      section80EE: calculations.section80EEResult,
      section80EEA: calculations.section80EEAResult,
      section80U: calculations.section80UResult,
      section80DDB: calculations.section80DDBResult,
      section80CCG: section80CCG,
      section80CCC: section80CCC,
      section80CCD: section80CCD,
      gratuity: calculations.gratuityDeduction,
      leaveEncashment
    };

    const hasChanged = Object.keys(newDeductions).some(
      key => newDeductions[key as keyof DeductionData] !== currentDeductions[key as keyof DeductionData]
    );

    if (hasChanged) {
      onDeductionsUpdate(newDeductions);
    }
  }, [calculations, lta, professionalTax, leaveEncashment, section80CCG, section80CCC, section80CCD, currentDeductions, onDeductionsUpdate]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const totalDeductions = currentDeductions.hra + currentDeductions.section80C + currentDeductions.section80D + 
                         currentDeductions.homeLoanInterest + currentDeductions.section80TTA + currentDeductions.nps +
                         currentDeductions.professionalTax + currentDeductions.section80E + currentDeductions.section80G +
                         currentDeductions.section80EE + currentDeductions.section80EEA + currentDeductions.section80U +
                         currentDeductions.section80DDB + currentDeductions.section80CCG + currentDeductions.section80CCC +
                         currentDeductions.section80CCD + currentDeductions.gratuity + currentDeductions.leaveEncashment +
                         currentDeductions.lta;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Comprehensive Tax Deduction Calculator (FY 2024-25)
        </h2>
        <p className="text-blue-700">Complete deduction calculator with all applicable sections and exemptions</p>
        <div className="mt-2 text-sm">
          <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2">Old Regime Only</span>
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">Both Regimes</span>
        </div>
      </div>

      <Tabs defaultValue="salary-exemptions" className="w-full">
        <TabsList className="grid w-full grid-cols-5 text-xs">
          <TabsTrigger value="salary-exemptions">Salary Exemptions</TabsTrigger>
          <TabsTrigger value="section-80">Section 80 Deductions</TabsTrigger>
          <TabsTrigger value="other-deductions">Other Deductions</TabsTrigger>
          <TabsTrigger value="exemptions">Exemptions</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="salary-exemptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HRA Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Home className="w-5 h-5" />
                  HRA - <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Old Regime Only</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
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
                    <Label htmlFor="hraReceived">HRA Received</Label>
                    <Input
                      id="hraReceived"
                      type="number"
                      value={hraData.hraReceived || ''}
                      onChange={(e) => setHraData(prev => ({ ...prev, hraReceived: Number(e.target.value) || 0 }))}
                      placeholder="Enter HRA received"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rentPaid">Rent Paid</Label>
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
                    <Label>Metro City</Label>
                  </div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">
                    HRA Exemption: {formatCurrency(calculations.hraDeduction)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* LTA Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">LTA - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="lta">Leave Travel Allowance</Label>
                <Input
                  id="lta"
                  type="number"
                  value={lta || ''}
                  onChange={(e) => setLta(Number(e.target.value) || 0)}
                  placeholder="Enter LTA amount"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Actual domestic travel expenses, 1 trip per calendar year
                </p>
              </CardContent>
            </Card>

            {/* Professional Tax */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Professional Tax - Both Regimes</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="professionalTax">Professional Tax Paid</Label>
                <Input
                  id="professionalTax"
                  type="number"
                  value={professionalTax || ''}
                  onChange={(e) => setProfessionalTax(Number(e.target.value) || 0)}
                  placeholder="Enter professional tax"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max: ₹2,500 per year
                </p>
              </CardContent>
            </Card>

            {/* Child Education Allowance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Child Education - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="childEducation">Number of Children (Max 2)</Label>
                <Input
                  id="childEducation"
                  type="number"
                  value={childEducation || ''}
                  onChange={(e) => setChildEducation(Math.min(Number(e.target.value) || 0, 2))}
                  placeholder="Enter number of children"
                  max="2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  ₹100/month per child. Exemption: {formatCurrency(calculations.childEducationDeduction)}
                </p>
              </CardContent>
            </Card>

            {/* Child Hostel Allowance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Child Hostel - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="childHostel">Number of Children in Hostel (Max 2)</Label>
                <Input
                  id="childHostel"
                  type="number"
                  value={childHostel || ''}
                  onChange={(e) => setChildHostel(Math.min(Number(e.target.value) || 0, 2))}
                  placeholder="Enter number of children"
                  max="2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  ₹300/month per child. Exemption: {formatCurrency(calculations.childHostelDeduction)}
                </p>
              </CardContent>
            </Card>

            {/* Meal Vouchers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Meal Vouchers - Both Regimes</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="mealVouchers">Number of Meals per Day</Label>
                <Input
                  id="mealVouchers"
                  type="number"
                  value={mealVouchers || ''}
                  onChange={(e) => setMealVouchers(Math.min(Number(e.target.value) || 0, 2))}
                  placeholder="Enter meals per day"
                  max="2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  ₹50/meal, max 2 meals/day. Annual: {formatCurrency(calculations.mealVoucherDeduction)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="section-80" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 80C */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-blue-600">Section 80C - Investment Deductions (Max: ₹1.5 Lakh) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(section80C).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key}>
                        {key === 'ppf' ? 'PPF' :
                         key === 'elss' ? 'ELSS' :
                         key === 'lic' ? 'LIC Premium' :
                         key === 'nsc' ? 'NSC' :
                         key === 'taxSaverFD' ? 'Tax Saver FD' :
                         key === 'tuitionFees' ? 'Tuition Fees' :
                         key === 'homeLoanPrincipal' ? 'Home Loan Principal' :
                         key === 'sukanyaSamriddhi' ? 'Sukanya Samriddhi' :
                         key === 'epf' ? 'EPF' :
                         key === 'ulip' ? 'ULIP' : key}
                      </Label>
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
                  <p className="text-lg font-bold text-blue-600">
                    Total Deduction: {formatCurrency(calculations.section80CResult.total)}
                    {calculations.section80CResult.maxReached && <span className="text-green-600 ml-2">✓ Maximum reached</span>}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 80D */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Heart className="w-5 h-5" />
                  Section 80D - Health Insurance - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="selfFamily">Self & Family Premium</Label>
                    <Input
                      id="selfFamily"
                      type="number"
                      value={section80D.selfAndFamily === 0 ? '' : section80D.selfAndFamily}
                      onChange={(e) => setSection80D(prev => ({ ...prev, selfAndFamily: Number(e.target.value) || 0 }))}
                      placeholder="Premium for self and family"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parents">Parents Premium</Label>
                    <Input
                      id="parents"
                      type="number"
                      value={section80D.parents === 0 ? '' : section80D.parents}
                      onChange={(e) => setSection80D(prev => ({ ...prev, parents: Number(e.target.value) || 0 }))}
                      placeholder="Premium for parents"
                    />
                  </div>
                  <div>
                    <Label htmlFor="healthCheckup">Preventive Health Checkup</Label>
                    <Input
                      id="healthCheckup"
                      type="number"
                      value={section80D.preventiveHealthCheckup === 0 ? '' : section80D.preventiveHealthCheckup}
                      onChange={(e) => setSection80D(prev => ({ ...prev, preventiveHealthCheckup: Number(e.target.value) || 0 }))}
                      placeholder="Health checkup expenses"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
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

            {/* Section 80E */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <GraduationCap className="w-5 h-5" />
                  Section 80E - Education Loan - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80E">Education Loan Interest</Label>
                <Input
                  id="section80E"
                  type="number"
                  value={section80E || ''}
                  onChange={(e) => setSection80E(Number(e.target.value) || 0)}
                  placeholder="Enter education loan interest"
                />
                <p className="text-sm text-gray-600 mt-2">
                  No upper limit (max 8 years). Deduction: {formatCurrency(calculations.section80EResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80G */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <Gift className="w-5 h-5" />
                  Section 80G - Donations - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80G">Charitable Donations</Label>
                <Input
                  id="section80G"
                  type="number"
                  value={section80G || ''}
                  onChange={(e) => setSection80G(Number(e.target.value) || 0)}
                  placeholder="Enter donation amount"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max 10% of AGTI. Deduction: {formatCurrency(calculations.section80GResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80U */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <Shield className="w-5 h-5" />
                  Section 80U - Self Disability - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section80U.amount > 0}
                    onCheckedChange={(checked) => setSection80U(prev => ({ ...prev, amount: checked ? 1 : 0 }))}
                  />
                  <Label>Claim Disability Deduction</Label>
                </div>
                {section80U.amount > 0 && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section80U.isSevere}
                      onCheckedChange={(checked) => setSection80U(prev => ({ ...prev, isSevere: checked }))}
                    />
                    <Label>Severe Disability (80%+)</Label>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Deduction: {formatCurrency(calculations.section80UResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80DD */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <Shield className="w-5 h-5" />
                  Section 80DD - Dependent Disability - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section80DD.amount > 0}
                    onCheckedChange={(checked) => setSection80DD(prev => ({ ...prev, amount: checked ? 1 : 0 }))}
                  />
                  <Label>Claim Dependent Disability Deduction</Label>
                </div>
                {section80DD.amount > 0 && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section80DD.isSevere}
                      onCheckedChange={(checked) => setSection80DD(prev => ({ ...prev, isSevere: checked }))}
                    />
                    <Label>Severe Disability (80%+)</Label>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Deduction: {formatCurrency(calculations.section80DDResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80DDB */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Heart className="w-5 h-5" />
                  Section 80DDB - Medical Treatment - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80DDB">Medical Treatment Expenses</Label>
                <Input
                  id="section80DDB"
                  type="number"
                  value={section80DDB || ''}
                  onChange={(e) => setSection80DDB(Number(e.target.value) || 0)}
                  placeholder="Enter medical expenses"
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
                  Limit: {formatCurrency(userAge >= 60 ? 100000 : 40000)}. Eligible: {formatCurrency(calculations.section80DDBResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80EE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Home className="w-5 h-5" />
                  Section 80EE - First Home Loan - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80EE">Home Loan Interest (Additional)</Label>
                <Input
                  id="section80EE"
                  type="number"
                  value={section80EE || ''}
                  onChange={(e) => setSection80EE(Number(e.target.value) || 0)}
                  placeholder="Enter additional home loan interest"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max: ₹50,000 (First-time buyers). Eligible: {formatCurrency(calculations.section80EEResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80EEA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Home className="w-5 h-5" />
                  Section 80EEA - Affordable Housing - Old Regime Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80EEA">Affordable Housing Loan Interest</Label>
                <Input
                  id="section80EEA"
                  type="number"
                  value={section80EEA || ''}
                  onChange={(e) => setSection80EEA(Number(e.target.value) || 0)}
                  placeholder="Enter affordable housing loan interest"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max: ₹1.5 lakh (Property ≤₹45 lakh). Eligible: {formatCurrency(calculations.section80EEAResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80TTA/TTB */}
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-600">Section 80TTA/80TTB - Interest Income - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="savings">Savings/Deposit Interest</Label>
                <Input
                  id="savings"
                  type="number"
                  value={section80TTA || ''}
                  onChange={(e) => setSection80TTA(Number(e.target.value) || 0)}
                  placeholder="Enter savings interest"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Limit: {formatCurrency(userAge >= 60 ? 50000 : 10000)}. Eligible: {formatCurrency(calculations.section80TTAResult)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80CCC */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Section 80CCC - Pension Fund - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80CCC">Pension Fund Contribution</Label>
                <Input
                  id="section80CCC"
                  type="number"
                  value={section80CCC || ''}
                  onChange={(e) => setSection80CCC(Number(e.target.value) || 0)}
                  placeholder="Enter pension fund contribution"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Part of overall ₹1.5 lakh limit (80C + 80CCC + 80CCD)
                </p>
              </CardContent>
            </Card>

            {/* Section 80CCD */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Section 80CCD(1) - Employee NPS - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80CCD">Employee NPS Contribution</Label>
                <Input
                  id="section80CCD"
                  type="number"
                  value={section80CCD || ''}
                  onChange={(e) => setSection80CCD(Number(e.target.value) || 0)}
                  placeholder="Enter employee NPS contribution"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Part of overall ₹1.5 lakh limit (80C + 80CCC + 80CCD)
                </p>
              </CardContent>
            </Card>

            {/* Section 80CCG */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Section 80CCG - Rajiv Gandhi Equity - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="section80CCG">Rajiv Gandhi Equity Savings Scheme</Label>
                <Input
                  id="section80CCG"
                  type="number"
                  value={section80CCG || ''}
                  onChange={(e) => setSection80CCG(Number(e.target.value) || 0)}
                  placeholder="Enter RGESS investment"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max: ₹25,000 (50% of investment, separate from 80C)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="other-deductions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Home Loan Interest */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Home Loan Interest (Section 24b) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="homeLoan">Annual Interest</Label>
                <Input
                  id="homeLoan"
                  type="number"
                  value={homeLoanInterest || ''}
                  onChange={(e) => setHomeLoanInterest(Number(e.target.value) || 0)}
                  placeholder="Enter home loan interest"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max: ₹2 lakh (self-occupied). Eligible: {formatCurrency(calculations.homeLoanDeduction)}
                </p>
              </CardContent>
            </Card>

            {/* NPS Additional */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">NPS Additional (80CCD-1B) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="nps">Additional NPS Contribution</Label>
                <Input
                  id="nps"
                  type="number"
                  value={npsContribution || ''}
                  onChange={(e) => setNpsContribution(Number(e.target.value) || 0)}
                  placeholder="Enter additional NPS contribution"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Max: ₹50,000 (over and above 80C limit). Eligible: {formatCurrency(calculations.npsDeduction)}
                </p>
              </CardContent>
            </Card>

            {/* Section 80GG */}
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-600">Section 80GG - Rent (No HRA) - Old Regime Only</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="section80GGRent">Rent Paid</Label>
                  <Input
                    id="section80GGRent"
                    type="number"
                    value={section80GG.rentPaid || ''}
                    onChange={(e) => setSection80GG(prev => ({ ...prev, rentPaid: Number(e.target.value) || 0 }))}
                    placeholder="Enter rent paid"
                  />
                </div>
                <div>
                  <Label htmlFor="section80GGIncome">Total Income</Label>
                  <Input
                    id="section80GGIncome"
                    type="number"
                    value={section80GG.totalIncome || ''}
                    onChange={(e) => setSection80GG(prev => ({ ...prev, totalIncome: Number(e.target.value) || 0 }))}
                    placeholder="Enter total income"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  For those not receiving HRA. Eligible: {formatCurrency(calculations.section80GGResult)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exemptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gratuity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Gratuity Exemption - Both Regimes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="gratuitySalary">Last Drawn Salary (Monthly)</Label>
                  <Input
                    id="gratuitySalary"
                    type="number"
                    value={gratuity.salary || ''}
                    onChange={(e) => setGratuity(prev => ({ ...prev, salary: Number(e.target.value) || 0 }))}
                    placeholder="Enter monthly salary"
                  />
                </div>
                <div>
                  <Label htmlFor="gratuityYears">Years of Service</Label>
                  <Input
                    id="gratuityYears"
                    type="number"
                    value={gratuity.years || ''}
                    onChange={(e) => setGratuity(prev => ({ ...prev, years: Number(e.target.value) || 0 }))}
                    placeholder="Enter years of service"
                  />
                </div>
                <div>
                  <Label htmlFor="gratuityActual">Actual Gratuity Received</Label>
                  <Input
                    id="gratuityActual"
                    type="number"
                    value={gratuity.actual || ''}
                    onChange={(e) => setGratuity(prev => ({ ...prev, actual: Number(e.target.value) || 0 }))}
                    placeholder="Enter actual gratuity amount"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Formula: 15 days salary × years of service ÷ 26. Max: ₹20 lakh<br/>
                  Exemption: {formatCurrency(calculations.gratuityDeduction)}
                </p>
              </CardContent>
            </Card>

            {/* Leave Encashment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-cyan-600">Leave Encashment - Both Regimes</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="leave">Leave Encashment Amount</Label>
                <Input
                  id="leave"
                  type="number"
                  value={leaveEncashment || ''}
                  onChange={(e) => setLeaveEncashment(Number(e.target.value) || 0)}
                  placeholder="Enter leave encashment amount"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Exempt as per Income Tax rules (conditions apply)
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
                  <h3 className="font-semibold text-green-600">Applicable to Both Regimes:</h3>
                  <div className="flex justify-between">
                    <span>Gratuity:</span>
                    <span className="font-semibold">{formatCurrency(calculations.gratuityDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leave Encashment:</span>
                    <span className="font-semibold">{formatCurrency(leaveEncashment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax:</span>
                    <span className="font-semibold">{formatCurrency(professionalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meal Vouchers:</span>
                    <span className="font-semibold">{formatCurrency(calculations.mealVoucherDeduction)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-600">Old Regime Only:</h3>
                  <div className="flex justify-between">
                    <span>HRA Exemption:</span>
                    <span className="font-semibold">{formatCurrency(calculations.hraDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LTA:</span>
                    <span className="font-semibold">{formatCurrency(lta)}</span>
                  </div>
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
                    <span>Education Loan:</span>
                    <span className="font-semibold">{formatCurrency(calculations.section80EResult)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NPS Additional:</span>
                    <span className="font-semibold">{formatCurrency(calculations.npsDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Section 80:</span>
                    <span className="font-semibold">{formatCurrency(calculations.section80GResult + calculations.section80EEResult + calculations.section80EEAResult + calculations.section80UResult + calculations.section80DDResult + calculations.section80DDBResult + calculations.section80TTAResult)}</span>
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>Total Deductions (Old Regime):</span>
                <span>{formatCurrency(totalDeductions)}</span>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> In New Tax Regime, only Standard Deduction (₹75,000), Gratuity, Leave Encashment, Professional Tax, and Meal Vouchers are allowed.
                  Total New Regime Deductions: {formatCurrency(calculations.gratuityDeduction + leaveEncashment + professionalTax + calculations.mealVoucherDeduction)} + Standard Deduction
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
