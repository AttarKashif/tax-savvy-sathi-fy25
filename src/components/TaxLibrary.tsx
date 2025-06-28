
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Library, Search, Calendar, TrendingUp, Download, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateTaxComparisonPDF } from '@/utils/pdfGenerator';

interface SavedCalculation {
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
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalculation, setSelectedCalculation] = useState<SavedCalculation | null>(null);

  useEffect(() => {
    fetchCalculations();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = calculations.filter(calc => 
        calc.taxpayer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.recommended_regime?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCalculations(filtered);
    } else {
      setFilteredCalculations(calculations);
    }
  }, [searchTerm, calculations]);

  const fetchCalculations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', user.id)
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
      
      setCalculations(prev => prev.filter(calc => calc.id !== id));
    } catch (error) {
      console.error('Error deleting calculation:', error);
    }
  };

  const downloadReport = async (calculation: SavedCalculation) => {
    const reportData = {
      income: calculation.income_data,
      deductions: calculation.deductions_data,
      oldRegimeResult: {
        grossIncome: calculation.income_data.salary + calculation.income_data.businessIncome + calculation.income_data.capitalGainsShort + calculation.income_data.capitalGainsLong + calculation.income_data.otherSources,
        totalDeductions: Object.values(calculation.deductions_data).reduce((sum: number, val: any) => sum + (val || 0), 0),
        taxableIncome: 0,
        taxBeforeRebate: 0,
        rebateAmount: 0,
        taxAfterRebate: 0,
        surcharge: 0,
        cess: 0,
        totalTax: calculation.old_regime_tax,
        effectiveRate: 0
      },
      newRegimeResult: {
        grossIncome: calculation.income_data.salary + calculation.income_data.businessIncome + calculation.income_data.capitalGainsShort + calculation.income_data.capitalGainsLong + calculation.income_data.otherSources,
        totalDeductions: 0,
        taxableIncome: 0,
        taxBeforeRebate: 0,
        rebateAmount: 0,
        taxAfterRebate: 0,
        surcharge: 0,
        cess: 0,
        totalTax: calculation.new_regime_tax,
        effectiveRate: 0
      },
      recommendation: {
        recommendedRegime: calculation.recommended_regime as 'old' | 'new',
        savings: Math.abs(calculation.old_regime_tax - calculation.new_regime_tax),
        percentageSavings: 0
      },
      age: calculation.age,
      taxpayerName: calculation.taxpayer_name
    };

    await generateTaxComparisonPDF(reportData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading your calculations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Library className="w-4 h-4 text-white" />
            </div>
            Tax Calculation Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name or regime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full">
              {filteredCalculations.length} calculations
            </Badge>
          </div>

          {filteredCalculations.length === 0 ? (
            <Alert className="bg-slate-700/30 border-slate-600/30 rounded-xl">
              <Library className="h-4 w-4" />
              <AlertDescription className="text-slate-300">
                {calculations.length === 0 
                  ? "No saved calculations found. Complete a tax calculation to see it here."
                  : "No calculations match your search criteria."
                }
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {filteredCalculations.map((calculation) => (
                <Card key={calculation.id} className="bg-slate-700/30 border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {calculation.taxpayer_name || 'Unnamed Calculation'}
                          </h3>
                          <Badge 
                            variant={calculation.recommended_regime === 'old' ? 'secondary' : 'default'}
                            className={`rounded-full px-3 py-1 ${
                              calculation.recommended_regime === 'old' 
                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' 
                                : 'bg-green-500/20 text-green-300 border-green-500/30'
                            }`}
                          >
                            {calculation.recommended_regime?.toUpperCase()} REGIME
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">Age</div>
                            <div className="text-white font-medium">{calculation.age} years</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">Old Regime Tax</div>
                            <div className="text-white font-medium">{formatCurrency(calculation.old_regime_tax)}</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">New Regime Tax</div>
                            <div className="text-white font-medium">{formatCurrency(calculation.new_regime_tax)}</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="text-xs text-slate-400 mb-1">Savings</div>
                            <div className="text-green-400 font-medium">
                              {formatCurrency(Math.abs(calculation.old_regime_tax - calculation.new_regime_tax))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" />
                          Created: {formatDate(calculation.created_at)}
                          {calculation.updated_at !== calculation.created_at && (
                            <span>• Updated: {formatDate(calculation.updated_at)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReport(calculation)}
                          className="text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCalculation(calculation.id)}
                          className="text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg"
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
        </CardContent>
      </Card>
    </div>
  );
};
