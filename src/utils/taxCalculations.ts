
// Tax calculation utilities for FY 2024-25 (AY 2025-26)

export interface TaxSlabRate {
  min: number;
  max: number;
  rate: number;
}

export interface AssetType {
  id: string;
  name: string;
  shortTermRate: number; // Tax rate for short-term gains
  longTermRate: number; // Tax rate for long-term gains
  longTermThreshold: number; // Months to qualify for long-term
  exemptionLimit?: number; // Annual exemption limit if any
}

export interface CapitalGain {
  assetType: string;
  isLongTerm: boolean;
  amount: number;
  purchaseDate?: string;
  saleDate?: string;
}

export interface CarryForwardLoss {
  assessmentYear: string;
  shortTermLoss: number;
  longTermLoss: number;
  businessLoss: number;
  housePropertyLoss: number;
  speculativeLoss: number;
  nonSpeculativeLoss: number;
}

export interface TDSData {
  salary: number;
  professionalServices: number;
  interestFromBank: number;
  rentReceived: number;
  otherTDS: number;
}

export interface IncomeData {
  salary: number;
  basicSalary: number;
  businessIncome: number;
  capitalGains: CapitalGain[];
  otherSources: number;
}

export interface DeductionData {
  section80C: number;
  section80D: number;
  hra: number;
  lta: number;
  homeLoanInterest: number;
  section80TTA: number;
  nps: number;
  professionalTax: number;
  section80E: number;
  section80G: number;
  section80EE: number;
  section80EEA: number;
  section80U: number;
  section80DDB: number;
  section80CCG: number;
  section80CCC: number;
  section80CCD: number;
  gratuity: number;
  leaveEncashment: number;
}

export interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebateAmount: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  capitalGainsTax: number;
  regularIncomeTax: number;
  tdsDeducted: number;
  netTaxPayable: number;
  advanceTaxRequired: number;
}

// Asset type definitions with current tax rates
export const assetTypes: AssetType[] = [
  {
    id: 'equity_shares',
    name: 'Equity Shares (Listed)',
    shortTermRate: 15, // 15% for STCG on equity
    longTermRate: 10, // 10% above ₹1 lakh for LTCG on equity
    longTermThreshold: 12,
    exemptionLimit: 100000
  },
  {
    id: 'equity_mf',
    name: 'Equity Mutual Funds',
    shortTermRate: 15,
    longTermRate: 10,
    longTermThreshold: 12,
    exemptionLimit: 100000
  },
  {
    id: 'debt_mf',
    name: 'Debt Mutual Funds',
    shortTermRate: 0, // As per slab rate
    longTermRate: 20, // 20% with indexation (simplified)
    longTermThreshold: 36
  },
  {
    id: 'real_estate',
    name: 'Real Estate/Property',
    shortTermRate: 0, // As per slab rate
    longTermRate: 20, // 20% with indexation
    longTermThreshold: 24
  },
  {
    id: 'gold_jewelry',
    name: 'Gold/Jewelry',
    shortTermRate: 0, // As per slab rate
    longTermRate: 20, // 20% with indexation
    longTermThreshold: 36
  },
  {
    id: 'bonds',
    name: 'Bonds/Debentures',
    shortTermRate: 0, // As per slab rate
    longTermRate: 20, // 20% with indexation
    longTermThreshold: 12
  },
  {
    id: 'unlisted_shares',
    name: 'Unlisted Shares',
    shortTermRate: 0, // As per slab rate
    longTermRate: 20, // 20% with indexation
    longTermThreshold: 24
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    shortTermRate: 30, // 30% flat rate as per new rules
    longTermRate: 30, // No differentiation for crypto
    longTermThreshold: 12
  }
];

// Old Tax Regime Slabs (FY 2024-25)
export const oldRegimeSlabs = {
  regular: [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 5 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 }
  ],
  senior: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 500000, rate: 5 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 }
  ],
  superSenior: [
    { min: 0, max: 500000, rate: 0 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 }
  ]
};

// New Tax Regime Slabs (FY 2024-25)
export const newRegimeSlabs = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 }
];

export function calculateTaxOnSlabs(taxableIncome: number, slabs: TaxSlabRate[]): number {
  let tax = 0;
  
  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min;
      tax += (taxableInThisSlab * slab.rate) / 100;
    }
  }
  
  return tax;
}

