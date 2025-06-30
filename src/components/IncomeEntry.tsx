import React from 'react';
import { IncomeData } from '@/utils/taxCalculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, DollarSign, TrendingUp, PiggyBank, Building, Briefcase, AlertTriangle, Info } from 'lucide-react';

interface IncomeEntryProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
  taxpayerName: string;
  setTaxpayerName: (name: string) => void;
}

export const IncomeEntry: React.FC<IncomeEntryProps> = ({ income, setIncome, taxpayerName, setTaxpayerName }) => {
  const handleIncomeChange = (field: keyof IncomeData, value: number) => {
    setIncome({
      ...income,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;

  // Smart validations
  const getValidationAlerts = () => {
    const alerts = [];
    
    if (income.basicSalary > income.salary && income.salary > 0) {
      alerts.push({
        type: "warning",
        message: "Basic salary cannot exceed total salary"
      });
    }
    
    if (income.salary > 5000000) {
      alerts.push({
        type: "info",
        message: "High salary detected - ensure accurate reporting for surcharge calculations"
      });
    }
    
    if (income.capitalGainsLong > 100000) {
      alerts.push({
        type: "info", 
        message: "LTCG above ₹1 lakh is taxable at 10% (without indexation)"
      });
    }

    return alerts;
  };

  const validationAlerts = getValidationAlerts();
  const inputClassName = "bg-slate-700/50 border-slate-600/40 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition-all duration-200 hover:bg-slate-700/70";
  const labelClassName = "text-slate-200 font-medium text-sm";
  const cardClassName = "bg-slate-800/50 border-slate-600/30 backdrop-blur-sm rounded-2xl shadow-lg hover:bg-slate-800/60 transition-all duration-200";

  return (
    <div className="space-y-6">
      {/* Validation Alerts */}
      {validationAlerts.map((alert, index) => (
        <Alert key={index} className={`${alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
          {alert.type === 'warning' ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          ) : (
            <Info className="h-4 w-4 text-blue-400" />
          )}
          <AlertDescription className={alert.type === 'warning' ? 'text-amber-200' : 'text-blue-200'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Personal Information */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className={labelClassName}>Taxpayer Name</Label>
            <Input 
              type="text" 
              value={taxpayerName} 
              onChange={e => setTaxpayerName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClassName}
            />
            <p className="text-xs text-slate-400">This will appear on your tax calculation report</p>
          </div>
        </CardContent>
      </Card>

      {/* Salary Income */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <Building className="w-6 h-6" />
            Salary Income
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClassName}>Annual Salary (CTC)</Label>
              <Input 
                type="number" 
                value={income.salary || ''} 
                onChange={e => handleIncomeChange('salary', Number(e.target.value) || 0)}
                placeholder="Enter your annual CTC"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Complete Cost to Company including all allowances</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Basic Salary (Annual)</Label>
              <Input 
                type="number" 
                value={income.basicSalary || ''} 
                onChange={e => handleIncomeChange('basicSalary', Number(e.target.value) || 0)}
                placeholder="Enter your basic salary"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">Basic salary component for HRA calculation (typically 40-50% of CTC)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business & Professional Income */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Business & Professional Income
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className={labelClassName}>Business/Professional Income</Label>
            <Input 
              type="number" 
              value={income.businessIncome || ''} 
              onChange={e => handleIncomeChange('businessIncome', Number(e.target.value) || 0)}
              placeholder="Enter net business income"
              className={inputClassName}
            />
            <p className="text-xs text-slate-400">Net profit from business or professional services (after all business expenses)</p>
          </div>
          
          {income.businessIncome > 0 && (
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Business income is taxed as per your slab rate. Consider business deductions and GST implications.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Capital Gains */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <PiggyBank className="w-6 h-6" />
            Capital Gains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClassName}>Short-term Capital Gains</Label>
              <Input 
                type="number" 
                value={income.capitalGainsShort || ''} 
                onChange={e => handleIncomeChange('capitalGainsShort', Number(e.target.value) || 0)}
                placeholder="STCG amount"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">From assets held for less than 1 year (taxed as per slab)</p>
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Long-term Capital Gains</Label>
              <Input 
                type="number" 
                value={income.capitalGainsLong || ''} 
                onChange={e => handleIncomeChange('capitalGainsLong', Number(e.target.value) || 0)}
                placeholder="LTCG amount"
                className={inputClassName}
              />
              <p className="text-xs text-slate-400">From assets held for more than 1 year (10% above ₹1 lakh)</p>
            </div>
          </div>
          
          {(income.capitalGainsShort > 0 || income.capitalGainsLong > 0) && (
            <Alert className="bg-purple-500/10 border-purple-500/20">
              <Info className="h-4 w-4 text-purple-400" />
              <AlertDescription className="text-purple-200">
                Capital gains from equity mutual funds and shares have different tax rates. Ensure proper classification.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Other Income */}
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Other Income Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className={labelClassName}>Other Sources Income</Label>
            <Input 
              type="number" 
              value={income.otherSources || ''} 
              onChange={e => handleIncomeChange('otherSources', Number(e.target.value) || 0)}
              placeholder="Interest, dividends, rental etc."
              className={inputClassName}
            />
            <p className="text-xs text-slate-400">Interest from savings/FD, dividends, rental income, freelance income, etc.</p>
          </div>
          
          {income.otherSources > 50000 && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <Info className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                Consider Section 80TTA deduction (up to ₹10,000) on savings account interest.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Income Summary */}
      <Card className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-600/50 backdrop-blur-sm rounded-2xl shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-200">Income Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30 text-center">
              <h4 className="text-slate-300 font-semibold mb-2">Salary</h4>
              <p className="text-lg font-bold text-white">₹{formatCurrency(income.salary)}</p>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30 text-center">
              <h4 className="text-slate-300 font-semibold mb-2">Business</h4>
              <p className="text-lg font-bold text-white">₹{formatCurrency(income.businessIncome)}</p>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30 text-center">
              <h4 className="text-slate-300 font-semibold mb-2">Capital Gains</h4>
              <p className="text-lg font-bold text-white">₹{formatCurrency(income.capitalGainsShort + income.capitalGainsLong)}</p>
            </div>
            
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30 text-center">
              <h4 className="text-slate-300 font-semibold mb-2">Other Sources</h4>
              <p className="text-lg font-bold text-white">₹{formatCurrency(income.otherSources)}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-700/60 to-slate-600/60 p-4 rounded-xl border border-slate-500/30">
            <h4 className="text-slate-300 font-semibold text-lg mb-2">Total Annual Income</h4>
            <p className="text-3xl font-bold text-white">₹{formatCurrency(totalIncome)}</p>
            <p className="text-sm text-slate-400 mt-2">
              This is your total income before deductions and tax calculations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
