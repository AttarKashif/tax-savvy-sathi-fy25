// Advanced tax calculation utilities for professional-grade computations
// Handles indexation, presumptive taxation, and complex exemptions

export interface IndexationData {
  purchaseYear: number;
  saleYear: number;
  costOfAcquisition: number;
  costOfImprovement: number;
}

export interface PresumptiveTaxData {
  turnover: number;
  businessType: '44AD' | '44AE' | '44ADA';
  vehicleType?: 'goods' | 'passenger';
  isNewVehicle?: boolean;
}

export interface SalaryExemptionData {
  hra: number;
  lta: number;
  childEducationAllowance: number;
  childHostelAllowance: number;
  mealVouchers: number;
  transportAllowance: number;
  medicalReimbursement: number;
  telephoneBills: number;
  newspaperReimbursement: number;
  uniformAllowance: number;
  driverSalary: number;
  gardenerSalary: number;
  sweepingSalary: number;
  watchmanSalary: number;
}

// Cost Inflation Index (CII) for indexation calculations
export const COST_INFLATION_INDEX: Record<number, number> = {
  2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117,
  2006: 122, 2007: 129, 2008: 137, 2009: 148, 2010: 167,
  2011: 184, 2012: 200, 2013: 220, 2014: 240, 2015: 254,
  2016: 264, 2017: 272, 2018: 280, 2019: 289, 2020: 301,
  2021: 317, 2022: 331, 2023: 348, 2024: 363, 2025: 380
};

// Calculate indexed cost of acquisition for LTCG
export function calculateIndexedCost(data: IndexationData): number {
  const purchaseYearCII = COST_INFLATION_INDEX[data.purchaseYear] || COST_INFLATION_INDEX[2001];
  const saleYearCII = COST_INFLATION_INDEX[data.saleYear] || COST_INFLATION_INDEX[2024];
  
  const indexedCostOfAcquisition = (data.costOfAcquisition * saleYearCII) / purchaseYearCII;
  const indexedCostOfImprovement = (data.costOfImprovement * saleYearCII) / purchaseYearCII;
  
  return indexedCostOfAcquisition + indexedCostOfImprovement;
}

// Calculate presumptive income under various sections
export function calculatePresumptiveIncome(data: PresumptiveTaxData): number {
  switch (data.businessType) {
    case '44AD':
      // Presumptive income for eligible business - 8% of turnover (6% for digital receipts)
      return data.turnover * 0.08;
    
    case '44AE':
      // Presumptive income for goods carriages
      if (data.vehicleType === 'goods') {
        return data.isNewVehicle ? 7500 * 12 : 7500 * 12; // ₹7,500 per month per vehicle
      } else if (data.vehicleType === 'passenger') {
        return data.isNewVehicle ? 1000 * 12 : 1000 * 12; // ₹1,000 per month per vehicle
      }
      return 0;
    
    case '44ADA':
      // Presumptive income for professionals - 50% of gross receipts
      return data.turnover * 0.5;
    
    default:
      return 0;
  }
}

// Calculate comprehensive salary exemptions
export function calculateSalaryExemptions(data: SalaryExemptionData, basicSalary: number): {
  totalExemptions: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  
  // HRA exemption (minimum of three conditions)
  const hraExemption = Math.min(
    data.hra,
    basicSalary * 0.5, // 50% of basic salary (40% for non-metro)
    Math.max(0, data.hra - (basicSalary * 0.1)) // Rent paid minus 10% of basic
  );
  breakdown.hra = hraExemption;
  
  // LTA exemption (actual travel expenses or LTA received, whichever is lower)
  breakdown.lta = Math.min(data.lta, 19200 * 2); // ₹19,200 for 2 journeys in a block of 4 years
  
  // Child Education Allowance
  breakdown.childEducationAllowance = Math.min(data.childEducationAllowance, 2400); // ₹100 per month per child (max 2)
  
  // Child Hostel Allowance
  breakdown.childHostelAllowance = Math.min(data.childHostelAllowance, 7200); // ₹300 per month per child (max 2)
  
  // Meal Vouchers
  breakdown.mealVouchers = Math.min(data.mealVouchers, 25000); // ₹50 per meal, max 2 per day
  
  // Transport Allowance
  breakdown.transportAllowance = Math.min(data.transportAllowance, 21600); // ₹1,800 per month
  
  // Medical Reimbursement
  breakdown.medicalReimbursement = Math.min(data.medicalReimbursement, 15000); // ₹15,000 per year
  
  // Telephone Bills
  breakdown.telephoneBills = Math.min(data.telephoneBills, 36000); // ₹3,000 per month
  
  // Newspaper Reimbursement
  breakdown.newspaperReimbursement = Math.min(data.newspaperReimbursement, 1000); // ₹1,000 per year
  
  // Uniform Allowance
  breakdown.uniformAllowance = Math.min(data.uniformAllowance, 20000); // ₹20,000 per year
  
  // Domestic helper salaries (20% or actual, whichever is lower)
  const domesticSalaries = data.driverSalary + data.gardenerSalary + data.sweepingSalary + data.watchmanSalary;
  breakdown.domesticHelperSalaries = Math.min(domesticSalaries, domesticSalaries * 0.2);
  
  const totalExemptions = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  
  return { totalExemptions, breakdown };
}

