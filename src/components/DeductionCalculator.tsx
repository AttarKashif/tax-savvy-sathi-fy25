import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DeductionData } from '@/utils/taxCalculations';
import { calculateMaxHRA } from '@/utils/deductionCalculations';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [localDeductions, setLocalDeductions] = useState<DeductionData>(currentDeductions);
  const [hraData, setHraData] = useState({
    hraReceived: 0,
    rentPaid: 0,
    isMetroCity: false
  });

  // Update parent component when local deductions change
  useEffect(() => {
    onDeductionsUpdate(localDeductions);
  }, [localDeductions, onDeductionsUpdate]);

  const updateDeduction = useCallback((field: keyof DeductionData, value: number) => {
    setLocalDeductions(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  }, []);

  // Calculate HRA automatically when HRA data changes
  useEffect(() => {
    if (hraData.hraReceived > 0 && hraData.rentPaid > 0 && basicSalary > 0) {
      const calculatedHRA = calculateMaxHRA({
        basicSalary,
        hraReceived: hraData.hraReceived,
        rentPaid: hraData.rentPaid,
        isMetroCity: hraData.isMetroCity
      });
      updateDeduction('hra', calculatedHRA);
    }
  }, [hraData, basicSalary, updateDeduction]);

  const formatCurrency = (value: number) => value.toLocaleString('en-IN');

  // Calculate totals for each section
  const section80Total = localDeductions.section80C + localDeductions.section80D + 
                        localDeductions.section80E + localDeductions.section80G + 
                        localDeductions.section80EE + localDeductions.section80EEA + 
                        localDeductions.section80U + localDeductions.section80DDB + 
                        localDeductions.section80CCG + localDeductions.section80CCC + 
                        localDeductions.section80CCD + localDeductions.nps;

  const salaryExemptionsTotal = localDeductions.hra + localDeductions.lta + 
                               localDeductions.professionalTax;

  const otherDeductionsTotal = localDeductions.homeLoanInterest + localDeductions.section80TTA;

  const exemptionsTotal = localDeductions.gratuity + localDeductions.leaveEncashment;

  const grandTotal = section80Total + salaryExemptionsTotal + otherDeductionsTotal + exemptionsTotal;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Total Deductions Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Section 80 Deductions</p>
              <p className="text-lg font-bold text-blue-600">₹{formatCurrency(section80Total)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Salary Exemptions</p>
              <p className="text-lg font-bold text-purple-600">₹{formatCurrency(salaryExemptionsTotal)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Other Deductions</p>
              <p className="text-lg font-bold text-orange-600">₹{formatCurrency(otherDeductionsTotal)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Deductions</p>
              <p className="text-xl font-bold text-green-600">₹{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Exemptions & Allowances */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600">
            Salary Exemptions & Allowances
            <Badge variant="destructive" className="ml-2">Old Regime Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* HRA Calculation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">House Rent Allowance (HRA)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>HRA Received (Annual)</Label>
                <Input
                  type="number"
                  value={hraData.hraReceived || ''}
                  onChange={(e) => setHraData(prev => ({ ...prev, hraReceived: Number(e.target.value) || 0 }))}
                  placeholder="Enter HRA received"
                />
              </div>
              <div>
                <Label>Rent Paid (Annual)</Label>
                <Input
                  type="number"
                  value={hraData.rentPaid || ''}
                  onChange={(e) => setHraData(prev => ({ ...prev, rentPaid: Number(e.target.value) || 0 }))}
                  placeholder="Enter rent paid"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="metro-city"
                  checked={hraData.isMetroCity}
                  onCheckedChange={(checked) => setHraData(prev => ({ ...prev, isMetroCity: checked as boolean }))}
                />
                <Label htmlFor="metro-city">Metro City</Label>
              </div>
            </div>
            {localDeductions.hra > 0 && (
              <p className="text-sm text-green-600 mt-2">
                Calculated HRA Exemption: ₹{formatCurrency(localDeductions.hra)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Leave Travel Allowance (LTA)</Label>
              <Input
                type="number"
                value={localDeductions.lta || ''}
                onChange={(e) => updateDeduction('lta', Number(e.target.value) || 0)}
                placeholder="Enter LTA amount"
              />
            </div>
            <div>
              <Label>Professional Tax</Label>
              <Input
                type="number"
                value={localDeductions.professionalTax || ''}
                onChange={(e) => updateDeduction('professionalTax', Number(e.target.value) || 0)}
                placeholder="Enter professional tax paid"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 80 Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">
            Chapter VI-A Deductions (Section 80)
            <Badge variant="destructive" className="ml-2">Old Regime Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Section 80C (PPF, ELSS, Insurance, etc.) - Max ₹1.5L</Label>
              <Input
                type="number"
                value={localDeductions.section80C || ''}
                onChange={(e) => updateDeduction('section80C', Number(e.target.value) || 0)}
                placeholder="Enter 80C investments"
              />
              {localDeductions.section80C > 150000 && (
                <p className="text-sm text-red-600">Limit exceeded. Maximum allowed: ₹1,50,000</p>
              )}
            </div>
            <div>
              <Label>Section 80D (Health Insurance) - Max ₹25K-1L</Label>
              <Input
                type="number"
                value={localDeductions.section80D || ''}
                onChange={(e) => updateDeduction('section80D', Number(e.target.value) || 0)}
                placeholder="Enter health insurance premium"
              />
            </div>
            <div>
              <Label>Section 80CCD(1B) - NPS Additional - Max ₹50K</Label>
              <Input
                type="number"
                value={localDeductions.nps || ''}
                onChange={(e) => updateDeduction('nps', Number(e.target.value) || 0)}
                placeholder="Enter NPS contribution"
              />
            </div>
            <div>
              <Label>Section 80E (Education Loan Interest) - No Limit</Label>
              <Input
                type="number"
                value={localDeductions.section80E || ''}
                onChange={(e) => updateDeduction('section80E', Number(e.target.value) || 0)}
                placeholder="Enter education loan interest"
              />
            </div>
            <div>
              <Label>Section 80G (Donations) - Max 10% of Income</Label>
              <Input
                type="number"
                value={localDeductions.section80G || ''}
                onChange={(e) => updateDeduction('section80G', Number(e.target.value) || 0)}
                placeholder="Enter donation amount"
              />
            </div>
            <div>
              <Label>Section 80TTA/80TTB (Interest Income) - Max ₹10K/50K</Label>
              <Input
                type="number"
                value={localDeductions.section80TTA || ''}
                onChange={(e) => updateDeduction('section80TTA', Number(e.target.value) || 0)}
                placeholder="Enter interest on savings"
              />
            </div>
            <div>
              <Label>Section 80EE (First Home Loan Interest) - Max ₹50K</Label>
              <Input
                type="number"
                value={localDeductions.section80EE || ''}
                onChange={(e) => updateDeduction('section80EE', Number(e.target.value) || 0)}
                placeholder="Enter first home loan interest"
              />
            </div>
            <div>
              <Label>Section 80EEA (Affordable Housing) - Max ₹1.5L</Label>
              <Input
                type="number"
                value={localDeductions.section80EEA || ''}
                onChange={(e) => updateDeduction('section80EEA', Number(e.target.value) || 0)}
                placeholder="Enter affordable housing interest"
              />
            </div>
            <div>
              <Label>Section 80U (Self Disability) - ₹75K/1.25L</Label>
              <Input
                type="number"
                value={localDeductions.section80U || ''}
                onChange={(e) => updateDeduction('section80U', Number(e.target.value) || 0)}
                placeholder="Enter disability deduction"
              />
            </div>
            <div>
              <Label>Section 80DDB (Medical Treatment) - Max ₹40K/1L</Label>
              <Input
                type="number"
                value={localDeductions.section80DDB || ''}
                onChange={(e) => updateDeduction('section80DDB', Number(e.target.value) || 0)}
                placeholder="Enter medical treatment expense"
              />
            </div>
            <div>
              <Label>Section 80CCC (Pension Fund) - Part of 80C</Label>
              <Input
                type="number"
                value={localDeductions.section80CCC || ''}
                onChange={(e) => updateDeduction('section80CCC', Number(e.target.value) || 0)}
                placeholder="Enter pension fund contribution"
              />
            </div>
            <div>
              <Label>Section 80CCD (Employee NPS) - Part of 80C</Label>
              <Input
                type="number"
                value={localDeductions.section80CCD || ''}
                onChange={(e) => updateDeduction('section80CCD', Number(e.target.value) || 0)}
                placeholder="Enter employee NPS contribution"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Other Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Home Loan Interest (Self-occupied) - Max ₹2L</Label>
              <Badge variant="destructive" className="ml-2">Old Regime Only</Badge>
              <Input
                type="number"
                value={localDeductions.homeLoanInterest || ''}
                onChange={(e) => updateDeduction('homeLoanInterest', Number(e.target.value) || 0)}
                placeholder="Enter home loan interest"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">
            Exemptions
            <Badge variant="secondary" className="ml-2">Both Regimes</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gratuity Exemption - Max ₹20L</Label>
              <Input
                type="number"
                value={localDeductions.gratuity || ''}
                onChange={(e) => updateDeduction('gratuity', Number(e.target.value) || 0)}
                placeholder="Enter gratuity amount"
              />
            </div>
            <div>
              <Label>Leave Encashment Exemption</Label>
              <Input
                type="number"
                value={localDeductions.leaveEncashment || ''}
                onChange={(e) => updateDeduction('leaveEncashment', Number(e.target.value) || 0)}
                placeholder="Enter leave encashment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standard Deduction Info */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Standard Deduction (Automatic)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Old Tax Regime</p>
              <p className="text-lg font-bold text-blue-600">₹50,000</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">New Tax Regime</p>
              <p className="text-lg font-bold text-green-600">₹75,000</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Standard deduction is automatically applied in tax calculations
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
