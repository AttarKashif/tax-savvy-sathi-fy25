import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  Users, 
  Calculator,
  FileText,
  TrendingUp,
  PieChart
} from 'lucide-react';

export const ReportGenerator = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [notes, setNotes] = useState('');

  const reportTypes = [
    { 
      id: 'tax-summary', 
      name: 'Tax Summary Report', 
      icon: Calculator,
      description: 'Comprehensive tax calculation summary for selected clients'
    },
    { 
      id: 'client-analytics', 
      name: 'Client Analytics', 
      icon: PieChart,
      description: 'Client portfolio analysis and tax patterns'
    },
    { 
      id: 'compliance-status', 
      name: 'Compliance Status Report', 
      icon: FileText,
      description: 'ITR filing status and pending compliance items'
    },
    { 
      id: 'revenue-analysis', 
      name: 'Revenue Analysis', 
      icon: TrendingUp,
      description: 'Fee collection and revenue trends analysis'
    },
    { 
      id: 'custom-report', 
      name: 'Custom Report', 
      icon: FileBarChart,
      description: 'Build your own custom report template'
    }
  ];

  const sampleClients = [
    'ABC Corp Ltd',
    'John Doe (Individual)',
    'XYZ Pvt Ltd',
    'Jane Smith (HUF)',
    'Tech Solutions Inc'
  ];

  const handleClientToggle = (client: string) => {
    setSelectedClients(prev => 
      prev.includes(client) 
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  const generateReport = async () => {
    try {
      const reportData = {
        type: selectedReportType,
        dateRange,
        clients: selectedClients,
        title: reportTitle,
        notes
      };

      console.log('Generating report with Google AI:', reportData);
      
      const { data } = await supabase.functions.invoke('google-api-helper', {
        body: {
          action: 'generate-report',
          data: {
            reportType: selectedReportType,
            clientData: selectedClients,
            period: `${dateRange.from} to ${dateRange.to}`,
            customTitle: reportTitle,
            additionalNotes: notes
          }
        }
      });

      if (data.success) {
        // Create and download the generated report
        const reportContent = data.data;
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportTitle || selectedReportType}_report.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="uniform-page-container">
      <div className="uniform-content-wrapper">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FileBarChart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="uniform-section-title">Report Generator</h1>
            <p className="uniform-section-subtitle">Create custom reports and analytics for your practice</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle>Select Report Type</CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedReportType === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedReportType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <h3 className="font-medium text-foreground">{type.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Report Configuration */}
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content space-y-4">
                <div className="uniform-input-group">
                  <Label className="uniform-input-label">Report Title</Label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter custom report title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="uniform-input-group">
                    <Label className="uniform-input-label">From Date</Label>
                    <Input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  <div className="uniform-input-group">
                    <Label className="uniform-input-label">To Date</Label>
                    <Input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="uniform-input-group">
                  <Label className="uniform-input-label">Additional Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any specific requirements or notes for the report"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Client Selection */}
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Select Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedClients.map((client) => (
                      <Badge key={client} variant="secondary" className="cursor-pointer" onClick={() => handleClientToggle(client)}>
                        {client} ×
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sampleClients.map((client) => (
                      <div
                        key={client}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedClients.includes(client)
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleClientToggle(client)}
                      >
                        <span className="text-sm font-medium">{client}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Actions */}
          <div className="space-y-6">
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">
                      {reportTitle || 'Report Title'}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Type: {reportTypes.find(t => t.id === selectedReportType)?.name || 'Select type'}</p>
                      <p>Period: {dateRange.from && dateRange.to ? `${dateRange.from} to ${dateRange.to}` : 'Select dates'}</p>
                      <p>Clients: {selectedClients.length || 0} selected</p>
                    </div>
                  </div>

                  <Button 
                    onClick={generateReport}
                    className="w-full"
                    disabled={!selectedReportType || !dateRange.from || !dateRange.to}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Monthly Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  ITR Status Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Revenue Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};