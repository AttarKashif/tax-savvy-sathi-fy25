import React, { useCallback, useState } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, HelpCircle, Info, TrendingDown, Receipt, Home, GraduationCap, Heart } from 'lucide-react';
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
  const [hraDetails, setHraDetails] = useState({
    monthlyRent: 0,
    cityType: 'metro' as 'metro' | 'non-metro'
  });

  const handleDeductionUpdate = (field: keyof DeductionData, value: number) => {
    setDeductions({
      ...deductions,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Calculate HRA exemption
  const calculateHRAExemption = () => {
    if (!income.basicSalary || !hraDetails.monthlyRent) return 0;
    
    const annualRent = hraDetails.monthlyRent * 12;
    const annualBasic = income.basicSalary;
    const cityPercentage = hraDetails.cityType === 'metro' ? 0.5 : 0.4;
    
    const hraReceived = annualRent; // Assuming HRA received equals rent paid
    const exemptionLimit1 = hraReceived;
    const exemptionLimit2 = Math.max(0, annualRent - (annualBasic * 0.1));
    const exemptionLimit3 = annualBasic * cityPercentage;
    
    const hraExemption = Math.max(0, Math.min(exemptionLimit1, exemptionLimit2, exemptionLimit3));
    
    handleDeductionUpdate('hra', hraExemption);
    return hraExemption;
  };

  // Calculate deduction summaries
  const section80CGroup = deductions.section80C + deductions.section80CCC + deductions.section80CCD;
  const totalSalaryDeductions = deductions.hra + deductions.lta + deductions.professionalTax + deductions.gratuity + deductions.leaveEncashment;
  const totalSection80Deductions = section80CGroup + deductions.section80D + deductions.section80DDB + deductions.section80E + deductions.section80EE + deductions.section80EEA + deductions.section80G + deductions.section80TTA + deductions.section80U + deductions.section80CCG + deductions.nps;
  const totalOtherDeductions = deductions.homeLoanInterest;
  const totalDeductions = totalSalaryDeductions + totalSection80Deductions + totalOtherDeductions;

  const inputClassName = "bg-slate-800/70 border-slate-600/40 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/70";
  const labelClassName = "text-slate-200 font-medium text-sm";
  const cardClassName = "bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl";

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
                className="bg-slate-600 hover:bg-slate-700 rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Tax Comparison
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Information */}
      <Card className={cardClassName}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Deductions Information</h3>
              <p className="text-slate-400 text-sm mb-3">
                Enter your deduction amounts. Most deductions apply only to the Old Tax Regime.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/30">
                  <h4 className="text-slate-300 font-medium text-sm mb-1">Salary Deductions</h4>
                  <p className="text-xs text-slate-400">HRA, LTA, Professional Tax, Gratuity</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/30">
                  <h4 className="text-slate-300 font-medium text-sm mb-1">Section 80 Deductions</h4>
                  <p className="text-xs text-slate-400">80C, 80D, 80E, 80G and others</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/30">
                  <h4 className="text-slate-300 font-medium text-sm mb-1">Other Deductions</h4>
                  <p className="text-xs text-slate-400">Home Loan Interest, NPS Additional</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SALARY DEDUCTIONS SECTION */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            Salary Deductions
            <span className="text-sm font-normal text-slate-400">(Old Regime Only)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* HRA Calculation */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-600/30">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">HRA Exemption Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={labelClassName}>Monthly Rent Paid</Label>
                <Input 
                  type="number" 
                  value={hraDetails.monthlyRent || ''} 
                  onChange={e => setHraDetails(prev => ({ ...prev, monthlyRent: Number(e.target.value) || 0 }))}
                  placeholder="Enter monthly rent"
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <Label className={labelClassName}>City Type</Label>
                <select
                  value={hraDetails.cityType}
                  onChange={(e) => setHraDetails(prev => ({ ...prev, cityType: e.target.value as 'metro' | 'non-metro' }))}
                  className={inputClassName}
                >
                  <option value="metro">Metro City (50% of basic)</option>
                  <option value="non-metro">Non-Metro City (40% of basic)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className={labelClassName}>Annual Basic Salary</Label>
                <Input 
                  type="number" 
                  value={income.basicSalary || ''} 
                  readOnly
                  className="bg-slate-700/50 border-slate-600/40 text-slate-400"
                  placeholder="Enter in Income section"
                />
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={calculateHRAExemption}
                  className="bg-slate-600 hover:bg-slate-700 rounded-xl"
                >
                  Calculate HRA Exemption
                </Button>
              </div>
            </div>
            {deductions.hra > 0 && (
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                <h4 className="text-slate-300 font-semibold mb-2">HRA Calculation Working:</h4>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>• HRA Received: ₹{formatCurrency(hraDetails.monthlyRent * 12)}</p>
                  <p>• Rent - 10% of Basic: ₹{formatCurrency(Math.max(0, (hraDetails.monthlyRent * 12) - (income.basicSalary * 0.1)))}</p>
                  <p>• {hraDetails.cityType === 'metro' ? '50%' : '40%'} of Basic: ₹{formatCurrency(income.basicSalary * (hraDetails.cityType === 'metro' ? 0.5 : 0.4))}</p>
                  <p className="font-semibold text-slate-300">• HRA Exemption: ₹{formatCurrency(deductions.hra)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClassName}>LTA (Leave Travel Allowance)</Label>
              <Input 
                type="number" 
                value={deductions.lta || ''} 
                onChange={e => handleDeductionUpdate('lta', Number(e.target.value) || 0)}
                placeholder="Enter LTA exemption"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Exemption for domestic travel expenses</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Professional Tax</Label>
              <Input 
                type="number" 
                value={deductions.professionalTax || ''} 
                onChange={e => handleDeductionUpdate('professionalTax', Number(e.target.value) || 0)}
                placeholder="Max ₹2,500"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Annual professional tax paid</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Gratuity Exemption</Label>
              <Input 
                type="number" 
                value={deductions.gratuity || ''} 
                onChange={e => handleDeductionUpdate('gratuity', Number(e.target.value) || 0)}
                placeholder="Enter gratuity amount"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">As per gratuity rules</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Leave Encashment</Label>
              <Input 
                type="number" 
                value={deductions.leaveEncashment || ''} 
                onChange={e => handleDeductionUpdate('leaveEncashment', Number(e.target.value) || 0)}
                placeholder="Enter leave encashment"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">On retirement/resignation</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-300 font-semibold">Total Salary Deductions: ₹{formatCurrency(totalSalaryDeductions)}</p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 80 DEDUCTIONS */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Section 80 Deductions (Chapter VI-A)
            <span className="text-sm font-normal text-slate-400">(Old Regime Only)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 80C Group */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-600/30">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Section 80C, 80CCC, 80CCD Group (Combined Limit: ₹1.5 Lakh)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className={labelClassName}>Section 80C</Label>
                <Input 
                  type="number" 
                  value={deductions.section80C || ''} 
                  onChange={e => handleDeductionUpdate('section80C', Number(e.target.value) || 0)}
                  placeholder="PPF, ELSS, Insurance"
                  className={inputClassName}
                />
                <p className="text-xs text-slate-400">PPF, ELSS, Life Insurance, Home Loan Principal</p>
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
                <p className="text-xs text-slate-400">Pension fund contributions</p>
              </div>

              <div className="space-y-2">
                <Label className={labelClassName}>Section 80CCD (1)</Label>
                <Input 
                  type="number" 
                  value={deductions.section80CCD || ''} 
                  onChange={e => handleDeductionUpdate('section80CCD', Number(e.target.value) || 0)}
                  placeholder="NPS employee"
                  className={inputClassName}
                />
                <p className="text-xs text-slate-400">NPS employee contribution</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300 font-semibold">Section 80C Group Total: ₹{formatCurrency(section80CGroup)}</p>
              <p className="text-xs text-slate-400 mt-1">Effective Deduction: ₹{formatCurrency(Math.min(150000, section80CGroup))} (Max ₹1.5 Lakh)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClassName}>Section 80D - Health Insurance</Label>
              <Input 
                type="number" 
                value={deductions.section80D || ''} 
                onChange={e => handleDeductionUpdate('section80D', Number(e.target.value) || 0)}
                placeholder="Health insurance premium"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Self & Family: ₹25k, Parents: ₹25k (₹50k if senior)</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80DDB - Medical Treatment</Label>
              <Input 
                type="number" 
                value={deductions.section80DDB || ''} 
                onChange={e => handleDeductionUpdate('section80DDB', Number(e.target.value) || 0)}
                placeholder="Medical expenses"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Max ₹40k (₹1L for senior) - specified diseases</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80E - Education Loan</Label>
              <Input 
                type="number" 
                value={deductions.section80E || ''} 
                onChange={e => handleDeductionUpdate('section80E', Number(e.target.value) || 0)}
                placeholder="Education loan interest"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">No limit - interest on education loan</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80EE - First Home Buyer</Label>
              <Input 
                type="number" 
                value={deductions.section80EE || ''} 
                onChange={e => handleDeductionUpdate('section80EE', Number(e.target.value) || 0)}
                placeholder="Max ₹50,000"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Additional home loan interest deduction</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80EEA - Affordable Housing</Label>
              <Input 
                type="number" 
                value={deductions.section80EEA || ''} 
                onChange={e => handleDeductionUpdate('section80EEA', Number(e.target.value) || 0)}
                placeholder="Max ₹1.5 Lakh"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Affordable housing interest</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80G - Donations</Label>
              <Input 
                type="number" 
                value={deductions.section80G || ''} 
                onChange={e => handleDeductionUpdate('section80G', Number(e.target.value) || 0)}
                placeholder="Charitable donations"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">50%-100% deduction based on organization</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80TTA - Interest Income</Label>
              <Input 
                type="number" 
                value={deductions.section80TTA || ''} 
                onChange={e => handleDeductionUpdate('section80TTA', Number(e.target.value) || 0)}
                placeholder="Savings interest"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Max ₹10k (below 60) / ₹50k (senior citizens)</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80U - Disability</Label>
              <Input 
                type="number" 
                value={deductions.section80U || ''} 
                onChange={e => handleDeductionUpdate('section80U', Number(e.target.value) || 0)}
                placeholder="Disability deduction"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">₹75k (normal) / ₹1.25L (severe disability)</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCG - Equity Savings</Label>
              <Input 
                type="number" 
                value={deductions.section80CCG || ''} 
                onChange={e => handleDeductionUpdate('section80CCG', Number(e.target.value) || 0)}
                placeholder="Equity savings scheme"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Rajiv Gandhi Equity Savings Scheme</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>NPS Additional - 80CCD(1B)</Label>
              <Input 
                type="number" 
                value={deductions.nps || ''} 
                onChange={e => handleDeductionUpdate('nps', Number(e.target.value) || 0)}
                placeholder="Max ₹50,000"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Additional NPS deduction over 80C limit</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-300 font-semibold">Total Section 80 Deductions: ₹{formatCurrency(totalSection80Deductions)}</p>
          </div>
        </CardContent>
      </Card>

      {/* OTHER DEDUCTIONS */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <Home className="w-6 h-6" />
            Other Deductions
            <span className="text-sm font-normal text-slate-400">(Old Regime Only)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className={labelClassName}>Home Loan Interest (Section 24)</Label>
            <Input 
              type="number" 
              value={deductions.homeLoanInterest || ''} 
              onChange={e => handleDeductionUpdate('homeLoanInterest', Number(e.target.value) || 0)}
              placeholder="Max ₹2,00,000"
              className={inputClassName}
            />
            <p className="text-xs text-slate-400">For self-occupied property - Max ₹2 Lakh per year</p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-300 font-semibold">Total Other Deductions: ₹{formatCurrency(totalOtherDeductions)}</p>
          </div>
        </CardContent>
      </Card>

      {/* DEDUCTION SUMMARY */}
      <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-600/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-200">Deduction Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30">
              <h4 className="text-slate-300 font-semibold mb-2">Salary Deductions</h4>
              <p className="text-2xl font-bold text-white">₹{formatCurrency(totalSalaryDeductions)}</p>
              <p className="text-xs text-slate-400 mt-1">HRA, LTA, Professional Tax, etc.</p>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30">
              <h4 className="text-slate-300 font-semibold mb-2">Section 80 Deductions</h4>
              <p className="text-2xl font-bold text-white">₹{formatCurrency(totalSection80Deductions)}</p>
              <p className="text-xs text-slate-400 mt-1">80C, 80D, 80E, 80G, etc.</p>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30">
              <h4 className="text-slate-300 font-semibold mb-2">Other Deductions</h4>
              <p className="text-2xl font-bold text-white">₹{formatCurrency(totalOtherDeductions)}</p>
              <p className="text-xs text-slate-400 mt-1">Home Loan Interest</p>
            </div>
          </div>
          
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-500/30">
            <h4 className="text-slate-300 font-semibold text-lg mb-2">Total Deductions (Old Regime)</h4>
            <p className="text-3xl font-bold text-white">₹{formatCurrency(totalDeductions)}</p>
            <p className="text-sm text-slate-400 mt-2">
              These deductions will reduce your taxable income in the Old Tax Regime
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
