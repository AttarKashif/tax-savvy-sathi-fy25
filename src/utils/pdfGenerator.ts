
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

  // Helper function to create tables
  const createTable = (headers: string[], rows: string[][], startY: number) => {
    const colWidth = (pageWidth - 30) / headers.length;
    
    // Draw headers
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.setTextColor(255, 255, 255); // White text
    pdf.rect(15, startY, pageWidth - 30, 8, 'F');
    
    headers.forEach((header, i) => {
      pdf.text(header, 15 + (i * colWidth) + 2, startY + 6);
    });
    
    // Draw rows
    pdf.setTextColor(0, 0, 0);
    let currentY = startY + 8;
    
    rows.forEach((row, rowIndex) => {
      const fillColor = rowIndex % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
      pdf.setFillColor(...fillColor);
      pdf.rect(15, currentY, pageWidth - 30, 6, 'F');
      
      row.forEach((cell, i) => {
        pdf.text(cell, 15 + (i * colWidth) + 2, currentY + 4);
      });
      currentY += 6;
    });
    
    return currentY + 5;
  };

  // Title Section
  pdf.setFontSize(24);
  pdf.setTextColor(59, 130, 246);
  pdf.text('TAX COMPARISON REPORT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  pdf.setFontSize(16);
  pdf.setTextColor(147, 51, 234);
  pdf.text('Financial Year 2024-25 (Assessment Year 2025-26)', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date and taxpayer info
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  pdf.text(`Taxpayer Age: ${data.age} years`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Executive Summary Box
  checkPageBreak(40);
  pdf.setFillColor(34, 197, 94);
  pdf.rect(15, yPosition, pageWidth - 30, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text('RECOMMENDATION', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  pdf.setFontSize(14);
  const recommendedText = `Choose ${data.recommendation.recommendedRegime.toUpperCase()} Tax Regime`;
  pdf.text(recommendedText, pageWidth / 2, yPosition + 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Save ₹${data.recommendation.savings.toLocaleString('en-IN')} (${data.recommendation.percentageSavings.toFixed(1)}%)`, 
           pageWidth / 2, yPosition + 22, { align: 'center' });
  yPosition += 35;

  // Income Summary Table
  checkPageBreak(60);
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('INCOME SUMMARY', 15, yPosition);
  yPosition += 8;

  const incomeHeaders = ['Income Source', 'Amount (₹)'];
  const incomeRows = [
    ['Annual Salary', data.income.salary.toLocaleString('en-IN')],
    ['Basic Salary', data.income.basicSalary.toLocaleString('en-IN')],
    ['Business Income', data.income.businessIncome.toLocaleString('en-IN')],
    ['Short-term Capital Gains', data.income.capitalGainsShort.toLocaleString('en-IN')],
    ['Long-term Capital Gains', data.income.capitalGainsLong.toLocaleString('en-IN')],
    ['Other Sources', data.income.otherSources.toLocaleString('en-IN')],
    ['TOTAL GROSS INCOME', Object.values(data.income).reduce((sum, value) => sum + value, 0).toLocaleString('en-IN')]
  ];

  yPosition = createTable(incomeHeaders, incomeRows, yPosition);

  // Tax Comparison Table
  checkPageBreak(80);
  pdf.setFontSize(14);
  pdf.text('TAX CALCULATION COMPARISON', 15, yPosition);
  yPosition += 8;

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

  // Deductions Breakdown (Old Regime)
  checkPageBreak(60);
  pdf.setFontSize(14);
  pdf.text('DEDUCTIONS BREAKDOWN (OLD REGIME)', 15, yPosition);
  yPosition += 8;

  const deductionHeaders = ['Section/Type', 'Amount (₹)', 'Limit (₹)'];
  const deductionRows = [
    ['Standard Deduction', '50,000', '50,000'],
    ['Section 80C', data.deductions.section80C.toLocaleString('en-IN'), '1,50,000'],
    ['Section 80D (Health Insurance)', data.deductions.section80D.toLocaleString('en-IN'), '25,000-1,00,000'],
    ['HRA Exemption', data.deductions.hra.toLocaleString('en-IN'), 'As per calculation'],
    ['Home Loan Interest', data.deductions.homeLoanInterest.toLocaleString('en-IN'), '2,00,000'],
    ['NPS (80CCD-1B)', data.deductions.nps.toLocaleString('en-IN'), '50,000'],
    ['Education Loan (80E)', data.deductions.section80E.toLocaleString('en-IN'), 'No Limit'],
    ['Professional Tax', data.deductions.professionalTax.toLocaleString('en-IN'), '2,500']
  ];

  yPosition = createTable(deductionHeaders, deductionRows, yPosition);

  // Add new page for recommendations
  pdf.addPage();
  yPosition = 20;

  // Tax Saving Recommendations
  pdf.setFontSize(16);
  pdf.setTextColor(34, 197, 94);
  pdf.text('LEGAL TAX SAVING RECOMMENDATIONS', 15, yPosition);
  yPosition += 12;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  const recommendations = [
    'SECTION 80C INVESTMENTS (Maximum ₹1.5 Lakh)',
    '• Public Provident Fund (PPF) - 15-year lock-in, tax-free returns',
    '• Equity Linked Savings Scheme (ELSS) - 3-year lock-in, market returns',
    '• Employee Provident Fund (EPF) - Employer matched contribution',
    '• Life Insurance Premiums - Term + investment plans',
    '• Home Loan Principal Repayment - Asset building + tax benefit',
    '',
    'HEALTH INSURANCE (SECTION 80D)',
    '• Self & Family: ₹25,000 (₹50,000 if senior citizen)',
    '• Parents: Additional ₹25,000 (₹50,000 if senior citizen)',
    '• Preventive Health Checkup: ₹5,000 within above limits',
    '',
    'ADDITIONAL DEDUCTIONS',
    '• NPS (80CCD-1B): Extra ₹50,000 over 80C limit',
    '• Education Loan Interest (80E): No upper limit for 8 years',
    '• Home Loan Interest: ₹2 lakh for self-occupied property',
    '• Donations (80G): 50%-100% based on organization',
    '',
    'SALARY STRUCTURE OPTIMIZATION',
    '• Claim HRA if paying rent (Old regime only)',
    '• Optimize meal vouchers and transport allowance',
    '• Plan Leave Travel Allowance (LTA) usage',
    '',
    'YEAR-END PLANNING',
    '• Review and switch tax regime if beneficial',
    '• Complete investments before March 31st',
    '• Maintain proper documentation for all claims',
    '• Consider advance tax payments to avoid interest'
  ];

  recommendations.forEach(line => {
    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = 20;
    }
    
    if (line.startsWith('SECTION') || line.startsWith('HEALTH') || line.startsWith('ADDITIONAL') || 
        line.startsWith('SALARY') || line.startsWith('YEAR-END')) {
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246);
      pdf.text(line, 15, yPosition);
      yPosition += 8;
    } else if (line.trim() === '') {
      yPosition += 4;
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(line, 15, yPosition);
      yPosition += 5;
    }
  });

  // Footer with disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 30) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(255, 243, 205);
  pdf.rect(15, yPosition, pageWidth - 30, 25, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(120, 53, 15);
  pdf.text('DISCLAIMER', pageWidth / 2, yPosition + 6, { align: 'center' });
  pdf.text('This is a calculated estimate based on current tax laws for FY 2024-25.', pageWidth / 2, yPosition + 12, { align: 'center' });
  pdf.text('Please consult a qualified tax professional for final tax planning and compliance.', pageWidth / 2, yPosition + 16, { align: 'center' });
  pdf.text('Tax laws are subject to change. Keep updated with latest amendments.', pageWidth / 2, yPosition + 20, { align: 'center' });

  // Save the PDF
  pdf.save(`Comprehensive_Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
