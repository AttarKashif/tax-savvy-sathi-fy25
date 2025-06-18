
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TaxResult } from '@/utils/taxCalculations';
import { CircleCheck } from 'lucide-react';

interface TaxComparisonProps {
  oldRegimeResult: TaxResult;
  newRegimeResult: TaxResult;
  recommendation: {
    recommendedRegime: 'old' | 'new';
    savings: number;
    percentageSavings: number;
    oldRegimeTax: number;
    newRegimeTax: number;
  };
  age: number;
}

export const TaxComparison: React.FC<TaxComparisonProps> = ({
  oldRegimeResult,
  newRegimeResult,
  recommendation,
  age
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  const chartData = [
    {
      regime: 'Old Regime',
      tax: oldRegimeResult.totalTax,
      recommended: recommendation.recommendedRegime === 'old'
    },
    {
      regime: 'New Regime',
      tax: newRegimeResult.totalTax,
      recommended: recommendation.recommendedRegime === 'new'
    }
  ];

  const pieData = [
    { name: 'Tax Payable', value: recommendation.recommendedRegime === 'old' ? oldRegimeResult.totalTax : newRegimeResult.totalTax },
    { name: 'After-tax Income', value: oldRegimeResult.grossIncome - (recommendation.recommendedRegime === 'old' ? oldRegimeResult.totalTax : newRegimeResult.totalTax) }
  ];

  const COLORS = ['#ef4444', '#22c55e'];

  const getAgeCategory = (age: number) => {
    if (age >= 80) return 'Super Senior Citizen (80+ years)';
    if (age >= 60) return 'Senior Citizen (60-79 years)';
    return 'Regular (Below 60 years)';
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Banner */}
      <Card className={`${recommendation.recommendedRegime === 'new' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <CircleCheck className={`w-8 h-8 ${recommendation.recommendedRegime === 'new' ? 'text-green-600' : 'text-blue-600'}`} />
            <div>
              <h3 className="text-xl font-bold">
                Recommended: {recommendation.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
              </h3>
              <p className="text-gray-600">
                You can save ₹{formatCurrency(recommendation.savings)} ({recommendation.percentageSavings.toFixed(1)}%) by choosing this regime
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Old Regime Tax</p>
              <p className="text-lg font-bold">₹{formatCurrency(recommendation.oldRegimeTax)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">New Regime Tax</p>
              <p className="text-lg font-bold">₹{formatCurrency(recommendation.newRegimeTax)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Your Savings</p>
              <p className="text-lg font-bold text-green-600">₹{formatCurrency(recommendation.savings)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Liability Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="regime" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`₹${formatCurrency(Number(value))}`, 'Tax Amount']} />
              <Bar dataKey="tax" fill={(entry) => entry.recommended ? '#22c55e' : '#94a3b8'} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old Regime */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Old Tax Regime
              {recommendation.recommendedRegime === 'old' && (
                <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Gross Income:</span>
              <span className="font-semibold">₹{formatCurrency(oldRegimeResult.grossIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Deductions:</span>
              <span className="font-semibold text-green-600">-₹{formatCurrency(oldRegimeResult.totalDeductions)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxable Income:</span>
              <span className="font-semibold">₹{formatCurrency(oldRegimeResult.taxableIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Before Rebate:</span>
              <span>₹{formatCurrency(oldRegimeResult.taxBeforeRebate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Section 87A Rebate:</span>
              <span className="text-green-600">-₹{formatCurrency(oldRegimeResult.rebateAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax After Rebate:</span>
              <span>₹{formatCurrency(oldRegimeResult.taxAfterRebate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Surcharge:</span>
              <span>₹{formatCurrency(oldRegimeResult.surcharge)}</span>
            </div>
            <div className="flex justify-between">
              <span>Health & Education Cess:</span>
              <span>₹{formatCurrency(oldRegimeResult.cess)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Tax:</span>
              <span>₹{formatCurrency(oldRegimeResult.totalTax)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Effective Rate:</span>
              <span>{oldRegimeResult.effectiveRate.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* New Regime */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              New Tax Regime
              {recommendation.recommendedRegime === 'new' && (
                <Badge className="bg-green-100 text-green-800">Recommended</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Gross Income:</span>
              <span className="font-semibold">₹{formatCurrency(newRegimeResult.grossIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Deduction:</span>
              <span className="font-semibold text-green-600">-₹{formatCurrency(newRegimeResult.totalDeductions)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxable Income:</span>
              <span className="font-semibold">₹{formatCurrency(newRegimeResult.taxableIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Before Rebate:</span>
              <span>₹{formatCurrency(newRegimeResult.taxBeforeRebate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Section 87A Rebate:</span>
              <span className="text-green-600">-₹{formatCurrency(newRegimeResult.rebateAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax After Rebate:</span>
              <span>₹{formatCurrency(newRegimeResult.taxAfterRebate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Surcharge:</span>
              <span>₹{formatCurrency(newRegimeResult.surcharge)}</span>
            </div>
            <div className="flex justify-between">
              <span>Health & Education Cess:</span>
              <span>₹{formatCurrency(newRegimeResult.cess)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Tax:</span>
              <span>₹{formatCurrency(newRegimeResult.totalTax)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Effective Rate:</span>
              <span>{newRegimeResult.effectiveRate.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Income Distribution (Recommended Regime)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${formatCurrency(value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${formatCurrency(Number(value))}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tax Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Summary & Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Taxpayer Details</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Age:</strong> {age} years</li>
                <li><strong>Category:</strong> {getAgeCategory(age)}</li>
                <li><strong>Assessment Year:</strong> 2025-26</li>
                <li><strong>Financial Year:</strong> 2024-25</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Key Benefits</h4>
              <ul className="space-y-2 text-sm">
                {recommendation.recommendedRegime === 'new' ? (
                  <>
                    <li>✅ Higher standard deduction (₹75,000)</li>
                    <li>✅ Higher rebate limit (₹7 lakh)</li>
                    <li>✅ Simplified tax structure</li>
                    <li>✅ No complex deduction calculations</li>
                  </>
                ) : (
                  <>
                    <li>✅ Multiple deduction benefits</li>
                    <li>✅ Tax-saving investment options</li>
                    <li>✅ HRA and other allowances</li>
                    <li>✅ Lower tax with proper planning</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
