
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Upload, 
  Download, 
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TDSReturns = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [returnStatus, setReturnStatus] = useState<'draft' | 'submitted' | 'processed'>('draft');
  const { toast } = useToast();

  const tdsReturns = [
    { 
      value: '24Q', 
      label: 'Form 24Q', 
      description: 'TDS on Salary',
      dueDate: '31st July, October, January, April'
    },
    { 
      value: '26Q', 
      label: 'Form 26Q', 
      description: 'TDS on Non-Salary Payments',
      dueDate: '31st July, October, January, April'
    },
    { 
      value: '27Q', 
      label: 'Form 27Q', 
      description: 'TCS Return',
      dueDate: '31st July, October, January, April'
    },
    { 
      value: '27EQ', 
      label: 'Form 27EQ', 
      description: 'TDS on E-commerce Transactions',
      dueDate: '31st July, October, January, April'
    }
  ];

  const quarters = [
    { value: 'Q1', label: 'Q1 (Apr-Jun)', year: '2024-25' },
    { value: 'Q2', label: 'Q2 (Jul-Sep)', year: '2024-25' },
    { value: 'Q3', label: 'Q3 (Oct-Dec)', year: '2024-25' },
    { value: 'Q4', label: 'Q4 (Jan-Mar)', year: '2024-25' }
  ];

  const handleGenerateReturn = () => {
    toast({
      title: "Return Generated",
      description: `${selectedForm} for ${selectedQuarter} has been generated`,
    });
  };

  const handleSubmitReturn = () => {
    setReturnStatus('submitted');
    toast({
      title: "Return Submitted",
      description: "TDS return has been submitted to TRACES",
    });
  };

  return (
    <div className="h-full bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">TDS/TCS Returns (24Q, 26Q, 27Q, 27EQ)</h1>
          </div>
          <p className="text-muted-foreground">Comprehensive TDS/TCS return filing with TRACES integration</p>
        </div>

        <Tabs defaultValue="selection" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="selection">Return Selection</TabsTrigger>
            <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="generation">File Generation</TabsTrigger>
            <TabsTrigger value="submission">TRACES Filing</TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Return Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tdsReturns.map((returnType) => (
                    <Card 
                      key={returnType.value} 
                      className={`cursor-pointer transition-colors ${
                        selectedForm === returnType.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedForm(returnType.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{returnType.label}</h3>
                          {selectedForm === returnType.value && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{returnType.description}</p>
                        <p className="text-xs text-blue-600">Due: {returnType.dueDate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Quarter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quarters.map((quarter) => (
                    <Card 
                      key={quarter.value} 
                      className={`cursor-pointer transition-colors ${
                        selectedQuarter === quarter.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedQuarter(quarter.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{quarter.label}</h3>
                            <p className="text-sm text-muted-foreground">{quarter.year}</p>
                          </div>
                          {selectedQuarter === quarter.value && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {selectedForm && selectedQuarter && (
              <Card>
                <CardHeader>
                  <CardTitle>Return Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Deductor Type</Label>
                      <Select defaultValue="company">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="firm">Firm</SelectItem>
                          <SelectItem value="aop">AOP/BOI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Return Status</Label>
                      <Badge variant={returnStatus === 'draft' ? 'secondary' : returnStatus === 'submitted' ? 'default' : 'outline'}>
                        {returnStatus.charAt(0).toUpperCase() + returnStatus.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label>Filing Type</Label>
                      <Select defaultValue="original">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Original Return</SelectItem>
                          <SelectItem value="revised">Revised Return</SelectItem>
                          <SelectItem value="correction">Correction Statement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data-entry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deductor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TAN</Label>
                    <Input placeholder="ABCD12345E" />
                  </div>
                  <div className="space-y-2">
                    <Label>PAN</Label>
                    <Input placeholder="ABCDE1234F" />
                  </div>
                  <div className="space-y-2">
                    <Label>Deductor Name</Label>
                    <Input placeholder="Company Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch/Division</Label>
                    <Input placeholder="Head Office" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TDS Details Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="bulk-entry" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="bulk-entry">Bulk Entry</TabsTrigger>
                    <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
                    <TabsTrigger value="import-data">Import Data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="bulk-entry" className="space-y-4">
                    <div className="flex gap-4 mb-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Excel File
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Template
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Upload TDS Data</h3>
                      <p className="text-sm text-muted-foreground">Drag and drop your Excel file or click to browse</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual-entry" className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Deductee PAN</Label>
                        <Input placeholder="ABCDE1234F" />
                      </div>
                      <div className="space-y-2">
                        <Label>Deductee Name</Label>
                        <Input placeholder="Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Section</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="194A">194A - Interest</SelectItem>
                            <SelectItem value="194C">194C - Contractor</SelectItem>
                            <SelectItem value="194J">194J - Professional</SelectItem>
                            <SelectItem value="194H">194H - Commission</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount Paid</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>TDS Rate (%)</Label>
                        <Input type="number" placeholder="10" />
                      </div>
                      <div className="space-y-2">
                        <Label>TDS Amount</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Payment</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Deduction</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <Button className="w-full">Add Entry</Button>
                  </TabsContent>

                  <TabsContent value="import-data" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-4 text-center">
                          <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">From Accounting Software</h3>
                          <p className="text-sm text-muted-foreground">Import from Tally, QuickBooks, etc.</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-4 text-center">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">From Previous Quarter</h3>
                          <p className="text-sm text-muted-foreground">Copy recurring deductees</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Validation & Error Checking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">All PAN validations passed</span>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">TDS calculations verified</span>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-800">3 entries require attention - duplicate PANs detected</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Summary Statistics</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">156</div>
                      <div className="text-muted-foreground">Total Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹2,45,000</div>
                      <div className="text-muted-foreground">Total TDS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">₹12,25,000</div>
                      <div className="text-muted-foreground">Total Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-muted-foreground">Errors</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>File Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">XML File Generation</h3>
                      <p className="text-sm text-muted-foreground mb-4">Generate official XML file for TRACES upload</p>
                      <Button onClick={handleGenerateReturn} className="w-full">
                        Generate XML
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">FVU File Generation</h3>
                      <p className="text-sm text-muted-foreground mb-4">Generate FVU file for offline verification</p>
                      <Button variant="outline" className="w-full">
                        Generate FVU
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Additional Reports</h3>
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Summary Report
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generate Form 16/16A
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>TRACES Integration & Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TRACES Login ID</Label>
                    <Input placeholder="Your TRACES ID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Digital Signature Certificate</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select DSC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dsc1">DSC Certificate 1</SelectItem>
                        <SelectItem value="dsc2">DSC Certificate 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Submission Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Return Type:</span>
                      <span className="font-semibold ml-2">{selectedForm}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quarter:</span>
                      <span className="font-semibold ml-2">{selectedQuarter}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total TDS:</span>
                      <span className="font-semibold ml-2">₹2,45,000</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-semibold ml-2">31st July 2024</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitReturn} 
                  className="w-full" 
                  disabled={returnStatus === 'submitted'}
                >
                  {returnStatus === 'submitted' ? 'Already Submitted to TRACES' : 'Submit to TRACES'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
