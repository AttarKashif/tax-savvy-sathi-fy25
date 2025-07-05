
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Receipt, Building, CreditCard, Home, DollarSign, Info } from 'lucide-react';
import { TDSData } from '@/utils/taxCalculations';

interface TDSEntryProps {
  tdsData: TDSData;
  setTDSData: (tds: TDSData) => void;
}

export const TDSEntry: React.FC<TDSEntryProps> = ({
  tdsData,
  setTDSData
}) => {
  const handleTDSChange = (field: keyof TDSData, value: number) => {
    setTDSData({
      ...tdsData,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalTDS = tdsData.salary + tdsData.professionalServices + tdsData.interestFromBank + 
                   tdsData.rentReceived + tdsData.otherTDS;

  const tdsCategories = [
    {
      key: 'salary' as keyof TDSData,
      label: 'Salary TDS',
      description: 'Tax deducted by your employer (from Form 16)',
      icon: Building,
      color: 'blue'
    },
    {
      key: 'professionalServices' as keyof TDSData,
      label: 'Professional Services TDS',
      description: 'TDS on freelance/consultancy income (10%)',
      icon: CreditCard,
      color: 'purple'
    },
    {
      key: 'interestFromBank' as keyof TDSData,
      label: 'Interest TDS',
      description: 'TDS on bank/FD interest (10%)',
      icon: DollarSign,
      color: 'green'
    },
    {
      key: 'rentReceived' as keyof TDSData,
      label: 'Rent TDS',
      description: 'TDS on rent received (10%)',
      icon: Home,
      color: 'orange'
    },
    {
      key: 'otherTDS' as keyof TDSData,
      label: 'Other TDS',
      description: 'Any other TDS deductions',
      icon: Receipt,
      color: 'gray'
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            Tax Deducted at Source (TDS)
          </div>
          {totalTDS > 0 && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Total: ₹{formatCurrency(totalTDS)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            Enter the TDS amounts as shown in your Form 16, Form 16A, or TDS certificates. 
            This will be adjusted against your final tax liability.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tdsCategories.map((category) => {
            const IconComponent = category.icon;
            const colorClasses = {
              blue: 'bg-blue-600',
              purple: 'bg-purple-600',
              green: 'bg-green-600',
              orange: 'bg-orange-600',
              gray: 'bg-gray-600'
            };

            return (
              <div key={category.key} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-slate-200 font-medium text-sm">{category.label}</Label>
                    <p className="text-xs text-slate-400">{category.description}</p>
                  </div>
                </div>
                
                <Input
                  type="number"
                  value={tdsData[category.key] || ''}
                  onChange={(e) => handleTDSChange(category.key, Number(e.target.value) || 0)}
                  placeholder="Enter TDS amount"
                  className="bg-slate-700/50 border-slate-600/40 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200"
                />
              </div>
            );
          })}
        </div>

        {totalTDS > 0 && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-emerald-200 font-semibold">Total TDS Deducted</h4>
                <p className="text-slate-300 text-sm">This amount will be adjusted against your tax liability</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">₹{formatCurrency(totalTDS)}</div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-1">
                  Pre-paid Tax
                </Badge>
              </div>
            </div>
          </div>
        )}

        <Alert className="bg-amber-500/10 border-amber-500/20">
          <Info className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            <div className="space-y-2">
              <div><strong>Important:</strong> Keep all TDS certificates safe for ITR filing</div>
              <div>• Form 16 for salary TDS</div>
              <div>• Form 16A for other TDS</div>
              <div>• Verify TDS details in Form 26AS</div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
