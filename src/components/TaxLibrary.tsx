
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Library, Search, Calendar, FileText, Download, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

interface TaxCalculation {
  id: string;
  taxpayer_name: string;
  age: number;
  income_data: any;
  deductions_data: any;
  old_regime_tax: number;
  new_regime_tax: number;
  recommended_regime: string;
  created_at: string;
  updated_at: string;
}

export const TaxLibrary = () => {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<TaxCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalculation, setSelectedCalculation] = useState<TaxCalculation | null>(null);

  useEffect(() => {
    if (user) {
      fetchCalculations();
    }
  }, [user]);

  const fetchCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalculations(data || []);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCalculation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tax_calculations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCalculations(calculations.filter(calc => calc.id !== id));
    } catch (error) {
      console.error('Error deleting calculation:', error);
    }
  };

  const generatePDF = (calculation: TaxCalculation) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Calculation Report', pageWidth / 2, 20, { align: 'center' });
    
    // Personal Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Taxpayer Name: ${calculation.taxpayer_name}`, 20, 40);
    doc.text(`Age: ${calculation.age}`, 20, 50);
    doc.text(`Date: ${format(new Date(calculation.created_at), 'dd/MM/yyyy')}`, 20, 60);
    
    // Tax Results
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Comparison Results:', 20, 80);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Old Regime Tax: ₹${calculation.old_regime_tax?.toLocaleString('en-IN')}`, 20, 95);
    doc.text(`New Regime Tax: ₹${calculation.new_regime_tax?.toLocaleString('en-IN')}`, 20, 105);
    doc.text(`Recommended Regime: ${calculation.recommended_regime}`, 20, 115);
    
    // Income Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Income Details:', 20, 135);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const income = calculation.income_data;
    doc.text(`Salary: ₹${income.salary?.toLocaleString('en-IN')}`, 20, 150);
    doc.text(`Business Income: ₹${income.businessIncome?.toLocaleString('en-IN')}`, 20, 160);
    doc.text(`Other Sources: ₹${income.otherSources?.toLocaleString('en-IN')}`, 20, 170);
    
    doc.save(`Tax_Report_${calculation.taxpayer_name}_${format(new Date(), 'ddMMyyyy')}.pdf`);
  };

  const filteredCalculations = calculations.filter(calc =>
    calc.taxpayer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <div className="uniform-page-container">
      <div className="uniform-content-wrapper">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Library className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="uniform-section-title">Tax Calculation Library</h1>
            <p className="uniform-section-subtitle">Access your saved tax calculations, view detailed reports, and manage your tax planning history.</p>
          </div>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">Saved Calculations</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            {/* Search Bar */}
            <Card className="uniform-card">
              <CardContent className="uniform-card-content">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by taxpayer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Calculations List */}
            {loading ? (
              <Card className="uniform-card">
                <CardContent className="uniform-card-content">
                  <div className="text-center text-muted-foreground">Loading calculations...</div>
                </CardContent>
              </Card>
            ) : filteredCalculations.length === 0 ? (
              <Card className="uniform-card">
                <CardContent className="uniform-card-content">
                  <div className="text-center">
                    <Library className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Calculations Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No calculations match your search.' : 'Start by creating your first tax calculation.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredCalculations.map((calculation) => (
                  <Card key={calculation.id} className="uniform-card">
                    <CardContent className="uniform-card-content">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold text-foreground">{calculation.taxpayer_name || 'Unnamed Calculation'}</h3>
                            <Badge variant="outline">Age {calculation.age}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Old Regime Tax</p>
                              <p className="text-lg font-semibold text-foreground">₹{formatCurrency(calculation.old_regime_tax || 0)}</p>
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">New Regime Tax</p>
                              <p className="text-lg font-semibold text-foreground">₹{formatCurrency(calculation.new_regime_tax || 0)}</p>
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Recommended</p>
                              <p className="text-lg font-semibold text-foreground">{calculation.recommended_regime}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {format(new Date(calculation.created_at), 'dd MMM yyyy, HH:mm')}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => generatePDF(calculation)}
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={() => deleteCalculation(calculation.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="uniform-card">
              <CardHeader className="uniform-card-header">
                <CardTitle>Quick Start Templates</CardTitle>
              </CardHeader>
              <CardContent className="uniform-card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-foreground mb-2">Salaried Employee</h3>
                    <p className="text-sm text-muted-foreground mb-3">Template for employees with salary income, HRA, and common deductions</p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Salary income with HRA</p>
                      <p>• Section 80C investments</p>
                      <p>• Health insurance (80D)</p>
                      <p>• Home loan interest</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-foreground mb-2">Business Owner</h3>
                    <p className="text-sm text-muted-foreground mb-3">Template for self-employed individuals with business income</p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Business/Professional income</p>
                      <p>• NPS contributions</p>
                      <p>• Equipment depreciation</p>
                      <p>• Business loan interest</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-foreground mb-2">Senior Citizen</h3>
                    <p className="text-sm text-muted-foreground mb-3">Template optimized for senior citizens with higher exemption limits</p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Higher basic exemption (₹3L)</p>
                      <p>• Medical insurance (₹50K)</p>
                      <p>• Interest income (₹50K)</p>
                      <p>• Medical treatment deductions</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-foreground mb-2">Investor</h3>
                    <p className="text-sm text-muted-foreground mb-3">Template for individuals with significant capital gains and investments</p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Capital gains (LTCG/STCG)</p>
                      <p>• Dividend income</p>
                      <p>• Multiple investment deductions</p>
                      <p>• Donation benefits (80G)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
