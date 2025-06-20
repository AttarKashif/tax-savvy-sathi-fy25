
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3, Lock } from 'lucide-react';
import { DeductionData } from '@/utils/taxCalculations';

interface DeductionCalculatorProps {
  onDeductionsUpdate: (deductions: DeductionData) => void;
  currentDeductions: DeductionData;
  basicSalary: number;
}

export const DeductionCalculator: React.FC<DeductionCalculatorProps> = ({
  onDeductionsUpdate,
  currentDeductions,
  basicSalary
}) => {
  const [deductions, setDeductions] = useState<DeductionData>(currentDeductions);
  const [isEditMode, setIsEditMode] = useState(true);
  const [hraDetails, setHraDetails] = useState({
    monthlyRent: 0,
    cityType: 'metro' as 'metro' | 'non-metro'
  });

  // Update parent component when deductions change
  useEffect(() => {
    onDeductionsUpdate(deductions);
  }, [deductions, onDeductionsUpdate]);

  const updateDeduction = (field: keyof DeductionData, value: number) => {
    if (!isEditMode) return;
    setDeductions(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Calculate HRA exemption
  const calculateHRA = () => {
    if (!basicSalary || !hraDetails.monthlyRent) return 0;
    
    const annualRent = hraDetails.monthlyRent * 12;
    const annualBasic = basicSalary;
    const cityPercentage = hraDetails.cityType === 'metro' ? 0.5 : 0.4;
    
    const hraReceived = annualRent; // Assuming HRA received equals rent paid
    const exemptionLimit1 = hraReceived;
    const exemptionLimit2 = annualRent - (annualBasic * 0.1);
    const exemptionLimit3 = annualBasic * cityPercentage;
    
    const hraExemption = Math.max(0, Math.min(exemptionLimit1, exemptionLimit2, exemptionLimit3));
    
    updateDeduction('hra', hraExemption);
    return hraExemption;
  };

  useEffect(() => {
    if (basicSalary && hraDetails.monthlyRent) {
      calculateHRA();
    }
  }, [basicSalary, hraDetails]);

  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      {/* Edit Mode Toggle */}
      <div className="flex justify-end">
        <Button
          variant={isEditMode ? "destructive" : "outline"}
          onClick={() => setIsEditMode(!isEditMode)}
          className="flex items-center gap-2"
        >
          {isEditMode ? <Lock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditMode ? 'Lock Fields' : 'Edit Fields'}
        </Button>
      </div>

      {/* Chapter VI-A Deductions - Section 80C to 80U */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-600">Chapter VI-A Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 80C Group */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80C Deductions
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Max: ₹1,50,000)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80C">Total 80C Investments</Label>
                <Input
                  id="section80C"
                  type="number"
                  value={deductions.section80C || ''}
                  onChange={(e) => updateDeduction('section80C', Number(e.target.value) || 0)}
                  placeholder="Enter total 80C deductions"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Includes PPF, ELSS, Life Insurance, Home Loan Principal, NSC, Tax Saver FD, etc.
                </p>
                {deductions.section80C > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80C)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80CCC */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80CCC - Pension Fund
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Within 80C limit)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80CCC">Pension Fund Contribution</Label>
                <Input
                  id="section80CCC"
                  type="number"
                  value={deductions.section80CCC || ''}
                  onChange={(e) => updateDeduction('section80CCC', Number(e.target.value) || 0)}
                  placeholder="Enter pension fund contribution"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                {deductions.section80CCC > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80CCC)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80CCD */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80CCD - NPS Contribution
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Within 80C limit)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80CCD">NPS Employee Contribution</Label>
                <Input
                  id="section80CCD"
                  type="number"
                  value={deductions.section80CCD || ''}
                  onChange={(e) => updateDeduction('section80CCD', Number(e.target.value) || 0)}
                  placeholder="Enter NPS employee contribution"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                {deductions.section80CCD > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80CCD)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80D Group */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80D - Health Insurance
                <Badge variant="destructive">Old Regime Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80D">Health Insurance Premium</Label>
                <Input
                  id="section80D"
                  type="number"
                  value={deductions.section80D || ''}
                  onChange={(e) => updateDeduction('section80D', Number(e.target.value) || 0)}
                  placeholder="Enter health insurance premium"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Self & Family: ₹25,000, Parents: ₹25,000 additional (₹50,000 each if senior citizen)
                </p>
                {deductions.section80D > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80D)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80DDB */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80DDB - Medical Treatment
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Max: ₹40,000/₹1,00,000)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80DDB">Medical Treatment Expenses</Label>
                <Input
                  id="section80DDB"
                  type="number"
                  value={deductions.section80DDB || ''}
                  onChange={(e) => updateDeduction('section80DDB', Number(e.target.value) || 0)}
                  placeholder="Enter medical treatment expenses"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  For specified diseases - self/dependent
                </p>
                {deductions.section80DDB > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80DDB)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80E */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80E - Education Loan Interest
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(No Limit)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80E">Education Loan Interest</Label>
                <Input
                  id="section80E"
                  type="number"
                  value={deductions.section80E || ''}
                  onChange={(e) => updateDeduction('section80E', Number(e.target.value) || 0)}
                  placeholder="Enter education loan interest"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Interest on education loan for 8 years
                </p>
                {deductions.section80E > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80E)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80EE & 80EEA */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80EE - First Time Home Buyer
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Max: ₹50,000)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="section80EE">First Time Home Buyer Interest</Label>
                <Input
                  id="section80EE"
                  type="number"
                  value={deductions.section80EE || ''}
                  onChange={(e) => updateDeduction('section80EE', Number(e.target.value) || 0)}
                  placeholder="Enter home loan interest (80EE)"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                {deductions.section80EE > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80EE)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="section80EEA">Affordable Housing Interest (80EEA)</Label>
                <Input
                  id="section80EEA"
                  type="number"
                  value={deductions.section80EEA || ''}
                  onChange={(e) => updateDeduction('section80EEA', Number(e.target.value) || 0)}
                  placeholder="Enter affordable housing interest"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Max ₹1.5 lakh for affordable housing
                </p>
                {deductions.section80EEA > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80EEA)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80G */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80G - Donations
                <Badge variant="destructive">Old Regime Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80G">Charitable Donations</Label>
                <Input
                  id="section80G"
                  type="number"
                  value={deductions.section80G || ''}
                  onChange={(e) => updateDeduction('section80G', Number(e.target.value) || 0)}
                  placeholder="Enter donation amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  50%-100% deduction based on organization type
                </p>
                {deductions.section80G > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80G)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80TTA & 80TTB */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80TTA/80TTB - Interest Income
                <Badge variant="destructive">Old Regime Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80TTA">Savings/Deposit Interest</Label>
                <Input
                  id="section80TTA"
                  type="number"
                  value={deductions.section80TTA || ''}
                  onChange={(e) => updateDeduction('section80TTA', Number(e.target.value) || 0)}
                  placeholder="Enter savings/FD interest amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  80TTA: ₹10,000 (below 60 years), 80TTB: ₹50,000 (senior citizens)
                </p>
                {deductions.section80TTA > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80TTA)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 80U */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Section 80U - Disability Deduction
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(₹75,000/₹1,25,000)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="section80U">Disability Deduction</Label>
                <Input
                  id="section80U"
                  type="number"
                  value={deductions.section80U || ''}
                  onChange={(e) => updateDeduction('section80U', Number(e.target.value) || 0)}
                  placeholder="Enter disability deduction amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  ₹75,000 (normal), ₹1,25,000 (severe disability)
                </p>
                {deductions.section80U > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80U)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Salary Specific Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-600">Salary Specific Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* HRA Calculation */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                HRA Exemption Calculator
                <Badge variant="destructive">Old Regime Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="basicSalary">Annual Basic Salary</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={basicSalary || ''}
                  readOnly
                  className="mt-1 bg-gray-100"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter basic salary in Income section for HRA calculation
                </p>
              </div>
              
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent Paid</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={hraDetails.monthlyRent || ''}
                  onChange={(e) => setHraDetails(prev => ({ ...prev, monthlyRent: Number(e.target.value) || 0 }))}
                  placeholder="Enter monthly rent amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
              </div>

              <div>
                <Label htmlFor="cityType">City Type</Label>
                <select
                  id="cityType"
                  value={hraDetails.cityType}
                  onChange={(e) => setHraDetails(prev => ({ ...prev, cityType: e.target.value as 'metro' | 'non-metro' }))}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  disabled={!isEditMode}
                >
                  <option value="metro">Metro City (50% of basic)</option>
                  <option value="non-metro">Non-Metro City (40% of basic)</option>
                </select>
              </div>

              {deductions.hra > 0 && (
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">
                    HRA Exemption: ₹{formatCurrency(deductions.hra)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* LTA */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                LTA (Leave Travel Allowance)
                <Badge variant="destructive">Old Regime Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="lta">LTA Exemption Amount</Label>
                <Input
                  id="lta"
                  type="number"
                  value={deductions.lta || ''}
                  onChange={(e) => updateDeduction('lta', Number(e.target.value) || 0)}
                  placeholder="Enter LTA exemption amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Exemption for domestic travel expenses
                </p>
                {deductions.lta > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.lta)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Tax */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Professional Tax
                <Badge variant="secondary">Both Regimes</Badge>
                <span className="text-sm font-normal">(Max: ₹2,500)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="professionalTax">Annual Professional Tax</Label>
                <Input
                  id="professionalTax"
                  type="number"
                  value={deductions.professionalTax || ''}
                  onChange={(e) => updateDeduction('professionalTax', Number(e.target.value) || 0)}
                  placeholder="Enter professional tax amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                {deductions.professionalTax > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.professionalTax)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gratuity */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Gratuity Exemption
                <Badge variant="secondary">Both Regimes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="gratuity">Gratuity Amount</Label>
                <Input
                  id="gratuity"
                  type="number"
                  value={deductions.gratuity || ''}
                  onChange={(e) => updateDeduction('gratuity', Number(e.target.value) || 0)}
                  placeholder="Enter gratuity amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Exemption as per rules
                </p>
                {deductions.gratuity > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.gratuity)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Leave Encashment */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Leave Encashment
                <Badge variant="secondary">Both Regimes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="leaveEncashment">Leave Encashment Amount</Label>
                <Input
                  id="leaveEncashment"
                  type="number"
                  value={deductions.leaveEncashment || ''}
                  onChange={(e) => updateDeduction('leaveEncashment', Number(e.target.value) || 0)}
                  placeholder="Enter leave encashment amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Exemption as per rules
                </p>
                {deductions.leaveEncashment > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.leaveEncashment)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Additional NPS Deduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-purple-600">Additional Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                NPS - Section 80CCD(1B)
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Max: ₹50,000)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="nps">NPS Additional Contribution</Label>
                <Input
                  id="nps"
                  type="number"
                  value={deductions.nps || ''}
                  onChange={(e) => updateDeduction('nps', Number(e.target.value) || 0)}
                  placeholder="Enter NPS contribution"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Additional deduction over Section 80C limit
                </p>
                {deductions.nps > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.nps)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Home Loan Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Property Related Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Home Loan Interest
                <Badge variant="destructive">Old Regime Only</Badge>
                <span className="text-sm font-normal">(Max: ₹2,00,000)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="homeLoanInterest">Annual Interest Paid</Label>
                <Input
                  id="homeLoanInterest"
                  type="number"
                  value={deductions.homeLoanInterest || ''}
                  onChange={(e) => updateDeduction('homeLoanInterest', Number(e.target.value) || 0)}
                  placeholder="Enter home loan interest amount"
                  className="mt-1"
                  disabled={!isEditMode}
                />
                <p className="text-xs text-gray-600 mt-1">
                  For self-occupied property
                </p>
                {deductions.homeLoanInterest > 0 && (
                  <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.homeLoanInterest)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Total Deductions Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Total Deductions Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            ₹{formatCurrency(totalDeductions)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Total deductions applicable under Old Tax Regime
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
