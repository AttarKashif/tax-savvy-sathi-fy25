import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeductionData } from '@/utils/taxCalculations';

interface DeductionGroupsProps {
  deductions: DeductionData;
  onUpdate: (field: keyof DeductionData, value: number) => void;
}

export const DeductionGroups: React.FC<DeductionGroupsProps> = ({
  deductions,
  onUpdate
}) => {
  const inputClassName = "bg-slate-700/50 border-slate-600/50 text-white rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200";

  return (
    <div className="space-y-8">
      {/* Section 80C Deductions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400 border-b border-slate-600/30 pb-2">Section 80C Deductions (Max ₹1.5 Lakh)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80C Investments</Label>
            <Input 
              type="number" 
              value={deductions.section80C || ''} 
              onChange={e => onUpdate('section80C', Number(e.target.value) || 0)}
              placeholder="PPF, ELSS, etc."
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">NPS (80CCD)</Label>
            <Input 
              type="number" 
              value={deductions.section80CCD || ''} 
              onChange={e => onUpdate('section80CCD', Number(e.target.value) || 0)}
              placeholder="NPS contribution"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80CCC</Label>
            <Input 
              type="number" 
              value={deductions.section80CCC || ''} 
              onChange={e => onUpdate('section80CCC', Number(e.target.value) || 0)}
              placeholder="Pension fund"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Section 80D Health Insurance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-green-400 border-b border-slate-600/30 pb-2">Section 80D - Health Insurance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Health Insurance Premium</Label>
            <Input 
              type="number" 
              value={deductions.section80D || ''} 
              onChange={e => onUpdate('section80D', Number(e.target.value) || 0)}
              placeholder="Self & family premium"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80DDB Medical Expenses</Label>
            <Input 
              type="number" 
              value={deductions.section80DDB || ''} 
              onChange={e => onUpdate('section80DDB', Number(e.target.value) || 0)}
              placeholder="Medical treatment"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* House Property Deductions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-400 border-b border-slate-600/30 pb-2">House Property Deductions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">HRA Exemption</Label>
            <Input 
              type="number" 
              value={deductions.hra || ''} 
              onChange={e => onUpdate('hra', Number(e.target.value) || 0)}
              placeholder="HRA exemption amount"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Home Loan Interest</Label>
            <Input 
              type="number" 
              value={deductions.homeLoanInterest || ''} 
              onChange={e => onUpdate('homeLoanInterest', Number(e.target.value) || 0)}
              placeholder="Home loan interest"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Education & Loan Deductions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-orange-400 border-b border-slate-600/30 pb-2">Education & Loan Deductions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80E Education Loan</Label>
            <Input 
              type="number" 
              value={deductions.section80E || ''} 
              onChange={e => onUpdate('section80E', Number(e.target.value) || 0)}
              placeholder="Education loan interest"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80EE Home Loan</Label>
            <Input 
              type="number" 
              value={deductions.section80EE || ''} 
              onChange={e => onUpdate('section80EE', Number(e.target.value) || 0)}
              placeholder="First-time home buyer"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80EEA Home Loan</Label>
            <Input 
              type="number" 
              value={deductions.section80EEA || ''} 
              onChange={e => onUpdate('section80EEA', Number(e.target.value) || 0)}
              placeholder="Affordable housing"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Other Deductions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-400 border-b border-slate-600/30 pb-2">Other Deductions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80G Donations</Label>
            <Input 
              type="number" 
              value={deductions.section80G || ''} 
              onChange={e => onUpdate('section80G', Number(e.target.value) || 0)}
              placeholder="Charitable donations"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80TTA Savings Interest</Label>
            <Input 
              type="number" 
              value={deductions.section80TTA || ''} 
              onChange={e => onUpdate('section80TTA', Number(e.target.value) || 0)}
              placeholder="Savings account interest"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Professional Tax</Label>
            <Input 
              type="number" 
              value={deductions.professionalTax || ''} 
              onChange={e => onUpdate('professionalTax', Number(e.target.value) || 0)}
              placeholder="Professional tax paid"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80U Disability</Label>
            <Input 
              type="number" 
              value={deductions.section80U || ''} 
              onChange={e => onUpdate('section80U', Number(e.target.value) || 0)}
              placeholder="Disability deduction"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">LTA</Label>
            <Input 
              type="number" 
              value={deductions.lta || ''} 
              onChange={e => onUpdate('lta', Number(e.target.value) || 0)}
              placeholder="Leave travel allowance"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">NPS (Additional 80CCD)</Label>
            <Input 
              type="number" 
              value={deductions.nps || ''} 
              onChange={e => onUpdate('nps', Number(e.target.value) || 0)}
              placeholder="Additional NPS (50k limit)"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Exemptions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-400 border-b border-slate-600/30 pb-2">Exemptions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Gratuity Exemption</Label>
            <Input 
              type="number" 
              value={deductions.gratuity || ''} 
              onChange={e => onUpdate('gratuity', Number(e.target.value) || 0)}
              placeholder="Gratuity exemption"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">Leave Encashment</Label>
            <Input 
              type="number" 
              value={deductions.leaveEncashment || ''} 
              onChange={e => onUpdate('leaveEncashment', Number(e.target.value) || 0)}
              placeholder="Leave encashment exemption"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium">80CCG Equity Savings</Label>
            <Input 
              type="number" 
              value={deductions.section80CCG || ''} 
              onChange={e => onUpdate('section80CCG', Number(e.target.value) || 0)}
              placeholder="Equity savings scheme"
              className={inputClassName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
