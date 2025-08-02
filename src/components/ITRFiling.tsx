
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  FileDown, 
  FileType,
  Calendar,
  User,
  Building2,
  TrendingUp,
  Calculator,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  FileX,
  Upload
} from 'lucide-react';
import { IncomeData, DeductionData } from '@/utils/taxCalculations';
import { generateITR1XML, generateITR1JSON, validateITRData, ITRValidationError } from '@/utils/itrGenerator';
import { generateProfessionalTaxReport } from '@/utils/professionalReportGenerator';

interface ITRFilingProps {
  income?: IncomeData;
  deductions?: DeductionData;
  taxpayerName?: string;
  age?: number;
}

export const ITRFiling: React.FC<ITRFilingProps> = ({ 
  income, 
  deductions, 
  taxpayerName = '', 
  age = 30 
}) => {
  const { toast } = useToast();
  const [selectedITRForm, setSelectedITRForm] = useState<'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4'>('ITR-1');
  const [activeTab, setActiveTab] = useState('form-selection');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState<ITRValidationError[] | null>(null);
  const [filingProgress, setFilingProgress] = useState(0);
  
  // Professional Filing Data
  const [filingData, setFilingData] = useState({
    assessmentYear: '2025-26',
    financialYear: '2024-25',
    filingType: 'original',
    returnType: 'ITR-1',
    acknowledgmentNumber: '',
    filingDate: '',
    
    // Personal Details
    personalDetails: {
      name: taxpayerName || '',
      pan: '',
      aadhar: '',
      dateOfBirth: '',
      gender: '',
      category: 'Individual',
      residentialStatus: 'Resident',
      
      // Contact Details
      email: '',
      mobile: '',
      
      // Address
      address: {
        flatNo: '',
        buildingName: '',
        roadStreet: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    },
    
    // Bank Details
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: ''
    },
    
    // Additional Information
    seventhProvisoClaim: false,
    section89Relief: false,
    schedulePTI: false,
    scheduleOS: false,
    scheduleAL: false
  });

  // Auto-validate when data changes
  useEffect(() => {
    if (income && deductions) {
      const results = validateITRData(income, deductions, filingData.personalDetails.pan, age, filingData.assessmentYear);
      setValidationResults(results);
      
      // Update progress based on completion
      const passedChecks = results.filter(r => !r.isError).length;
      const completionRate = Math.min(100, (passedChecks / results.length) * 100);
      setFilingProgress(completionRate);
    }
  }, [income, deductions, filingData.personalDetails.pan]);

  // Determine appropriate ITR form
  const determineITRForm = () => {
    if (!income) return 'ITR-1';
    
    const totalCapitalGains = income.capitalGains?.reduce((sum, gain) => sum + gain.amount, 0) || 0;
    const hasBusinessIncome = (income.businessIncome || 0) > 0;
    const hasPropertyIncome = (income.houseProperty?.annualRentReceived || 0) > 0;
    
    if (hasBusinessIncome || (income.salary || 0) > 5000000) return 'ITR-3';
    if (totalCapitalGains > 0 || hasPropertyIncome) return 'ITR-2';
    return 'ITR-1';
  };

  // Handle ITR form generation
  const handleGenerateITR = async (format: 'xml' | 'json') => {
    if (!income || !deductions || !validationResults?.every(r => !r.isError)) {
      toast({
        title: "Validation Failed",
        description: "Please complete all required fields and fix validation errors.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const itrData = {
        personalDetails: filingData.personalDetails,
        bankDetails: filingData.bankDetails,
        income,
        deductions,
        assessmentYear: filingData.assessmentYear,
        returnType: selectedITRForm
      };

      let result;
      if (format === 'xml') {
        result = generateITR1XML(itrData);
      } else {
        result = generateITR1JSON(itrData);
      }

      // Create and download file
      const blob = new Blob([result], { 
        type: format === 'xml' ? 'application/xml' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ITR_${selectedITRForm}_${filingData.assessmentYear}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "ITR Generated Successfully",
        description: `${selectedITRForm} ${format.toUpperCase()} file has been downloaded.`
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate ITR file. Please check your data.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle professional report generation
  const handleGenerateReport = async () => {
    if (!income || !deductions) {
      toast({
        title: "Missing Data",
        description: "Income and deduction data is required for report generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await generateProfessionalTaxReport(
        income,
        deductions,
        age,
        filingData.personalDetails.name || 'Taxpayer',
        filingData.assessmentYear,
        'Firm Name'
      );

      toast({
        title: "Professional Report Generated",
        description: "CA-grade tax computation report has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate professional report.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="uniform-page-container">
      <div className="uniform-content-wrapper">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileType className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">ITR Filing</h1>
                <p className="text-sm text-muted-foreground">Professional e-Filing with validation & compliance checks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                AY {filingData.assessmentYear}
              </Badge>
              <Badge variant={validationResults?.isValid ? 'default' : 'destructive'} className="text-xs">
                {validationResults?.isValid ? 'Ready to File' : 'Validation Required'}
              </Badge>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Filing Completion</span>
              <span className="text-sm text-muted-foreground">{Math.round(filingProgress)}%</span>
            </div>
            <Progress value={filingProgress} className="h-2" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 bg-muted/50 p-1 h-auto">
            <TabsTrigger value="form-selection" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <FileType className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Form Selection</span>
            </TabsTrigger>
            <TabsTrigger value="personal-details" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <User className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Personal Details</span>
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Validation</span>
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <Download className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Generate ITR</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 px-2 py-2 text-xs lg:text-sm">
              <FileDown className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Form Selection Tab */}
          <TabsContent value="form-selection" className="uniform-tab-content">
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle className="flex items-center gap-3">
                  <FileType className="w-5 h-5" />
                  ITR Form Selection & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="space-y-6">
                  {/* Recommended Form */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primary">Recommended Form</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your income sources, we recommend <strong>{determineITRForm()}</strong>
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedITRForm(determineITRForm())}
                    >
                      Use Recommended Form
                    </Button>
                  </div>

                  {/* Manual Selection */}
                  <div>
                    <Label className="uniform-input-label mb-3 block">Manual Form Selection</Label>
                    <Select value={selectedITRForm} onValueChange={(value: any) => setSelectedITRForm(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ITR Form" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ITR-1">ITR-1 (Sahaj) - Salary & Pension Income</SelectItem>
                        <SelectItem value="ITR-2">ITR-2 - Capital Gains & House Property</SelectItem>
                        <SelectItem value="ITR-3">ITR-3 - Business & Professional Income</SelectItem>
                        <SelectItem value="ITR-4">ITR-4 (Sugam) - Presumptive Business Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Form Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Selected Form: {selectedITRForm}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedITRForm === 'ITR-1' && 'For individuals with salary, pension, and interest income only.'}
                        {selectedITRForm === 'ITR-2' && 'For individuals with capital gains, property income, or foreign assets.'}
                        {selectedITRForm === 'ITR-3' && 'For individuals with business or professional income.'}
                        {selectedITRForm === 'ITR-4' && 'For presumptive income from business or profession.'}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Filing Deadline</h4>
                      <p className="text-sm text-muted-foreground">
                        July 31, 2025 for AY 2025-26
                      </p>
                      <Badge variant="outline" className="mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        Time Remaining: Calculate
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Details Tab */}
          <TabsContent value="personal-details" className="uniform-tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="uniform-card">
                <CardHeader className="uniform-card-header">
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="uniform-card-content space-y-4">
                  <div className="uniform-form-grid">
                    <div className="uniform-input-group">
                      <Label htmlFor="name" className="uniform-input-label">Full Name *</Label>
                      <Input
                        id="name"
                        value={filingData.personalDetails.name}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          personalDetails: { ...filingData.personalDetails, name: e.target.value }
                        })}
                        placeholder="As per PAN Card"
                        className="uniform-focus-input"
                      />
                    </div>
                    
                    <div className="uniform-input-group">
                      <Label htmlFor="pan" className="uniform-input-label">PAN Number *</Label>
                      <Input
                        id="pan"
                        value={filingData.personalDetails.pan}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          personalDetails: { ...filingData.personalDetails, pan: e.target.value.toUpperCase() }
                        })}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="uniform-focus-input"
                      />
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="aadhar" className="uniform-input-label">Aadhar Number</Label>
                      <Input
                        id="aadhar"
                        value={filingData.personalDetails.aadhar}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          personalDetails: { ...filingData.personalDetails, aadhar: e.target.value }
                        })}
                        placeholder="1234 5678 9012"
                        maxLength={12}
                        className="uniform-focus-input"
                      />
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="dob" className="uniform-input-label">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={filingData.personalDetails.dateOfBirth}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          personalDetails: { ...filingData.personalDetails, dateOfBirth: e.target.value }
                        })}
                        className="uniform-focus-input"
                      />
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="gender" className="uniform-input-label">Gender *</Label>
                      <Select 
                        value={filingData.personalDetails.gender} 
                        onValueChange={(value) => setFilingData({
                          ...filingData,
                          personalDetails: { ...filingData.personalDetails, gender: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="email" className="uniform-input-label">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={filingData.personalDetails.email}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          personalDetails: { ...filingData.personalDetails, email: e.target.value }
                        })}
                        placeholder="your.email@example.com"
                        className="uniform-focus-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card className="uniform-card">
                <CardHeader className="uniform-card-header">
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="w-5 h-5" />
                    Bank Details for Refund
                  </CardTitle>
                </CardHeader>
                <CardContent className="uniform-card-content space-y-4">
                  <div className="uniform-form-grid">
                    <div className="uniform-input-group">
                      <Label htmlFor="accountNumber" className="uniform-input-label">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={filingData.bankDetails.accountNumber}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          bankDetails: { ...filingData.bankDetails, accountNumber: e.target.value }
                        })}
                        placeholder="Bank Account Number"
                        className="uniform-focus-input"
                      />
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="ifscCode" className="uniform-input-label">IFSC Code *</Label>
                      <Input
                        id="ifscCode"
                        value={filingData.bankDetails.ifscCode}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          bankDetails: { ...filingData.bankDetails, ifscCode: e.target.value.toUpperCase() }
                        })}
                        placeholder="IFSC Code"
                        maxLength={11}
                        className="uniform-focus-input"
                      />
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="bankName" className="uniform-input-label">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={filingData.bankDetails.bankName}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          bankDetails: { ...filingData.bankDetails, bankName: e.target.value }
                        })}
                        placeholder="Bank Name"
                        className="uniform-focus-input"
                      />
                    </div>

                    <div className="uniform-input-group">
                      <Label htmlFor="branchName" className="uniform-input-label">Branch Name</Label>
                      <Input
                        id="branchName"
                        value={filingData.bankDetails.branchName}
                        onChange={(e) => setFilingData({
                          ...filingData,
                          bankDetails: { ...filingData.bankDetails, branchName: e.target.value }
                        })}
                        placeholder="Branch Name"
                        className="uniform-focus-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation" className="uniform-tab-content">
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Pre-Filing Validation & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                {validationResults ? (
                  <div className="space-y-6">
                    {/* Validation Summary */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Validation Status</h4>
                        <p className="text-sm text-muted-foreground">
                          {validationResults.passedChecks} of {validationResults.totalChecks} checks passed
                        </p>
                      </div>
                      <Badge variant={validationResults.isValid ? 'default' : 'destructive'}>
                        {validationResults.isValid ? 'Ready to File' : 'Action Required'}
                      </Badge>
                    </div>

                    {/* Validation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Errors */}
                      {validationResults.errors.length > 0 && (
                        <div>
                          <h4 className="font-medium text-destructive mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Critical Issues ({validationResults.errors.length})
                          </h4>
                          <div className="space-y-2">
                            {validationResults.errors.map((error, index) => (
                              <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">{error}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {validationResults.warnings.length > 0 && (
                        <div>
                          <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Warnings ({validationResults.warnings.length})
                          </h4>
                          <div className="space-y-2">
                            {validationResults.warnings.map((warning, index) => (
                              <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/20 dark:border-orange-400/20">
                                <p className="text-sm text-orange-800 dark:text-orange-300">{warning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Success State */}
                    {validationResults.isValid && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-400/20">
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">All validations passed! Ready for ITR filing.</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Complete income and personal details to run validation checks.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generation Tab */}
          <TabsContent value="generation" className="uniform-tab-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ITR File Generation */}
              <Card className="uniform-card">
                <CardHeader className="uniform-card-header">
                  <CardTitle className="flex items-center gap-3">
                    <Upload className="w-5 h-5" />
                    Generate ITR Files for e-Filing
                  </CardTitle>
                </CardHeader>
                <CardContent className="uniform-card-content">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate XML or JSON files compatible with the Income Tax Department's e-Filing portal.
                    </p>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleGenerateITR('xml')}
                        disabled={!validationResults?.isValid || isGenerating}
                        className="w-full justify-start"
                      >
                        <FileX className="w-4 h-4 mr-2" />
                        Generate XML for Upload
                      </Button>
                      
                      <Button 
                        onClick={() => handleGenerateITR('json')}
                        disabled={!validationResults?.isValid || isGenerating}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Generate JSON Backup
                      </Button>
                    </div>

                    {isGenerating && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-center">Generating ITR files...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Filing Instructions */}
              <Card className="uniform-card">
                <CardHeader className="uniform-card-header">
                  <CardTitle className="flex items-center gap-3">
                    <FileType className="w-5 h-5" />
                    Filing Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="uniform-card-content">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">1</div>
                        <div>
                          <p className="font-medium">Download ITR File</p>
                          <p className="text-sm text-muted-foreground">Generate and download the XML file for your ITR form.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">2</div>
                        <div>
                          <p className="font-medium">Visit e-Filing Portal</p>
                          <p className="text-sm text-muted-foreground">Go to www.incometax.gov.in and login with your credentials.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">3</div>
                        <div>
                          <p className="font-medium">Upload & Submit</p>
                          <p className="text-sm text-muted-foreground">Upload the XML file and complete the digital signature process.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="uniform-tab-content">
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle className="flex items-center gap-3">
                  <FileDown className="w-5 h-5" />
                  Professional Reports & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="justify-start h-auto p-4 flex-col items-start"
                  >
                    <FileDown className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">CA-Grade Tax Report</div>
                      <div className="text-xs opacity-75">Professional computation with firm branding</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    disabled={true}
                    className="justify-start h-auto p-4 flex-col items-start"
                  >
                    <Calculator className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Computation Sheet</div>
                      <div className="text-xs opacity-75">Detailed tax calculation breakdown</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    disabled={true}
                    className="justify-start h-auto p-4 flex-col items-start"
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Tax Planning Report</div>
                      <div className="text-xs opacity-75">Future year planning & strategies</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
