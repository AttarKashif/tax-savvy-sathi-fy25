
import React, { useCallback } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { DeductionCalculator } from './DeductionCalculator';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

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
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Tax Deductions Calculator</h2>
        <p className="text-yellow-700">
          Enter your deductions below. Note: Most deductions apply only to the Old Tax Regime.
        </p>
      </div>

      <DeductionCalculator 
        onDeductionsUpdate={handleDeductionsUpdate}
        currentDeductions={deductions}
        basicSalary={income.basicSalary}
      />

      {hasValidIncome && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <div className="text-center space-y-4">
            <Button 
              onClick={onCalculate} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Tax Comparison
            </Button>
            <p className="text-sm text-gray-600">
              Compare Old vs New Tax Regime with detailed analysis and PDF report generation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
