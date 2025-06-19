
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { IncomeData } from '@/utils/taxCalculations';

interface IncomeEntryProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
}

export const IncomeEntry: React.FC<IncomeEntryProps> = ({ income, setIncome }) => {
  const updateIncome = (field: keyof IncomeData, value: number) => {
    const newIncome = { ...income, [field]: value };
    // Auto-calculate basic salary as 40% of annual salary (common practice)
    if (field === 'salary') {
      newIncome.basicSalary = Math.round(value * 0.4);
    }
    setIncome(newIncome);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // This is a placeholder for document scanning functionality
      // In a real implementation, you would send the file to an OCR service
      console.log('Document uploaded:', file.name);
      alert('Document scanning feature will be implemented soon. This will automatically extract data from Form 16, Form 26AS, and other tax documents.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Scanner (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload your Form 16, Form 26AS, or salary slips to automatically extract income data
            </p>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById('document-upload')?.click()}>
                <Upload className="w-4 h-4" />
                Upload Tax Document
              </Button>
              <input
                id="document-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-blue-600">
              Supported formats: PDF, JPG, PNG. Supports Form 16, Form 26AS, ITR forms, and salary slips.
            </p>
          </div>
        </CardContent>
      </Card>

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
              value={income.salary || ''}
              onChange={(e) => updateIncome('salary', Number(e.target.value) || 0)}
              placeholder="Enter your total annual salary"
              className="mt-1"
            />
            {income.salary > 0 && (
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">₹{formatCurrency(income.salary)}</p>
                <p className="text-xs text-blue-600">
                  Basic salary estimated as ₹{formatCurrency(income.basicSalary)} (40% of annual salary)
                </p>
              </div>
            )}
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
              value={income.businessIncome || ''}
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
              value={income.capitalGainsShort || ''}
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
              value={income.capitalGainsLong || ''}
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
              value={income.otherSources || ''}
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
