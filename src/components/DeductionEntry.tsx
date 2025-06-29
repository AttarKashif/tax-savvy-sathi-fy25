
import React, { useCallback } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { DeductionCalculator } from './DeductionCalculator';
import { Button } from '@/components/ui/button';
import { Calculator, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const handleDeductionsUpdate = useCallback((updatedDeductions: DeductionData) => {
    setDeductions(updatedDeductions);
  }, [setDeductions]);

  return (
    <div className="space-y-6">
      {/* Calculate Tax Button at Top */}
      {hasValidIncome && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm">
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
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Deductions Information</h3>
              <p className="text-slate-300 text-sm mb-3">
                Most deductions apply only to the Old Tax Regime. The New Tax Regime has limited deductions but lower tax rates.
              </p>
              <p className="text-slate-300 text-sm">
                Check the Help section for detailed information about each deduction section and eligibility criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeductionCalculator 
        onDeductionsUpdate={handleDeductionsUpdate}
        currentDeductions={deductions}
        basicSalary={income.basicSalary}
      />
    </div>
  );
};
