
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, FileText, Upload, HelpCircle } from 'lucide-react';

export const HelpManual = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">User Manual & Help Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete guide to using the AI Tax Calculator for FY 2024-25. Learn how to maximize your tax savings legally.
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="income-entry">Income Entry</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="comparison">Tax Comparison</TabsTrigger>
          <TabsTrigger value="tips">Tax Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                How to Use This Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Step 1: Choose Your Path</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>AI Assistant:</strong> Chat with AI for guided help</li>
                    <li>• <strong>Manual Entry:</strong> Fill forms yourself</li>
                    <li>• <strong>Document Upload:</strong> Scan tax documents</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Step 2: Enter Your Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Income from all sources</li>
                    <li>• Your age (affects tax slabs)</li>
                    <li>• All eligible deductions</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 3: Review Deductions</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Section 80C investments</li>
                    <li>• Health insurance premiums</li>
                    <li>• Home loan interest</li>
                    <li>• Other eligible deductions</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Step 4: Compare & Save</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Old vs New regime comparison</li>
                    <li>• Download detailed PDF report</li>
                    <li>• Legal tax-saving suggestions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>⚠️ Tax Regime Choice:</strong> Most deductions are only available in the Old Tax Regime. 
                    New regime offers higher standard deduction but fewer deduction options.
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>💡 Annual Choice:</strong> You can switch between tax regimes every year based on your situation.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>📋 Documentation:</strong> Keep all investment proofs, rent receipts, and medical bills for IT department verification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income-entry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Income Entry Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Salary Income</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• <strong>Annual Salary:</strong> Total CTC including all allowances</li>
                    <li>• <strong>Basic Salary:</strong> Basic pay component only (for HRA calculation)</li>
                    <li>• These are independent - enter actual amounts from your salary slip</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Document Scanning</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Upload Form 16, Form 26AS, salary slips</li>
                    <li>• Supported formats: PDF, JPG, PNG</li>
                    <li>• OCR will auto-fill income details (feature under development)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Other Income Sources</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• <strong>Business Income:</strong> Net profit from business/profession</li>
                    <li>• <strong>Capital Gains:</strong> Profit from sale of assets</li>
                    <li>• <strong>Other Sources:</strong> Interest, dividends, rent income</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete Deductions Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-600 mb-3">Section 80C (₹1.5 Lakh Limit)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• PPF, EPF contributions</li>
                    <li>• ELSS mutual funds</li>
                    <li>• Life insurance premiums</li>
                    <li>• Home loan principal</li>
                    <li>• Children's tuition fees</li>
                    <li>• NSC, tax-saver FDs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-green-600 mb-3">Health Insurance (80D)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Self & family: ₹25K (₹50K if senior)</li>
                    <li>• Parents: ₹25K (₹50K if senior)</li>
                    <li>• Health checkup: ₹5K</li>
                    <li>• Maximum total: ₹1 lakh</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-600 mb-3">Home Loan Benefits</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Principal: Under 80C (₹1.5L limit)</li>
                    <li>• Interest: ₹2 lakh annually</li>
                    <li>• 80EE: Extra ₹50K for first home</li>
                    <li>• 80EEA: Extra ₹1.5L for affordable housing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-orange-600 mb-3">Other Key Deductions</h3>
                  <ul className="text-sm space-y-1">
                    <li>• NPS (80CCD-1B): Extra ₹50K</li>
                    <li>• Education loan (80E): No limit</li>
                    <li>• Donations (80G): 10% of income</li>
                    <li>• HRA: Calculated automatically</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Maximize 80C early in the financial year</li>
                  <li>• Keep all receipts and certificates</li>
                  <li>• Plan investments for tax efficiency</li>
                  <li>• Review annually for optimal regime choice</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Understanding Tax Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Old Tax Regime</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Lower standard deduction (₹50K)</li>
                    <li>• All deductions available</li>
                    <li>• Traditional tax slabs</li>
                    <li>• Good for high deduction claims</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">New Tax Regime</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Higher standard deduction (₹75K)</li>
                    <li>• Limited deductions</li>
                    <li>• Lower tax rates</li>
                    <li>• Simplified calculations</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">PDF Report Features</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Detailed tax calculations in tabular format</li>
                  <li>• Colorful charts and graphs</li>
                  <li>• Side-by-side regime comparison</li>
                  <li>• Tax-saving recommendations</li>
                  <li>• Legal compliance guidelines</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal Tax Saving Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Investment Strategy</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Start SIP in ELSS early</li>
                    <li>• Maximize PPF contributions</li>
                    <li>• Consider NPS for extra ₹50K deduction</li>
                    <li>• Plan insurance premiums wisely</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Timing Matters</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Make investments before March 31</li>
                    <li>• Claim HRA if paying rent</li>
                    <li>• Keep medical expense receipts</li>
                    <li>• Review regime choice annually</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Common Mistakes to Avoid:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Don't exceed 80C limit without checking 80CCD-1B</li>
                  <li>• Don't claim fake HRA without rent receipts</li>
                  <li>• Don't ignore health insurance benefits</li>
                  <li>• Don't forget to keep investment proofs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