export function calculateCapitalGainsTax(capitalGains: CapitalGain[]): {
  totalTax: number;
  breakdown: { assetType: string; tax: number; amount: number }[];
} {
  let totalTax = 0;
  const breakdown: { assetType: string; tax: number; amount: number }[] = [];

  capitalGains.forEach(gain => {
    const assetType = assetTypes.find(type => type.id === gain.assetType);
    if (!assetType) return;

    let tax = 0;
    const amount = gain.amount;

    if (gain.isLongTerm) {
      if (assetType.exemptionLimit && amount <= assetType.exemptionLimit) {
        tax = 0; // Exempt
      } else {
        const taxableAmount = assetType.exemptionLimit ? 
          Math.max(0, amount - assetType.exemptionLimit) : amount;
        
        if (assetType.longTermRate === 0) {
          // Will be taxed as per regular slab - handled separately
          tax = 0;
        } else {
          tax = (taxableAmount * assetType.longTermRate) / 100;
        }
      }
    } else {
      if (assetType.shortTermRate === 0) {
        // Will be taxed as per regular slab - handled separately
        tax = 0;
      } else {
        tax = (amount * assetType.shortTermRate) / 100;
      }
    }

    totalTax += tax;
    breakdown.push({
      assetType: assetType.name,
      tax,
      amount
    });
  });

  return { totalTax, breakdown };
}

export function applyCarryForwardLosses(
  currentIncome: {
    businessIncome: number;
    capitalGainsShort: number;
    capitalGainsLong: number;
    housePropertyIncome: number;
    speculativeIncome: number;
  },
  carryForwardLosses: CarryForwardLoss[]
): {
  adjustedIncome: typeof currentIncome;
  lossesUtilized: CarryForwardLoss;
  remainingLosses: CarryForwardLoss[];
} {
  const adjustedIncome = { ...currentIncome };
  const lossesUtilized: CarryForwardLoss = {
    assessmentYear: 'Current',
    shortTermLoss: 0,
    longTermLoss: 0,
    businessLoss: 0,
    housePropertyLoss: 0,
    speculativeLoss: 0,
    nonSpeculativeLoss: 0
  };

  // Sort losses by assessment year (older first)
  const sortedLosses = [...carryForwardLosses].sort((a, b) => a.assessmentYear.localeCompare(b.assessmentYear));
  const remainingLosses: CarryForwardLoss[] = [];

  sortedLosses.forEach(loss => {
    const remaining = { ...loss };

    // Set off short-term capital loss against short-term capital gains first
    if (remaining.shortTermLoss > 0 && adjustedIncome.capitalGainsShort > 0) {
      const setOff = Math.min(remaining.shortTermLoss, adjustedIncome.capitalGainsShort);
      adjustedIncome.capitalGainsShort -= setOff;
      remaining.shortTermLoss -= setOff;
      lossesUtilized.shortTermLoss += setOff;
    }

    // Set off remaining short-term capital loss against long-term capital gains
    if (remaining.shortTermLoss > 0 && adjustedIncome.capitalGainsLong > 0) {
      const setOff = Math.min(remaining.shortTermLoss, adjustedIncome.capitalGainsLong);
      adjustedIncome.capitalGainsLong -= setOff;
      remaining.shortTermLoss -= setOff;
      lossesUtilized.shortTermLoss += setOff;
    }

    // Long-term capital loss can only be set off against long-term capital gains
    if (remaining.longTermLoss > 0 && adjustedIncome.capitalGainsLong > 0) {
      const setOff = Math.min(remaining.longTermLoss, adjustedIncome.capitalGainsLong);
      adjustedIncome.capitalGainsLong -= setOff;
      remaining.longTermLoss -= setOff;
      lossesUtilized.longTermLoss += setOff;
    }

    // Business loss can be set off against any income except salary
    if (remaining.businessLoss > 0) {
      // Set off against business income first
      if (adjustedIncome.businessIncome > 0) {
        const setOff = Math.min(remaining.businessLoss, adjustedIncome.businessIncome);
        adjustedIncome.businessIncome -= setOff;
        remaining.businessLoss -= setOff;
        lossesUtilized.businessLoss += setOff;
      }
      
      // Then against capital gains
      if (remaining.businessLoss > 0 && adjustedIncome.capitalGainsShort > 0) {
        const setOff = Math.min(remaining.businessLoss, adjustedIncome.capitalGainsShort);
        adjustedIncome.capitalGainsShort -= setOff;
        remaining.businessLoss -= setOff;
        lossesUtilized.businessLoss += setOff;
      }
      
      if (remaining.businessLoss > 0 && adjustedIncome.capitalGainsLong > 0) {
        const setOff = Math.min(remaining.businessLoss, adjustedIncome.capitalGainsLong);
        adjustedIncome.capitalGainsLong -= setOff;
        remaining.businessLoss -= setOff;
        lossesUtilized.businessLoss += setOff;
      }
    }

    // Add remaining losses to carry forward
    if (remaining.shortTermLoss > 0 || remaining.longTermLoss > 0 || 
        remaining.businessLoss > 0 || remaining.housePropertyLoss > 0 ||
        remaining.speculativeLoss > 0 || remaining.nonSpeculativeLoss > 0) {
      remainingLosses.push(remaining);
    }
  });

  return { adjustedIncome, lossesUtilized, remainingLosses };
}

