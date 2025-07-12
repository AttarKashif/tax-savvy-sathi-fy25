
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  Calculator, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AuditReports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportStatus, setReportStatus] = useState<'draft' | 'completed' | 'submitted'>('draft');
  const { toast } = useToast();

  const auditReports = [
    { 
      value: '3CA', 
      label: 'Form 3CA', 
      description: 'Tax Audit Report for businesses',
      applicable: 'Business entities with turnover > ₹1 Cr'
    },
    { 
      value: '3CB', 
      label: 'Form 3CB', 
      description: 'Tax Audit Report for professionals',
      applicable: 'Professionals with receipts > ₹50 Lakh'
    },
    { 
      value: '3CD', 
      label: 'Form 3CD',   
      description: 'Audit Report for special provisions',
      applicable: 'Companies claiming deductions u/s 10AA, 80-IA, etc.'
    }
  ];

  const handleGenerateReport = () => {
    setReportStatus('completed');
    toast({
      title: "Report Generated",
      description: `${selectedReport} report has been generated successfully`,
    });
  };

  const handleSubmitReport = () => {
    setReportStatus('submitted');
    toast({
      title: "Report Submitted",
      description: `${selectedReport} has been submitted to authorities`,
    });
  };

  return (
    <div className="h-full bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Tax Audit Reports (3CA/3CB/3CD)</h1>
          </div>
          <p className="text-muted-foreground">Generate comprehensive tax audit reports with automated calculations</p>
        </div>

        <Tabs defaultValue="selection" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="selection">Report Selection</TabsTrigger>
            <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
            <TabsTrigger value="generation">Report Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Audit Report Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {auditReports.map((report) => (
                    <Card 
                      key={report.value} 
                      className={`cursor-pointer transition-colors ${
                        selectedReport === report.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedReport(report.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{report.label}</h3>
                          {selectedReport === report.value && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <p className="text-xs text-blue-600">{report.applicable}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedReport && (
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration - {selectedReport}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Assessment Year</Label>
                      <Select defaultValue="2024-25">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Report Status</Label>
                      <Badge variant={reportStatus === 'draft' ? 'secondary' : reportStatus === 'completed' ? 'default' : 'outline'}>
                        {reportStatus.charAt(0).toUpperCase() + reportStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client1">ABC Private Limited</SelectItem>
                          <SelectItem value="client2">XYZ Industries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Auditor Details</Label>
                      <Input placeholder="CA Name & Registration No." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data-entry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Data Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="p&l" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="p&l">P&L Statement</TabsTrigger>
                    <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
                    <TabsTrigger value="schedules">Schedules</TabsTrigger>
                  </TabsList>

                  <TabsContent value="p&l" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Revenue</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cost of Goods Sold</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Operating Expenses</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Net Profit</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="balance-sheet" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Assets</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Liabilities</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Share Capital</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Reserves & Surplus</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedules" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Depreciation as per Books</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Depreciation as per IT Act</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Disallowances u/s 40(a)</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Exempt Income</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import from Excel
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automated Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Book Profit Calculation</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Net Profit as per P&L</span>
                          <span>₹5,00,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Add: Depreciation (Books)</span>
                          <span>₹1,00,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Less: Depreciation (IT Act)</span>
                          <span>₹1,50,000</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Book Profit</span>
                          <span>₹4,50,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Tax Computation</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Income</span>
                          <span>₹4,50,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax Rate</span>
                          <span>30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax on Income</span>
                          <span>₹1,35,000</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Total Tax Liability</span>
                          <span>₹1,35,000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Validation Checks</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Balance Sheet Balancing</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Arithmetic Accuracy</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Compliance Verification</span>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Report Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Format</SelectItem>
                        <SelectItem value="word">Word Document</SelectItem>
                        <SelectItem value="excel">Excel Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Include Annexures</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Annexures</SelectItem>
                        <SelectItem value="selected">Selected Only</SelectItem>
                        <SelectItem value="none">Main Report Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Report Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Report Type:</span>
                      <span className="font-semibold ml-2">{selectedReport}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assessment Year:</span>
                      <span className="font-semibold ml-2">2024-25</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Income:</span>
                      <span className="font-semibold ml-2">₹4,50,000</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax Liability:</span>
                      <span className="font-semibold ml-2">₹1,35,000</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleGenerateReport} className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSubmitReport}
                    disabled={reportStatus !== 'completed'}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Submit to Authorities
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
