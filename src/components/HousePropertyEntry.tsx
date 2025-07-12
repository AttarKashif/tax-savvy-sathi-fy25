
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Home, Calculator, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { HousePropertyData, calculateHousePropertyIncome } from '@/utils/taxCalculations';

interface HousePropertyEntryProps {
  houseProperty: HousePropertyData;
  setHouseProperty: (data: HousePropertyData) => void;
}

export const HousePropertyEntry: React.FC<HousePropertyEntryProps> = ({
  houseProperty,
  setHouseProperty
}) => {
  const handlePropertyChange = (field: keyof HousePropertyData, value: number | boolean) => {
    setHouseProperty({
      ...houseProperty,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const housePropertyIncome = calculateHousePropertyIncome(houseProperty);
  const isLoss = housePropertyIncome < 0;

  const inputClassName = "bg-slate-700/50 border-slate-600/40 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200";
  const cardClassName = "bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200";

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle className="text-xl text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            House Property Income
          </div>
          {Math.abs(housePropertyIncome) > 0 && (
            <Badge className={`${isLoss ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} rounded-xl`}>
              {isLoss ? 'Loss' : 'Income'}: ₹{formatCurrency(Math.abs(housePropertyIncome))}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-500/10 border-blue-500/20 rounded-xl">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            Income from house property includes rental income from let-out properties and deemed income from vacant properties.
            Self-occupied properties generally show loss due to home loan interest deduction.
          </AlertDescription>
        </Alert>

        {/* Property Type Selection */}
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-slate-200 font-medium">Property Type</Label>
              <p className="text-xs text-slate-400 mt-1">
                {houseProperty.isLetOut ? 'Let-out property with rental income' : 'Self-occupied property'}
              </p>
            </div>
            <Switch
              checked={houseProperty.isLetOut}
              onCheckedChange={(checked) => handlePropertyChange('isLetOut', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-200 font-medium text-sm">
                {houseProperty.isLetOut ? 'Annual Rent Received' : 'Annual Rental Value (if any)'}
              </Label>
              <Input
                type="number"
                value={houseProperty.annualRentReceived || ''}
                onChange={(e) => handlePropertyChange('annualRentReceived', Number(e.target.value) || 0)}
                placeholder={houseProperty.isLetOut ? "Enter annual rent" : "Enter if deemed let-out"}
                className={inputClassName}
              />
            </div>

            {!houseProperty.isLetOut && (
              <div className="space-y-2">
                <Label className="text-slate-200 font-medium text-sm">Number of Self-Occupied Properties</Label>
                <Input
                  type="number"
                  value={houseProperty.selfOccupiedCount || 1}
                  onChange={(e) => handlePropertyChange('selfOccupiedCount', Math.max(1, Number(e.target.value) || 1))}
                  placeholder="Enter count"
                  className={inputClassName}
                  min="1"
                />
                <p className="text-xs text-slate-400">Up to 2 self-occupied properties are exempt from deemed rental income</p>
              </div>
            )}
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
          <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Allowable Deductions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-200 font-medium text-sm">Municipal Taxes Paid</Label>
              <Input
                type="number"
                value={houseProperty.municipalTaxes || ''}
                onChange={(e) => handlePropertyChange('municipalTaxes', Number(e.target.value) || 0)}
                placeholder="Enter municipal taxes"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Property tax, water tax, etc.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 font-medium text-sm">Repair & Maintenance</Label>
              <Input
                type="number"
                value={houseProperty.repairMaintenance || ''}
                onChange={(e) => handlePropertyChange('repairMaintenance', Number(e.target.value) || 0)}
                placeholder="Enter repair costs"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Actual repair and maintenance expenses</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 font-medium text-sm">Interest on Housing Loan</Label>
              <Input
                type="number"
                value={houseProperty.interestOnLoan || ''}
                onChange={(e) => handlePropertyChange('interestOnLoan', Number(e.target.value) || 0)}
                placeholder="Enter loan interest"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">
                {houseProperty.isLetOut ? 'Full interest amount allowed' : 'Max ₹2 lakh for self-occupied'}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 font-medium text-sm">Other Expenses</Label>
              <Input
                type="number"
                value={houseProperty.otherExpenses || ''}
                onChange={(e) => handlePropertyChange('otherExpenses', Number(e.target.value) || 0)}
                placeholder="Enter other expenses"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Insurance, broker commission, etc.</p>
            </div>
          </div>
        </div>

        {/* Calculation Summary */}
        {(houseProperty.annualRentReceived > 0 || houseProperty.interestOnLoan > 0) && (
          <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Income Calculation</h3>
            
            {houseProperty.isLetOut ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Annual Rent Received:</span>
                  <span className="text-white">₹{formatCurrency(houseProperty.annualRentReceived)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Less: Municipal Taxes:</span>
                  <span className="text-red-400">₹{formatCurrency(houseProperty.municipalTaxes)}</span>
                </div>
                
                <div className="flex justify-between text-sm border-t border-slate-600 pt-2">
                  <span className="text-slate-400">Net Annual Value (NAV):</span>
                  <span className="text-white">₹{formatCurrency(Math.max(0, houseProperty.annualRentReceived - houseProperty.municipalTaxes))}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Less: Standard Deduction (30% of NAV):</span>
                  <span className="text-red-400">₹{formatCurrency(Math.max(0, houseProperty.annualRentReceived - houseProperty.municipalTaxes) * 0.3)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Less: Interest on Housing Loan:</span>
                  <span className="text-red-400">₹{formatCurrency(houseProperty.interestOnLoan)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Less: Other Expenses:</span>
                  <span className="text-red-400">₹{formatCurrency(houseProperty.repairMaintenance + houseProperty.otherExpenses)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Interest on Housing Loan:</span>
                  <span className="text-red-400">₹{formatCurrency(houseProperty.interestOnLoan)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Maximum Deduction Allowed:</span>
                  <span className="text-red-400">₹{formatCurrency(Math.min(200000, houseProperty.interestOnLoan))}</span>
                </div>
              </div>
            )}
            
            <div className="border-t border-slate-600 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-semibold">House Property Income/Loss:</span>
                <div className="flex items-center gap-2">
                  {isLoss ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  <span className={`text-lg font-bold ${isLoss ? 'text-red-400' : 'text-green-400'}`}>
                    {isLoss ? '-' : ''}₹{formatCurrency(Math.abs(housePropertyIncome))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Alert className="bg-amber-500/10 border-amber-500/20 rounded-xl">
          <Info className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            <div className="space-y-2">
              <div><strong>Key Points:</strong></div>
              <div>• Loss from house property can be set off against other income (except salary)</div>
              <div>• Maximum loss that can be set off in a year is ₹2 lakh</div>
              <div>• Excess loss can be carried forward for 8 years</div>
              <div>• Up to 2 self-occupied properties are exempt from deemed rental income</div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
