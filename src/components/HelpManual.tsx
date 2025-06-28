
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, FileText, HelpCircle, Info, AlertCircle } from 'lucide-react';

export const HelpManual = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Complete Tax Guide & Help</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Everything you need to know about tax calculation, deductions, and maximizing your savings for FY 2024-25.
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-600/30 rounded-2xl p-1">
          <TabsTrigger value="getting-started" className="data-[state=active]:bg-blue-500 rounded-xl text-slate-300 data-[state=active]:text-white">Quick Start</TabsTrigger>
          <TabsTrigger value="income-guide" className="data-[state=active]:bg-blue-500 rounded-xl text-slate-300 data-[state=active]:text-white">Income Guide</TabsTrigger>
          <TabsTrigger value="deductions" className="data-[state=active]:bg-blue-500 rounded-xl text-slate-300 data-[state=active]:text-white">Deductions</TabsTrigger>
          <TabsTrigger value="tax-regimes" className="data-[state=active]:bg-blue-500 rounded-xl text-slate-300 data-[state=active]:text-white">Tax Regimes</TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-blue-500 rounded-xl text-slate-300 data-[state=active]:text-white">FAQ</TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:bg-blue-500 rounded-xl text-slate-300 data-[state=active]:text-white">Pro Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5" />
                How to Use This Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <h3 className="font-semibold text-blue-400 mb-2">Step 1: Enter Personal Info</h3>
                  <ul className="text-sm space-y-1 text-slate-300">
                    <li>• Enter your age (affects tax slabs)</li>
                    <li>• Add your name for reports</li>
                    <li>• Age determines your tax category</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <h3 className="font-semibold text-green-400 mb-2">Step 2: Input All Income</h3>
                  <ul className="text-sm space-y-1 text-slate-300">
                    <li>• Annual salary (total CTC)</li>
                    <li>• Basic salary (for HRA calc)</li>
                    <li>• Business/other income</li>
                  </ul>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                  <h3 className="font-semibold text-purple-400 mb-2">Step 3: Add Deductions</h3>
                  <ul className="text-sm space-y-1 text-slate-300">
                    <li>• 80C investments</li>
                    <li>• Health insurance</li>
                    <li>• Home loan interest</li>
                  </ul>
                </div>
                <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                  <h3 className="font-semibold text-orange-400 mb-2">Step 4: Compare & Save</h3>
                  <ul className="text-sm space-y-1 text-slate-300">
                    <li>• View regime comparison</li>
                    <li>• Download PDF report</li>
                    <li>• Save to library</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income-guide" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calculator className="w-5 h-5" />
                Complete Income Entry Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <h3 className="font-semibold mb-3 text-white">💰 Salary Income</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><strong className="text-white">Annual Salary:</strong> Your complete Cost to Company (CTC) including all allowances, bonuses, and benefits</p>
                    <p><strong className="text-white">Basic Salary:</strong> Only the basic pay component from your salary slip (used for HRA calculation)</p>
                    <p><strong className="text-blue-400">Note:</strong> These are independent fields - enter actual amounts from your payslip</p>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <h3 className="font-semibold mb-3 text-white">🏢 Business Income</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><strong className="text-white">Business/Professional Income:</strong> Net profit from business, freelancing, or professional services</p>
                    <p><strong className="text-blue-400">Note:</strong> Enter profit after business expenses, not gross revenue</p>
                  </div>
                </div>

                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <h3 className="font-semibold mb-3 text-white">📈 Capital Gains</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><strong className="text-white">Short-term:</strong> Profit from assets held for less than 1 year (stocks, mutual funds)</p>
                    <p><strong className="text-white">Long-term:</strong> Profit from assets held for more than 1 year</p>
                  </div>
                </div>

                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <h3 className="font-semibold mb-3 text-white">💳 Other Sources</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p><strong className="text-white">Includes:</strong> Interest from savings/FD, dividends, rental income, lottery winnings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Deductions by Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 mb-3">Section 80C (₹1.5 Lakh Limit)</h3>
                    <ul className="text-sm space-y-1 text-slate-300">
                      <li>• PPF contributions</li>
                      <li>• EPF contributions</li>
                      <li>• ELSS mutual funds</li>
                      <li>• Life insurance premiums</li>
                      <li>• Home loan principal</li>
                      <li>• Children's tuition fees</li>
                      <li>• NSC, tax-saver FDs</li>
                      <li>• Sukanya Samriddhi Yojana</li>
                    </ul>
                  </div>

                  <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                    <h3 className="font-semibold text-green-400 mb-3">Section 80D (Health Insurance)</h3>
                    <ul className="text-sm space-y-1 text-slate-300">
                      <li>• Self & family: ₹25K (₹50K if senior)</li>
                      <li>• Parents: ₹25K (₹50K if senior)</li>
                      <li>• Health checkup: ₹5K</li>
                      <li>• Maximum total: ₹1 lakh</li>
                    </ul>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                    <h3 className="font-semibold text-purple-400 mb-3">Housing Benefits</h3>
                    <ul className="text-sm space-y-1 text-slate-300">
                      <li>• HRA: As per calculation</li>
                      <li>• Home loan interest: ₹2 lakh</li>
                      <li>• 80EE: Extra ₹50K (first home)</li>
                      <li>• 80EEA: Extra ₹1.5L (affordable)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                    <h3 className="font-semibold text-orange-400 mb-3">Additional Deductions</h3>
                    <ul className="text-sm space-y-1 text-slate-300">
                      <li>• 80CCD(1B): NPS ₹50K extra</li>
                      <li>• 80E: Education loan (no limit)</li>
                      <li>• 80G: Donations (50%-100%)</li>
                      <li>• 80TTA: Savings interest ₹10K</li>
                      <li>• 80U: Disability deduction</li>
                      <li>• 80DDB: Medical treatment</li>
                    </ul>
                  </div>

                  <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/20">
                    <h3 className="font-semibold text-cyan-400 mb-3">Salary Exemptions</h3>
                    <ul className="text-sm space-y-1 text-slate-300">
                      <li>• LTA: Travel allowance</li>
                      <li>• Professional tax: ₹2.5K max</li>
                      <li>• Gratuity: ₹20 lakh limit</li>
                      <li>• Leave encashment: ₹3 lakh</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-regimes" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Old vs New Tax Regime Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <h3 className="font-semibold text-blue-400 mb-3">Old Tax Regime</h3>
                  <ul className="text-sm space-y-2 text-slate-300">
                    <li>✅ All deductions available</li>
                    <li>✅ Standard deduction: ₹50,000</li>
                    <li>✅ HRA, LTA exemptions</li>
                    <li>✅ Good for high investments</li>
                    <li>❌ Higher tax rates</li>
                    <li>❌ Complex calculations</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <h3 className="font-semibold text-green-400 mb-3">New Tax Regime</h3>
                  <ul className="text-sm space-y-2 text-slate-300">
                    <li>✅ Lower tax rates</li>
                    <li>✅ Standard deduction: ₹75,000</li>
                    <li>✅ Higher rebate limit: ₹7L</li>
                    <li>✅ Simple calculations</li>
                    <li>❌ Limited deductions</li>
                    <li>❌ No HRA benefit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            {[
              {
                q: "Can I switch between tax regimes every year?",
                a: "Yes, you can choose between old and new regime annually. However, if you have business income, the choice is binding for that year."
              },
              {
                q: "What's the difference between annual salary and basic salary?",
                a: "Annual salary is your total CTC including all components. Basic salary is just the basic pay component used for HRA calculation."
              },
              {
                q: "How is HRA calculated?",
                a: "HRA exemption is the minimum of: (i) Actual HRA received, (ii) 50% of basic salary (40% for non-metro), (iii) Actual rent paid minus 10% of basic salary."
              },
              {
                q: "What's Section 87A rebate?",
                a: "It's a rebate that reduces your tax liability. Old regime: ₹12,500 for income up to ₹5L. New regime: ₹25,000 for income up to ₹7L."
              },
              {
                q: "Can I claim both 80C and 80CCD(1B)?",
                a: "Yes, 80CCD(1B) is separate from 80C. You can claim ₹1.5L under 80C plus additional ₹50K under 80CCD(1B) for NPS."
              },
              {
                q: "What if my income is below taxable limit?",
                a: "If your income is below the basic exemption limit (₹2.5L for individuals, ₹3L for senior citizens, ₹5L for super senior citizens), you don't need to pay tax."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Legal Tax Saving Strategies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <h3 className="font-semibold text-green-400 mb-2">Smart Investment Tips</h3>
                  <ul className="text-sm space-y-1 text-slate-300">
                    <li>• Start ELSS SIP early in the year</li>
                    <li>• Maximize PPF contributions</li>
                    <li>• Consider NPS for extra ₹50K deduction</li>
                    <li>• Plan insurance premiums strategically</li>
                  </ul>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <h3 className="font-semibold text-blue-400 mb-2">Timing Strategies</h3>
                  <ul className="text-sm space-y-1 text-slate-300">
                    <li>• Make investments before March 31</li>
                    <li>• Keep rent receipts for HRA</li>
                    <li>• Maintain medical expense records</li>
                    <li>• Review regime choice annually</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Common Mistakes to Avoid
                </h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Don't exceed 80C limit without utilizing 80CCD-1B</li>
                  <li>• Don't claim HRA without proper rent receipts</li>
                  <li>• Don't forget to keep investment proofs</li>
                  <li>• Don't ignore health insurance benefits</li>
                  <li>• Don't choose regime without proper calculation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
