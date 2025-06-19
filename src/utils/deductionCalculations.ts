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
  epf: number;
  ulip: number;
}

export interface Section80DOptions {
  selfAndFamily: number;
  parents: number;
  preventiveHealthCheckup: number;
  isParentSenior: boolean;
  isSelfSenior: boolean;
}

export interface SalaryExemptions {
  hra: number;
  lta: number;
  childEducationAllowance: number;
  childHostelAllowance: number;
  mealVouchers: number;
  professionalTax: number;
}

export interface Section80Deductions {
  section80C: number;
  section80D: number;
  section80DDB: number;
  section80DD: number;
  section80U: number;
  section80E: number;
  section80EE: number;
  section80EEA: number;
  section80G: number;
  section80GG: number;
  section80TTA: number;
  section80TTB: number;
  section80CCD1B: number;
}

export interface OtherExemptions {
  gratuity: number;
  leaveEncashment: number;
  providentFund: number;
  rentFreeAccommodation: number;
  interestFreeLoans: number;
}

// HRA Calculation Logic
export function calculateMaxHRA(data: HRACalculationData): number {
  const { basicSalary, hraReceived, rentPaid, isMetroCity } = data;
  
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

// Section 80DDB - Medical Treatment
export function calculateSection80DDB(amount: number, age: number): number {
  const maxLimit = age >= 60 ? 100000 : 40000;
  return Math.min(amount, maxLimit);
}

// Section 80DD - Disability Dependent
export function calculateSection80DD(isSevereDisability: boolean): number {
  return isSevereDisability ? 125000 : 75000;
}

// Section 80U - Self Disability
export function calculateSection80U(isSevereDisability: boolean): number {
  return isSevereDisability ? 125000 : 75000;
}

// Section 80E - Education Loan Interest
export function calculateSection80E(interest: number): number {
  return interest; // No upper limit
}

// Section 80EE - First Home Loan Interest
export function calculateSection80EE(interest: number): number {
  const maxLimit = 50000;
  return Math.min(interest, maxLimit);
}

// Section 80EEA - Affordable Housing Loan
export function calculateSection80EEA(interest: number): number {
  const maxLimit = 150000;
  return Math.min(interest, maxLimit);
}

// Section 80G - Donations
export function calculateSection80G(donations: number, adjustedGrossTotalIncome: number): number {
  const maxLimit = adjustedGrossTotalIncome * 0.1; // 10% of AGTI
  return Math.min(donations, maxLimit);
}

// Section 80GG - Rent (No HRA)
export function calculateSection80GG(rentPaid: number, totalIncome: number): number {
  const option1 = rentPaid - (totalIncome * 0.1);
  const option2 = 60000; // ₹5,000 per month
  const option3 = totalIncome * 0.25;
  
  return Math.min(Math.max(0, option1), option2, option3);
}

// Section 80TTA/80TTB - Interest Income
export function calculateSection80TTA(interest: number, age: number): number {
  const maxLimit = age >= 60 ? 50000 : 10000; // 80TTB for seniors, 80TTA for others
  return Math.min(interest, maxLimit);
}

// Other calculations
export function calculateHomeLoanInterest(interest: number): number {
  const maxLimit = 200000; // Rs. 2 lakh for self-occupied property
  return Math.min(interest, maxLimit);
}

export function calculateNPSDeduction(contribution: number): number {
  const maxLimit = 50000; // Additional 50k under 80CCD(1B)
  return Math.min(contribution, maxLimit);
}

export function calculateChildEducationAllowance(numberOfChildren: number): number {
  const maxChildren = Math.min(numberOfChildren, 2);
  return maxChildren * 2400; // ₹100 per month per child (max 2)
}

export function calculateChildHostelAllowance(numberOfChildren: number): number {
  const maxChildren = Math.min(numberOfChildren, 2);
  return maxChildren * 7200; // ₹300 per month per child (max 2)
}

export function calculateMealVouchers(numberOfMeals: number): number {
  const maxPerDay = 100; // ₹50 per meal, max 2 meals
  const workingDays = 250; // Assuming 250 working days
  return Math.min(numberOfMeals * 50, maxPerDay * workingDays);
}

export function calculateGratuity(salary: number, yearsOfService: number, actualGratuity: number): number {
  const calculated = (15 * salary * yearsOfService) / 26; // 15 days salary for each year
  const maxLimit = 2000000; // ₹20 lakh
  
  return Math.min(calculated, maxLimit, actualGratuity);
}
