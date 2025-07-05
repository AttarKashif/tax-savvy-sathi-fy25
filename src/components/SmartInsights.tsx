
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Target,
  Lightbulb,
  Calculator
} from 'lucide-react';
import { IncomeData, DeductionData, TaxResult } from '@/utils/taxCalculations';

interface SmartInsightsProps {
  income: IncomeData;
  deductions: DeductionData;
  age: number;
  oldRegimeResult: TaxResult;
  newRegimeResult: TaxResult;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({
  income,
  deductions,
  age,
  oldRegimeResult,
  newRegimeResult
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;
  
  // Smart analysis
  const getOptimizationOpportunities = () => {
    const opportunities = [];
    
    // Section 80C optimization
    if (deductions.section80C < 150000 && totalIncome > 300000) {
      const potentialSaving = Math.min(150000 - deductions.section80C, totalIncome * 0.3) * 0.3;
      opportunities.push({
        title: "Maximize Section 80C Investments",
        description: `You can invest ₹${formatCurrency(150000 - deductions.section80C)} more in ELSS, PPF, or NSC`,
        potentialSaving: potentialSaving,
        priority: "high"
      });
    }

    // HRA optimization
    if (income.basicSalary > 0 && deductions.hra === 0) {
      const maxHRA = Math.min(income.basicSalary * 0.5, income.salary * 0.1);
      opportunities.push({
        title: "Claim HRA Deduction",
        description: "You might be eligible for HRA benefits if you pay rent",
        potentialSaving: maxHRA * 0.3,
        priority: "medium"
      });
    }

    // Health insurance
    if (deductions.section80D === 0 && totalIncome > 300000) {
      opportunities.push({
        title: "Health Insurance Benefits",
        description: "Get tax benefits up to ₹25,000 for health insurance premiums",
        potentialSaving: 25000 * 0.3,
        priority: "high"
      });
    }

    // NPS optimization
    if (deductions.nps < 50000 && totalIncome > 500000) {
      opportunities.push({
        title: "NPS Additional Deduction",
        description: "Extra ₹50,000 deduction available under Section 80CCD(1B)",
        potentialSaving: 50000 * 0.3,
        priority: "medium"
      });
    }

    return opportunities.sort((a, b) => b.potentialSaving - a.potentialSaving);
  };

  const getTaxEfficiency = () => {
    const effectiveRate = oldRegimeResult.effectiveRate;
    if (effectiveRate < 5) return { level: "Excellent", color: "text-green-400", description: "Very tax efficient" };
    if (effectiveRate < 15) return { level: "Good", color: "text-blue-400", description: "Reasonably optimized" };
    if (effectiveRate < 25) return { level: "Average", color: "text-yellow-400", description: "Room for improvement" };
    return { level: "Needs Work", color: "text-red-400", description: "High tax burden" };
  };

  const getFinancialHealth = () => {
    const savingsRate = (deductions.section80C + deductions.nps) / totalIncome * 100;
    if (savingsRate > 20) return { level: "Excellent", color: "text-green-400" };
    if (savingsRate > 15) return { level: "Good", color: "text-blue-400" };
    if (savingsRate > 10) return { level: "Average", color: "text-yellow-400" };
    return { level: "Low", color: "text-red-400" };
  };

  const opportunities = getOptimizationOpportunities();
  const taxEfficiency = getTaxEfficiency();
  const financialHealth = getFinancialHealth();
  const totalPotentialSavings = opportunities.reduce((sum, opp) => sum + opp.potentialSaving, 0);

  return (
    <div className="space-y-6">
      {/* Tax Efficiency Overview */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Calculator className="w-6 h-6" />
            Tax Efficiency Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${taxEfficiency.color}`}>
                {taxEfficiency.level}
              </div>
              <p className="text-slate-400 text-sm">{taxEfficiency.description}</p>
              <p className="text-white text-lg mt-2">{oldRegimeResult.effectiveRate.toFixed(1)}% effective rate</p>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${financialHealth.color}`}>
                {financialHealth.level}
              </div>
              <p className="text-slate-400 text-sm">Investment Rate</p>
              <p className="text-white text-lg mt-2">
                {((deductions.section80C + deductions.nps) / totalIncome * 100).toFixed(1)}% of income
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                ₹{formatCurrency(totalPotentialSavings)}
              </div>
              <p className="text-slate-400 text-sm">Potential Savings</p>
              <p className="text-white text-lg mt-2">Available to unlock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Opportunities */}
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Lightbulb className="w-6 h-6" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold">Well Optimized!</h3>
              <p className="text-slate-400">Your tax planning looks good. Consider reviewing annually.</p>
            </div>
          ) : (
            opportunities.map((opportunity, index) => (
              <div key={index} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-semibold">{opportunity.title}</h4>
                      <Badge 
                        variant={opportunity.priority === 'high' ? 'destructive' : 'secondary'}
                        className={opportunity.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}
                      >
                        {opportunity.priority} priority
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{opportunity.description}</p>
                    <p className="text-green-400 font-semibold">
                      Potential tax saving: ₹{formatCurrency(opportunity.potentialSaving)}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400 ml-4 flex-shrink-0" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Regime Comparison Deep Dive */}
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Target className="w-6 h-6" />
            Regime Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Old Regime Benefits</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Multiple deduction options (80C, 80D, HRA)</li>
                <li>• Higher savings potential with planning</li>
                <li>• Flexibility in tax-saving investments</li>
                <li>• Better for high-deduction scenarios</li>
              </ul>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-white font-semibold">Total Tax: ₹{formatCurrency(oldRegimeResult.totalTax)}</p>
                <p className="text-slate-400 text-sm">Effective Rate: {oldRegimeResult.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-semibold">New Regime Benefits</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Higher standard deduction (₹75,000)</li>
                <li>• Simplified tax structure</li>
                <li>• No complex planning required</li>
                <li>• Higher rebate limit (₹7 lakh)</li>
              </ul>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <p className="text-white font-semibold">Total Tax: ₹{formatCurrency(newRegimeResult.totalTax)}</p>
                <p className="text-slate-400 text-sm">Effective Rate: {newRegimeResult.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Planning Timeline */}
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <DollarSign className="w-6 h-6" />
            Annual Planning Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <h5 className="text-white font-semibold mb-2">April - June</h5>
                <p className="text-slate-300 text-sm">Plan investments, review salary structure</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <h5 className="text-white font-semibold mb-2">July - Sept</h5>
                <p className="text-slate-300 text-sm">Mid-year review, adjust investments</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <h5 className="text-white font-semibold mb-2">Oct - Dec</h5>
                <p className="text-slate-300 text-sm">Final planning, maximize deductions</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <h5 className="text-white font-semibold mb-2">Jan - March</h5>
                <p className="text-slate-300 text-sm">Last chance investments, prepare for filing</p>
              </div>
            </div>
            
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <div className="text-blue-200">
                <strong>Pro Tip:</strong> Start tax planning early in the financial year for maximum benefits. 
                Consider SIP investments in ELSS funds for rupee cost averaging.
              </div>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
