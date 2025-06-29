
import React, { useCallback } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { DeductionGroups } from './DeductionGroups';
import { Button } from '@/components/ui/button';
import { Calculator, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DeductionEntryProps {
  deductions: DeductionData;
  setDeductions: (deductions: DeductionData) => void;
  income: IncomeData;
  onCalculate: () => void;
  hasValidIncome: boolean;
  age: number;
}

export const DeductionEntry: React.FC<DeductionEntryProps> = ({ 
  deductions, 
  setDeductions, 
  income,
  onCalculate,
  hasValidIncome,
  age 
}) => {
  const handleDeductionUpdate = (field: keyof DeductionData, value: number) => {
    setDeductions({
      ...deductions,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {/* Calculate Tax Button at Top */}
      {hasValidIncome && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Calculate Tax</h3>
                <p className="text-slate-300">Compare Old vs New Tax Regime with detailed analysis</p>
              </div>
              <Button 
                onClick={onCalculate} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Tax Comparison
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Information */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Deductions Information</h3>
              <p className="text-slate-300 text-sm mb-3">
                Deductions are grouped by sections for easy navigation. Most deductions apply only to the Old Tax Regime.
              </p>
              <p className="text-slate-300 text-sm">
                Check the Help section for detailed information about each deduction section and eligibility criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deduction Groups */}
      <DeductionGroups 
        deductions={deductions}
        onUpdate={handleDeductionUpdate}
      />

      {/* Total Deductions Summary */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-green-400 mb-2">Total Deductions</h3>
        <p className="text-3xl font-bold text-white">
          ₹{formatCurrency(totalDeductions)}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Sum of all deduction sections entered above
        </p>
      </div>
    </div>
  );
};
