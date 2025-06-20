
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  const [hraDetails, setHraDetails] = useState({
    monthlyRent: 0,
    cityType: 'metro' as 'metro' | 'non-metro'
  });

  // Update parent component when deductions change
  useEffect(() => {
    onDeductionsUpdate(deductions);
  }, [deductions, onDeductionsUpdate]);

  const updateDeduction = (field: keyof DeductionData, value: number) => {
    setDeductions(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
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
      {/* Section 80C Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            />
            <p className="text-xs text-gray-600 mt-1">
              Includes PPF, ELSS, Life Insurance, Home Loan Principal, NSC, etc.
            </p>
            {deductions.section80C > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80C)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 80D - Health Insurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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

      {/* HRA Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            />
          </div>

          <div>
            <Label htmlFor="cityType">City Type</Label>
            <select
              id="cityType"
              value={hraDetails.cityType}
              onChange={(e) => setHraDetails(prev => ({ ...prev, cityType: e.target.value as 'metro' | 'non-metro' }))}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="metro">Metro City (50% of basic)</option>
              <option value="non-metro">Non-Metro City (40% of basic)</option>
            </select>
          </div>

          {deductions.hra > 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                HRA Exemption: ₹{formatCurrency(deductions.hra)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Home Loan Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            />
            {deductions.homeLoanInterest > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.homeLoanInterest)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NPS Section 80CCD(1B) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            NPS - Section 80CCD(1B)
            <Badge variant="destructive">Old Regime Only</Badge>
            <span className="text-sm font-normal">(Max: ₹50,000)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="nps">NPS Contribution</Label>
            <Input
              id="nps"
              type="number"
              value={deductions.nps || ''}
              onChange={(e) => updateDeduction('nps', Number(e.target.value) || 0)}
              placeholder="Enter NPS contribution"
              className="mt-1"
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

      {/* Section 80E - Education Loan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            />
            {deductions.section80E > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80E)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 80G - Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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

      {/* Section 80TTA - Savings Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Section 80TTA - Savings Interest
            <Badge variant="destructive">Old Regime Only</Badge>
            <span className="text-sm font-normal">(Max: ₹10,000)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="section80TTA">Savings Account Interest</Label>
            <Input
              id="section80TTA"
              type="number"
              value={deductions.section80TTA || ''}
              onChange={(e) => updateDeduction('section80TTA', Number(e.target.value) || 0)}
              placeholder="Enter savings interest amount"
              className="mt-1"
            />
            {deductions.section80TTA > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80TTA)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Tax */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            />
            {deductions.professionalTax > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.professionalTax)}</p>
            )}
          </div>
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
