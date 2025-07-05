
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PiggyBank, Plus, Trash2, Info, TrendingUp } from 'lucide-react';
import { CapitalGain, assetTypes } from '@/utils/taxCalculations';

interface CapitalGainsEntryProps {
  capitalGains: CapitalGain[];
  setCapitalGains: (gains: CapitalGain[]) => void;
}

export const CapitalGainsEntry: React.FC<CapitalGainsEntryProps> = ({
  capitalGains,
  setCapitalGains
}) => {
  const addCapitalGain = () => {
    setCapitalGains([
      ...capitalGains,
      {
        assetType: 'equity_shares',
        isLongTerm: false,
        amount: 0
      }
    ]);
  };

  const removeCapitalGain = (index: number) => {
    setCapitalGains(capitalGains.filter((_, i) => i !== index));
  };

  const updateCapitalGain = (index: number, field: keyof CapitalGain, value: any) => {
    const updated = [...capitalGains];
    updated[index] = { ...updated[index], [field]: value };
    setCapitalGains(updated);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const getTaxInfo = (assetTypeId: string, isLongTerm: boolean) => {
    const asset = assetTypes.find(type => type.id === assetTypeId);
    if (!asset) return null;

    const rate = isLongTerm ? asset.longTermRate : asset.shortTermRate;
    const rateText = rate === 0 ? 'As per slab rate' : `${rate}%`;
    
    return {
      rate: rateText,
      exemption: asset.exemptionLimit && isLongTerm ? `₹${formatCurrency(asset.exemptionLimit)} exemption` : null,
      threshold: `${asset.longTermThreshold} months for long-term`
    };
  };

  const totalCapitalGains = capitalGains.reduce((sum, gain) => sum + gain.amount, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          Capital Gains Portfolio
          {totalCapitalGains > 0 && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Total: ₹{formatCurrency(totalCapitalGains)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-slate-300 text-sm">
            Add your capital gains from different asset classes for accurate tax calculation
          </p>
          <Button
            onClick={addCapitalGain}
            className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>

        {capitalGains.length === 0 ? (
          <div className="text-center py-8 bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-600">
            <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-slate-300 text-lg font-semibold mb-2">No Capital Gains Added</h3>
            <p className="text-slate-400 text-sm mb-4">
              Add your capital gains to get accurate tax calculations for different asset types
            </p>
            <Button onClick={addCapitalGain} className="bg-purple-600 hover:bg-purple-700 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Asset
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {capitalGains.map((gain, index) => {
              const taxInfo = getTaxInfo(gain.assetType, gain.isLongTerm);
              const selectedAsset = assetTypes.find(type => type.id === gain.assetType);

              return (
                <div key={index} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-semibold">Asset #{index + 1}</h4>
                    <Button
                      onClick={() => removeCapitalGain(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200 font-medium text-sm">Asset Type</Label>
                      <Select
                        value={gain.assetType}
                        onValueChange={(value) => updateCapitalGain(index, 'assetType', value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600/40 text-white rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 rounded-xl">
                          {assetTypes.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id} className="text-white hover:bg-slate-700">
                              {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200 font-medium text-sm">Holding Period</Label>
                      <Select
                        value={gain.isLongTerm ? 'long' : 'short'}
                        onValueChange={(value) => updateCapitalGain(index, 'isLongTerm', value === 'long')}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600/40 text-white rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 rounded-xl">
                          <SelectItem value="short" className="text-white hover:bg-slate-700">
                            Short-term ({selectedAsset && selectedAsset.longTermThreshold < 12 ? '< 1 year' : `< ${selectedAsset?.longTermThreshold} months`})
                          </SelectItem>
                          <SelectItem value="long" className="text-white hover:bg-slate-700">
                            Long-term (≥ {selectedAsset?.longTermThreshold} months)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200 font-medium text-sm">Gain Amount (₹)</Label>
                      <Input
                        type="number"
                        value={gain.amount || ''}
                        onChange={(e) => updateCapitalGain(index, 'amount', Number(e.target.value) || 0)}
                        placeholder="Enter gain amount"
                        className="bg-slate-700/50 border-slate-600/40 text-white rounded-xl"
                      />
                    </div>
                  </div>

                  {taxInfo && (
                    <Alert className="bg-blue-500/10 border-blue-500/20">
                      <Info className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-200">
                        <div className="space-y-1 text-sm">
                          <div><strong>Tax Rate:</strong> {taxInfo.rate}</div>
                          {taxInfo.exemption && <div><strong>Exemption:</strong> {taxInfo.exemption}</div>}
                          <div><strong>Long-term threshold:</strong> {taxInfo.threshold}</div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {capitalGains.length > 0 && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              <div className="flex justify-between items-center">
                <span>Total Capital Gains: <strong>₹{formatCurrency(totalCapitalGains)}</strong></span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {capitalGains.length} asset{capitalGains.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