// Enhanced Section 80C calculation with sub-limits
export function calculateEnhancedSection80C(investments: {
  ppf: number;
  elss: number;
  lic: number;
  nsc: number;
  taxSaverFD: number;
  tuitionFees: number;
  homeLoanPrincipal: number;
  sukanyaSamriddhi: number;
  epf: number;
  ulip: number;
  repaymentOfHousingLoan: number;
  stampDutyOnHouseProperty: number;
  notifiedPensionScheme: number;
}): { total: number; breakdown: Record<string, number>; maxReached: boolean; unutilized: number } {
  const MAX_LIMIT = 150000;
  let totalUsed = 0;
  const breakdown: Record<string, number> = {};
  
  // Process each investment within overall limit
  Object.entries(investments).forEach(([key, value]) => {
    const allowedAmount = Math.min(value, MAX_LIMIT - totalUsed);
    breakdown[key] = allowedAmount;
    totalUsed += allowedAmount;
  });
  
  return {
    total: totalUsed,
    breakdown,
    maxReached: totalUsed >= MAX_LIMIT,
    unutilized: Math.max(0, MAX_LIMIT - totalUsed)
  };
}

// Calculate quarterly advance tax installments
export function calculateAdvanceTaxInstallments(annualTax: number): {
  q1: number; // By June 15
  q2: number; // By September 15
  q3: number; // By December 15
  q4: number; // By March 15
} {
  if (annualTax <= 10000) {
    return { q1: 0, q2: 0, q3: 0, q4: 0 };
  }
  
  return {
    q1: Math.round(annualTax * 0.15), // 15%
    q2: Math.round(annualTax * 0.45 - annualTax * 0.15), // 45% - 15% = 30%
    q3: Math.round(annualTax * 0.75 - annualTax * 0.45), // 75% - 45% = 30%
    q4: Math.round(annualTax - annualTax * 0.75) // 100% - 75% = 25%
  };
}

// Calculate TDS rates for different income types
export function calculateTDSRates(incomeType: string, amount: number, panAvailable: boolean): {
  rate: number;
  tdsAmount: number;
  threshold: number;
} {
  const rates: Record<string, { rate: number; rateWithoutPAN: number; threshold: number }> = {
    salary: { rate: 0, rateWithoutPAN: 0, threshold: 250000 },
    interest: { rate: 10, rateWithoutPAN: 20, threshold: 40000 },
    dividends: { rate: 10, rateWithoutPAN: 20, threshold: 5000 },
    rent: { rate: 10, rateWithoutPAN: 20, threshold: 240000 },
    professionalFees: { rate: 10, rateWithoutPAN: 20, threshold: 30000 },
    commission: { rate: 5, rateWithoutPAN: 20, threshold: 15000 },
    contractorPayments: { rate: 1, rateWithoutPAN: 20, threshold: 30000 }
  };
  
  const rateInfo = rates[incomeType] || { rate: 10, rateWithoutPAN: 20, threshold: 0 };
  const applicableRate = panAvailable ? rateInfo.rate : rateInfo.rateWithoutPAN;
  const tdsAmount = amount > rateInfo.threshold ? (amount * applicableRate) / 100 : 0;
  
  return {
    rate: applicableRate,
    tdsAmount,
    threshold: rateInfo.threshold
  };
}

// Calculate rebate under Section 87A for both regimes
export function calculateRebate87A(taxableIncome: number, taxBeforeRebate: number, regime: 'old' | 'new'): number {
  if (regime === 'old') {
    // Old regime: ₹12,500 for income up to ₹5 lakh
    if (taxableIncome <= 500000) {
      return Math.min(12500, taxBeforeRebate);
    }
  } else {
    // New regime: ₹25,000 for income up to ₹7 lakh
    if (taxableIncome <= 700000) {
      return Math.min(25000, taxBeforeRebate);
    }
  }
  return 0;
}

// Validate regime eligibility
export function validateRegimeEligibility(income: number, hasBusinessIncome: boolean): {
  oldRegimeEligible: boolean;
  newRegimeEligible: boolean;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  
  // Both regimes are generally eligible for individuals
  let oldRegimeEligible = true;
  let newRegimeEligible = true;
  
  // Special cases and recommendations
  if (income > 1500000) {
    recommendations.push("Consider tax planning strategies for high income");
  }
  
  if (hasBusinessIncome) {
    recommendations.push("Evaluate presumptive taxation benefits under sections 44AD/44ADA");
  }
  
  if (income < 700000) {
    recommendations.push("New regime may be beneficial due to higher rebate limit");
  }
  
  return {
    oldRegimeEligible,
    newRegimeEligible,
    recommendations
  };
}