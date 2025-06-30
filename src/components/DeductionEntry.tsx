
import React, { useCallback } from 'react';
import { DeductionData, IncomeData } from '@/utils/taxCalculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DeductionEntryProps {
  deductions: DeductionData;
  setDeductions: (deductions: DeductionData) => void;
  income: IncomeData;
  onCalculate: () => void;
  hasValidIncome: boolean;
  age: number;
}

export const DeductionEntry: React.FC<DeductionEntryProps> = ({ 
  deductions, 
  setDeductions, 
  income,
  onCalculate,
  hasValidIncome,
  age 
}) => {
  const handleDeductionUpdate = (field: keyof DeductionData, value: number) => {
    setDeductions({
      ...deductions,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);

  const inputClassName = "bg-slate-800/70 border-slate-600/40 text-white rounded-xl focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/70";
  const labelClassName = "text-slate-200 font-medium text-sm";

  return (
    <div className="space-y-6">
      {/* Calculate Tax Button at Top */}
      {hasValidIncome && (
        <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Calculate Tax</h3>
                <p className="text-slate-300">Compare Old vs New Tax Regime with detailed analysis</p>
              </div>
              <Button 
                onClick={onCalculate} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Tax Comparison
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Information */}
      <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Deductions Information</h3>
              <p className="text-slate-300 text-sm mb-3">
                Enter your deduction amounts. Most deductions apply only to the Old Tax Regime.
              </p>
              <p className="text-slate-300 text-sm">
                Check the Help section for detailed information about each deduction and eligibility criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Grid */}
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className={labelClassName}>Section 80C</Label>
              <Input 
                type="number" 
                value={deductions.section80C || ''} 
                onChange={e => handleDeductionUpdate('section80C', Number(e.target.value) || 0)}
                placeholder="Max ₹1.5 Lakh"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCD (NPS)</Label>
              <Input 
                type="number" 
                value={deductions.section80CCD || ''} 
                onChange={e => handleDeductionUpdate('section80CCD', Number(e.target.value) || 0)}
                placeholder="NPS contribution"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCC</Label>
              <Input 
                type="number" 
                value={deductions.section80CCC || ''} 
                onChange={e => handleDeductionUpdate('section80CCC', Number(e.target.value) || 0)}
                placeholder="Pension fund"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80D</Label>
              <Input 
                type="number" 
                value={deductions.section80D || ''} 
                onChange={e => handleDeductionUpdate('section80D', Number(e.target.value) || 0)}
                placeholder="Health insurance"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80DDB</Label>
              <Input 
                type="number" 
                value={deductions.section80DDB || ''} 
                onChange={e => handleDeductionUpdate('section80DDB', Number(e.target.value) || 0)}
                placeholder="Medical expenses"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>HRA Exemption</Label>
              <Input 
                type="number" 
                value={deductions.hra || ''} 
                onChange={e => handleDeductionUpdate('hra', Number(e.target.value) || 0)}
                placeholder="HRA exemption"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Home Loan Interest</Label>
              <Input 
                type="number" 
                value={deductions.homeLoanInterest || ''} 
                onChange={e => handleDeductionUpdate('homeLoanInterest', Number(e.target.value) || 0)}
                placeholder="Home loan interest"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80E</Label>
              <Input 
                type="number" 
                value={deductions.section80E || ''} 
                onChange={e => handleDeductionUpdate('section80E', Number(e.target.value) || 0)}
                placeholder="Education loan"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80EE</Label>
              <Input 
                type="number" 
                value={deductions.section80EE || ''} 
                onChange={e => handleDeductionUpdate('section80EE', Number(e.target.value) || 0)}
                placeholder="First-time home buyer"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80EEA</Label>
              <Input 
                type="number" 
                value={deductions.section80EEA || ''} 
                onChange={e => handleDeductionUpdate('section80EEA', Number(e.target.value) || 0)}
                placeholder="Affordable housing"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80G</Label>
              <Input 
                type="number" 
                value={deductions.section80G || ''} 
                onChange={e => handleDeductionUpdate('section80G', Number(e.target.value) || 0)}
                placeholder="Donations"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80TTA</Label>
              <Input 
                type="number" 
                value={deductions.section80TTA || ''} 
                onChange={e => handleDeductionUpdate('section80TTA', Number(e.target.value) || 0)}
                placeholder="Savings interest"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Professional Tax</Label>
              <Input 
                type="number" 
                value={deductions.professionalTax || ''} 
                onChange={e => handleDeductionUpdate('professionalTax', Number(e.target.value) || 0)}
                placeholder="Professional tax"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80U</Label>
              <Input 
                type="number" 
                value={deductions.section80U || ''} 
                onChange={e => handleDeductionUpdate('section80U', Number(e.target.value) || 0)}
                placeholder="Disability deduction"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>LTA</Label>
              <Input 
                type="number" 
                value={deductions.lta || ''} 
                onChange={e => handleDeductionUpdate('lta', Number(e.target.value) || 0)}
                placeholder="Leave travel allowance"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>NPS Additional</Label>
              <Input 
                type="number" 
                value={deductions.nps || ''} 
                onChange={e => handleDeductionUpdate('nps', Number(e.target.value) || 0)}
                placeholder="Additional NPS (50k)"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Gratuity</Label>
              <Input 
                type="number" 
                value={deductions.gratuity || ''} 
                onChange={e => handleDeductionUpdate('gratuity', Number(e.target.value) || 0)}
                placeholder="Gratuity exemption"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Leave Encashment</Label>
              <Input 
                type="number" 
                value={deductions.leaveEncashment || ''} 
                onChange={e => handleDeductionUpdate('leaveEncashment', Number(e.target.value) || 0)}
                placeholder="Leave encashment"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Section 80CCG</Label>
              <Input 
                type="number" 
                value={deductions.section80CCG || ''} 
                onChange={e => handleDeductionUpdate('section80CCG', Number(e.target.value) || 0)}
                placeholder="Equity savings"
                className={inputClassName}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Deductions Summary */}
      <Card className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold text-green-400 mb-2">Total Deductions</h3>
          <p className="text-3xl font-bold text-white">
            ₹{formatCurrency(totalDeductions)}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Sum of all deduction sections entered above
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
```

Now let me update the IncomeEntry component to have the same uniform dark theme:

<lov-write file_path="src/components/IncomeEntry.tsx">
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { IncomeData } from '@/utils/taxCalculations';

interface IncomeEntryProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
  age: number;
  setAge: (age: number) => void;
  taxpayerName: string;
  setTaxpayerName: (name: string) => void;
}

export const IncomeEntry: React.FC<IncomeEntryProps> = ({ 
  income, 
  setIncome, 
  age, 
  setAge,
  taxpayerName,
  setTaxpayerName
}) => {
  const handleIncomeUpdate = (field: keyof IncomeData, value: number) => {
    setIncome({
      ...income,
      [field]: value
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;

  const inputClassName = "bg-slate-800/70 border-slate-600/40 text-white rounded-xl focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/70";
  const labelClassName = "text-slate-200 font-medium text-sm";

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-8">
          <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={labelClassName}>Taxpayer Name</Label>
              <Input 
                type="text" 
                value={taxpayerName} 
                onChange={e => setTaxpayerName(e.target.value)}
                placeholder="Enter your name"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Age</Label>
              <Input 
                type="number" 
                value={age || ''} 
                onChange={e => setAge(Number(e.target.value) || 0)}
                placeholder="Enter your age"
                className={inputClassName}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Details */}
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-8">
          <h3 className="text-xl font-bold text-white mb-6">Income Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className={labelClassName}>Annual Salary</Label>
              <Input 
                type="number" 
                value={income.salary || ''} 
                onChange={e => handleIncomeUpdate('salary', Number(e.target.value) || 0)}
                placeholder="Enter annual salary"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Basic Salary</Label>
              <Input 
                type="number" 
                value={income.basicSalary || ''} 
                onChange={e => handleIncomeUpdate('basicSalary', Number(e.target.value) || 0)}
                placeholder="Enter basic salary"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Business Income</Label>
              <Input 
                type="number" 
                value={income.businessIncome || ''} 
                onChange={e => handleIncomeUpdate('businessIncome', Number(e.target.value) || 0)}
                placeholder="Enter business income"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Short-term Capital Gains</Label>
              <Input 
                type="number" 
                value={income.capitalGainsShort || ''} 
                onChange={e => handleIncomeUpdate('capitalGainsShort', Number(e.target.value) || 0)}
                placeholder="Enter STCG"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Long-term Capital Gains</Label>
              <Input 
                type="number" 
                value={income.capitalGainsLong || ''} 
                onChange={e => handleIncomeUpdate('capitalGainsLong', Number(e.target.value) || 0)}
                placeholder="Enter LTCG"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label className={labelClassName}>Other Sources</Label>
              <Input 
                type="number" 
                value={income.otherSources || ''} 
                onChange={e => handleIncomeUpdate('otherSources', Number(e.target.value) || 0)}
                placeholder="Enter other income"
                className={inputClassName}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Income Summary */}
      <Card className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold text-green-400 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-white">
            ₹{formatCurrency(totalIncome)}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Sum of all income sources entered above
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
```

Now let me enhance the PDF generator to make the report look more premium:

<lov-write file_path="src/utils/pdfGenerator.ts">
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
      yPosition = 25;
    }
  };

  // Premium gradient background helper
  const addPremiumBackground = () => {
    // Dark gradient background
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add subtle pattern overlay
    pdf.setFillColor(30, 41, 59, 0.3); // slate-800 with opacity
    for (let i = 0; i < pageWidth; i += 10) {
      pdf.rect(i, 0, 2, pageHeight, 'F');
    }
  };

  // Premium footer with branding
  const addFooter = () => {
    const footerY = pageHeight - 20;
    
    // Premium footer background with gradient effect
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.roundedRect(5, footerY - 12, pageWidth - 10, 15, 3, 3, 'F');
    
    // Add subtle border
    pdf.setDrawColor(59, 130, 246); // blue-500
    pdf.setLineWidth(0.5);
    pdf.roundedRect(5, footerY - 12, pageWidth - 10, 15, 3, 3);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184); // slate-400
    
    // Left side - Premium branding
    const profileText = `${data.taxpayerName || 'Valued Client'} • Premium Tax Analysis`;
    pdf.text(profileText, 10, footerY - 6);
    
    // Center - Company branding
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(59, 130, 246); // blue-500
    pdf.text('TAX ADVISOR PRO', pageWidth / 2, footerY - 6, { align: 'center' });
    
    // Right side - Generation timestamp
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    const timestamp = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
    const timestampText = `${timestamp} IST`;
    pdf.text(timestampText, pageWidth - 10, footerY - 6, { align: 'right' });
    
    // Add premium accent line
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(1);
    pdf.line(10, footerY - 2, pageWidth - 10, footerY - 2);
  };

  // Helper function to format numbers with premium styling
  const formatNumber = (value: number): string => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Premium table creation with enhanced styling
  const createPremiumTable = (headers: string[], rows: string[][], startY: number, columnWidths?: number[]) => {
    const totalWidth = pageWidth - 20;
    const colWidths = columnWidths || headers.map(() => totalWidth / headers.length);
    const rowHeight = 10;
    
    // Premium header with gradient and shadow effect
    pdf.setFillColor(30, 41, 59); // slate-800
    
    let xPos = 10;
    headers.forEach((header, i) => {
      // Add shadow effect
      pdf.setFillColor(0, 0, 0, 0.2);
      pdf.roundedRect(xPos + 1, startY + 1, colWidths[i], rowHeight, 2, 2, 'F');
      
      // Main header background
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(xPos, startY, colWidths[i], rowHeight, 2, 2, 'F');
      
      // Add border
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(xPos, startY, colWidths[i], rowHeight, 2, 2);
      
      xPos += colWidths[i];
    });
    
    // Premium header text with enhanced styling
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    
    xPos = 10;
    headers.forEach((header, i) => {
      const textX = xPos + (colWidths[i] / 2);
      pdf.text(header, textX, startY + 6, { align: 'center' });
      xPos += colWidths[i];
    });
    
    // Premium rows with alternating colors and enhanced styling
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    let currentY = startY + rowHeight;
    
    rows.forEach((row, rowIndex) => {
      // Premium alternating row colors
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(51, 65, 85, 0.8); // slate-700 with opacity
      } else {
        pdf.setFillColor(71, 85, 105, 0.6); // slate-600 with opacity
      }
      
      xPos = 10;
      headers.forEach((_, i) => {
        pdf.roundedRect(xPos, currentY, colWidths[i], rowHeight, 1, 1, 'F');
        
        // Add subtle border
        pdf.setDrawColor(100, 116, 139, 0.3);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(xPos, currentY, colWidths[i], rowHeight, 1, 1);
        
        xPos += colWidths[i];
      });
      
      // Enhanced row text
      pdf.setTextColor(241, 245, 249); // slate-100
      xPos = 10;
      row.forEach((cell, i) => {
        const textX = i === 0 ? xPos + 3 : xPos + (colWidths[i] / 2);
        const align = i === 0 ? 'left' : 'center';
        pdf.text(cell, textX, currentY + 6, { align: align as any });
        xPos += colWidths[i];
      });
      currentY += rowHeight;
    });
    
    return currentY + 5;
  };

  // Add premium background
  addPremiumBackground();

  // Premium header with enhanced styling and logo space
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.roundedRect(5, 5, pageWidth - 10, 35, 5, 5, 'F');
  
  // Add premium border and shadow
  pdf.setDrawColor(59, 130, 246); // blue-500
  pdf.setLineWidth(1);
  pdf.roundedRect(5, 5, pageWidth - 10, 35, 5, 5);
  
  // Shadow effect
  pdf.setFillColor(0, 0, 0, 0.2);
  pdf.roundedRect(6, 6, pageWidth - 10, 35, 5, 5, 'F');
  
  // Premium title with enhanced typography
  pdf.setFontSize(28);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PREMIUM TAX REPORT', pageWidth / 2, 20, { align: 'center' });
  
  // Subtitle with premium styling
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(59, 130, 246); // blue-500
  pdf.text('Professional Tax Analysis & Optimization', pageWidth / 2, 28, { align: 'center' });
  
  // Year information with enhanced styling
  pdf.setFontSize(10);
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text('Financial Year 2024-25 • Assessment Year 2025-26', pageWidth / 2, 35, { align: 'center' });
  
  yPosition = 50;

  // Executive Summary Section with premium styling
  checkPageBreak(60);
  
  pdf.setFillColor(59, 130, 246); // blue-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 12, 3, 3, 'F');
  
  // Add premium shadow
  pdf.setFillColor(0, 0, 0, 0.3);
  pdf.roundedRect(11, yPosition + 1, pageWidth - 20, 12, 3, 3, 'F');
  pdf.setFillColor(59, 130, 246);
  pdf.roundedRect(10, yPosition, pageWidth - 20, 12, 3, 3, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('EXECUTIVE SUMMARY', 15, yPosition + 8);
  yPosition += 16;

  // Premium recommendation box
  const savings = data.recommendation.savings;
  const recommendedRegime = data.recommendation.recommendedRegime;
  
  pdf.setFillColor(16, 185, 129, 0.2); // emerald with opacity
  pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 4, 4, 'F');
  
  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(1);
  pdf.roundedRect(10, yPosition, pageWidth - 20, 25, 4, 4);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(16, 185, 129);
  pdf.text(`RECOMMENDED: ${recommendedRegime.toUpperCase()} REGIME`, pageWidth / 2, yPosition + 8, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Potential Savings: ₹${formatNumber(savings)}`, pageWidth / 2, yPosition + 16);
  pdf.text(`(${data.recommendation.percentageSavings.toFixed(1)}% reduction)`, pageWidth / 2, yPosition + 22, { align: 'center' });
  
  yPosition += 35;

  // Continue with rest of the sections using premium styling...
  // Personal Information Section
  checkPageBreak(50);
  
  pdf.setFillColor(147, 51, 234); // purple-600
  pdf.roundedRect(10, yPosition, pageWidth - 20, 10, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('CLIENT INFORMATION', 15, yPosition + 6);
  yPosition += 14;

  const personalHeaders = ['Attribute', 'Details'];
  const personalRows = [
    ['Client Name', data.taxpayerName || 'Premium Client'],
    ['Age Category', data.age >= 80 ? 'Super Senior Citizen (80+)' : data.age >= 60 ? 'Senior Citizen (60-79)' : 'Individual (<60)'],
    ['Tax Exemption Limit', data.age >= 80 ? '₹5,00,000' : data.age >= 60 ? '₹3,00,000' : '₹2,50,000'],
    ['Analysis Date', new Date().toLocaleDateString('en-IN')]
  ];

  yPosition = createPremiumTable(personalHeaders, personalRows, yPosition, [80, 100]);

  // Income Analysis Section
  checkPageBreak(60);
  
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.roundedRect(10, yPosition, pageWidth - 20, 10, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('INCOME ANALYSIS', 15, yPosition + 6);
  yPosition += 14;

  const incomeHeaders = ['Income Source', 'Amount (₹)'];
  const totalIncome = data.income.salary + data.income.businessIncome + data.income.capitalGainsShort + data.income.capitalGainsLong + data.income.otherSources;
  
  const incomeRows = [
    ['Annual Salary', formatNumber(data.income.salary)],
    ['Basic Salary', formatNumber(data.income.basicSalary)],
    ['Business Income', formatNumber(data.income.businessIncome)],
    ['Short-term Capital Gains', formatNumber(data.income.capitalGainsShort)],
    ['Long-term Capital Gains', formatNumber(data.income.capitalGainsLong)],
    ['Other Sources', formatNumber(data.income.otherSources)],
    ['TOTAL GROSS INCOME', formatNumber(totalIncome)]
  ];

  yPosition = createPremiumTable(incomeHeaders, incomeRows, yPosition, [100, 80]);

  // Tax Calculation Comparison
  checkPageBreak(80);
  
  pdf.setFillColor(147, 51, 234); // purple-600
  pdf.roundedRect(10, yPosition, pageWidth - 20, 10, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('COMPREHENSIVE TAX COMPARISON', 15, yPosition + 6);
  yPosition += 14;

  const comparisonHeaders = ['Tax Components', 'Old Regime (₹)', 'New Regime (₹)'];
  const comparisonRows = [
    ['Gross Income', formatNumber(data.oldRegimeResult.grossIncome), formatNumber(data.newRegimeResult.grossIncome)],
    ['Total Deductions', formatNumber(data.oldRegimeResult.totalDeductions), formatNumber(data.newRegimeResult.totalDeductions)],
    ['Taxable Income', formatNumber(data.oldRegimeResult.taxableIncome), formatNumber(data.newRegimeResult.taxableIncome)],
    ['Tax Before Rebate', formatNumber(data.oldRegimeResult.taxBeforeRebate), formatNumber(data.newRegimeResult.taxBeforeRebate)],
    ['Section 87A Rebate', formatNumber(data.oldRegimeResult.rebateAmount), formatNumber(data.newRegimeResult.rebateAmount)],
    ['Tax After Rebate', formatNumber(data.oldRegimeResult.taxAfterRebate), formatNumber(data.newRegimeResult.taxAfterRebate)],
    ['Surcharge', formatNumber(data.oldRegimeResult.surcharge), formatNumber(data.newRegimeResult.surcharge)],
    ['Health & Education Cess', formatNumber(data.oldRegimeResult.cess), formatNumber(data.newRegimeResult.cess)],
    ['FINAL TAX LIABILITY', formatNumber(data.oldRegimeResult.totalTax), formatNumber(data.newRegimeResult.totalTax)]
  ];

  yPosition = createPremiumTable(comparisonHeaders, comparisonRows, yPosition, [70, 60, 60]);

  // Premium disclaimer with enhanced styling
  yPosition += 15;
  if (yPosition > pageHeight - 50) {
    addFooter();
    pdf.addPage();
    addPremiumBackground();
    yPosition = 25;
  }

  pdf.setFillColor(245, 158, 11, 0.2); // amber with opacity
  pdf.roundedRect(10, yPosition, pageWidth - 20, 35, 4, 4, 'F');
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(1);
  pdf.roundedRect(10, yPosition, pageWidth - 20, 35, 4, 4);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(146, 64, 14);
  pdf.text('PROFESSIONAL DISCLAIMER', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This premium analysis is based on current tax legislation (FY 2024-25) and provided information.', pageWidth / 2, yPosition + 16, { align: 'center' });
  pdf.text('For personalized tax planning and compliance, consult with a qualified tax professional.', pageWidth / 2, yPosition + 22, { align: 'center' });
  pdf.text('Tax laws are subject to change. This report is generated for advisory purposes only.', pageWidth / 2, yPosition + 28, { align: 'center' });

  // Add premium footer
  addFooter();

  // Enhanced file naming with timestamp
  const fileName = data.taxpayerName 
    ? `Premium_Tax_Report_${data.taxpayerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `Premium_Tax_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}
```

Finally, let me remove the DeductionGroups component since we're no longer using it:

<lov-delete file_path="src/components/DeductionGroups.tsx" />
