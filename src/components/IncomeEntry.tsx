
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, User } from 'lucide-react';
import { IncomeData } from '@/utils/taxCalculations';

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
  const updateIncome = (field: keyof IncomeData, value: number) => {
    setIncome({ ...income, [field]: value });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Document uploaded:', file.name);
      alert('Document scanning feature requires backend integration for OCR processing. Currently showing placeholder functionality.');
    }
  };

  // Calculate total income excluding basic salary (basic salary is not separate income)
  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;

  return (
    <div className="space-y-6">
      {/* Taxpayer Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
            <User className="w-5 h-5" />
            Taxpayer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="taxpayerName">Full Name</Label>
            <Input
              id="taxpayerName"
              type="text"
              value={taxpayerName}
              onChange={(e) => setTaxpayerName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Section */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Scanner
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
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs text-orange-600 font-medium">
                ⚠️ OCR Feature Status: Requires backend integration for document processing. Currently showing placeholder functionality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">Salary Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="salary">Annual Salary (Total CTC)</Label>
            <Input
              id="salary"
              type="number"
              value={income.salary || ''}
              onChange={(e) => updateIncome('salary', Number(e.target.value) || 0)}
              placeholder="Enter your total annual salary"
              className="mt-1"
            />
            {income.salary > 0 && (
              <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.salary)}</p>
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
          ₹{formatCurrency(totalIncome)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Note: Basic salary is included in annual salary and used only for HRA calculation
        </p>
      </div>
    </div>
  );
};
