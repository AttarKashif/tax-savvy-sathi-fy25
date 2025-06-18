
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
}

export const DeductionEntry: React.FC<DeductionEntryProps> = ({ 
  deductions, 
  setDeductions, 
  income,
  onCalculate,
  hasValidIncome 
}) => {
  const handleDeductionsUpdate = useCallback((updatedDeductions: DeductionData) => {
    setDeductions(updatedDeductions);
  }, [setDeductions]);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Tax Deductions Calculator</h2>
        <p className="text-yellow-700">
          Enter your deductions below. HRA applies to both regimes, while other deductions are primarily for the Old Tax Regime.
        </p>
      </div>

      <DeductionCalculator 
        onDeductionsUpdate={handleDeductionsUpdate}
        currentDeductions={deductions}
        basicSalary={income.salary}
      />

      {hasValidIncome && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <div className="text-center">
            <Button 
              onClick={onCalculate} 
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Tax Comparison
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Compare Old vs New Tax Regime with your current deductions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
