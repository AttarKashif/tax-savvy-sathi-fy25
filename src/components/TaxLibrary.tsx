
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Calendar, User, TrendingUp, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { IncomeData, DeductionData } from '@/utils/taxCalculations';
import { generateTaxComparisonPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';

interface SavedCalculation {
  id: string;
  taxpayer_name: string;
  age: number;
  income_data: IncomeData;
  deductions_data: DeductionData;
  old_regime_tax: number;
  new_regime_tax: number;
  recommended_regime: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const TaxLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (error) {
        console.error('Error fetching calculations:', error);
        return;
      }

      // Properly cast the JSON data to the expected types
      const typedCalculations: SavedCalculation[] = data.map(calc => ({
        ...calc,
        income_data: calc.income_data as unknown as IncomeData,
        deductions_data: calc.deductions_data as unknown as DeductionData
      }));

      setCalculations(typedCalculations);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tax_calculations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting calculation:', error);
        toast({
          title: "Error",
          description: "Failed to delete calculation",
          variant: "destructive"
        });
        return;
      }

      setCalculations(prev => prev.filter(calc => calc.id !== id));
      toast({
        title: "Success",
        description: "Calculation deleted successfully"
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownloadPDF = async (calculation: SavedCalculation) => {
    try {
      // Create mock tax results for PDF generation
      const mockOldRegimeResult = {
        grossIncome: calculation.income_data.salary + calculation.income_data.businessIncome + calculation.income_data.capitalGainsShort + calculation.income_data.capitalGainsLong + calculation.income_data.otherSources,
        totalDeductions: Object.values(calculation.deductions_data).reduce((sum, val) => sum + val, 0),
        taxableIncome: 0,
        taxBeforeRebate: 0,
        rebateAmount: 0,
        taxAfterRebate: 0,
        surcharge: 0,
        cess: 0,
        totalTax: calculation.old_regime_tax,
        effectiveRate: 0
      };

      const mockNewRegimeResult = {
        ...mockOldRegimeResult,
        totalTax: calculation.new_regime_tax
      };

      const recommendation = {
        recommendedRegime: calculation.recommended_regime as 'old' | 'new',
        savings: Math.abs(calculation.old_regime_tax - calculation.new_regime_tax),
        percentageSavings: 0,
        oldRegimeTax: calculation.old_regime_tax,
        newRegimeTax: calculation.new_regime_tax
      };

      const pdfData = {
        income: calculation.income_data,
        deductions: calculation.deductions_data,
        oldRegimeResult: mockOldRegimeResult,
        newRegimeResult: mockNewRegimeResult,
        recommendation,
        age: calculation.age,
        taxpayerName: calculation.taxpayer_name
      };

      await generateTaxComparisonPDF(pdfData);
      
      toast({
        title: "Success",
        description: "PDF report generated successfully"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading your saved calculations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Tax Calculation Library</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          View, download, and manage all your saved tax calculations and comparisons.
        </p>
      </div>

      {calculations.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Calculations Found</h3>
            <p className="text-slate-400 mb-6">
              You haven't saved any tax calculations yet. Complete a tax calculation to see it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculations.map((calculation) => (
            <Card 
              key={calculation.id} 
              className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    {calculation.taxpayer_name || 'Tax Calculation'}
                  </CardTitle>
                  <Badge 
                    className={`${
                      calculation.recommended_regime === 'new' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    } rounded-full`}
                  >
                    {calculation.recommended_regime === 'new' ? 'New Regime' : 'Old Regime'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4" />
                    <span>Age: {calculation.age}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(calculation.created_at)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Old Regime Tax:</span>
                    <span className="text-white font-semibold">₹{formatCurrency(calculation.old_regime_tax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">New Regime Tax:</span>
                    <span className="text-white font-semibold">₹{formatCurrency(calculation.new_regime_tax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Savings:</span>
                    <span className="text-green-400 font-semibold">
                      ₹{formatCurrency(Math.abs(calculation.old_regime_tax - calculation.new_regime_tax))}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleDownloadPDF(calculation)}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => handleDelete(calculation.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
