
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
      addFooter();
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add modern footer with profile and timestamp
  const addFooter = () => {
    const footerY = pageHeight - 15;
    
    // Modern dark footer background
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.roundedRect(10, footerY - 8, pageWidth - 20, 12, 2, 2, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184); // slate-400
    
    // Left side - Profile info
    const profileText = `${data.taxpayerName || 'User'} • Age: ${data.age} years`;
    pdf.text(profileText, 15, footerY - 2);
    
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
    pdf.text(timestampText, pageWidth - 15, footerY - 2, { align: 'right' });
  };

  // Helper function to format numbers
  const formatNumber = (value: number): string => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper function to create modern dark-themed tables
  const createModernTable = (headers: string[], rows: string[][], startY: number, columnWidths?: number[]) => {
    const totalWidth = pageWidth - 20;
    const colWidths = columnWidths || headers.map(() => totalWidth / headers.length);
    const rowHeight = 8;
    
    // Draw modern header with dark theme
    pdf.setFillColor(51, 65, 85); // slate-700
    
    let xPos = 10;
    headers.forEach((header, i) => {
      pdf.roundedRect(xPos, startY, colWidths[i], rowHeight, 1, 1, 'F');
      xPos += colWidths[i];
    });
    
    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    
    xPos = 10;
    headers.forEach((header, i) => {
      const textX = xPos + (colWidths[i] / 2);
      pdf.text(header, textX, startY + 5, { align: 'center' });
      xPos += colWidths[i];
    });
    
    // Draw rows with alternating colors
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    let currentY = startY + rowHeight;
    
    rows.forEach((row, rowIndex) => {
      // Alternating row colors - dark theme
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(71, 85, 105); // slate-600
      } else {
        pdf.setFillColor(55, 65, 81); // slate-700
      }
      
      xPos = 10;
      headers.forEach((_, i) => {
        pdf.roundedRect(xPos, currentY, colWidths[i], rowHeight, 0.5, 0.5, 'F');
        xPos += colWidths[i];
      });
      
      // Row text
      pdf.setTextColor(241, 245, 249); // slate-100
      xPos = 10;
      row.forEach((cell, i) => {
        const textX = i === 0 ? xPos + 2 : xPos + (colWidths[i] / 2);
        const align = i === 0 ? 'left' : 'center';
        pdf.text(cell, textX, currentY + 5, { align: align as any });
        xPos += colWidths[i];
      });
      currentY += rowHeight;
    });
    
    return currentY + 5;
  };

  // Modern dark header with gradient effect
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.roundedRect(10, 10, pageWidth - 20, 20, 3, 3, 'F');
  
  pdf.setFontSize(22);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TAX COMPARISON REPORT', pageWidth / 2, 18, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text('Financial Year 2024-25 • Assessment Year 2025-26', pageWidth / 2, 25, { align: 'center' });
  
  yPosition = 40;

  // Personal Information Section
  checkPageBreak(50);
  
  pdf.setFillColor(59, 130, 246); // blue-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('PERSONAL INFORMATION', 15, yPosition + 5);
  yPosition += 12;

  const personalHeaders = ['Field', 'Value'];
  const personalRows = [
    ['Taxpayer Name', data.taxpayerName || 'Not provided'],
    ['Age', `${data.age} years`],
    ['Tax Category', data.age >= 80 ? 'Super Senior (80+)' : data.age >= 60 ? 'Senior (60-79)' : 'Regular (<60)'],
    ['Exemption Limit', data.age >= 80 ? '₹5,00,000' : data.age >= 60 ? '₹3,00,000' : '₹2,50,000']
  ];

  yPosition = createModernTable(personalHeaders, personalRows, yPosition, [60, 120]);

  // Income Summary Section
  checkPageBreak(60);
  
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('INCOME SUMMARY', 15, yPosition + 5);
  yPosition += 12;

  const incomeHeaders = ['Income Source', 'Amount (₹)'];
  const totalIncome = data.income.salary + data.income.businessIncome + data.income.capitalGainsShort + data.income.capitalGainsLong + data.income.otherSources;
  
  const incomeRows = [
    ['Annual Salary', formatNumber(data.income.salary)],
    ['Basic Salary', formatNumber(data.income.basicSalary)],
    ['Business Income', formatNumber(data.income.businessIncome)],
    ['Short-term Capital Gains', formatNumber(data.income.capitalGainsShort)],
    ['Long-term Capital Gains', formatNumber(data.income.capitalGainsLong)],
    ['Other Sources', formatNumber(data.income.otherSources)],
    ['TOTAL INCOME', formatNumber(totalIncome)]
  ];

  yPosition = createModernTable(incomeHeaders, incomeRows, yPosition, [100, 80]);

  // Tax Calculation Comparison
  checkPageBreak(80);
  
  pdf.setFillColor(147, 51, 234); // purple-600
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('TAX CALCULATION COMPARISON', 15, yPosition + 5);
  yPosition += 12;

  const comparisonHeaders = ['Particulars', 'Old Regime', 'New Regime'];
  const comparisonRows = [
    ['Gross Income', formatNumber(data.oldRegimeResult.grossIncome), formatNumber(data.newRegimeResult.grossIncome)],
    ['Total Deductions', formatNumber(data.oldRegimeResult.totalDeductions), formatNumber(data.newRegimeResult.totalDeductions)],
    ['Taxable Income', formatNumber(data.oldRegimeResult.taxableIncome), formatNumber(data.newRegimeResult.taxableIncome)],
    ['Tax Before Rebate', formatNumber(data.oldRegimeResult.taxBeforeRebate), formatNumber(data.newRegimeResult.taxBeforeRebate)],
    ['Section 87A Rebate', formatNumber(data.oldRegimeResult.rebateAmount), formatNumber(data.newRegimeResult.rebateAmount)],
    ['Tax After Rebate', formatNumber(data.oldRegimeResult.taxAfterRebate), formatNumber(data.newRegimeResult.taxAfterRebate)],
    ['Surcharge', formatNumber(data.oldRegimeResult.surcharge), formatNumber(data.newRegimeResult.surcharge)],
    ['Cess (4%)', formatNumber(data.oldRegimeResult.cess), formatNumber(data.newRegimeResult.cess)],
    ['TOTAL TAX', formatNumber(data.oldRegimeResult.totalTax), formatNumber(data.newRegimeResult.totalTax)]
  ];

  yPosition = createModernTable(comparisonHeaders, comparisonRows, yPosition, [70, 55, 55]);

  // Recommendation Summary
  checkPageBreak(50);
  
  pdf.setFillColor(236, 72, 153); // pink-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('RECOMMENDATION', 15, yPosition + 5);
  yPosition += 12;

  const recommendationHeaders = ['Metric', 'Value'];
  const recommendationRows = [
    ['Recommended Regime', data.recommendation.recommendedRegime.toUpperCase()],
    ['Tax Savings', `₹${formatNumber(data.recommendation.savings)}`],
    ['Percentage Savings', `${data.recommendation.percentageSavings.toFixed(1)}%`],
    ['Old Regime Tax', `₹${formatNumber(data.oldRegimeResult.totalTax)}`],
    ['New Regime Tax', `₹${formatNumber(data.newRegimeResult.totalTax)}`]
  ];

  yPosition = createModernTable(recommendationHeaders, recommendationRows, yPosition, [80, 100]);

  // Modern disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 35) {
    addFooter();
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(254, 243, 199); // amber-100
  pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 3, 3, 'F');
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 3, 3);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(146, 64, 14);
  pdf.text('DISCLAIMER', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is a calculated estimate based on FY 2024-25 tax laws. Consult a tax professional for final advice.', pageWidth / 2, yPosition + 15, { align: 'center' });
  pdf.text('Generated by AI Tax Calculator for informational purposes only.', pageWidth / 2, yPosition + 20, { align: 'center' });

  // Add footer to final page
  addFooter();

  // Save PDF with enhanced naming
  const fileName = data.taxpayerName 
    ? `Tax_Report_${data.taxpayerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}
