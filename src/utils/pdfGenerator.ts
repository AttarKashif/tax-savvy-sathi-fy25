
import jsPDF from 'jspdf';
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
  taxpayerName: string;
}

export async function generateTaxComparisonPDF(data: PDFReportData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to create tables with black and white styling
  const createTable = (headers: string[], rows: string[][], startY: number) => {
    const colWidth = (pageWidth - 30) / headers.length;
    
    // Draw headers with black background
    pdf.setFillColor(0, 0, 0);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.rect(15, startY, pageWidth - 30, 8, 'F');
    
    headers.forEach((header, i) => {
      pdf.text(header, 15 + (i * colWidth) + 2, startY + 6);
    });
    
    // Draw rows with alternating gray/white background
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    let currentY = startY + 8;
    
    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(240, 240, 240);
      } else {
        pdf.setFillColor(255, 255, 255);
      }
      pdf.rect(15, currentY, pageWidth - 30, 6, 'F');
      
      row.forEach((cell, i) => {
        pdf.text(cell, 15 + (i * colWidth) + 2, currentY + 4);
      });
      currentY += 6;
    });
    
    return currentY + 5;
  };

  // Title Section
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text('TAX COMPARISON REPORT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  pdf.setFontSize(14);
  pdf.text('Financial Year 2024-25 (Assessment Year 2025-26)', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Taxpayer Information Table
  checkPageBreak(40);
  pdf.setFontSize(12);
  pdf.text('TAXPAYER INFORMATION', 15, yPosition);
  yPosition += 5;

  const taxpayerHeaders = ['Field', 'Details'];
  const taxpayerRows = [
    ['Name', data.taxpayerName || 'Not provided'],
    ['Age', `${data.age} years`],
    ['Category', data.age >= 80 ? 'Super Senior Citizen' : data.age >= 60 ? 'Senior Citizen' : 'Regular'],
    ['Report Date', new Date().toLocaleDateString('en-IN')],
    ['Financial Year', '2024-25'],
    ['Assessment Year', '2025-26']
  ];

  yPosition = createTable(taxpayerHeaders, taxpayerRows, yPosition);

  // Recommendation Summary Table
  checkPageBreak(40);
  pdf.setFontSize(12);
  pdf.text('RECOMMENDATION SUMMARY', 15, yPosition);
  yPosition += 5;

  const recommendationHeaders = ['Particulars', 'Details'];
  const recommendationRows = [
    ['Recommended Regime', data.recommendation.recommendedRegime.toUpperCase()],
    ['Tax Savings', `₹${data.recommendation.savings.toLocaleString('en-IN')}`],
    ['Percentage Savings', `${data.recommendation.percentageSavings.toFixed(1)}%`],
    ['Old Regime Tax', `₹${data.oldRegimeResult.totalTax.toLocaleString('en-IN')}`],
    ['New Regime Tax', `₹${data.newRegimeResult.totalTax.toLocaleString('en-IN')}`]
  ];

  yPosition = createTable(recommendationHeaders, recommendationRows, yPosition);

  // Income Summary Table
  checkPageBreak(60);
  pdf.setFontSize(12);
  pdf.text('INCOME SUMMARY', 15, yPosition);
  yPosition += 5;

  const incomeHeaders = ['Income Source', 'Amount (₹)'];
  const totalIncome = data.income.salary + data.income.businessIncome + data.income.capitalGainsShort + data.income.capitalGainsLong + data.income.otherSources;
  
  const incomeRows = [
    ['Annual Salary', data.income.salary.toLocaleString('en-IN')],
    ['Business Income', data.income.businessIncome.toLocaleString('en-IN')],
    ['Short-term Capital Gains', data.income.capitalGainsShort.toLocaleString('en-IN')],
    ['Long-term Capital Gains', data.income.capitalGainsLong.toLocaleString('en-IN')],
    ['Other Sources', data.income.otherSources.toLocaleString('en-IN')],
    ['TOTAL GROSS INCOME', totalIncome.toLocaleString('en-IN')]
  ];

  yPosition = createTable(incomeHeaders, incomeRows, yPosition);

  // Tax Calculation Comparison Table
  checkPageBreak(80);
  pdf.setFontSize(12);
  pdf.text('TAX CALCULATION COMPARISON', 15, yPosition);
  yPosition += 5;

  const comparisonHeaders = ['Particulars', 'Old Regime (₹)', 'New Regime (₹)'];
  const comparisonRows = [
    ['Gross Income', data.oldRegimeResult.grossIncome.toLocaleString('en-IN'), data.newRegimeResult.grossIncome.toLocaleString('en-IN')],
    ['Total Deductions', data.oldRegimeResult.totalDeductions.toLocaleString('en-IN'), data.newRegimeResult.totalDeductions.toLocaleString('en-IN')],
    ['Taxable Income', data.oldRegimeResult.taxableIncome.toLocaleString('en-IN'), data.newRegimeResult.taxableIncome.toLocaleString('en-IN')],
    ['Tax Before Rebate', data.oldRegimeResult.taxBeforeRebate.toLocaleString('en-IN'), data.newRegimeResult.taxBeforeRebate.toLocaleString('en-IN')],
    ['Section 87A Rebate', data.oldRegimeResult.rebateAmount.toLocaleString('en-IN'), data.newRegimeResult.rebateAmount.toLocaleString('en-IN')],
    ['Tax After Rebate', data.oldRegimeResult.taxAfterRebate.toLocaleString('en-IN'), data.newRegimeResult.taxAfterRebate.toLocaleString('en-IN')],
    ['Surcharge', data.oldRegimeResult.surcharge.toLocaleString('en-IN'), data.newRegimeResult.surcharge.toLocaleString('en-IN')],
    ['Health & Education Cess', data.oldRegimeResult.cess.toLocaleString('en-IN'), data.newRegimeResult.cess.toLocaleString('en-IN')],
    ['TOTAL TAX LIABILITY', data.oldRegimeResult.totalTax.toLocaleString('en-IN'), data.newRegimeResult.totalTax.toLocaleString('en-IN')]
  ];

  yPosition = createTable(comparisonHeaders, comparisonRows, yPosition);

  // Deductions Breakdown Table
  checkPageBreak(100);
  pdf.setFontSize(12);
  pdf.text('DEDUCTIONS BREAKDOWN (OLD REGIME)', 15, yPosition);
  yPosition += 5;

  const deductionHeaders = ['Section/Type', 'Amount (₹)', 'Limit (₹)', 'Regime'];
  const deductionRows = [
    ['Standard Deduction', '50,000', '50,000', 'Both'],
    ['Section 80C', data.deductions.section80C.toLocaleString('en-IN'), '1,50,000', 'Old Only'],
    ['Section 80D', data.deductions.section80D.toLocaleString('en-IN'), '25,000-1,00,000', 'Old Only'],
    ['HRA Exemption', data.deductions.hra.toLocaleString('en-IN'), 'As per calculation', 'Old Only'],
    ['Home Loan Interest', data.deductions.homeLoanInterest.toLocaleString('en-IN'), '2,00,000', 'Old Only'],
    ['NPS (80CCD-1B)', data.deductions.nps.toLocaleString('en-IN'), '50,000', 'Old Only'],
    ['Education Loan (80E)', data.deductions.section80E.toLocaleString('en-IN'), 'No Limit', 'Old Only'],
    ['Section 80G (Donations)', data.deductions.section80G.toLocaleString('en-IN'), 'As per rules', 'Old Only'],
    ['Section 80TTA', data.deductions.section80TTA.toLocaleString('en-IN'), '10,000', 'Old Only'],
    ['Professional Tax', data.deductions.professionalTax.toLocaleString('en-IN'), '2,500', 'Both']
  ];

  yPosition = createTable(deductionHeaders, deductionRows, yPosition);

  // Add new page for effective rates and summary
  pdf.addPage();
  yPosition = 20;

  // Effective Tax Rate Comparison
  pdf.setFontSize(12);
  pdf.text('EFFECTIVE TAX RATE COMPARISON', 15, yPosition);
  yPosition += 5;

  const rateHeaders = ['Regime', 'Total Tax (₹)', 'Gross Income (₹)', 'Effective Rate (%)'];
  const rateRows = [
    ['Old Regime', data.oldRegimeResult.totalTax.toLocaleString('en-IN'), data.oldRegimeResult.grossIncome.toLocaleString('en-IN'), data.oldRegimeResult.effectiveRate.toFixed(2)],
    ['New Regime', data.newRegimeResult.totalTax.toLocaleString('en-IN'), data.newRegimeResult.grossIncome.toLocaleString('en-IN'), data.newRegimeResult.effectiveRate.toFixed(2)]
  ];

  yPosition = createTable(rateHeaders, rateRows, yPosition);

  // Tax Saving Recommendations
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.text('TAX SAVING RECOMMENDATIONS', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  const recommendations = [
    '1. SECTION 80C INVESTMENTS (Maximum ₹1.5 Lakh)',
    '   • Public Provident Fund (PPF) - 15-year lock-in, tax-free returns',
    '   • Equity Linked Savings Scheme (ELSS) - 3-year lock-in, market returns',
    '   • Employee Provident Fund (EPF) - Employer matched contribution',
    '',
    '2. HEALTH INSURANCE (SECTION 80D)',
    '   • Self & Family: ₹25,000 (₹50,000 if senior citizen)',
    '   • Parents: Additional ₹25,000 (₹50,000 if senior citizen)',
    '',
    '3. ADDITIONAL DEDUCTIONS',
    '   • NPS (80CCD-1B): Extra ₹50,000 over 80C limit',
    '   • Education Loan Interest (80E): No upper limit for 8 years',
    '   • Home Loan Interest: ₹2 lakh for self-occupied property',
    '',
    '4. YEAR-END PLANNING CHECKLIST',
    '   • Review and switch tax regime if beneficial',
    '   • Complete investments before March 31st',
    '   • Maintain proper documentation for all claims'
  ];

  recommendations.forEach(line => {
    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.text(line, 15, yPosition);
    yPosition += 5;
  });

  // Footer with disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 30) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(220, 220, 220);
  pdf.rect(15, yPosition, pageWidth - 30, 25, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.text('DISCLAIMER', pageWidth / 2, yPosition + 6, { align: 'center' });
  pdf.text('This is a calculated estimate based on current tax laws for FY 2024-25.', pageWidth / 2, yPosition + 12, { align: 'center' });
  pdf.text('Please consult a qualified tax professional for final tax planning and compliance.', pageWidth / 2, yPosition + 16, { align: 'center' });
  pdf.text('Tax laws are subject to change. Keep updated with latest amendments.', pageWidth / 2, yPosition + 20, { align: 'center' });

  // Save the PDF with taxpayer name if provided
  const fileName = data.taxpayerName 
    ? `Tax_Report_${data.taxpayerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}
