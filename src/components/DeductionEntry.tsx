
import React, { useCallback } from 'react';
import { DeductionData } from '@/utils/taxCalculations';
import { DeductionCalculator } from './DeductionCalculator';

interface DeductionEntryProps {
  deductions: DeductionData;
  setDeductions: (deductions: DeductionData) => void;
}

export const DeductionEntry: React.FC<DeductionEntryProps> = ({ deductions, setDeductions }) => {
  const handleDeductionsUpdate = useCallback((totalDeductions: number) => {
    // For now, we'll update the main deduction object with the total
    // In a more sophisticated implementation, we'd track individual components
    const newDeductions = {
      ...deductions,
      section80C: Math.min(totalDeductions * 0.4, 150000), // Rough allocation
      section80D: Math.min(totalDeductions * 0.1, 75000),
      hra: Math.min(totalDeductions * 0.3, totalDeductions),
      lta: Math.min(totalDeductions * 0.05, totalDeductions),
      homeLoanInterest: Math.min(totalDeductions * 0.1, 200000),
      section80TTA: Math.min(totalDeductions * 0.05, 50000)
    };
    
    // Only update if there's an actual change to prevent unnecessary re-renders
    const hasChanged = Object.keys(newDeductions).some(
      key => newDeductions[key as keyof DeductionData] !== deductions[key as keyof DeductionData]
    );
    
    if (hasChanged) {
      setDeductions(newDeductions);
    }
  }, [deductions, setDeductions]);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Old Tax Regime Deductions</h2>
        <p className="text-yellow-700">These deductions are only applicable under the Old Tax Regime. The New Tax Regime offers limited deductions but lower tax rates.</p>
      </div>

      <DeductionCalculator 
        onDeductionsUpdate={handleDeductionsUpdate}
        basicSalary={0} // This should be passed from the main component
      />
    </div>
  );
};
