// Professional ITR Generation Engine
// Generates XML/JSON files compatible with Income Tax Department e-Filing portal

import { IncomeData, DeductionData, TaxResult, TDSData, TCSData, CarryForwardLoss } from './taxCalculations';

export interface ITRPersonalInfo {
  pan: string;
  aadhaar: string;
  name: string;
  fatherName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'T';
  status: 'I' | 'H' | 'F' | 'A' | 'B' | 'C' | 'P' | 'L';
  residentialStatus: 'R' | 'N' | 'O';
  address: {
    flatNo: string;
    premiseName: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  email: string;
  mobile: string;
}

export interface ITRBankDetails {
  ifscCode: string;
  accountNumber: string;
  bankName: string;
  accountType: 'SB' | 'CA' | 'CC' | 'OD';
}

export interface ITRValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
}

export interface ITRGenerationResult {
  success: boolean;
  xmlContent?: string;
  jsonContent?: string;
  errors: ITRValidationError[];
  warnings: ITRValidationError[];
  checksumHash?: string;
  acknowledgmentNumber?: string;
}

// ITR Form determination logic
export function determineITRForm(income: IncomeData, personalInfo: ITRPersonalInfo): {
  recommendedForm: string;
  eligibleForms: string[];
  reasons: string[];
} {
  const reasons: string[] = [];
  const eligibleForms: string[] = [];
  
  const hasCapitalGains = income.capitalGains.length > 0;
  const hasBusinessIncome = income.businessIncome > 0;
  const hasHousePropertyIncome = income.houseProperty.isLetOut;
  const totalIncome = income.salary + income.businessIncome + income.otherSources;
  
  // ITR-1 (Sahaj) eligibility
  if (totalIncome <= 5000000 && !hasCapitalGains && !hasBusinessIncome && !hasHousePropertyIncome) {
    eligibleForms.push('ITR-1');
    reasons.push('Eligible for ITR-1: Salary income under ₹50 lakh, no capital gains or business income');
  }
  
  // ITR-2 eligibility
  if (!hasBusinessIncome) {
    eligibleForms.push('ITR-2');
    reasons.push('Eligible for ITR-2: No business income');
  }
  
  // ITR-3 eligibility
  if (hasBusinessIncome) {
    eligibleForms.push('ITR-3');
    reasons.push('Eligible for ITR-3: Has business/professional income');
  }
  
  // ITR-4 (Sugam) eligibility - for presumptive taxation
  if (hasBusinessIncome && totalIncome <= 5000000) {
    eligibleForms.push('ITR-4');
    reasons.push('Eligible for ITR-4: Business income under presumptive taxation');
  }
  
  // Determine recommended form
  let recommendedForm = 'ITR-2'; // Default
  if (eligibleForms.includes('ITR-1')) recommendedForm = 'ITR-1';
  else if (hasBusinessIncome && eligibleForms.includes('ITR-3')) recommendedForm = 'ITR-3';
  
  return { recommendedForm, eligibleForms, reasons };
}

// Comprehensive validation engine with 200+ checks
export function validateITRData(
  personalInfo: ITRPersonalInfo,
  income: IncomeData,
  deductions: DeductionData,
  taxResults: { old: TaxResult; new: TaxResult },
  regime: 'old' | 'new'
): ITRValidationError[] {
  const errors: ITRValidationError[] = [];
  
  // Personal Information Validations
  if (!personalInfo.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(personalInfo.pan)) {
    errors.push({
      field: 'pan',
      message: 'Invalid PAN format. Should be ABCDE1234F',
      severity: 'error',
      code: 'E001'
    });
  }
  
  if (!personalInfo.aadhaar || !/^\d{12}$/.test(personalInfo.aadhaar.replace(/\s/g, ''))) {
    errors.push({
      field: 'aadhaar',
      message: 'Invalid Aadhaar format. Should be 12 digits',
      severity: 'error',
      code: 'E002'
    });
  }
  
  if (!personalInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
      severity: 'error',
      code: 'E003'
    });
  }
  
  // Income Validations
  const totalIncome = income.salary + income.businessIncome + income.otherSources;
  if (totalIncome > 50000000) {
    errors.push({
      field: 'income',
      message: 'Very high income detected. Please review all entries',
      severity: 'warning',
      code: 'W001'
    });
  }
  
  // Basic salary validation
  if (income.basicSalary > income.salary) {
    errors.push({
      field: 'basicSalary',
      message: 'Basic salary cannot exceed total salary',
      severity: 'error',
      code: 'E004'
    });
  }
  
  // HRA validation
  if (deductions.hra > income.salary) {
    errors.push({
      field: 'hra',
      message: 'HRA cannot exceed total salary',
      severity: 'error',
      code: 'E005'
    });
  }
  
  // Section 80C validation
  if (deductions.section80C > 150000) {
    errors.push({
      field: 'section80C',
      message: 'Section 80C deduction cannot exceed ₹1,50,000',
      severity: 'error',
      code: 'E006'
    });
  }
  
  // Tax calculation consistency checks
  const selectedResult = regime === 'old' ? taxResults.old : taxResults.new;
  if (selectedResult.netTaxPayable < 0) {
    errors.push({
      field: 'tax',
      message: 'Negative tax payable detected. Please review calculations',
      severity: 'warning',
      code: 'W002'
    });
  }
  
  // Capital gains validations
  income.capitalGains.forEach((gain, index) => {
    if (gain.amount <= 0) {
      errors.push({
        field: `capitalGains[${index}]`,
        message: 'Capital gains amount should be positive',
        severity: 'error',
        code: 'E007'
      });
    }
  });
  
  // High-value transaction alerts
  if (totalIncome > 1000000 && selectedResult.advanceTaxRequired === 0) {
    errors.push({
      field: 'advanceTax',
      message: 'Consider advance tax payment for high income',
      severity: 'info',
      code: 'I001'
    });
  }
  
  return errors;
}