export function calculateSurcharge(income: number, tax: number): number {
  if (income <= 5000000) return 0;
  if (income <= 10000000) return tax * 0.1;
  if (income <= 20000000) return tax * 0.15;
  if (income <= 50000000) return tax * 0.25;
  return tax * 0.37;
}

export function calculateCess(taxPlusSurcharge: number): number {
  return taxPlusSurcharge * 0.04; // 4% Health & Education Cess
}

export function calculateOldRegimeTax(
  income: IncomeData,
  deductions: DeductionData,
  age: number,
  tdsData: TDSData,
  carryForwardLosses: CarryForwardLoss[] = []
): TaxResult {
  // Calculate capital gains tax separately
  const capitalGainsResult = calculateCapitalGainsTax(income.capitalGains);
  
  // Calculate total capital gains for regular income calculation
  const totalCapitalGainsForSlab = income.capitalGains
    .filter(gain => {
      const assetType = assetTypes.find(type => type.id === gain.assetType);
      return assetType && (
        (gain.isLongTerm && assetType.longTermRate === 0) ||
        (!gain.isLongTerm && assetType.shortTermRate === 0)
      );
    })
    .reduce((sum, gain) => sum + gain.amount, 0);

  // Apply carry forward losses
  const currentIncome = {
    businessIncome: income.businessIncome,
    capitalGainsShort: income.capitalGains.filter(g => !g.isLongTerm).reduce((sum, g) => sum + g.amount, 0),
    capitalGainsLong: income.capitalGains.filter(g => g.isLongTerm).reduce((sum, g) => sum + g.amount, 0),
    housePropertyIncome: 0, // Not implemented yet
    speculativeIncome: 0 // Not implemented yet
  };

  const lossAdjustment = applyCarryForwardLosses(currentIncome, carryForwardLosses);

  const grossIncome = income.salary + lossAdjustment.adjustedIncome.businessIncome + 
                     totalCapitalGainsForSlab + income.otherSources;
  
  // Standard deduction for salary (₹50,000)
  const standardDeduction = Math.min(income.salary, 50000);
  
  const totalDeductions = standardDeduction + deductions.section80C + deductions.section80D + 
                         deductions.hra + deductions.lta + deductions.homeLoanInterest + 
                         deductions.section80TTA + deductions.nps + deductions.professionalTax +
                         deductions.section80E + deductions.section80G + deductions.section80EE +
                         deductions.section80EEA + deductions.section80U + deductions.section80DDB +
                         deductions.section80CCG + deductions.section80CCC + deductions.section80CCD +
                         deductions.gratuity + deductions.leaveEncashment;
  
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  let slabs;
  if (age >= 80) slabs = oldRegimeSlabs.superSenior;
  else if (age >= 60) slabs = oldRegimeSlabs.senior;
  else slabs = oldRegimeSlabs.regular;
  
  const regularIncomeTax = calculateTaxOnSlabs(taxableIncome, slabs);
  const taxBeforeRebate = regularIncomeTax + capitalGainsResult.totalTax;
  
  // Section 87A rebate (₹12,500 for taxable income up to ₹5 lakh)
  const rebateAmount = taxableIncome <= 500000 ? Math.min(12500, regularIncomeTax) : 0;
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  
  const surcharge = calculateSurcharge(grossIncome, taxAfterRebate);
  const cess = calculateCess(taxAfterRebate + surcharge);
  const totalTax = taxAfterRebate + surcharge + cess;
  
  const totalTDS = tdsData.salary + tdsData.professionalServices + tdsData.interestFromBank + 
                   tdsData.rentReceived + tdsData.otherTDS;
  
  const netTaxPayable = Math.max(0, totalTax - totalTDS);
  const advanceTaxRequired = netTaxPayable > 10000 ? netTaxPayable * 0.9 : 0;
  
  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebateAmount,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    capitalGainsTax: capitalGainsResult.totalTax,
    regularIncomeTax,
    tdsDeducted: totalTDS,
    netTaxPayable,
    advanceTaxRequired
  };
}

