
// Tax calculation utilities for FY 2024-25 (AY 2025-26)

export interface TaxSlabRate {
  min: number;
  max: number;
  rate: number;
}

export interface IncomeData {
  salary: number;
  businessIncome: number;
  capitalGainsShort: number;
  capitalGainsLong: number;
  otherSources: number;
}

export interface DeductionData {
  section80C: number;
  section80D: number;
  hra: number;
  lta: number;
  homeLoanInterest: number;
  section80TTA: number;
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
}

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

// New Tax Regime Slabs (FY 2024-25) - Updated per Budget 2024
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
  age: number
): TaxResult {
  const grossIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;
  
  // Standard deduction for salary (₹50,000)
  const standardDeduction = Math.min(income.salary, 50000);
  
  const totalDeductions = standardDeduction + deductions.section80C + deductions.section80D + 
                         deductions.hra + deductions.lta + deductions.homeLoanInterest + deductions.section80TTA;
  
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  let slabs;
  if (age >= 80) slabs = oldRegimeSlabs.superSenior;
  else if (age >= 60) slabs = oldRegimeSlabs.senior;
  else slabs = oldRegimeSlabs.regular;
  
  const taxBeforeRebate = calculateTaxOnSlabs(taxableIncome, slabs);
  
  // Section 87A rebate (₹12,500 for taxable income up to ₹5 lakh)
  const rebateAmount = taxableIncome <= 500000 ? Math.min(12500, taxBeforeRebate) : 0;
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  
  const surcharge = calculateSurcharge(grossIncome, taxAfterRebate);
  const cess = calculateCess(taxAfterRebate + surcharge);
  const totalTax = taxAfterRebate + surcharge + cess;
  
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
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0
  };
}

export function calculateNewRegimeTax(income: IncomeData, age: number): TaxResult {
  const grossIncome = income.salary + income.businessIncome + income.capitalGainsShort + income.capitalGainsLong + income.otherSources;
  
  // Standard deduction for salary (₹75,000 in new regime as per Budget 2024)
  const standardDeduction = Math.min(income.salary, 75000);
  
  const totalDeductions = standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  const taxBeforeRebate = calculateTaxOnSlabs(taxableIncome, newRegimeSlabs);
  
  // Section 87A rebate (₹25,000 for taxable income up to ₹7 lakh in new regime)
  const rebateAmount = taxableIncome <= 700000 ? Math.min(25000, taxBeforeRebate) : 0;
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);
  
  const surcharge = calculateSurcharge(grossIncome, taxAfterRebate);
  const cess = calculateCess(taxAfterRebate + surcharge);
  const totalTax = taxAfterRebate + surcharge + cess;
  
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
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0
  };
}

export function getOptimalRegime(oldRegimeResult: TaxResult, newRegimeResult: TaxResult) {
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
