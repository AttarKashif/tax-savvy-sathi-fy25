import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { generateTaxComparisonPDF } from '@/utils/pdfGenerator';
import { calculateOldRegimeTax, calculateNewRegimeTax, getOptimalRegime, IncomeData, DeductionData } from '@/utils/taxCalculations';

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
}

export const TaxLibrary = () => {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalculations();
  }, [user]);

  const fetchCalculations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the JSON data to proper types
      const typedCalculations = (data || []).map(calc => ({
        ...calc,
        income_data: calc.income_data as IncomeData,
        deductions_data: calc.deductions_data as DeductionData
      })) as SavedCalculation[];
      
      setCalculations(typedCalculations);
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

  const downloadPDF = async (calculation: SavedCalculation) => {
    try {
      const oldRegimeResult = calculateOldRegimeTax(calculation.income_data, calculation.deductions_data, calculation.age);
      const newRegimeResult = calculateNewRegimeTax(calculation.income_data, calculation.deductions_data, calculation.age);
      const recommendation = getOptimalRegime(oldRegimeResult, newRegimeResult);

      const pdfData = {
        income: calculation.income_data,
        deductions: calculation.deductions_data,
        oldRegimeResult,
        newRegimeResult,
        recommendation,
        age: calculation.age,
        taxpayerName: calculation.taxpayer_name
      };

      await generateTaxComparisonPDF(pdfData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
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
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading your tax calculations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Tax Calculation Library</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Access all your saved tax calculations and comparisons. Download PDF reports or delete old calculations.
        </p>
      </div>

      {calculations.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Calculations Yet</h3>
              <p className="text-slate-400">
                Complete a tax calculation to see your saved reports here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculations.map((calculation) => (
            <Card key={calculation.id} className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <CardTitle className="text-white text-sm truncate">
                      {calculation.taxpayer_name || 'Unnamed'}
                    </CardTitle>
                  </div>
                  <Badge className={`${
                    calculation.recommended_regime === 'new' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {calculation.recommended_regime?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Age:</span>
                    <span className="text-white">{calculation.age} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Old Regime Tax:</span>
                    <span className="text-white">₹{formatCurrency(calculation.old_regime_tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">New Regime Tax:</span>
                    <span className="text-white">₹{formatCurrency(calculation.new_regime_tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Savings:</span>
                    <span className="text-green-400">
                      ₹{formatCurrency(Math.abs(calculation.old_regime_tax - calculation.new_regime_tax))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(calculation.created_at)}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => downloadPDF(calculation)}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => deleteCalculation(calculation.id)}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
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
