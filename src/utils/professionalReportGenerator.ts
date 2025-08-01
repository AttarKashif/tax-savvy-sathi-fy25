// Professional Report Generator with CA Firm Branding
// Generates client-ready PDF reports with computation sheets and analysis

import jsPDF from 'jspdf';
import { IncomeData, DeductionData, TaxResult } from './taxCalculations';

export interface CAFirmDetails {
  firmName: string;
  partnerName: string;
  membershipNumber: string;
  address: string;
  phone: string;
  email: string;
  logo?: string; // Base64 encoded logo
  signature?: string; // Base64 encoded signature
}

export interface ClientDetails {
  name: string;
  pan: string;
  assessmentYear: string;
  consultationDate: string;
  clientId?: string;
}

export interface ReportOptions {
  includeComputationSheet: boolean;
  includeScheduleBreakdown: boolean;
  includeTaxPlanningTips: boolean;
  includeRegimeComparison: boolean;
  includeCarryForwardAnalysis: boolean;
  includeAdvanceTaxCalendar: boolean;
  watermark?: string;
  confidentialityNotice: boolean;
}

export async function generateProfessionalTaxReport(
  clientDetails: ClientDetails,
  caFirmDetails: CAFirmDetails,
  income: IncomeData,
  deductions: DeductionData,
  taxResults: { old: TaxResult; new: TaxResult },
  recommendedRegime: 'old' | 'new',
  options: ReportOptions = {
    includeComputationSheet: true,
    includeScheduleBreakdown: true,
    includeTaxPlanningTips: true,
    includeRegimeComparison: true,
    includeCarryForwardAnalysis: false,
    includeAdvanceTaxCalendar: true,
    confidentialityNotice: true
  }
): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let currentY = 20;

  // Color scheme
  const primaryColor = '#1e40af'; // Professional blue
  const secondaryColor = '#64748b'; // Professional gray
  const accentColor = '#059669'; // Success green

  // Helper functions
  const addPage = () => {
    doc.addPage();
    currentY = 20;
    addHeader();
    addFooter();
  };

  const addHeader = () => {
    // CA Firm Logo (if provided)
    if (caFirmDetails.logo) {
      try {
        doc.addImage(caFirmDetails.logo, 'PNG', 15, 10, 30, 15);
      } catch (e) {
        console.warn('Could not add logo');
      }
    }

    // CA Firm Details
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(caFirmDetails.firmName, pageWidth - 15, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.setFont('helvetica', 'normal');
    doc.text(caFirmDetails.partnerName, pageWidth - 15, 28, { align: 'right' });
    doc.text(`Membership No: ${caFirmDetails.membershipNumber}`, pageWidth - 15, 33, { align: 'right' });
    doc.text(caFirmDetails.phone, pageWidth - 15, 38, { align: 'right' });
    doc.text(caFirmDetails.email, pageWidth - 15, 43, { align: 'right' });

    // Header line
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.line(15, 50, pageWidth - 15, 50);
    
    currentY = 60;
  };

  const addFooter = () => {
    const footerY = pageHeight - 20;
    
    // Footer line
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor);
    doc.setFont('helvetica', 'normal');
    
    // Page number
    const pageNumber = doc.getCurrentPageInfo().pageNumber;
    doc.text(`Page ${pageNumber}`, pageWidth - 15, footerY, { align: 'right' });
    
    // Confidentiality notice
    if (options.confidentialityNotice) {
      doc.text('CONFIDENTIAL - This document contains sensitive financial information', 15, footerY);
    }
    
    // Generation timestamp
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 15, footerY + 5);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const addSectionTitle = (title: string, fontSize: number = 14) => {
    if (currentY > pageHeight - 40) addPage();
    
    doc.setFontSize(fontSize);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, currentY);
    currentY += 10;
    
    // Underline
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, currentY - 3, 15 + doc.getTextWidth(title), currentY - 3);
    currentY += 5;
  };

  const addTable = (headers: string[], rows: string[][], columnWidths: number[]) => {
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const startX = (pageWidth - tableWidth) / 2;
    
    // Headers
    doc.setFillColor(240, 240, 240);
    doc.rect(startX, currentY, tableWidth, 8, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    
    let currentX = startX;
    headers.forEach((header, index) => {
      doc.text(header, currentX + 2, currentY + 5);
      currentX += columnWidths[index];
    });
    
    currentY += 8;
    
    // Rows
    doc.setFont('helvetica', 'normal');
    rows.forEach((row, rowIndex) => {
      if (currentY > pageHeight - 40) {
        addPage();
        currentY += 20;
      }
      
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(startX, currentY, tableWidth, 6, 'F');
      }
      
      currentX = startX;
      row.forEach((cell, cellIndex) => {
        doc.text(cell, currentX + 2, currentY + 4);
        currentX += columnWidths[cellIndex];
      });
      
      currentY += 6;
    });
    
    // Table border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.rect(startX, currentY - (rows.length * 6) - 8, tableWidth, (rows.length * 6) + 8);
    
    currentY += 10;
  };

  // Start generating the report
  addHeader();
  addFooter();

  // Title Page
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INCOME TAX COMPUTATION REPORT', pageWidth / 2, 100, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(secondaryColor);
  doc.text(`Assessment Year ${clientDetails.assessmentYear}`, pageWidth / 2, 115, { align: 'center' });

  // Client Details Box
  currentY = 140;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(40, currentY, pageWidth - 80, 50, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT DETAILS', 50, currentY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${clientDetails.name}`, 50, currentY + 20);
  doc.text(`PAN: ${clientDetails.pan}`, 50, currentY + 28);
  doc.text(`Consultation Date: ${clientDetails.consultationDate}`, 50, currentY + 36);
  if (clientDetails.clientId) {
    doc.text(`Client ID: ${clientDetails.clientId}`, 50, currentY + 44);
  }

  // Executive Summary
  currentY = 210;
  addSectionTitle('EXECUTIVE SUMMARY', 16);
  
  const selectedResult = recommendedRegime === 'old' ? taxResults.old : taxResults.new;
  const otherResult = recommendedRegime === 'old' ? taxResults.new : taxResults.old;
  const savings = Math.abs(selectedResult.totalTax - otherResult.totalTax);
  const savingsPercentage = otherResult.totalTax > 0 ? (savings / otherResult.totalTax) * 100 : 0;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const summaryText = [
    `Based on our analysis of your financial information for AY ${clientDetails.assessmentYear}, we recommend the ${recommendedRegime.toUpperCase()} TAX REGIME.`,
    ``,
    `Key Highlights:`,
    `• Total Income: ${formatCurrency(selectedResult.grossIncome)}`,
    `• Taxable Income: ${formatCurrency(selectedResult.taxableIncome)}`,
    `• Tax Liability (${recommendedRegime.toUpperCase()} Regime): ${formatCurrency(selectedResult.totalTax)}`,
    `• Tax Liability (${(recommendedRegime === 'old' ? 'NEW' : 'OLD')} Regime): ${formatCurrency(otherResult.totalTax)}`,
    `• Tax Savings: ${formatCurrency(savings)} (${savingsPercentage.toFixed(1)}%)`,
    `• Effective Tax Rate: ${selectedResult.effectiveRate.toFixed(2)}%`,
    `• Net Tax Payable: ${formatCurrency(Math.max(0, selectedResult.netTaxPayable))}`,
    selectedResult.netTaxPayable < 0 ? `• Refund Expected: ${formatCurrency(Math.abs(selectedResult.netTaxPayable))}` : ''
  ].filter(Boolean);

  summaryText.forEach(line => {
    if (currentY > pageHeight - 30) addPage();
    doc.text(line, 15, currentY);
    currentY += 6;
  });

  // New page for detailed computation
  addPage();

  if (options.includeComputationSheet) {
    addSectionTitle('DETAILED TAX COMPUTATION');
    
    // Income Computation Table
    const incomeHeaders = ['Income Head', 'Amount (₹)'];
    const incomeRows = [
      ['Salary Income', formatCurrency(income.salary)],
      ['Less: Standard Deduction', formatCurrency(recommendedRegime === 'old' ? 50000 : 75000)],
      ['Net Salary Income', formatCurrency(Math.max(0, income.salary - (recommendedRegime === 'old' ? 50000 : 75000)))],
      ['House Property Income', formatCurrency(selectedResult.housePropertyIncome)],
      ['Business/Professional Income', formatCurrency(income.businessIncome)],
      ['Capital Gains', formatCurrency(income.capitalGains.reduce((sum, gain) => sum + gain.amount, 0))],
      ['Other Sources', formatCurrency(income.otherSources)],
      ['Gross Total Income', formatCurrency(selectedResult.grossIncome)]
    ];
    
    addTable(incomeHeaders, incomeRows, [120, 60]);

    currentY += 10;

    // Deductions Table (only for old regime or limited deductions for new regime)
    if (recommendedRegime === 'old' || selectedResult.totalDeductions > 0) {
      addSectionTitle('DEDUCTIONS UNDER CHAPTER VI-A');
      
      const deductionHeaders = ['Deduction', 'Amount (₹)'];
      const deductionRows = [];
      
      if (recommendedRegime === 'old') {
        deductionRows.push(
          ['Section 80C', formatCurrency(deductions.section80C)],
          ['Section 80D', formatCurrency(deductions.section80D)],
          ['HRA Exemption', formatCurrency(deductions.hra)],
          ['LTA Exemption', formatCurrency(deductions.lta)],
          ['Home Loan Interest', formatCurrency(deductions.homeLoanInterest)],
          ['Section 80TTA/TTB', formatCurrency(deductions.section80TTA)],
          ['NPS (80CCD1B)', formatCurrency(deductions.nps)],
          ['Other Deductions', formatCurrency(deductions.section80E + deductions.section80G)]
        );
      } else {
        deductionRows.push(['Limited Deductions (New Regime)', formatCurrency(selectedResult.totalDeductions)]);
      }
      
      deductionRows.push(['Total Deductions', formatCurrency(selectedResult.totalDeductions)]);
      deductionRows.push(['Taxable Income', formatCurrency(selectedResult.taxableIncome)]);
      
      addTable(deductionHeaders, deductionRows, [120, 60]);
    }

    currentY += 10;

    // Tax Computation Table
    addSectionTitle('TAX COMPUTATION');
    
    const taxHeaders = ['Particulars', 'Amount (₹)'];
    const taxRows = [
      ['Tax on Taxable Income', formatCurrency(selectedResult.taxBeforeRebate)],
      ['Less: Rebate u/s 87A', formatCurrency(selectedResult.rebateAmount)],
      ['Tax after Rebate', formatCurrency(selectedResult.taxAfterRebate)],
      ['Add: Surcharge', formatCurrency(selectedResult.surcharge)],
      ['Add: Health & Education Cess', formatCurrency(selectedResult.cess)],
      ['Total Tax Liability', formatCurrency(selectedResult.totalTax)],
      ['Less: TDS/TCS', formatCurrency(selectedResult.tdsDeducted + selectedResult.tcsDeducted)],
      ['Net Tax Payable', formatCurrency(Math.max(0, selectedResult.netTaxPayable))],
      selectedResult.netTaxPayable < 0 ? ['Refund Due', formatCurrency(Math.abs(selectedResult.netTaxPayable))] : null
    ].filter(Boolean) as string[][];
    
    addTable(taxHeaders, taxRows, [120, 60]);
  }

  // Regime Comparison
  if (options.includeRegimeComparison) {
    addPage();
    addSectionTitle('TAX REGIME COMPARISON ANALYSIS');
    
    const comparisonHeaders = ['Particulars', 'Old Regime (₹)', 'New Regime (₹)', 'Difference (₹)'];
    const comparisonRows = [
      ['Gross Total Income', formatCurrency(taxResults.old.grossIncome), formatCurrency(taxResults.new.grossIncome), '0'],
      ['Total Deductions', formatCurrency(taxResults.old.totalDeductions), formatCurrency(taxResults.new.totalDeductions), formatCurrency(taxResults.old.totalDeductions - taxResults.new.totalDeductions)],
      ['Taxable Income', formatCurrency(taxResults.old.taxableIncome), formatCurrency(taxResults.new.taxableIncome), formatCurrency(taxResults.old.taxableIncome - taxResults.new.taxableIncome)],
      ['Tax Liability', formatCurrency(taxResults.old.totalTax), formatCurrency(taxResults.new.totalTax), formatCurrency(taxResults.old.totalTax - taxResults.new.totalTax)],
      ['Effective Tax Rate', `${taxResults.old.effectiveRate.toFixed(2)}%`, `${taxResults.new.effectiveRate.toFixed(2)}%`, `${(taxResults.old.effectiveRate - taxResults.new.effectiveRate).toFixed(2)}%`]
    ];
    
    addTable(comparisonHeaders, comparisonRows, [50, 40, 40, 40]);

    currentY += 10;

    // Recommendation box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(15, currentY, pageWidth - 30, 25, 2, 2, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDATION', 20, currentY + 8);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const recommendationText = `Based on the above analysis, we recommend opting for the ${recommendedRegime.toUpperCase()} TAX REGIME as it results in a tax saving of ${formatCurrency(savings)} (${savingsPercentage.toFixed(1)}% reduction).`;
    
    const splitText = doc.splitTextToSize(recommendationText, pageWidth - 50);
    doc.text(splitText, 20, currentY + 16);
    
    currentY += 35;
  }

  // Tax Planning Tips
  if (options.includeTaxPlanningTips) {
    addPage();
    addSectionTitle('TAX PLANNING RECOMMENDATIONS');
    
    const tips = [
      'Investment Planning:',
      '• Maximize Section 80C investments (₹1.5 lakh limit)',
      '• Consider ELSS mutual funds for dual benefit of tax saving and wealth creation',
      '• Evaluate NPS contributions for additional ₹50,000 deduction under 80CCD(1B)',
      '',
      'Health Insurance:',
      '• Maintain adequate health insurance for Section 80D benefits',
      '• Consider separate policy for parents for higher deduction',
      '',
      'Advance Tax Planning:',
      '• Pay advance tax to avoid interest charges if liability exceeds ₹10,000',
      '• Consider quarterly installments as per the prescribed schedule',
      '',
      'Documentation:',
      '• Maintain proper records of all investments and expenses',
      '• Ensure timely receipt of TDS certificates (Form 16/16A)',
      '• Keep ready all supporting documents for deductions claimed'
    ];

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    tips.forEach(tip => {
      if (currentY > pageHeight - 20) addPage();
      
      if (tip.includes(':') && !tip.startsWith('•')) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      doc.text(tip, 15, currentY);
      currentY += 5;
    });
  }

  // Advance Tax Calendar
  if (options.includeAdvanceTaxCalendar && selectedResult.advanceTaxRequired > 0) {
    addPage();
    addSectionTitle('ADVANCE TAX PAYMENT CALENDAR');
    
    const installments = [
      { period: 'Q1 (Apr-Jun)', dueDate: '15th June 2024', percentage: '15%', amount: Math.round(selectedResult.advanceTaxRequired * 0.15) },
      { period: 'Q2 (Jul-Sep)', dueDate: '15th September 2024', percentage: '45%', amount: Math.round(selectedResult.advanceTaxRequired * 0.45) },
      { period: 'Q3 (Oct-Dec)', dueDate: '15th December 2024', percentage: '75%', amount: Math.round(selectedResult.advanceTaxRequired * 0.75) },
      { period: 'Q4 (Jan-Mar)', dueDate: '15th March 2025', percentage: '100%', amount: selectedResult.advanceTaxRequired }
    ];

    const calendarHeaders = ['Period', 'Due Date', 'Cumulative %', 'Cumulative Amount (₹)'];
    const calendarRows = installments.map(inst => [
      inst.period,
      inst.dueDate,
      inst.percentage,
      formatCurrency(inst.amount)
    ]);
    
    addTable(calendarHeaders, calendarRows, [45, 45, 30, 50]);
  }

  // Digital Signature
  if (caFirmDetails.signature) {
    addPage();
    currentY = pageHeight - 80;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Certified by:', pageWidth - 80, currentY);
    
    try {
      doc.addImage(caFirmDetails.signature, 'PNG', pageWidth - 80, currentY + 5, 50, 20);
    } catch (e) {
      console.warn('Could not add signature');
    }
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(caFirmDetails.partnerName, pageWidth - 80, currentY + 30);
    doc.text(`CA Membership No: ${caFirmDetails.membershipNumber}`, pageWidth - 80, currentY + 35);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 80, currentY + 40);
  }

  // Save the PDF
  const fileName = `Tax_Computation_${clientDetails.name.replace(/\s+/g, '_')}_AY_${clientDetails.assessmentYear.replace('-', '_')}.pdf`;
  doc.save(fileName);
}