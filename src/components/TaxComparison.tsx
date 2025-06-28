
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TaxResult, IncomeData, DeductionData } from '@/utils/taxCalculations';
import { CircleCheck, FileText, Calculator } from 'lucide-react';
import { generateTaxComparisonPDF } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  income: IncomeData;
  deductions: DeductionData;
  taxpayerName: string;
}

export const TaxComparison: React.FC<TaxComparisonProps> = ({
  oldRegimeResult,
  newRegimeResult,
  recommendation,
  age,
  income,
  deductions,
  taxpayerName
}) => {
  const { user } = useAuth();

  // Save calculation to database when component mounts
  useEffect(() => {
    const saveCalculation = async () => {
      if (!user) return;

      try {
        await supabase
          .from('tax_calculations')
          .insert([{
            user_id: user.id,
            taxpayer_name: taxpayerName,
            age: age,
            income_data: income,
            deductions_data: deductions,
            old_regime_tax: oldRegimeResult.totalTax,
            new_regime_tax: newRegimeResult.totalTax,
            recommended_regime: recommendation.recommendedRegime
          }]);
        
        console.log('Calculation saved successfully');
      } catch (error) {
        console.error('Error saving calculation:', error);
      }
    };

    saveCalculation();
  }, [user, taxpayerName, age, income, deductions, oldRegimeResult.totalTax, newRegimeResult.totalTax, recommendation.recommendedRegime]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  const handleGeneratePDF = async () => {
    const pdfData = {
      income,
      deductions,
      oldRegimeResult,
      newRegimeResult,
      recommendation,
      age,
      taxpayerName
    };
    
    try {
      await generateTaxComparisonPDF(pdfData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const chartData = [
    {
      regime: 'Old Regime',
      tax: oldRegimeResult.totalTax,
      fill: recommendation.recommendedRegime === 'old' ? '#22c55e' : '#94a3b8'
    },
    {
      regime: 'New Regime',
      tax: newRegimeResult.totalTax,
      fill: recommendation.recommendedRegime === 'new' ? '#22c55e' : '#94a3b8'
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
      {/* Calculate Tax Button at Top */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Tax Calculation Complete</h3>
              <p className="text-slate-300">Your tax comparison is ready. Review the results below.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Generation Section at Top */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Download Professional Report</h3>
              <p className="text-slate-300 text-sm">
                Get a comprehensive PDF report with detailed calculations and recommendations
              </p>
            </div>
            <Button 
              onClick={handleGeneratePDF}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FileText className="w-5 h-5 mr-2" />
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Banner */}
      <Card className={`${recommendation.recommendedRegime === 'new' ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20' : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20'} backdrop-blur-sm`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <CircleCheck className={`w-8 h-8 ${recommendation.recommendedRegime === 'new' ? 'text-green-400' : 'text-blue-400'}`} />
            <div>
              <h3 className="text-xl font-bold text-white">
                Recommended: {recommendation.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
              </h3>
              <p className="text-slate-300">
                You can save ₹{formatCurrency(recommendation.savings)} ({recommendation.percentageSavings.toFixed(1)}%) by choosing this regime
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <p className="text-sm text-slate-400">Old Regime Tax</p>
              <p className="text-lg font-bold text-white">₹{formatCurrency(recommendation.oldRegimeTax)}</p>
            </div>
            <div className="text-center bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <p className="text-sm text-slate-400">New Regime Tax</p>
              <p className="text-lg font-bold text-white">₹{formatCurrency(recommendation.newRegimeTax)}</p>
            </div>
            <div className="text-center bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <p className="text-sm text-slate-400">Your Savings</p>
              <p className="text-lg font-bold text-green-400">₹{formatCurrency(recommendation.savings)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Comparison Chart */}
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Tax Liability Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="regime" stroke="#94a3b8" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} stroke="#94a3b8" />
              <Tooltip 
                formatter={(value) => [`₹${formatCurrency(Number(value))}`, 'Tax Amount']} 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="tax" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old Regime */}
        <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              Old Tax Regime
              {recommendation.recommendedRegime === 'old' && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Recommended</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-slate-300">
              <span>Gross Income:</span>
              <span className="font-semibold text-white">₹{formatCurrency(oldRegimeResult.grossIncome)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Total Deductions:</span>
              <span className="font-semibold text-green-400">-₹{formatCurrency(oldRegimeResult.totalDeductions)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Taxable Income:</span>
              <span className="font-semibold text-white">₹{formatCurrency(oldRegimeResult.taxableIncome)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax Before Rebate:</span>
              <span className="text-white">₹{formatCurrency(oldRegimeResult.taxBeforeRebate)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Section 87A Rebate:</span>
              <span className="text-green-400">-₹{formatCurrency(oldRegimeResult.rebateAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax After Rebate:</span>
              <span className="text-white">₹{formatCurrency(oldRegimeResult.taxAfterRebate)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Surcharge:</span>
              <span className="text-white">₹{formatCurrency(oldRegimeResult.surcharge)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Health & Education Cess:</span>
              <span className="text-white">₹{formatCurrency(oldRegimeResult.cess)}</span>
            </div>
            <hr className="border-slate-600" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total Tax:</span>
              <span className="text-white">₹{formatCurrency(oldRegimeResult.totalTax)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Effective Rate:</span>
              <span>{oldRegimeResult.effectiveRate.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* New Regime */}
        <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              New Tax Regime
              {recommendation.recommendedRegime === 'new' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Recommended</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-slate-300">
              <span>Gross Income:</span>
              <span className="font-semibold text-white">₹{formatCurrency(newRegimeResult.grossIncome)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Standard Deduction:</span>
              <span className="font-semibold text-green-400">-₹{formatCurrency(newRegimeResult.totalDeductions)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Taxable Income:</span>
              <span className="font-semibold text-white">₹{formatCurrency(newRegimeResult.taxableIncome)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax Before Rebate:</span>
              <span className="text-white">₹{formatCurrency(newRegimeResult.taxBeforeRebate)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Section 87A Rebate:</span>
              <span className="text-green-400">-₹{formatCurrency(newRegimeResult.rebateAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax After Rebate:</span>
              <span className="text-white">₹{formatCurrency(newRegimeResult.taxAfterRebate)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Surcharge:</span>
              <span className="text-white">₹{formatCurrency(newRegimeResult.surcharge)}</span>
            </div>
            <div className="flex justify-between text-slate-3000">
              <span>Health & Education Cess:</span>
              <span className="text-white">₹{formatCurrency(newRegimeResult.cess)}</span>
            </div>
            <hr className="border-slate-600" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total Tax:</span>
              <span className="text-white">₹{formatCurrency(newRegimeResult.totalTax)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>Effective Rate:</span>
              <span>{newRegimeResult.effectiveRate.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Distribution Pie Chart */}
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Income Distribution (Recommended Regime)</CardTitle>
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
              <Tooltip 
                formatter={(value) => `₹${formatCurrency(Number(value))}`} 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tax Summary */}
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Tax Summary & Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-white">Taxpayer Details</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-slate-300"><strong className="text-white">Name:</strong> {taxpayerName || 'Not provided'}</li>
                <li className="text-slate-300"><strong className="text-white">Age:</strong> {age} years</li>
                <li className="text-slate-300"><strong className="text-white">Category:</strong> {getAgeCategory(age)}</li>
                <li className="text-slate-300"><strong className="text-white">Assessment Year:</strong> 2025-26</li>
                <li className="text-slate-300"><strong className="text-white">Financial Year:</strong> 2024-25</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-white">Key Benefits</h4>
              <ul className="space-y-2 text-sm">
                {recommendation.recommendedRegime === 'new' ? (
                  <>
                    <li className="text-green-400">✅ Higher standard deduction (₹75,000)</li>
                    <li className="text-green-400">✅ Higher rebate limit (₹7 lakh)</li>
                    <li className="text-green-400">✅ Simplified tax structure</li>
                    <li className="text-green-400">✅ No complex deduction calculations</li>
                  </>
                ) : (
                  <>
                    <li className="text-blue-400">✅ Multiple deduction benefits</li>
                    <li className="text-blue-400">✅ Tax-saving investment options</li>
                    <li className="text-blue-400">✅ HRA and other allowances</li>
                    <li className="text-blue-400">✅ Lower tax with proper planning</li>
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
