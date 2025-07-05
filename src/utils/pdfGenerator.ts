
import jsPDF from 'jspdf';
import { IncomeData, DeductionData, TaxResult, TDSData, CarryForwardLoss } from './taxCalculations';

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
  tdsData?: TDSData;
  carryForwardLosses?: CarryForwardLoss[];
  insights?: {
    taxEfficiency: { level: string; effectiveRate: number };
    optimizationOpportunities: Array<{
      title: string;
      description: string;
      potentialSaving: number;
      priority: string;
    }>;
  };
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
    
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.roundedRect(10, footerY - 8, pageWidth - 20, 12, 2, 2, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184); // slate-400
    
    const profileText = `${data.taxpayerName || 'User'} • Age: ${data.age} years`;
    pdf.text(profileText, 15, footerY - 2);
    
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
  pdf.text('COMPREHENSIVE TAX ANALYSIS REPORT', pageWidth / 2, 18, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text('Financial Year 2024-25 • Assessment Year 2025-26 • AI-Powered Analysis', pageWidth / 2, 25, { align: 'center' });
  
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

  // Income Summary Section with Capital Gains Breakdown
  checkPageBreak(80);
  
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('INCOME ANALYSIS', 15, yPosition + 5);
  yPosition += 12;

  const incomeHeaders = ['Income Source', 'Amount (₹)', 'Tax Treatment'];
  const totalCapitalGains = data.income.capitalGains.reduce((sum, gain) => sum + gain.amount, 0);
  const totalIncome = data.income.salary + data.income.businessIncome + totalCapitalGains + data.income.otherSources;
  
  const incomeRows = [
    ['Annual Salary', formatNumber(data.income.salary), 'As per slab'],
    ['Basic Salary', formatNumber(data.income.basicSalary), 'For HRA calculation'],
    ['Business Income', formatNumber(data.income.businessIncome), 'As per slab'],
    ['Capital Gains (Total)', formatNumber(totalCapitalGains), 'Asset-specific rates'],
    ['Other Sources', formatNumber(data.income.otherSources), 'As per slab'],
    ['GROSS TOTAL INCOME', formatNumber(totalIncome), '']
  ];

  yPosition = createModernTable(incomeHeaders, incomeRows, yPosition, [80, 60, 40]);

  // Capital Gains Detailed Breakdown
  if (data.income.capitalGains.length > 0) {
    checkPageBreak(60);
    
    pdf.setFillColor(147, 51, 234); // purple-600
    pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('CAPITAL GAINS PORTFOLIO', 15, yPosition + 5);
    yPosition += 12;

    const cgHeaders = ['Asset Type', 'Term', 'Amount (₹)', 'Tax Rate'];
    const cgRows = data.income.capitalGains.map(gain => [
      gain.assetType.replace(/_/g, ' ').toUpperCase(),
      gain.isLongTerm ? 'Long-term' : 'Short-term',
      formatNumber(gain.amount),
      'Asset-specific'
    ]);

    yPosition = createModernTable(cgHeaders, cgRows, yPosition, [50, 30, 50, 40]);
  }

  // TDS Summary
  if (data.tdsData) {
    const totalTDS = data.tdsData.salary + data.tdsData.professionalServices + 
                     data.tdsData.interestFromBank + data.tdsData.rentReceived + data.tdsData.otherTDS;
    
    if (totalTDS > 0) {
      checkPageBreak(60);
      
      pdf.setFillColor(34, 197, 94); // green-600
      pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('TAX DEDUCTED AT SOURCE (TDS)', 15, yPosition + 5);
      yPosition += 12;

      const tdsHeaders = ['TDS Category', 'Amount (₹)'];
      const tdsRows = [
        ['Salary TDS', formatNumber(data.tdsData.salary)],
        ['Professional Services', formatNumber(data.tdsData.professionalServices)],
        ['Interest from Bank', formatNumber(data.tdsData.interestFromBank)],
        ['Rent Received', formatNumber(data.tdsData.rentReceived)],
        ['Other TDS', formatNumber(data.tdsData.otherTDS)],
        ['TOTAL TDS', formatNumber(totalTDS)]
      ];

      yPosition = createModernTable(tdsHeaders, tdsRows, yPosition, [100, 80]);
    }
  }

  // Tax Calculation Comparison
  checkPageBreak(100);
  
  pdf.setFillColor(147, 51, 234); // purple-600
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('COMPREHENSIVE TAX COMPARISON', 15, yPosition + 5);
  yPosition += 12;

  const comparisonHeaders = ['Particulars', 'Old Regime', 'New Regime'];
  const comparisonRows = [
    ['Gross Total Income', formatNumber(data.oldRegimeResult.grossIncome), formatNumber(data.newRegimeResult.grossIncome)],
    ['Total Deductions', formatNumber(data.oldRegimeResult.totalDeductions), formatNumber(data.newRegimeResult.totalDeductions)],
    ['Taxable Income', formatNumber(data.oldRegimeResult.taxableIncome), formatNumber(data.newRegimeResult.taxableIncome)],
    ['Regular Income Tax', formatNumber(data.oldRegimeResult.regularIncomeTax), formatNumber(data.newRegimeResult.regularIncomeTax)],
    ['Capital Gains Tax', formatNumber(data.oldRegimeResult.capitalGainsTax), formatNumber(data.newRegimeResult.capitalGainsTax)],
    ['Tax Before Rebate', formatNumber(data.oldRegimeResult.taxBeforeRebate), formatNumber(data.newRegimeResult.taxBeforeRebate)],
    ['Section 87A Rebate', formatNumber(data.oldRegimeResult.rebateAmount), formatNumber(data.newRegimeResult.rebateAmount)],
    ['Tax After Rebate', formatNumber(data.oldRegimeResult.taxAfterRebate), formatNumber(data.newRegimeResult.taxAfterRebate)],
    ['Surcharge', formatNumber(data.oldRegimeResult.surcharge), formatNumber(data.newRegimeResult.surcharge)],
    ['Health & Education Cess', formatNumber(data.oldRegimeResult.cess), formatNumber(data.newRegimeResult.cess)],
    ['TOTAL TAX LIABILITY', formatNumber(data.oldRegimeResult.totalTax), formatNumber(data.newRegimeResult.totalTax)],
    ['TDS Deducted', formatNumber(data.oldRegimeResult.tdsDeducted), formatNumber(data.newRegimeResult.tdsDeducted)],
    ['NET TAX PAYABLE', formatNumber(data.oldRegimeResult.netTaxPayable), formatNumber(data.newRegimeResult.netTaxPayable)]
  ];

  yPosition = createModernTable(comparisonHeaders, comparisonRows, yPosition, [70, 55, 55]);

  // AI Insights Section
  if (data.insights) {
    checkPageBreak(80);
    
    pdf.setFillColor(245, 158, 11); // amber-500
    pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('AI-POWERED INSIGHTS & RECOMMENDATIONS', 15, yPosition + 5);
    yPosition += 12;

    // Tax Efficiency Analysis
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(245, 158, 11);
    pdf.text('Tax Efficiency Rating:', 15, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${data.insights.taxEfficiency.level} (${data.insights.taxEfficiency.effectiveRate.toFixed(1)}% effective rate)`, 60, yPosition + 5);
    yPosition += 10;

    // Optimization Opportunities
    if (data.insights.optimizationOpportunities.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(245, 158, 11);
      pdf.text('Top Optimization Opportunities:', 15, yPosition + 5);
      yPosition += 10;

      data.insights.optimizationOpportunities.slice(0, 5).forEach((opportunity, index) => {
        checkPageBreak(15);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${opportunity.title}`, 20, yPosition + 5);
        yPosition += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const desc = opportunity.description;
        if (desc.length > 80) {
          const words = desc.split(' ');
          let line = '';
          for (const word of words) {
            if ((line + word).length > 80) {
              pdf.text(line, 25, yPosition + 5);
              yPosition += 5;
              line = word + ' ';
            } else {
              line += word + ' ';
            }
          }
          if (line.trim()) {
            pdf.text(line.trim(), 25, yPosition + 5);
            yPosition += 5;
          }
        } else {
          pdf.text(desc, 25, yPosition + 5);
          yPosition += 5;
        }
        
        pdf.setTextColor(22, 163, 74);
        pdf.text(`Potential Saving: ₹${formatNumber(opportunity.potentialSaving)}`, 25, yPosition + 5);
        yPosition += 10;
      });
    }
  }

  // Recommendation Summary
  checkPageBreak(50);
  
  pdf.setFillColor(236, 72, 153); // pink-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('FINAL RECOMMENDATION', 15, yPosition + 5);
  yPosition += 12;

  const recommendationHeaders = ['Metric', 'Value'];
  const recommendationRows = [
    ['Recommended Regime', data.recommendation.recommendedRegime.toUpperCase()],
    ['Tax Savings', `₹${formatNumber(data.recommendation.savings)}`],
    ['Percentage Savings', `${data.recommendation.percentageSavings.toFixed(1)}%`],
    ['Old Regime Tax', `₹${formatNumber(data.oldRegimeResult.totalTax)}`],
    ['New Regime Tax', `₹${formatNumber(data.newRegimeResult.totalTax)}`],
    ['Net Tax Payable (Recommended)', `₹${formatNumber(data.recommendation.recommendedRegime === 'old' ? data.oldRegimeResult.netTaxPayable : data.newRegimeResult.netTaxPayable)}`]
  ];

  yPosition = createModernTable(recommendationHeaders, recommendationRows, yPosition, [80, 100]);

  // Action Items Section
  yPosition += 10;
  if (yPosition > pageHeight - 50) {
    addFooter();
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(34, 197, 94); // green-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 8, 2, 2, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('IMMEDIATE ACTION ITEMS', 15, yPosition + 5);
  yPosition += 15;

  const actionItems = [
    'Review and implement recommended tax regime',
    'Consider suggested investment opportunities',
    'Ensure all TDS certificates are collected',
    'Plan advance tax payments if net liability > ₹10,000',
    'Maintain proper documentation for all claims',
    'Consider quarterly tax planning reviews'
  ];

  actionItems.forEach((item, index) => {
    checkPageBreak(8);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${item}`, 15, yPosition + 5);
    yPosition += 8;
  });

  // Enhanced disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 40) {
    addFooter();
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(254, 243, 199); // amber-100
  pdf.roundedRect(10, yPosition, pageWidth - 20, 30, 3, 3, 'F');
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(10, yPosition, pageWidth - 20, 30, 3, 3);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(146, 64, 14);
  pdf.text('IMPORTANT DISCLAIMER', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is an AI-generated estimate based on FY 2024-25 tax laws and your inputs. Actual tax', pageWidth / 2, yPosition + 15, { align: 'center' });
  pdf.text('liability may vary. Please consult a qualified tax professional for personalized advice.', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.text('Generated by Smart Tax Calculator Pro for informational purposes only.', pageWidth / 2, yPosition + 25, { align: 'center' });

  // Add footer to final page
  addFooter();

  // Save PDF with enhanced naming
  const fileName = data.taxpayerName 
    ? `Comprehensive_Tax_Report_${data.taxpayerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `Comprehensive_Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}
