
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

  // Helper function to format numbers with exactly 2 decimal places and no gaps
  const formatNumber = (value: number): string => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper function to create tables with black and white styling
  const createTable = (headers: string[], rows: string[][], startY: number, columnWidths?: number[]) => {
    const totalWidth = pageWidth - 30;
    const colWidths = columnWidths || headers.map(() => totalWidth / headers.length);
    
    // Draw headers with black background
    pdf.setFillColor(0, 0, 0);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    
    let xPos = 15;
    headers.forEach((header, i) => {
      pdf.rect(xPos, startY, colWidths[i], 8, 'F');
      const textX = xPos + (colWidths[i] / 2);
      pdf.text(header, textX, startY + 6, { align: 'center' });
      xPos += colWidths[i];
    });
    
    // Draw rows with alternating background
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    let currentY = startY + 8;
    
    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(245, 245, 245);
      } else {
        pdf.setFillColor(255, 255, 255);
      }
      
      xPos = 15;
      headers.forEach((_, i) => {
        pdf.rect(xPos, currentY, colWidths[i], 6, 'F');
        xPos += colWidths[i];
      });
      
      xPos = 15;
      row.forEach((cell, i) => {
        const textX = i === 0 ? xPos + 2 : xPos + (colWidths[i] / 2);
        const align = i === 0 ? 'left' : 'center';
        pdf.text(cell, textX, currentY + 4, { align: align as any });
        xPos += colWidths[i];
      });
      currentY += 6;
    });
    
    // Draw table border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(15, startY, totalWidth, currentY - startY);
    
    return currentY + 10;
  };

  // Title Section
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TAX COMPARISON REPORT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Financial Year 2024-25 (Assessment Year 2025-26)', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // SECTION 1: Taxpayer Information
  checkPageBreak(50);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECTION 1: TAXPAYER INFORMATION', 15, yPosition);
  yPosition += 8;

  const taxpayerHeaders = ['Field', 'Details'];
  const taxpayerRows = [
    ['Name', data.taxpayerName || 'Not provided'],
    ['Age', `${data.age} years`],
    ['Category', data.age >= 80 ? 'Super Senior Citizen' : data.age >= 60 ? 'Senior Citizen' : 'Regular'],
    ['Report Date', new Date().toLocaleDateString('en-IN')],
    ['Financial Year', '2024-25'],
    ['Assessment Year', '2025-26']
  ];

  yPosition = createTable(taxpayerHeaders, taxpayerRows, yPosition, [80, 100]);

  // SECTION 2: Income Summary
  checkPageBreak(70);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECTION 2: INCOME SUMMARY', 15, yPosition);
  yPosition += 8;

  const incomeHeaders = ['Income Source', 'Amount (Rs)'];
  const totalIncome = data.income.salary + data.income.businessIncome + data.income.capitalGainsShort + data.income.capitalGainsLong + data.income.otherSources;
  
  const incomeRows = [
    ['Annual Salary', formatNumber(data.income.salary)],
    ['Business Income', formatNumber(data.income.businessIncome)],
    ['Short-term Capital Gains', formatNumber(data.income.capitalGainsShort)],
    ['Long-term Capital Gains', formatNumber(data.income.capitalGainsLong)],
    ['Other Sources', formatNumber(data.income.otherSources)],
    ['TOTAL GROSS INCOME', formatNumber(totalIncome)]
  ];

  yPosition = createTable(incomeHeaders, incomeRows, yPosition, [100, 80]);

  // SECTION 3: Tax Calculation Comparison
  checkPageBreak(100);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECTION 3: TAX CALCULATION COMPARISON', 15, yPosition);
  yPosition += 8;

  const comparisonHeaders = ['Particulars', 'Old Regime (Rs)', 'New Regime (Rs)'];
  const comparisonRows = [
    ['Gross Income', formatNumber(data.oldRegimeResult.grossIncome), formatNumber(data.newRegimeResult.grossIncome)],
    ['Total Deductions', formatNumber(data.oldRegimeResult.totalDeductions), formatNumber(data.newRegimeResult.totalDeductions)],
    ['Taxable Income', formatNumber(data.oldRegimeResult.taxableIncome), formatNumber(data.newRegimeResult.taxableIncome)],
    ['Tax Before Rebate', formatNumber(data.oldRegimeResult.taxBeforeRebate), formatNumber(data.newRegimeResult.taxBeforeRebate)],
    ['Section 87A Rebate', formatNumber(data.oldRegimeResult.rebateAmount), formatNumber(data.newRegimeResult.rebateAmount)],
    ['Tax After Rebate', formatNumber(data.oldRegimeResult.taxAfterRebate), formatNumber(data.newRegimeResult.taxAfterRebate)],
    ['Surcharge', formatNumber(data.oldRegimeResult.surcharge), formatNumber(data.newRegimeResult.surcharge)],
    ['Health & Education Cess', formatNumber(data.oldRegimeResult.cess), formatNumber(data.newRegimeResult.cess)],
    ['TOTAL TAX LIABILITY', formatNumber(data.oldRegimeResult.totalTax), formatNumber(data.newRegimeResult.totalTax)]
  ];

  yPosition = createTable(comparisonHeaders, comparisonRows, yPosition, [70, 55, 55]);

  // SECTION 4: Recommendation Summary
  checkPageBreak(50);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECTION 4: RECOMMENDATION SUMMARY', 15, yPosition);
  yPosition += 8;

  const recommendationHeaders = ['Particulars', 'Details'];
  const recommendationRows = [
    ['Recommended Regime', data.recommendation.recommendedRegime.toUpperCase()],
    ['Tax Savings', `Rs ${formatNumber(data.recommendation.savings)}`],
    ['Percentage Savings', `${data.recommendation.percentageSavings.toFixed(2)}%`],
    ['Old Regime Tax', `Rs ${formatNumber(data.oldRegimeResult.totalTax)}`],
    ['New Regime Tax', `Rs ${formatNumber(data.newRegimeResult.totalTax)}`]
  ];

  yPosition = createTable(recommendationHeaders, recommendationRows, yPosition, [80, 100]);

  // SECTION 5: Effective Tax Rate Comparison
  checkPageBreak(50);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECTION 5: EFFECTIVE TAX RATE COMPARISON', 15, yPosition);
  yPosition += 8;

  const rateHeaders = ['Regime', 'Total Tax (Rs)', 'Gross Income (Rs)', 'Effective Rate (%)'];
  const rateRows = [
    ['Old Regime', formatNumber(data.oldRegimeResult.totalTax), formatNumber(data.oldRegimeResult.grossIncome), data.oldRegimeResult.effectiveRate.toFixed(2)],
    ['New Regime', formatNumber(data.newRegimeResult.totalTax), formatNumber(data.newRegimeResult.grossIncome), data.newRegimeResult.effectiveRate.toFixed(2)]
  ];

  yPosition = createTable(rateHeaders, rateRows, yPosition, [45, 45, 45, 45]);

  // SECTION 6: Deductions Breakdown
  checkPageBreak(130);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECTION 6: DEDUCTIONS BREAKDOWN (OLD REGIME)', 15, yPosition);
  yPosition += 8;

  const deductionHeaders = ['Section/Type', 'Amount (Rs)', 'Limit (Rs)', 'Regime'];
  const deductionRows = [
    ['Standard Deduction', formatNumber(50000), formatNumber(50000), 'Both'],
    ['Section 80C', formatNumber(data.deductions.section80C), formatNumber(150000), 'Old Only'],
    ['Section 80D', formatNumber(data.deductions.section80D), formatNumber(100000), 'Old Only'],
    ['HRA Exemption', formatNumber(data.deductions.hra), 'As per calculation', 'Old Only'],
    ['Home Loan Interest', formatNumber(data.deductions.homeLoanInterest), formatNumber(200000), 'Old Only'],
    ['NPS (80CCD-1B)', formatNumber(data.deductions.nps), formatNumber(50000), 'Old Only'],
    ['Education Loan (80E)', formatNumber(data.deductions.section80E), 'No Limit', 'Old Only'],
    ['Section 80G (Donations)', formatNumber(data.deductions.section80G), 'As per rules', 'Old Only'],
    ['Section 80TTA', formatNumber(data.deductions.section80TTA), formatNumber(10000), 'Old Only'],
    ['Professional Tax', formatNumber(data.deductions.professionalTax), formatNumber(2500), 'Both']
  ];

  yPosition = createTable(deductionHeaders, deductionRows, yPosition, [50, 35, 45, 30]);

  // Footer with disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 30) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(220, 220, 220);
  pdf.rect(15, yPosition, pageWidth - 30, 25, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('DISCLAIMER', pageWidth / 2, yPosition + 6, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is a calculated estimate based on current tax laws for FY 2024-25.', pageWidth / 2, yPosition + 12, { align: 'center' });
  pdf.text('Please consult a qualified tax professional for final tax planning and compliance.', pageWidth / 2, yPosition + 16, { align: 'center' });
  pdf.text('Tax laws are subject to change. Keep updated with latest amendments.', pageWidth / 2, yPosition + 20, { align: 'center' });

  // Save the PDF with taxpayer name if provided
  const fileName = data.taxpayerName 
    ? `Tax_Report_${data.taxpayerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}
