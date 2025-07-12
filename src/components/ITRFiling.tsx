
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Eye,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ITRFiling = () => {
  const [selectedForm, setSelectedForm] = useState('');
  const [filingStatus, setFilingStatus] = useState<'draft' | 'submitted' | 'verified'>('draft');
  const { toast } = useToast();

  const itrForms = [
    { value: 'ITR-1', label: 'ITR-1 (Sahaj)', description: 'For individuals with salary/pension income' },
    { value: 'ITR-2', label: 'ITR-2', description: 'For individuals/HUFs with capital gains' },
    { value: 'ITR-3', label: 'ITR-3', description: 'For individuals/HUFs with business income' },
    { value: 'ITR-4', label: 'ITR-4 (Sugam)', description: 'For presumptive business income' },
    { value: 'ITR-5', label: 'ITR-5', description: 'For firms, LLP, AOP, BOI' },
    { value: 'ITR-6', label: 'ITR-6', description: 'For companies (except companies claiming exemption u/s 11)' },
    { value: 'ITR-7', label: 'ITR-7', description: 'For trusts, political parties, institutions' }
  ];

  const handleImportData = (source: string) => {
    toast({
      title: "Data Import Started",
      description: `Importing data from ${source}`,
    });
  };

  const handleGenerateXML = () => {
    toast({
      title: "XML Generated",
      description: "ITR XML file has been generated successfully",
    });
  };

  const handleSubmit = () => {
    setFilingStatus('submitted');
    toast({
      title: "ITR Submitted",
      description: "Your ITR has been submitted successfully",
    });
  };

  return (
    <div className="h-full bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">ITR Filing (ITR 1-7)</h1>
          </div>
          <p className="text-muted-foreground">Comprehensive Income Tax Return preparation and filing</p>
        </div>

        <Tabs defaultValue="preparation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="preparation">ITR Preparation</TabsTrigger>
            <TabsTrigger value="import">Data Import</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="filing">E-Filing</TabsTrigger>
          </TabsList>

          <TabsContent value="preparation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select ITR Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itrForms.map((form) => (
                    <Card 
                      key={form.value} 
                      className={`cursor-pointer transition-colors ${
                        selectedForm === form.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedForm(form.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{form.label}</h3>
                          {selectedForm === form.value && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedForm && (
              <Card>
                <CardHeader>
                  <CardTitle>ITR Form Details - {selectedForm}</CardTitle>
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
                      <Label>Filing Status</Label>
                      <Badge variant={filingStatus === 'draft' ? 'secondary' : filingStatus === 'submitted' ? 'default' : 'outline'}>
                        {filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview Form
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Import Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleImportData('Form 26AS')}>
                    <CardContent className="p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Form 26AS</h3>
                      <p className="text-sm text-muted-foreground">Import TDS details</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleImportData('AIS')}>
                    <CardContent className="p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">AIS</h3>
                      <p className="text-sm text-muted-foreground">Annual Information Statement</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleImportData('SFT')}>
                    <CardContent className="p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">SFT</h3>
                      <p className="text-sm text-muted-foreground">Statement of Financial Transactions</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Manual Data Entry</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PAN</Label>
                      <Input placeholder="ABCDE1234F" />
                    </div>
                    <div className="space-y-2">
                      <Label>Aadhaar</Label>
                      <Input placeholder="XXXX-XXXX-XXXX" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Validation & Error Checking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">All mandatory fields completed</span>
                </div>

                <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800">Warning: High value transactions detected</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Validation Checks</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Income computation</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Tax calculation</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>TDS reconciliation</span>
                      <RefreshCw className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                </div>

                <Button onClick={handleGenerateXML} className="w-full">
                  Generate XML/FVU File
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>E-Filing Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-Filing Password</Label>
                    <Input type="password" placeholder="Income Tax Portal Password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Digital Signature</Label>
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
                  <h3 className="font-semibold mb-2">Filing Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Income:</span>
                      <span className="font-semibold ml-2">₹5,00,000</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax Payable:</span>
                      <span className="font-semibold ml-2">₹25,000</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">TDS Deducted:</span>
                      <span className="font-semibold ml-2">₹30,000</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Refund Due:</span>
                      <span className="font-semibold ml-2 text-green-600">₹5,000</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full" disabled={filingStatus === 'submitted'}>
                  <Send className="w-4 h-4 mr-2" />
                  {filingStatus === 'submitted' ? 'Already Submitted' : 'Submit ITR'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
