export interface HRACalculationData {
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  isMetroCity: boolean;
}

export interface Section80COptions {
  ppf: number;
  elss: number;
  lic: number;
  nsc: number;
  taxSaverFD: number;
  tuitionFees: number;
  homeLoanPrincipal: number;
  sukanyaSamriddhi: number;
}

export interface Section80DOptions {
  selfAndFamily: number;
  parents: number;
  preventiveHealthCheckup: number;
  isParentSenior: boolean;
  isSelfSenior: boolean;
}

// HRA Calculation Logic
export function calculateMaxHRA(data: HRACalculationData): number {
  const { basicSalary, hraReceived, rentPaid, isMetroCity } = data;
  
  // HRA exemption is minimum of:
  // 1. Actual HRA received
  // 2. 50% of basic salary (metro) or 40% (non-metro)
  // 3. Rent paid minus 10% of basic salary
  
  const basicSalaryPercent = isMetroCity ? 0.5 : 0.4;
  const salaryPercentAmount = basicSalary * basicSalaryPercent;
  const rentMinusTenPercent = Math.max(0, rentPaid - (basicSalary * 0.1));
  
  return Math.min(hraReceived, salaryPercentAmount, rentMinusTenPercent);
}

// Section 80C Calculation
export function calculateSection80C(options: Section80COptions): { total: number; breakdown: Section80COptions; maxReached: boolean } {
  const total = Object.values(options).reduce((sum, value) => sum + value, 0);
  const maxLimit = 150000;
  
  return {
    total: Math.min(total, maxLimit),
    breakdown: options,
    maxReached: total >= maxLimit
  };
}

// Section 80D Calculation
export function calculateSection80D(options: Section80DOptions): { total: number; breakdown: any; limits: any } {
  const { selfAndFamily, parents, preventiveHealthCheckup, isParentSenior, isSelfSenior } = options;
  
  // Limits based on age
  const selfLimit = isSelfSenior ? 50000 : 25000;
  const parentLimit = isParentSenior ? 50000 : 25000;
  const healthCheckupLimit = 5000;
  
  const selfAmount = Math.min(selfAndFamily, selfLimit);
  const parentAmount = Math.min(parents, parentLimit);
  const healthCheckupAmount = Math.min(preventiveHealthCheckup, healthCheckupLimit);
  
  const total = selfAmount + parentAmount + healthCheckupAmount;
  
  return {
    total,
    breakdown: {
      selfAndFamily: selfAmount,
      parents: parentAmount,
      preventiveHealthCheckup: healthCheckupAmount
    },
    limits: {
      selfLimit,
      parentLimit,
      healthCheckupLimit,
      totalUsed: total
    }
  };
}

// Other deduction calculations
export function calculateHomeLoanInterest(interest: number): number {
  const maxLimit = 200000; // Rs. 2 lakh for self-occupied property
  return Math.min(interest, maxLimit);
}

export function calculateSection80TTA(interest: number, age: number): number {
  const maxLimit = age >= 60 ? 50000 : 10000; // 80TTB for seniors, 80TTA for others
  return Math.min(interest, maxLimit);
}

export function calculateEducationLoanInterest(interest: number): number {
  // No upper limit for education loan interest deduction
  return interest;
}

export function calculateNPSDeduction(contribution: number): number {
  const maxLimit = 50000; // Additional 50k under 80CCD(1B)
  return Math.min(contribution, maxLimit);
}
