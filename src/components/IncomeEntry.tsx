import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, User, Lock, Unlock, FileSpreadsheet } from 'lucide-react';
import { IncomeData } from '@/utils/taxCalculations';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';
interface IncomeEntryProps {
  income: IncomeData;
  setIncome: (income: IncomeData) => void;
  taxpayerName: string;
  setTaxpayerName: (name: string) => void;
}
interface ExtractedData {
  salary?: number;
  basicSalary?: number;
  businessIncome?: number;
  capitalGainsShort?: number;
  capitalGainsLong?: number;
  otherSources?: number;
  taxpayerName?: string;
}
export const IncomeEntry: React.FC<IncomeEntryProps> = ({
  income,
  setIncome,
  taxpayerName,
  setTaxpayerName
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    toast
  } = useToast();
  const updateIncome = (field: keyof IncomeData, value: number) => {
    if (!isLocked) {
      setIncome({
        ...income,
        [field]: value
      });
    }
  };
  const updateTaxpayerName = (name: string) => {
    if (!isLocked) {
      setTaxpayerName(name);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };
  const extractDataFromOCR = async (text: string): Promise<ExtractedData> => {
    const extractedData: ExtractedData = {};

    // Pattern matching for common tax document formats
    const patterns = {
      salary: /(?:gross salary|total salary|annual salary|ctc)[\s:]*₹?[\s]*([0-9,]+)/i,
      basicSalary: /(?:basic salary|basic pay)[\s:]*₹?[\s]*([0-9,]+)/i,
      businessIncome: /(?:business income|professional income)[\s:]*₹?[\s]*([0-9,]+)/i,
      capitalGainsShort: /(?:short.?term capital gains|stcg)[\s:]*₹?[\s]*([0-9,]+)/i,
      capitalGainsLong: /(?:long.?term capital gains|ltcg)[\s:]*₹?[\s]*([0-9,]+)/i,
      otherSources: /(?:other sources|interest income|dividend)[\s:]*₹?[\s]*([0-9,]+)/i,
      taxpayerName: /(?:name|taxpayer name|employee name)[\s:]*([A-Za-z\s]+)/i
    };
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match) {
        if (key === 'taxpayerName') {
          extractedData.taxpayerName = match[1].trim();
        } else {
          const value = parseFloat(match[1].replace(/,/g, ''));
          if (!isNaN(value)) {
            (extractedData as any)[key] = value;
          }
        }
      }
    });
    return extractedData;
  };
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('apikey', 'K85560277288957');
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.ParsedResults && result.ParsedResults[0]) {
        const extractedText = result.ParsedResults[0].ParsedText;
        const extractedData = await extractDataFromOCR(extractedText);

        // Update income data
        if (Object.keys(extractedData).length > 0) {
          const newIncome = {
            ...income
          };
          Object.entries(extractedData).forEach(([key, value]) => {
            if (key === 'taxpayerName' && typeof value === 'string') {
              setTaxpayerName(value);
            } else if (typeof value === 'number') {
              newIncome[key as keyof IncomeData] = value;
            }
          });
          setIncome(newIncome);
          setIsLocked(true);
          toast({
            title: "Document Processed Successfully",
            description: "Data extracted and fields have been locked. Use the unlock button to edit."
          });
        } else {
          toast({
            title: "No Data Found",
            description: "Could not extract financial data from the document. Please check the document format.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error('OCR processing failed');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Document Processing Failed",
        description: "Failed to process the document. Please try again or enter data manually.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      // Clear the input
      event.target.value = '';
    }
  };
  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1
      });
      const extractedData: ExtractedData = {};

      // Look for data in the Excel file
      jsonData.forEach((row: any) => {
        if (Array.isArray(row) && row.length >= 2) {
          const label = String(row[0]).toLowerCase();
          const value = row[1];
          if (label.includes('salary') && label.includes('annual')) {
            extractedData.salary = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
          } else if (label.includes('basic') && label.includes('salary')) {
            extractedData.basicSalary = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
          } else if (label.includes('business')) {
            extractedData.businessIncome = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
          } else if (label.includes('short') && label.includes('capital')) {
            extractedData.capitalGainsShort = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
          } else if (label.includes('long') && label.includes('capital')) {
            extractedData.capitalGainsLong = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
          } else if (label.includes('other') && label.includes('sources')) {
            extractedData.otherSources = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
          } else if (label.includes('name') && !label.includes('file')) {
            extractedData.taxpayerName = String(value);
          }
        }
      });
      if (Object.keys(extractedData).length > 0) {
        const newIncome = {
          ...income
        };
        Object.entries(extractedData).forEach(([key, value]) => {
          if (key === 'taxpayerName' && typeof value === 'string') {
            setTaxpayerName(value);
          } else if (typeof value === 'number') {
            newIncome[key as keyof IncomeData] = value;
          }
        });
        setIncome(newIncome);
        setIsLocked(true);
        toast({
          title: "Excel Data Imported Successfully",
          description: "Data extracted from Excel file and fields have been locked."
        });
      } else {
        toast({
          title: "No Valid Data Found",
          description: "Could not find recognizable income data in the Excel file.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Excel processing error:', error);
      toast({
        title: "Excel Processing Failed",
        description: "Failed to process the Excel file. Please check the format and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };
  const toggleLock = () => {
    setIsLocked(!isLocked);
    toast({
      title: isLocked ? "Fields Unlocked" : "Fields Locked",
      description: isLocked ? "You can now edit the fields" : "Fields are now locked from editing"
    });
  };

  // Calculate total income excluding basic salary (basic salary is not separate income)
  const totalIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;
  return <div className="space-y-6">
      {/* Lock/Unlock Controls */}
      <div className="flex justify-end">
        <Button onClick={toggleLock} variant={isLocked ? "destructive" : "outline"} className="flex items-center gap-2">
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {isLocked ? "Unlock Fields" : "Lock Fields"}
        </Button>
      </div>

      {/* Taxpayer Information */}
      <Card className={`border-blue-200 bg-blue-50 ${isLocked ? 'opacity-75' : ''}`}>
        <CardHeader className="bg-slate-800">
          <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
            <User className="w-5 h-5" />
            Taxpayer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-slate-800">
          <div>
            <Label htmlFor="taxpayerName">Full Name</Label>
            <Input id="taxpayerName" type="text" value={taxpayerName} onChange={e => updateTaxpayerName(e.target.value)} placeholder="Enter your full name" className="mt-1" disabled={isLocked} />
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Section */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Scanner & Excel Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload your Form 16, Form 26AS, salary slips (PDF/Images) or Excel file to automatically extract income data
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById('document-upload')?.click()} disabled={isProcessing}>
                <Upload className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Upload Tax Document'}
              </Button>
              <input id="document-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} className="hidden" />
              
              <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById('excel-upload')?.click()} disabled={isProcessing}>
                <FileSpreadsheet className="w-4 h-4" />
                Upload Excel File
              </Button>
              <input id="excel-upload" type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" />
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">Document Scanning: Active</h4>
              <p className="text-xs text-green-700 mb-2">
                <strong>Status:</strong> OCR service is connected and ready to process documents.
              </p>
              <p className="text-xs text-green-700 mb-2">
                <strong>Supported formats:</strong> PDF, JPG, PNG images and Excel files (.xlsx, .xls, .csv).
              </p>
              <p className="text-xs text-green-700">
                <strong>Note:</strong> After successful extraction, input fields will be automatically locked. Use the unlock button to make changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Entry Cards */}
      <Card className={isLocked ? 'opacity-75' : ''}>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">Salary Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="salary">Annual Salary (Total CTC)</Label>
            <Input id="salary" type="number" value={income.salary || ''} onChange={e => updateIncome('salary', Number(e.target.value) || 0)} placeholder="Enter your total annual salary" className="mt-1" disabled={isLocked} />
            {income.salary > 0 && <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.salary)}</p>}
          </div>

          <div>
            <Label htmlFor="basicSalary">Basic Salary (Annual)</Label>
            <Input id="basicSalary" type="number" value={income.basicSalary || ''} onChange={e => updateIncome('basicSalary', Number(e.target.value) || 0)} placeholder="Enter basic salary for HRA calculation" className="mt-1" disabled={isLocked} />
            <p className="text-xs text-gray-600 mt-1">
              Required for HRA exemption calculation only (not added to total income)
            </p>
            {income.basicSalary > 0 && <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.basicSalary)}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className={isLocked ? 'opacity-75' : ''}>
        <CardHeader>
          <CardTitle className="text-lg text-green-600">Business/Professional Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="business">Business or Professional Income</Label>
            <Input id="business" type="number" value={income.businessIncome || ''} onChange={e => updateIncome('businessIncome', Number(e.target.value) || 0)} placeholder="Enter business/professional income" className="mt-1" disabled={isLocked} />
            {income.businessIncome > 0 && <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.businessIncome)}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className={isLocked ? 'opacity-75' : ''}>
        <CardHeader>
          <CardTitle className="text-lg text-purple-600">Capital Gains</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="capitalShort">Short-term Capital Gains</Label>
            <Input id="capitalShort" type="number" value={income.capitalGainsShort || ''} onChange={e => updateIncome('capitalGainsShort', Number(e.target.value) || 0)} placeholder="Enter short-term capital gains" className="mt-1" disabled={isLocked} />
            {income.capitalGainsShort > 0 && <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.capitalGainsShort)}</p>}
          </div>
          
          <div>
            <Label htmlFor="capitalLong">Long-term Capital Gains</Label>
            <Input id="capitalLong" type="number" value={income.capitalGainsLong || ''} onChange={e => updateIncome('capitalGainsLong', Number(e.target.value) || 0)} placeholder="Enter long-term capital gains" className="mt-1" disabled={isLocked} />
            {income.capitalGainsLong > 0 && <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.capitalGainsLong)}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className={isLocked ? 'opacity-75' : ''}>
        <CardHeader>
          <CardTitle className="text-lg text-orange-600">Other Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="otherSources">Interest, Dividends, etc.</Label>
            <Input id="otherSources" type="number" value={income.otherSources || ''} onChange={e => updateIncome('otherSources', Number(e.target.value) || 0)} placeholder="Enter income from other sources" className="mt-1" disabled={isLocked} />
            {income.otherSources > 0 && <p className="text-sm text-gray-600 mt-1">₹{formatCurrency(income.otherSources)}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Total Gross Income</h3>
        <p className="text-2xl font-bold text-blue-600">
          ₹{formatCurrency(totalIncome)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Note: Basic salary is used only for HRA calculation and not added to total income
        </p>
      </div>

      {/* Income Tax Website Integration Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-lg text-amber-600">Income Tax Website Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">
            Direct integration with the Income Tax website (incometax.gov.in) requires backend authentication and security protocols that cannot be implemented in a frontend-only application.
          </p>
          <p className="text-sm text-amber-700 mb-3">
            <strong>Alternative approach:</strong> Use our generated PDF report to manually fill your tax return on the Income Tax website.
          </p>
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium text-amber-800 mb-2">Steps to file your return:</h4>
            <ol className="text-xs text-amber-700 space-y-1">
              <li>1. Generate the tax comparison PDF report from this application</li>
              <li>2. Visit <a href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener noreferrer" className="underline">Income Tax e-Filing portal</a></li>
              <li>3. Login with your credentials</li>
              <li>4. Select "File ITR" and choose appropriate ITR form</li>
              <li>5. Use data from the PDF report to fill the online form</li>
              <li>6. Choose the recommended tax regime from the report</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>;
};