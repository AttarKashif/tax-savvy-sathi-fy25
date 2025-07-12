
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Receipt, Building, CreditCard, Home, DollarSign, Info, ShoppingCart, Plane, Car, Gem, Hotel } from 'lucide-react';
import { TDSData, TCSData } from '@/utils/taxCalculations';

interface TDSTCSEntryProps {
  tdsData: TDSData;
  setTDSData: (tds: TDSData) => void;
  tcsData: TCSData;
  setTCSData: (tcs: TCSData) => void;
}

export const TDSTCSEntry: React.FC<TDSTCSEntryProps> = ({
  tdsData,
  setTDSData,
  tcsData,
  setTCSData
}) => {
  const handleTDSChange = (field: keyof TDSData, value: number) => {
    setTDSData({
      ...tdsData,
      [field]: value
    });
  };

  const handleTCSChange = (field: keyof TCSData, value: number) => {
    setTCSData({
      ...tcsData,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalTDS = tdsData.salary + tdsData.professionalServices + tdsData.interestFromBank + 
                   tdsData.rentReceived + tdsData.otherTDS;

  const totalTCS = tcsData.saleOfGoods + tcsData.foreignRemittance + tcsData.motorVehicles + 
                   tcsData.jewelryPurchase + tcsData.hotelBills + tcsData.otherTCS;

  const totalTaxDeducted = totalTDS + totalTCS;

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

  const tcsCategories = [
    {
      key: 'saleOfGoods' as keyof TCSData,
      label: 'Sale of Goods TCS',
      description: 'TCS on sale of goods above ₹50 lakh (0.1%)',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      key: 'foreignRemittance' as keyof TCSData,
      label: 'Foreign Remittance TCS',
      description: 'TCS on foreign remittance under LRS (5%)',
      icon: Plane,
      color: 'purple'
    },
    {
      key: 'motorVehicles' as keyof TCSData,
      label: 'Motor Vehicle TCS',
      description: 'TCS on purchase of motor vehicles above ₹10 lakh (1%)',
      icon: Car,
      color: 'green'
    },
    {
      key: 'jewelryPurchase' as keyof TCSData,
      label: 'Jewelry Purchase TCS',
      description: 'TCS on jewelry purchase above ₹2 lakh (1%)',
      icon: Gem,
      color: 'orange'
    },
    {
      key: 'hotelBills' as keyof TCSData,
      label: 'Hotel Bills TCS',
      description: 'TCS on hotel bills above ₹20,000 (1%)',
      icon: Hotel,
      color: 'red'
    },
    {
      key: 'otherTCS' as keyof TCSData,
      label: 'Other TCS',
      description: 'Any other TCS collections',
      icon: Receipt,
      color: 'gray'
    }
  ];

  const inputClassName = "bg-slate-700/50 border-slate-600/40 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200";
  const cardClassName = "bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200";

  return (
    <div className="space-y-6">
      {/* TDS Section */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              Tax Deducted at Source (TDS)
            </div>
            {totalTDS > 0 && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-xl">
                Total: ₹{formatCurrency(totalTDS)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-500/10 border-blue-500/20 rounded-xl">
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
                    className={inputClassName}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* TCS Section */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              Tax Collected at Source (TCS)
            </div>
            {totalTCS > 0 && (
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 rounded-xl">
                Total: ₹{formatCurrency(totalTCS)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-indigo-500/10 border-indigo-500/20 rounded-xl">
            <Info className="h-4 w-4 text-indigo-400" />
            <AlertDescription className="text-indigo-200">
              Enter TCS amounts collected on your purchases/transactions. TCS certificates are issued by the collector.
              This will be adjusted against your final tax liability.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tcsCategories.map((category) => {
              const IconComponent = category.icon;
              const colorClasses = {
                blue: 'bg-blue-600',
                purple: 'bg-purple-600',
                green: 'bg-green-600',
                orange: 'bg-orange-600',
                red: 'bg-red-600',
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
                    value={tcsData[category.key] || ''}
                    onChange={(e) => handleTCSChange(category.key, Number(e.target.value) || 0)}
                    placeholder="Enter TCS amount"
                    className={inputClassName}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Combined Summary */}
      {totalTaxDeducted > 0 && (
        <Card className="bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-2xl">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">₹{formatCurrency(totalTDS)}</div>
                <p className="text-slate-300 text-sm">Total TDS</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">₹{formatCurrency(totalTCS)}</div>
                <p className="text-slate-300 text-sm">Total TCS</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">₹{formatCurrency(totalTaxDeducted)}</div>
                <p className="text-slate-300 text-sm">Total Tax Deducted/Collected</p>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-2 rounded-xl">
                  Advance Tax Credit
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="bg-amber-500/10 border-amber-500/20 rounded-xl">
        <Info className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200">
          <div className="space-y-2">
            <div><strong>Important:</strong> Keep all TDS/TCS certificates safe for ITR filing</div>
            <div>• Form 16 for salary TDS</div>
            <div>• Form 16A for other TDS</div>
            <div>• TCS certificates from collectors</div>
            <div>• Verify TDS/TCS details in Form 26AS</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