export function calculateNewRegimeTax(
  income: IncomeData, 
  deductions: DeductionData, 
  age: number,
  tdsData: TDSData,
  carryForwardLosses: CarryForwardLoss[] = []
): TaxResult {
  // Similar logic as old regime but with new tax slabs and limited deductions
  const capitalGainsResult = calculateCapitalGainsTax(income.capitalGains);
  
  const totalCapitalGainsForSlab = income.capitalGains
    .filter(gain => {
      const assetType = assetTypes.find(type => type.id === gain.assetType);
      return assetType && (
        (gain.isLongTerm && assetType.longTermRate === 0) ||
        (!gain.isLongTerm && assetType.shortTermRate === 0)
      );
    })
    .reduce((sum, gain) => sum + gain.amount, 0);

  const currentIncome = {
    businessIncome: income.businessIncome,
    capitalGainsShort: income.capitalGains.filter(g => !g.isLongTerm).reduce((sum, g) => sum + g.amount, 0),
    capitalGainsLong: income.capitalGains.filter(g => g.isLongTerm).reduce((sum, g) => sum + g.amount, 0),
    housePropertyIncome: 0,
    speculativeIncome: 0
  };

  const lossAdjustment = applyCarryForwardLosses(currentIncome, carryForwardLosses);

  const grossIncome = income.salary + lossAdjustment.adjustedIncome.businessIncome + 
                     totalCapitalGainsForSlab + income.otherSources;
  
  // Standard deduction for salary (₹75,000 in new regime)
  const standardDeduction = Math.min(income.salary, 75000);
  
  // In new regime, only standard deduction and specific exemptions allowed
  const totalDeductions = standardDeduction + deductions.gratuity + deductions.leaveEncashment;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  const regularIncomeTax = calculateTaxOnSlabs(taxableIncome, newRegimeSlabs);
  const taxBeforeRebate = regularIncomeTax + capitalGainsResult.totalTax;
  
  // Section 87A rebate (₹25,000 for taxable income up to ₹7 lakh in new regime)
  const rebateAmount = taxableIncome <= 700000 ? Math.min(25000, regularIncomeTax) : 0;
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  
  const surcharge = calculateSurcharge(grossIncome, taxAfterRebate);
  const cess = calculateCess(taxAfterRebate + surcharge);
  const totalTax = taxAfterRebate + surcharge + cess;
  
  const totalTDS = tdsData.salary + tdsData.professionalServices + tdsData.interestFromBank + 
                   tdsData.rentReceived + tdsData.otherTDS;
  
  const netTaxPayable = Math.max(0, totalTax - totalTDS);
  const advanceTaxRequired = netTaxPayable > 10000 ? netTaxPayable * 0.9 : 0;
  
  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRebate,
    rebateAmount,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    capitalGainsTax: capitalGainsResult.totalTax,
    regularIncomeTax,
    tdsDeducted: totalTDS,
    netTaxPayable,
    advanceTaxRequired
  };
}

export function getOptimalRegime(oldRegimeResult: TaxResult, newRegimeResult: TaxResult): {
  recommendedRegime: 'old' | 'new';
  savings: number;
  percentageSavings: number;
  oldRegimeTax: number;
  newRegimeTax: number;
} {
  const savings = oldRegimeResult.totalTax - newRegimeResult.totalTax;
  const percentageSavings = oldRegimeResult.totalTax > 0 ? (savings / oldRegimeResult.totalTax) * 100 : 0;
  
  return {
    recommendedRegime: savings >= 0 ? 'new' : 'old',
    savings: Math.abs(savings),
    percentageSavings: Math.abs(percentageSavings),
    oldRegimeTax: oldRegimeResult.totalTax,
    newRegimeTax: newRegimeResult.totalTax
  };
}
