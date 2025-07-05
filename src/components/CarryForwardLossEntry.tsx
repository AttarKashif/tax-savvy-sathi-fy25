
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingDown, Plus, Trash2, AlertTriangle, Info, Calendar } from 'lucide-react';
import { CarryForwardLoss } from '@/utils/taxCalculations';

interface CarryForwardLossEntryProps {
  carryForwardLosses: CarryForwardLoss[];
  setCarryForwardLosses: (losses: CarryForwardLoss[]) => void;
}

export const CarryForwardLossEntry: React.FC<CarryForwardLossEntryProps> = ({
  carryForwardLosses,
  setCarryForwardLosses
}) => {
  const addLoss = () => {
    const currentYear = new Date().getFullYear();
    setCarryForwardLosses([
      ...carryForwardLosses,
      {
        assessmentYear: `${currentYear - 1}-${currentYear.toString().slice(-2)}`,
        shortTermLoss: 0,
        longTermLoss: 0,
        businessLoss: 0,
        housePropertyLoss: 0,
        speculativeLoss: 0,
        nonSpeculativeLoss: 0
      }
    ]);
  };

  const removeLoss = (index: number) => {
    setCarryForwardLosses(carryForwardLosses.filter((_, i) => i !== index));
  };

  const updateLoss = (index: number, field: keyof CarryForwardLoss, value: any) => {
    const updated = [...carryForwardLosses];
    updated[index] = { ...updated[index], [field]: value };
    setCarryForwardLosses(updated);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const getTotalLoss = (loss: CarryForwardLoss) => {
    return loss.shortTermLoss + loss.longTermLoss + loss.businessLoss + 
           loss.housePropertyLoss + loss.speculativeLoss + loss.nonSpeculativeLoss;
  };

  const getAssessmentYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 1; i <= 8; i++) {
      const year = currentYear - i;
      years.push(`${year}-${(year + 1).toString().slice(-2)}`);
    }
    return years;
  };

  const totalLosses = carryForwardLosses.reduce((sum, loss) => sum + getTotalLoss(loss), 0);

  const lossCategories = [
    {
      key: 'shortTermLoss' as keyof CarryForwardLoss,
      label: 'Short-term Capital Loss',
      description: 'Can be set off against short-term and long-term capital gains',
      carryForwardYears: 8
    },
    {
      key: 'longTermLoss' as keyof CarryForwardLoss,
      label: 'Long-term Capital Loss',
      description: 'Can only be set off against long-term capital gains',
      carryForwardYears: 8
    },
    {
      key: 'businessLoss' as keyof CarryForwardLoss,
      label: 'Business Loss',
      description: 'Can be set off against any income except salary',
      carryForwardYears: 8
    },
    {
      key: 'housePropertyLoss' as keyof CarryForwardLoss,
      label: 'House Property Loss',
      description: 'Can be set off against any income except salary',
      carryForwardYears: 8
    },
    {
      key: 'speculativeLoss' as keyof CarryForwardLoss,
      label: 'Speculative Business Loss',
      description: 'Can only be set off against speculative business income',
      carryForwardYears: 4
    },
    {
      key: 'nonSpeculativeLoss' as keyof CarryForwardLoss,
      label: 'Non-Speculative Business Loss',
      description: 'Can be set off against any business income',
      carryForwardYears: 8
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-600/30 rounded-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            Carry Forward Losses
          </div>
          {totalLosses > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Total: ₹{formatCurrency(totalLosses)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <div className="space-y-2">
              <div><strong>Carry forward losses</strong> from previous years can be set off against current year's income to reduce tax liability.</div>
              <div>• Capital losses can be carried forward for 8 years</div>
              <div>• Business losses can be carried forward for 8 years</div>
              <div>• Speculative losses can be carried forward for 4 years</div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center">
          <p className="text-slate-300 text-sm">
            Add losses from previous assessment years that can be set off against current income
          </p>
          <Button
            onClick={addLoss}
            className="bg-red-600 hover:bg-red-700 rounded-xl"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Loss Year
          </Button>
        </div>

        {carryForwardLosses.length === 0 ? (
          <div className="text-center py-8 bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-600">
            <TrendingDown className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-slate-300 text-lg font-semibold mb-2">No Carry Forward Losses</h3>
            <p className="text-slate-400 text-sm mb-4">
              Add losses from previous years to optimize your current tax liability
            </p>
            <Button onClick={addLoss} className="bg-red-600 hover:bg-red-700 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Previous Year Loss
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {carryForwardLosses.map((loss, index) => (
              <div key={index} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <h4 className="text-white font-semibold">Assessment Year</h4>
                  </div>
                  <Button
                    onClick={() => removeLoss(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200 font-medium text-sm">Assessment Year</Label>
                    <Select
                      value={loss.assessmentYear}
                      onValueChange={(value) => updateLoss(index, 'assessmentYear', value)}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600/40 text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 rounded-xl">
                        {getAssessmentYears().map((year) => (
                          <SelectItem key={year} value={year} className="text-white hover:bg-slate-700">
                            AY {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lossCategories.map((category) => (
                    <div key={category.key} className="space-y-2">
                      <Label className="text-slate-200 font-medium text-sm">
                        {category.label}
                      </Label>
                      <Input
                        type="number"
                        value={loss[category.key] || ''}
                        onChange={(e) => updateLoss(index, category.key, Number(e.target.value) || 0)}
                        placeholder="Enter loss amount"
                        className="bg-slate-700/50 border-slate-600/40 text-white rounded-xl"
                      />
                      <p className="text-xs text-slate-400">{category.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-600/30 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Loss for AY {loss.assessmentYear}:</span>
                    <span className="text-red-400 font-semibold">₹{formatCurrency(getTotalLoss(loss))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {carryForwardLosses.length > 0 && (
          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <div className="space-y-2">
                <div><strong>Important Notes:</strong></div>
                <div>• Losses must be from filed ITRs of previous years</div>
                <div>• Ensure losses haven't exceeded carry forward time limits</div>
                <div>• Some losses have specific set-off restrictions</div>
                <div>• Maintain proper documentation for audit purposes</div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
