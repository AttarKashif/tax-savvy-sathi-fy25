
import React, { useCallback } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { DeductionCalculator } from './DeductionCalculator';
import { Button } from '@/components/ui/button';
import { Calculator, FileText } from 'lucide-react';
import { generateTaxComparisonPDF } from '@/utils/pdfGenerator';
import { calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime } from '@/utils/taxCalculations';

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

  const handleGeneratePDF = async () => {
    const oldRegimeResult = calculateOldRegimeTax(income, deductions, age);
    const newRegimeResult = calculateNewRegimeTax(income, deductions, age);
    const recommendation = getOptimalRegime(oldRegimeResult, newRegimeResult);
    
    const pdfData = {
      income,
      deductions,
      oldRegimeResult,
      newRegimeResult,
      recommendation,
      age
    };
    
    try {
      await generateTaxComparisonPDF(pdfData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

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
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                onClick={onCalculate} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Tax Comparison
              </Button>
              
              <Button 
                onClick={handleGeneratePDF}
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <FileText className="w-5 h-5 mr-2" />
                Generate PDF Report
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Compare Old vs New Tax Regime and get detailed PDF report with tax-saving suggestions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
