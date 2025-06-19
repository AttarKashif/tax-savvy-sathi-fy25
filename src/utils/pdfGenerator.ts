
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IncomeData, DeductionData, TaxResult } from './taxCalculations';

export interface PDFReportData {
  income: IncomeData;
  deductions: DeductionData;
  oldRegimeResult: TaxResult;
  newRegimeResult: TaxResult;
  recommendation: {
    recommendedRegime: 'old' | 'new';
    savings: number;
    percentageSavings: number;
  };
  age: number;
}

export async function generateTaxComparisonPDF(data: PDFReportData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(33, 150, 243);
  pdf.text('Tax Comparison Report FY 2024-25', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Income Summary
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Income Summary', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  const incomeItems = [
    `Annual Salary: ₹${data.income.salary.toLocaleString('en-IN')}`,
    `Basic Salary: ₹${data.income.basicSalary.toLocaleString('en-IN')}`,
    `Business Income: ₹${data.income.businessIncome.toLocaleString('en-IN')}`,
    `Short-term Capital Gains: ₹${data.income.capitalGainsShort.toLocaleString('en-IN')}`,
    `Long-term Capital Gains: ₹${data.income.capitalGainsLong.toLocaleString('en-IN')}`,
    `Other Sources: ₹${data.income.otherSources.toLocaleString('en-IN')}`,
  ];

  incomeItems.forEach(item => {
    pdf.text(item, 20, yPosition);
    yPosition += 6;
  });

  const grossIncome = Object.values(data.income).reduce((sum, value) => sum + value, 0);
  pdf.setFontSize(12);
  pdf.setTextColor(0, 100, 0);
  pdf.text(`Total Gross Income: ₹${grossIncome.toLocaleString('en-IN')}`, 20, yPosition);
  yPosition += 15;

  // Deductions Summary (Old Regime)
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Deductions (Old Regime Only)', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  const deductionItems = [
    `Section 80C: ₹${data.deductions.section80C.toLocaleString('en-IN')}`,
    `Section 80D: ₹${data.deductions.section80D.toLocaleString('en-IN')}`,
    `HRA: ₹${data.deductions.hra.toLocaleString('en-IN')}`,
    `Home Loan Interest: ₹${data.deductions.homeLoanInterest.toLocaleString('en-IN')}`,
    `Professional Tax: ₹${data.deductions.professionalTax.toLocaleString('en-IN')}`,
    `NPS (80CCD-1B): ₹${data.deductions.nps.toLocaleString('en-IN')}`,
    `Education Loan (80E): ₹${data.deductions.section80E.toLocaleString('en-IN')}`,
  ];

  deductionItems.forEach(item => {
    pdf.text(item, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 10;

  // Tax Comparison
  pdf.setFontSize(16);
  pdf.setTextColor(220, 38, 127);
  pdf.text('Tax Comparison', 15, yPosition);
  yPosition += 15;

  // Old Regime
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Old Tax Regime', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  const oldRegimeItems = [
    `Gross Income: ₹${data.oldRegimeResult.grossIncome.toLocaleString('en-IN')}`,
    `Total Deductions: ₹${data.oldRegimeResult.totalDeductions.toLocaleString('en-IN')}`,
    `Taxable Income: ₹${data.oldRegimeResult.taxableIncome.toLocaleString('en-IN')}`,
    `Tax Before Rebate: ₹${data.oldRegimeResult.taxBeforeRebate.toLocaleString('en-IN')}`,
    `Rebate (87A): ₹${data.oldRegimeResult.rebateAmount.toLocaleString('en-IN')}`,
    `Tax After Rebate: ₹${data.oldRegimeResult.taxAfterRebate.toLocaleString('en-IN')}`,
    `Surcharge: ₹${data.oldRegimeResult.surcharge.toLocaleString('en-IN')}`,
    `Cess (4%): ₹${data.oldRegimeResult.cess.toLocaleString('en-IN')}`,
  ];

  oldRegimeItems.forEach(item => {
    pdf.text(item, 25, yPosition);
    yPosition += 6;
  });

  pdf.setFontSize(12);
  pdf.setTextColor(220, 38, 127);
  pdf.text(`Total Tax: ₹${data.oldRegimeResult.totalTax.toLocaleString('en-IN')}`, 25, yPosition);
  yPosition += 15;

  // New Regime
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('New Tax Regime', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  const newRegimeItems = [
    `Gross Income: ₹${data.newRegimeResult.grossIncome.toLocaleString('en-IN')}`,
    `Total Deductions: ₹${data.newRegimeResult.totalDeductions.toLocaleString('en-IN')}`,
    `Taxable Income: ₹${data.newRegimeResult.taxableIncome.toLocaleString('en-IN')}`,
    `Tax Before Rebate: ₹${data.newRegimeResult.taxBeforeRebate.toLocaleString('en-IN')}`,
    `Rebate (87A): ₹${data.newRegimeResult.rebateAmount.toLocaleString('en-IN')}`,
    `Tax After Rebate: ₹${data.newRegimeResult.taxAfterRebate.toLocaleString('en-IN')}`,
    `Surcharge: ₹${data.newRegimeResult.surcharge.toLocaleString('en-IN')}`,
    `Cess (4%): ₹${data.newRegimeResult.cess.toLocaleString('en-IN')}`,
  ];

  newRegimeItems.forEach(item => {
    pdf.text(item, 25, yPosition);
    yPosition += 6;
  });

  pdf.setFontSize(12);
  pdf.setTextColor(220, 38, 127);
  pdf.text(`Total Tax: ₹${data.newRegimeResult.totalTax.toLocaleString('en-IN')}`, 25, yPosition);
  yPosition += 15;

  // Recommendation
  pdf.setFontSize(16);
  pdf.setTextColor(34, 197, 94);
  pdf.text('Recommendation', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  const recommendedText = `We recommend the ${data.recommendation.recommendedRegime.toUpperCase()} Tax Regime`;
  pdf.text(recommendedText, 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.text(`You can save ₹${data.recommendation.savings.toLocaleString('en-IN')} (${data.recommendation.percentageSavings.toFixed(2)}%)`, 20, yPosition);
  yPosition += 15;

  // Tax Saving Suggestions
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Legal Tax Saving Suggestions', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  const suggestions = [
    '• Maximize Section 80C investments (₹1.5 lakh): PPF, ELSS, NSC, Tax-saver FDs',
    '• Health Insurance (80D): Up to ₹25,000 for self, ₹50,000 if senior citizen',
    '• NPS Additional (80CCD-1B): Extra ₹50,000 deduction',
    '• Home Loan Interest: Up to ₹2 lakh for self-occupied property',
    '• HRA: Claim if you pay rent (Old regime only)',
    '• Education Loan Interest (80E): No upper limit for 8 years',
    '• Donations (80G): 50%-100% deduction based on organization',
    '• Consider switching regimes annually based on your deductions',
  ];

  suggestions.forEach(suggestion => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(suggestion, 20, yPosition);
    yPosition += 6;
  });

  // Disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Disclaimer: This is a calculated estimate. Please consult a tax professional for final tax planning.', 15, yPosition);
  pdf.text('Calculations are based on Income Tax rules for FY 2024-25 (AY 2025-26).', 15, yPosition + 5);

  // Save the PDF
  pdf.save(`Tax_Comparison_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
