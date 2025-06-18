
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IncomeData } from '@/utils/taxCalculations';

interface IncomeEntryProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
}

export const IncomeEntry: React.FC<IncomeEntryProps> = ({ income, setIncome }) => {
  const updateIncome = (field: keyof IncomeData, value: number) => {
    setIncome({ ...income, [field]: value });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">Salary Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="salary">Annual Salary (including all allowances)</Label>
            <Input
              id="salary"
              type="number"
              value={income.salary === 0 ? '' : income.salary}
              onChange={(e) => updateIncome('salary', Number(e.target.value) || 0)}
              placeholder="Enter your total annual salary"
              className="mt-1"
            />
            {income.salary > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.salary)}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="basicSalary">Basic Salary (Annual)</Label>
            <Input
              id="basicSalary"
              type="number"
              value={income.basicSalary === 0 ? '' : income.basicSalary}
              onChange={(e) => updateIncome('basicSalary', Number(e.target.value) || 0)}
              placeholder="Enter your basic salary (for HRA calculation)"
              className="mt-1"
            />
            {income.basicSalary > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.basicSalary)}</p>
            )}
            <p className="text-xs text-blue-600 mt-1">
              Basic salary is used for HRA calculation. It's typically 40-50% of annual salary.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-600">Business/Professional Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="business">Business or Professional Income</Label>
            <Input
              id="business"
              type="number"
              value={income.businessIncome === 0 ? '' : income.businessIncome}
              onChange={(e) => updateIncome('businessIncome', Number(e.target.value) || 0)}
              placeholder="Enter business/professional income"
              className="mt-1"
            />
            {income.businessIncome > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.businessIncome)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-purple-600">Capital Gains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="capitalShort">Short-term Capital Gains</Label>
            <Input
              id="capitalShort"
              type="number"
              value={income.capitalGainsShort === 0 ? '' : income.capitalGainsShort}
              onChange={(e) => updateIncome('capitalGainsShort', Number(e.target.value) || 0)}
              placeholder="Enter short-term capital gains"
              className="mt-1"
            />
            {income.capitalGainsShort > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.capitalGainsShort)}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="capitalLong">Long-term Capital Gains</Label>
            <Input
              id="capitalLong"
              type="number"
              value={income.capitalGainsLong === 0 ? '' : income.capitalGainsLong}
              onChange={(e) => updateIncome('capitalGainsLong', Number(e.target.value) || 0)}
              placeholder="Enter long-term capital gains"
              className="mt-1"
            />
            {income.capitalGainsLong > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.capitalGainsLong)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-orange-600">Other Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="otherSources">Interest, Dividends, etc.</Label>
            <Input
              id="otherSources"
              type="number"
              value={income.otherSources === 0 ? '' : income.otherSources}
              onChange={(e) => updateIncome('otherSources', Number(e.target.value) || 0)}
              placeholder="Enter income from other sources"
              className="mt-1"
            />
            {income.otherSources > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.otherSources)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Total Gross Income</h3>
        <p className="text-2xl font-bold text-blue-600">
          ₹{formatCurrency(Object.values(income).reduce((sum, value) => sum + value, 0))}
        </p>
      </div>
    </div>
  );
};