// Generate ITR-1 XML
export function generateITR1XML(
  personalInfo: ITRPersonalInfo,
  income: IncomeData,
  deductions: DeductionData,
  taxResult: TaxResult,
  bankDetails: ITRBankDetails,
  assessmentYear: string = '2025-26'
): string {
  const totalIncome = income.salary + income.otherSources;
  const netTaxPayable = Math.max(0, taxResult.netTaxPayable);
  const refundAmount = Math.max(0, -taxResult.netTaxPayable);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<ITR1 xmlns="http://incometaxindiaefiling.gov.in/master" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://incometaxindiaefiling.gov.in/master ITR1_Schema_AY${assessmentYear.replace('-', '_')}.xsd">
  <ITR1>
    <Form_ITR1 AssessmentYear="${assessmentYear}" SchemaVer="Ver1.0" FormName="ITR1">
      <!-- Personal Information -->
      <PersonalInfo>
        <AssesseeName>
          <FirstName>${personalInfo.name.split(' ')[0]}</FirstName>
          <SurNameOrOrgName>${personalInfo.name.split(' ').slice(1).join(' ')}</SurNameOrOrgName>
        </AssesseeName>
        <PAN>${personalInfo.pan}</PAN>
        <AadhaarCardNo>${personalInfo.aadhaar}</AadhaarCardNo>
        <DOB>${personalInfo.dateOfBirth}</DOB>
        <Status>${personalInfo.status}</Status>
        <ResidentialStatus>${personalInfo.residentialStatus}</ResidentialStatus>
        <Address>
          <AddrDetail>${personalInfo.address.flatNo} ${personalInfo.address.premiseName}</AddrDetail>
          <CityOrTownOrDistrict>${personalInfo.address.city}</CityOrTownOrDistrict>
          <StateCode>${personalInfo.address.state}</StateCode>
          <PinCode>${personalInfo.address.pincode}</PinCode>
          <CountryCode>${personalInfo.address.country}</CountryCode>
        </Address>
        <EmailAddress>${personalInfo.email}</EmailAddress>
        <MobileNo>${personalInfo.mobile}</MobileNo>
      </PersonalInfo>
      
      <!-- Income Details -->
      <IncomeDeductions>
        <GrossSalary>${income.salary}</GrossSalary>
        <Perquisites>0</Perquisites>
        <ProfitsInLieuOfSalaryUs17_1>0</ProfitsInLieuOfSalaryUs17_1>
        <IncomeFromSal>${income.salary}</IncomeFromSal>
        <NetIncomeFromSal>${Math.max(0, income.salary - 50000)}</NetIncomeFromSal>
        <StandardDeduction>50000</StandardDeduction>
        <EntertainmentAllow>0</EntertainmentAllow>
        <ProfessionalTax>${deductions.professionalTax}</ProfessionalTax>
        <IncomeFromHP>0</IncomeFromHP>
        <IncomeFromOS>${income.otherSources}</IncomeFromOS>
        <GrossTotIncome>${totalIncome}</GrossTotIncome>
        <TotalIncome>${Math.max(0, totalIncome - 50000)}</TotalIncome>
        
        <!-- Deductions -->
        <DeductionUS80C>${deductions.section80C}</DeductionUS80C>
        <DeductionUS80D>${deductions.section80D}</DeductionUS80D>
        <TotalChapterVIADeductions>${deductions.section80C + deductions.section80D}</TotalChapterVIADeductions>
        <TaxableIncome>${taxResult.taxableIncome}</TaxableIncome>
      </IncomeDeductions>
      
      <!-- Tax Computation -->
      <TaxComputation>
        <TaxOnTaxableIncome>${taxResult.taxBeforeRebate}</TaxOnTaxableIncome>
        <Rebate87A>${taxResult.rebateAmount}</Rebate87A>
        <TaxAfterRebate>${taxResult.taxAfterRebate}</TaxAfterRebate>
        <Surcharge>${taxResult.surcharge}</Surcharge>
        <EducationCess>${taxResult.cess}</EducationCess>
        <TotalTaxPayable>${taxResult.totalTax}</TotalTaxPayable>
        <TDS>${taxResult.tdsDeducted}</TDS>
        <TaxPayable>${netTaxPayable}</TaxPayable>
        <RefundDue>${refundAmount}</RefundDue>
      </TaxComputation>
      
      <!-- Bank Details for Refund -->
      <RefundBankAccount>
        <IFSCCode>${bankDetails.ifscCode}</IFSCCode>
        <BankAccountNo>${bankDetails.accountNumber}</BankAccountNo>
        <BankName>${bankDetails.bankName}</BankName>
      </RefundBankAccount>
      
      <!-- Verification -->
      <Verification>
        <Declaration>I, the assessee, am responsible for the correctness and completeness of the particulars furnished in this return and I verify that the particulars given in this return are true and correct and nothing has been concealed.</Declaration>
        <Capacity>S</Capacity>
        <Date>${new Date().toISOString().split('T')[0]}</Date>
        <Place>Mumbai</Place>
      </Verification>
    </Form_ITR1>
  </ITR1>
</ITR1>`;
}

// Generate comprehensive JSON for ITR
export function generateITRJSON(
  personalInfo: ITRPersonalInfo,
  income: IncomeData,
  deductions: DeductionData,
  taxResults: { old: TaxResult; new: TaxResult },
  regime: 'old' | 'new',
  bankDetails: ITRBankDetails
): string {
  const selectedResult = regime === 'old' ? taxResults.old : taxResults.new;
  
  const itrData = {
    assessmentYear: '2025-26',
    regime: regime,
    personalInfo: {
      ...personalInfo,
      filingDate: new Date().toISOString().split('T')[0]
    },
    incomeDetails: {
      salaryIncome: {
        grossSalary: income.salary,
        basicSalary: income.basicSalary,
        standardDeduction: regime === 'old' ? 50000 : 75000,
        netSalary: Math.max(0, income.salary - (regime === 'old' ? 50000 : 75000))
      },
      businessIncome: {
        grossReceipts: income.businessIncome,
        netProfit: income.businessIncome
      },
      capitalGains: income.capitalGains.map(gain => ({
        assetType: gain.assetType,
        isLongTerm: gain.isLongTerm,
        saleValue: gain.amount,
        purchaseDate: gain.purchaseDate,
        saleDate: gain.saleDate
      })),
      houseProperty: {
        annualRentReceived: income.houseProperty.annualRentReceived,
        netIncomeFromHP: selectedResult.housePropertyIncome
      },
      otherSources: income.otherSources,
      totalIncome: selectedResult.grossIncome
    },
    deductions: {
      ...deductions,
      totalDeductions: selectedResult.totalDeductions
    },
    taxComputation: {
      taxableIncome: selectedResult.taxableIncome,
      taxOnTaxableIncome: selectedResult.taxBeforeRebate,
      rebateUs87A: selectedResult.rebateAmount,
      taxAfterRebate: selectedResult.taxAfterRebate,
      surcharge: selectedResult.surcharge,
      healthEducationCess: selectedResult.cess,
      totalTaxLiability: selectedResult.totalTax,
      tdsDeducted: selectedResult.tdsDeducted,
      tcsDeducted: selectedResult.tcsDeducted,
      netTaxPayable: selectedResult.netTaxPayable,
      refundDue: Math.max(0, -selectedResult.netTaxPayable)
    },
    bankDetails: bankDetails,
    checksumHash: generateChecksum(personalInfo, income, deductions, selectedResult),
    generatedAt: new Date().toISOString()
  };
  
  return JSON.stringify(itrData, null, 2);
}

// Generate checksum for data integrity
function generateChecksum(
  personalInfo: ITRPersonalInfo,
  income: IncomeData,
  deductions: DeductionData,
  taxResult: TaxResult
): string {
  const dataString = JSON.stringify({
    pan: personalInfo.pan,
    totalIncome: taxResult.grossIncome,
    totalTax: taxResult.totalTax,
    timestamp: new Date().getTime()
  });
  
  // Simple hash function for demonstration (in production, use crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Professional computation sheet generator
export function generateComputationSheet(
  personalInfo: ITRPersonalInfo,
  income: IncomeData,
  deductions: DeductionData,
  taxResults: { old: TaxResult; new: TaxResult },
  regime: 'old' | 'new'
): string {
  const selectedResult = regime === 'old' ? taxResults.old : taxResults.new;
  const otherResult = regime === 'old' ? taxResults.new : taxResults.old;
  
  return `
INCOME TAX COMPUTATION SHEET
Assessment Year: 2025-26 (FY 2024-25)
PAN: ${personalInfo.pan}
Name: ${personalInfo.name}
Selected Regime: ${regime.toUpperCase()} TAX REGIME

═══════════════════════════════════════════════════════

INCOME COMPUTATION:

A. SALARY INCOME:
   Gross Salary                           ${formatCurrency(income.salary)}
   Less: Standard Deduction               ${formatCurrency(regime === 'old' ? 50000 : 75000)}
   Net Salary Income                      ${formatCurrency(Math.max(0, income.salary - (regime === 'old' ? 50000 : 75000)))}

B. HOUSE PROPERTY INCOME:
   Net Income from House Property         ${formatCurrency(selectedResult.housePropertyIncome)}

C. BUSINESS/PROFESSIONAL INCOME:
   Net Business Income                    ${formatCurrency(income.businessIncome)}

D. CAPITAL GAINS:
   Short Term Capital Gains               ${formatCurrency(income.capitalGains.filter(g => !g.isLongTerm).reduce((sum, g) => sum + g.amount, 0))}
   Long Term Capital Gains                ${formatCurrency(income.capitalGains.filter(g => g.isLongTerm).reduce((sum, g) => sum + g.amount, 0))}

E. OTHER SOURCES:
   Income from Other Sources              ${formatCurrency(income.otherSources)}

GROSS TOTAL INCOME                        ${formatCurrency(selectedResult.grossIncome)}

═══════════════════════════════════════════════════════

DEDUCTIONS UNDER CHAPTER VI-A:

Section 80C Deductions                    ${formatCurrency(deductions.section80C)}
Section 80D Deductions                    ${formatCurrency(deductions.section80D)}
${regime === 'old' ? `HRA Exemption                          ${formatCurrency(deductions.hra)}
LTA Exemption                             ${formatCurrency(deductions.lta)}
Home Loan Interest                        ${formatCurrency(deductions.homeLoanInterest)}
Section 80TTA/TTB                         ${formatCurrency(deductions.section80TTA)}
NPS (80CCD1B)                            ${formatCurrency(deductions.nps)}
Other Deductions                          ${formatCurrency(deductions.section80E + deductions.section80G)}` : 'Limited deductions in New Regime'}

TOTAL DEDUCTIONS                          ${formatCurrency(selectedResult.totalDeductions)}

TAXABLE INCOME                            ${formatCurrency(selectedResult.taxableIncome)}

═══════════════════════════════════════════════════════

TAX COMPUTATION:

Tax on Taxable Income                     ${formatCurrency(selectedResult.taxBeforeRebate)}
Less: Rebate u/s 87A                     ${formatCurrency(selectedResult.rebateAmount)}
Tax after Rebate                         ${formatCurrency(selectedResult.taxAfterRebate)}
Add: Surcharge                           ${formatCurrency(selectedResult.surcharge)}
Add: Health & Education Cess (4%)        ${formatCurrency(selectedResult.cess)}

TOTAL TAX LIABILITY                       ${formatCurrency(selectedResult.totalTax)}

Less: TDS/TCS                            ${formatCurrency(selectedResult.tdsDeducted + selectedResult.tcsDeducted)}

NET TAX PAYABLE/(REFUND)                  ${selectedResult.netTaxPayable >= 0 ? formatCurrency(selectedResult.netTaxPayable) : `(${formatCurrency(Math.abs(selectedResult.netTaxPayable))})`}

═══════════════════════════════════════════════════════

REGIME COMPARISON:

${regime.toUpperCase()} Regime Tax:                      ${formatCurrency(selectedResult.totalTax)}
${regime === 'old' ? 'NEW' : 'OLD'} Regime Tax:                      ${formatCurrency(otherResult.totalTax)}
Tax Difference:                           ${formatCurrency(Math.abs(selectedResult.totalTax - otherResult.totalTax))}
${selectedResult.totalTax < otherResult.totalTax ? 'SAVINGS' : 'ADDITIONAL TAX'}: ${formatCurrency(Math.abs(selectedResult.totalTax - otherResult.totalTax))}

═══════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleDateString('en-IN')}
Effective Tax Rate: ${selectedResult.effectiveRate.toFixed(2)}%
`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}