
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeductionData } from '@/utils/taxCalculations';

interface DeductionEntryProps {
  deductions: DeductionData;
  setDeductions: (deductions: DeductionData) => void;
}

export const DeductionEntry: React.FC<DeductionEntryProps> = ({ deductions, setDeductions }) => {
  const updateDeduction = (field: keyof DeductionData, value: number) => {
    setDeductions({ ...deductions, [field]: value });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Old Tax Regime Deductions</h2>
        <p className="text-yellow-700">These deductions are only applicable under the Old Tax Regime. The New Tax Regime offers limited deductions but lower tax rates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">Section 80C - Investment Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="section80C">PPF, ELSS, LIC, NSC, etc. (Max: ₹1.5 Lakh)</Label>
            <Input
              id="section80C"
              type="number"
              value={deductions.section80C || ''}
              onChange={(e) => updateDeduction('section80C', Math.min(Number(e.target.value) || 0, 150000))}
              placeholder="Enter Section 80C investments"
              className="mt-1"
            />
            {deductions.section80C > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                ₹{formatCurrency(deductions.section80C)} 
                {deductions.section80C >= 150000 && <span className="text-green-600 ml-2">✓ Maximum limit reached</span>}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-600">Section 80D - Medical Insurance</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="section80D">Medical Insurance Premium (Max: ₹25,000 / ₹50,000 for seniors)</Label>
            <Input
              id="section80D"
              type="number"
              value={deductions.section80D || ''}
              onChange={(e) => updateDeduction('section80D', Number(e.target.value) || 0)}
              placeholder="Enter medical insurance premium"
              className="mt-1"
            />
            {deductions.section80D > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.section80D)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-purple-600">House Rent Allowance (HRA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="hra">HRA Exemption Amount</Label>
            <Input
              id="hra"
              type="number"
              value={deductions.hra || ''}
              onChange={(e) => updateDeduction('hra', Number(e.target.value) || 0)}
              placeholder="Enter HRA exemption"
              className="mt-1"
            />
            {deductions.hra > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(deductions.hra)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-orange-600">Other Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lta">Leave Travel Allowance (LTA)</Label>
            <Input
              id="lta"
              type="number"
              value={deductions.lta || ''}
              onChange={(e) => updateDeduction('lta', Number(e.target.value) || 0)}
              placeholder="Enter LTA exemption"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="homeLoan">Home Loan Interest (Section 24b)</Label>
            <Input
              id="homeLoan"
              type="number"
              value={deductions.homeLoanInterest || ''}
              onChange={(e) => updateDeduction('homeLoanInterest', Math.min(Number(e.target.value) || 0, 200000))}
              placeholder="Enter home loan interest (Max: ₹2 Lakh)"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="section80TTA">Section 80TTA - Savings Account Interest</Label>
            <Input
              id="section80TTA"
              type="number"
              value={deductions.section80TTA || ''}
              onChange={(e) => updateDeduction('section80TTA', Math.min(Number(e.target.value) || 0, 10000))}
              placeholder="Enter savings interest (Max: ₹10,000)"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Total Deductions (Old Regime)</h3>
        <p className="text-2xl font-bold text-green-600">
          ₹{formatCurrency(Object.values(deductions).reduce((sum, value) => sum + value, 0))}
        </p>
      </div>
    </div>
  );
};
