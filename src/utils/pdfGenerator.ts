
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
    if (yPosition + requiredSpace > pageHeight - 25) {
      addFooter();
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add footer with profile and timestamp
  const addFooter = () => {
    const footerY = pageHeight - 15;
    
    // Modern footer background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(15, footerY - 5, pageWidth - 30, 10, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.rect(15, footerY - 5, pageWidth - 30, 10);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    
    // Left side - Profile info
    const profileText = `Generated for: ${data.taxpayerName || 'User'} | Age: ${data.age} years`;
    pdf.text(profileText, 20, footerY);
    
    // Right side - Generation timestamp
    const timestamp = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
    const timestampText = `Generated: ${timestamp} IST`;
    pdf.text(timestampText, pageWidth - 20, footerY, { align: 'right' });
  };

  // Helper function to format numbers with exactly 2 decimal places
  const formatNumber = (value: number): string => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper function to create modern tables with rounded corners
  const createModernTable = (headers: string[], rows: string[][], startY: number, columnWidths?: number[]) => {
    const totalWidth = pageWidth - 30;
    const colWidths = columnWidths || headers.map(() => totalWidth / headers.length);
    const cornerRadius = 2;
    
    // Draw modern header with gradient
    pdf.setFillColor(51, 65, 85); // slate-700
    
    // Rounded rectangle for header
    let xPos = 15;
    headers.forEach((header, i) => {
      pdf.roundedRect(xPos, startY, colWidths[i], 10, cornerRadius, cornerRadius, 'F');
      xPos += colWidths[i];
    });
    
    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    
    xPos = 15;
    headers.forEach((header, i) => {
      const textX = xPos + (colWidths[i] / 2);
      pdf.text(header, textX, startY + 7, { align: 'center' });
      xPos += colWidths[i];
    });
    
    // Draw rows with modern styling
    pdf.setTextColor(51, 65, 85);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    let currentY = startY + 10;
    
    rows.forEach((row, rowIndex) => {
      // Alternating row colors
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(248, 250, 252); // slate-50
      } else {
        pdf.setFillColor(255, 255, 255);
      }
      
      xPos = 15;
      headers.forEach((_, i) => {
        pdf.roundedRect(xPos, currentY, colWidths[i], 8, 1, 1, 'F');
        xPos += colWidths[i];
      });
      
      xPos = 15;
      row.forEach((cell, i) => {
        const textX = i === 0 ? xPos + 3 : xPos + (colWidths[i] / 2);
        const align = i === 0 ? 'left' : 'center';
        pdf.text(cell, textX, currentY + 5.5, { align: align as any });
        xPos += colWidths[i];
      });
      currentY += 8;
    });
    
    return currentY + 8;
  };

  // Modern title section with gradient background
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.roundedRect(15, 15, pageWidth - 30, 25, 3, 3, 'F');
  
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TAX COMPARISON REPORT', pageWidth / 2, 27, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(203, 213, 225);
  pdf.text('Financial Year 2024-25 (Assessment Year 2025-26)', pageWidth / 2, 34, { align: 'center' });
  
  yPosition = 50;

  // SECTION 1: Personal Information with modern card design
  checkPageBreak(70);
  
  // Section header with accent
  pdf.setFillColor(59, 130, 246); // blue-500
  pdf.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, 'F');
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('PERSONAL INFORMATION', 20, yPosition + 5.5);
  yPosition += 15;

  const personalHeaders = ['Field', 'Details'];
  const personalRows = [
    ['Taxpayer Name', data.taxpayerName || 'Not provided'],
    ['Age', `${data.age} years`],
    ['Tax Category', data.age >= 80 ? 'Super Senior Citizen (80+ years)' : data.age >= 60 ? 'Senior Citizen (60-79 years)' : 'Individual (Below 60 years)'],
    ['Basic Tax Exemption Limit', data.age >= 80 ? '₹5,00,000' : data.age >= 60 ? '₹3,00,000' : '₹2,50,000'],
    ['Financial Year', '2024-25'],
    ['Assessment Year', '2025-26']
  ];

  yPosition = createModernTable(personalHeaders, personalRows, yPosition, [80, 100]);

  // SECTION 2: Income Summary
  checkPageBreak(90);
  
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, 'F');
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('INCOME SUMMARY', 20, yPosition + 5.5);
  yPosition += 15;

  const incomeHeaders = ['Income Source', 'Amount (Rs)'];
  const totalIncome = data.income.salary + data.income.businessIncome + data.income.capitalGainsShort + data.income.capitalGainsLong + data.income.otherSources;
  
  const incomeRows = [
    ['Annual Salary (CTC)', formatNumber(data.income.salary)],
    ['Basic Salary (for HRA calculation)', formatNumber(data.income.basicSalary)],
    ['Business/Professional Income', formatNumber(data.income.businessIncome)],
    ['Short-term Capital Gains', formatNumber(data.income.capitalGainsShort)],
    ['Long-term Capital Gains', formatNumber(data.income.capitalGainsLong)],
    ['Income from Other Sources', formatNumber(data.income.otherSources)],
    ['TOTAL GROSS INCOME', formatNumber(totalIncome)]
  ];

  yPosition = createModernTable(incomeHeaders, incomeRows, yPosition, [100, 80]);

  // SECTION 3: Tax Calculation Comparison
  checkPageBreak(120);
  
  pdf.setFillColor(147, 51, 234); // purple-600
  pdf.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, 'F');
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('TAX CALCULATION COMPARISON', 20, yPosition + 5.5);
  yPosition += 15;

  const comparisonHeaders = ['Particulars', 'Old Regime (Rs)', 'New Regime (Rs)'];
  const comparisonRows = [
    ['Gross Income', formatNumber(data.oldRegimeResult.grossIncome), formatNumber(data.newRegimeResult.grossIncome)],
    ['Total Deductions Available', formatNumber(data.oldRegimeResult.totalDeductions), formatNumber(data.newRegimeResult.totalDeductions)],
    ['Taxable Income', formatNumber(data.oldRegimeResult.taxableIncome), formatNumber(data.newRegimeResult.taxableIncome)],
    ['Tax Before Rebate', formatNumber(data.oldRegimeResult.taxBeforeRebate), formatNumber(data.newRegimeResult.taxBeforeRebate)],
    ['Section 87A Rebate', formatNumber(data.oldRegimeResult.rebateAmount), formatNumber(data.newRegimeResult.rebateAmount)],
    ['Tax After Rebate', formatNumber(data.oldRegimeResult.taxAfterRebate), formatNumber(data.newRegimeResult.taxAfterRebate)],
    ['Surcharge (if applicable)', formatNumber(data.oldRegimeResult.surcharge), formatNumber(data.newRegimeResult.surcharge)],
    ['Health & Education Cess (4%)', formatNumber(data.oldRegimeResult.cess), formatNumber(data.newRegimeResult.cess)],
    ['TOTAL TAX LIABILITY', formatNumber(data.oldRegimeResult.totalTax), formatNumber(data.newRegimeResult.totalTax)]
  ];

  yPosition = createModernTable(comparisonHeaders, comparisonRows, yPosition, [70, 55, 55]);

  // SECTION 4: Recommendation Summary
  checkPageBreak(70);
  
  pdf.setFillColor(245, 101, 101); // red-400
  pdf.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, 'F');
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('RECOMMENDATION SUMMARY', 20, yPosition + 5.5);
  yPosition += 15;

  const recommendationHeaders = ['Particulars', 'Details'];
  const recommendationRows = [
    ['Recommended Tax Regime', data.recommendation.recommendedRegime.toUpperCase() + ' REGIME'],
    ['Tax Savings Amount', `Rs ${formatNumber(data.recommendation.savings)}`],
    ['Percentage Savings', `${data.recommendation.percentageSavings.toFixed(2)}%`],
    ['Old Regime Total Tax', `Rs ${formatNumber(data.oldRegimeResult.totalTax)}`],
    ['New Regime Total Tax', `Rs ${formatNumber(data.newRegimeResult.totalTax)}`],
    ['Take-home Income (Old)', `Rs ${formatNumber(data.oldRegimeResult.grossIncome - data.oldRegimeResult.totalTax)}`],
    ['Take-home Income (New)', `Rs ${formatNumber(data.newRegimeResult.grossIncome - data.newRegimeResult.totalTax)}`]
  ];

  yPosition = createModernTable(recommendationHeaders, recommendationRows, yPosition, [80, 100]);

  // Modern disclaimer
  yPosition += 15;
  if (yPosition > pageHeight - 40) {
    addFooter();
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(254, 243, 199); // amber-100
  pdf.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3, 'F');
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(146, 64, 14);
  pdf.text('IMPORTANT DISCLAIMER', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is a calculated estimate based on current tax laws for FY 2024-25. Actual tax liability may vary.', pageWidth / 2, yPosition + 18, { align: 'center' });
  pdf.text('Please consult a qualified Chartered Accountant or tax professional for final tax planning.', pageWidth / 2, yPosition + 24, { align: 'center' });
  pdf.text('This report is generated by AI Tax Calculator and is for informational purposes only.', pageWidth / 2, yPosition + 30, { align: 'center' });

  // Add footer to final page
  addFooter();

  // Save the PDF with enhanced naming
  const fileName = data.taxpayerName 
    ? `Tax_Report_${data.taxpayerName.replace(/\s+/g, '_')}_FY2024-25_${new Date().toISOString().split('T')[0]}.pdf`
    : `Tax_Report_FY2024-25_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}
