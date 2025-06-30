
import React, { useCallback } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const inputClassName = "bg-slate-800/70 border-slate-600/40 text-white rounded-xl focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/70";
  const labelClassName = "text-slate-200 font-medium text-sm";

  return (
    <div className="space-y-6">
      {/* Calculate Tax Button at Top */}
      {hasValidIncome && (
        <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Calculate Tax</h3>
                <p className="text-slate-300">Compare Old vs New Tax Regime with detailed analysis</p>
              </div>
              <Button 
                onClick={onCalculate} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Tax Comparison
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Information */}
      <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Deductions Information</h3>
              <p className="text-slate-300 text-sm mb-3">
                Enter your deduction amounts. Most deductions apply only to the Old Tax Regime.
              </p>
              <p className="text-slate-300 text-sm">
                Check the Help section for detailed information about each deduction and eligibility criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Grid */}
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className={labelClassName}>Section 80C</Label>
              <Input 
                type="number" 
                value={deductions.section80C || ''} 
                onChange={e => handleDeductionUpdate('section80C', Number(e.target.value) || 0)}
                placeholder="Max ₹1.5 Lakh"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCD (NPS)</Label>
              <Input 
                type="number" 
                value={deductions.section80CCD || ''} 
                onChange={e => handleDeductionUpdate('section80CCD', Number(e.target.value) || 0)}
                placeholder="NPS contribution"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCC</Label>
              <Input 
                type="number" 
                value={deductions.section80CCC || ''} 
                onChange={e => handleDeductionUpdate('section80CCC', Number(e.target.value) || 0)}
                placeholder="Pension fund"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80D</Label>
              <Input 
                type="number" 
                value={deductions.section80D || ''} 
                onChange={e => handleDeductionUpdate('section80D', Number(e.target.value) || 0)}
                placeholder="Health insurance"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80DDB</Label>
              <Input 
                type="number" 
                value={deductions.section80DDB || ''} 
                onChange={e => handleDeductionUpdate('section80DDB', Number(e.target.value) || 0)}
                placeholder="Medical expenses"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>HRA Exemption</Label>
              <Input 
                type="number" 
                value={deductions.hra || ''} 
                onChange={e => handleDeductionUpdate('hra', Number(e.target.value) || 0)}
                placeholder="HRA exemption"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Home Loan Interest</Label>
              <Input 
                type="number" 
                value={deductions.homeLoanInterest || ''} 
                onChange={e => handleDeductionUpdate('homeLoanInterest', Number(e.target.value) || 0)}
                placeholder="Home loan interest"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80E</Label>
              <Input 
                type="number" 
                value={deductions.section80E || ''} 
                onChange={e => handleDeductionUpdate('section80E', Number(e.target.value) || 0)}
                placeholder="Education loan"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80EE</Label>
              <Input 
                type="number" 
                value={deductions.section80EE || ''} 
                onChange={e => handleDeductionUpdate('section80EE', Number(e.target.value) || 0)}
                placeholder="First-time home buyer"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80EEA</Label>
              <Input 
                type="number" 
                value={deductions.section80EEA || ''} 
                onChange={e => handleDeductionUpdate('section80EEA', Number(e.target.value) || 0)}
                placeholder="Affordable housing"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80G</Label>
              <Input 
                type="number" 
                value={deductions.section80G || ''} 
                onChange={e => handleDeductionUpdate('section80G', Number(e.target.value) || 0)}
                placeholder="Donations"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80TTA</Label>
              <Input 
                type="number" 
                value={deductions.section80TTA || ''} 
                onChange={e => handleDeductionUpdate('section80TTA', Number(e.target.value) || 0)}
                placeholder="Savings interest"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Professional Tax</Label>
              <Input 
                type="number" 
                value={deductions.professionalTax || ''} 
                onChange={e => handleDeductionUpdate('professionalTax', Number(e.target.value) || 0)}
                placeholder="Professional tax"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80U</Label>
              <Input 
                type="number" 
                value={deductions.section80U || ''} 
                onChange={e => handleDeductionUpdate('section80U', Number(e.target.value) || 0)}
                placeholder="Disability deduction"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>LTA</Label>
              <Input 
                type="number" 
                value={deductions.lta || ''} 
                onChange={e => handleDeductionUpdate('lta', Number(e.target.value) || 0)}
                placeholder="Leave travel allowance"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>NPS Additional</Label>
              <Input 
                type="number" 
                value={deductions.nps || ''} 
                onChange={e => handleDeductionUpdate('nps', Number(e.target.value) || 0)}
                placeholder="Additional NPS (50k)"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Gratuity</Label>
              <Input 
                type="number" 
                value={deductions.gratuity || ''} 
                onChange={e => handleDeductionUpdate('gratuity', Number(e.target.value) || 0)}
                placeholder="Gratuity exemption"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Leave Encashment</Label>
              <Input 
                type="number" 
                value={deductions.leaveEncashment || ''} 
                onChange={e => handleDeductionUpdate('leaveEncashment', Number(e.target.value) || 0)}
                placeholder="Leave encashment"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCG</Label>
              <Input 
                type="number" 
                value={deductions.section80CCG || ''} 
                onChange={e => handleDeductionUpdate('section80CCG', Number(e.target.value) || 0)}
                placeholder="Equity savings"
                className={inputClassName}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Deductions Summary */}
      <Card className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold text-green-400 mb-2">Total Deductions</h3>
          <p className="text-3xl font-bold text-white">
            ₹{formatCurrency(totalDeductions)}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Sum of all deduction sections entered above
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
