
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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Tax Calculation Library</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Access your saved tax calculations, view detailed reports, and manage your tax planning history.
        </p>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-600/30 rounded-2xl p-1">
          <TabsTrigger value="saved" className="data-[state=active]:bg-slate-600 rounded-xl text-slate-300 data-[state=active]:text-white">
            Saved Calculations
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-slate-600 rounded-xl text-slate-300 data-[state=active]:text-white">
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-6">
          {/* Search Bar */}
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by taxpayer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Calculations List */}
          {loading ? (
            <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center text-slate-400">Loading calculations...</div>
              </CardContent>
            </Card>
          ) : filteredCalculations.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Library className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Calculations Found</h3>
                  <p className="text-slate-400">
                    {searchTerm ? 'No calculations match your search.' : 'Start by creating your first tax calculation.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCalculations.map((calculation) => (
                <Card key={calculation.id} className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <h3 className="text-lg font-semibold text-white">{calculation.taxpayer_name || 'Unnamed Calculation'}</h3>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            Age {calculation.age}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Old Regime Tax</p>
                            <p className="text-lg font-semibold text-white">₹{formatCurrency(calculation.old_regime_tax || 0)}</p>
                          </div>
                          
                          <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">New Regime Tax</p>
                            <p className="text-lg font-semibold text-white">₹{formatCurrency(calculation.new_regime_tax || 0)}</p>
                          </div>
                          
                          <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-sm text-slate-400 mb-1">Recommended</p>
                            <p className="text-lg font-semibold text-slate-300">{calculation.recommended_regime}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {format(new Date(calculation.created_at), 'dd MMM yyyy, HH:mm')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => generatePDF(calculation)}
                          size="sm"
                          className="bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          onClick={() => deleteCalculation(calculation.id)}
                          size="sm"
                          variant="destructive"
                          className="rounded-lg"
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
          <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Start Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                  <h3 className="font-semibold text-white mb-2">Salaried Employee</h3>
                  <p className="text-sm text-slate-400 mb-3">Template for employees with salary income, HRA, and common deductions</p>
                  <div className="text-xs text-slate-500">
                    <p>• Salary income with HRA</p>
                    <p>• Section 80C investments</p>
                    <p>• Health insurance (80D)</p>
                    <p>• Home loan interest</p>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                  <h3 className="font-semibold text-white mb-2">Business Owner</h3>
                  <p className="text-sm text-slate-400 mb-3">Template for self-employed individuals with business income</p>
                  <div className="text-xs text-slate-500">
                    <p>• Business/Professional income</p>
                    <p>• NPS contributions</p>
                    <p>• Equipment depreciation</p>
                    <p>• Business loan interest</p>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                  <h3 className="font-semibold text-white mb-2">Senior Citizen</h3>
                  <p className="text-sm text-slate-400 mb-3">Template optimized for senior citizens with higher exemption limits</p>
                  <div className="text-xs text-slate-500">
                    <p>• Higher basic exemption (₹3L)</p>
                    <p>• Medical insurance (₹50K)</p>
                    <p>• Interest income (₹50K)</p>
                    <p>• Medical treatment deductions</p>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                  <h3 className="font-semibold text-white mb-2">Investor</h3>
                  <p className="text-sm text-slate-400 mb-3">Template for individuals with significant capital gains and investments</p>
                  <div className="text-xs text-slate-500">
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
  );
};
