import React from 'react';
import { IncomeData } from '@/utils/taxCalculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, DollarSign, Building, Briefcase, AlertTriangle, Info } from 'lucide-react';

interface IncomeEntryProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
  taxpayerName: string;
  setTaxpayerName: (name: string) => void;
}

export const IncomeEntry: React.FC<IncomeEntryProps> = ({
  income,
  setIncome,
  taxpayerName,
  setTaxpayerName
}) => {
  const handleIncomeChange = (field: keyof Omit<IncomeData, 'capitalGains'>, value: number) => {
    setIncome({
      ...income,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalCapitalGains = income.capitalGains.reduce((sum, gain) => sum + gain.amount, 0);
  const totalIncome = income.salary + income.businessIncome + totalCapitalGains + income.otherSources;

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
    return alerts;
  };

  const validationAlerts = getValidationAlerts();

  return (
    <div className="uniform-tab-content">
      {/* Validation Alerts */}
      {validationAlerts.map((alert, index) => (
        <Alert key={index} className={`mb-4 ${alert.type === 'warning' ? 'uniform-alert-warning' : 'uniform-alert-info'}`}>
          {alert.type === 'warning' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertDescription>
            {alert.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Personal Information */}
      <Card className="uniform-card">
        <CardHeader className="uniform-card-header">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="uniform-card-content">
          <div className="uniform-input-group">
            <Label className="uniform-input-label">Taxpayer Name</Label>
            <Input
              type="text"
              value={taxpayerName}
              onChange={(e) => setTaxpayerName(e.target.value)}
              placeholder="Enter your full name"
              className="uniform-focus-input"
            />
            <p className="text-xs text-muted-foreground">This will appear on your tax calculation report</p>
          </div>
        </CardContent>
      </Card>

      {/* Salary Income */}
      <Card className="uniform-card">
        <CardHeader className="uniform-card-header">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Salary Income
          </CardTitle>
        </CardHeader>
        <CardContent className="uniform-card-content">
          <div className="uniform-form-grid">
            <div className="uniform-input-group">
              <Label className="uniform-input-label">Annual Salary (CTC)</Label>
              <Input
                type="number"
                value={income.salary || ''}
                onChange={(e) => handleIncomeChange('salary', Number(e.target.value) || 0)}
                placeholder="Enter your annual CTC"
                className="uniform-focus-input"
              />
              <p className="text-xs text-muted-foreground">Complete Cost to Company including all allowances</p>
            </div>

            <div className="uniform-input-group">
              <Label className="uniform-input-label">Basic Salary (Annual)</Label>
              <Input
                type="number"
                value={income.basicSalary || ''}
                onChange={(e) => handleIncomeChange('basicSalary', Number(e.target.value) || 0)}
                placeholder="Enter your basic salary"
                className="uniform-focus-input"
              />
              <p className="text-xs text-muted-foreground">Basic salary component for HRA calculation (typically 40-50% of CTC)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business & Professional Income */}
      <Card className="uniform-card">
        <CardHeader className="uniform-card-header">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Business & Professional Income
          </CardTitle>
        </CardHeader>
        <CardContent className="uniform-card-content">
          <div className="uniform-input-group">
            <Label className="uniform-input-label">Business/Professional Income</Label>
            <Input
              type="number"
              value={income.businessIncome || ''}
              onChange={(e) => handleIncomeChange('businessIncome', Number(e.target.value) || 0)}
              placeholder="Enter net business income"
              className="uniform-focus-input"
            />
            <p className="text-xs text-muted-foreground">Net profit from business or professional services (after all business expenses)</p>
          </div>
          
          {income.businessIncome > 0 && (
            <Alert className="uniform-alert-info mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Business income is taxed as per your slab rate. Consider business deductions and GST implications.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Other Income */}
      <Card className="uniform-card">
        <CardHeader className="uniform-card-header">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Other Income Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="uniform-card-content">
          <div className="uniform-input-group">
            <Label className="uniform-input-label">Other Sources Income</Label>
            <Input
              type="number"
              value={income.otherSources || ''}
              onChange={(e) => handleIncomeChange('otherSources', Number(e.target.value) || 0)}
              placeholder="Interest, dividends, rental etc."
              className="uniform-focus-input"
            />
            <p className="text-xs text-muted-foreground">Interest from savings/FD, dividends, rental income, freelance income, etc.</p>
          </div>
          
          {income.otherSources > 50000 && (
            <Alert className="uniform-alert-success mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Consider Section 80TTA deduction (up to ₹10,000) on savings account interest.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Income Summary */}
      <Card className="uniform-card border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="uniform-card-content">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Income Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="uniform-card p-4 text-center uniform-hover-card">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Salary</h4>
              <p className="text-lg font-bold text-foreground">₹{formatCurrency(income.salary)}</p>
            </div>
            
            <div className="uniform-card p-4 text-center uniform-hover-card">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Business</h4>
              <p className="text-lg font-bold text-foreground">₹{formatCurrency(income.businessIncome)}</p>
            </div>
            
            <div className="uniform-card p-4 text-center uniform-hover-card">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Capital Gains</h4>
              <p className="text-lg font-bold text-foreground">₹{formatCurrency(totalCapitalGains)}</p>
              <p className="text-xs text-muted-foreground">{income.capitalGains.length} asset{income.capitalGains.length !== 1 ? 's' : ''}</p>
            </div>
            
            <div className="uniform-card p-4 text-center uniform-hover-card">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Other Sources</h4>
              <p className="text-lg font-bold text-foreground">₹{formatCurrency(income.otherSources)}</p>
            </div>
          </div>
          
          <div className="uniform-card bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-primary/30">
            <h4 className="text-lg font-semibold text-foreground mb-2">Total Annual Income</h4>
            <p className="text-3xl font-bold text-primary">₹{formatCurrency(totalIncome)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This is your total income before deductions and tax calculations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
