export interface MortgageInput {
  price: number;
  downPercent: number;
  annualRate: number;
  years: number;
}

export interface MortgageResult {
  downPayment: number;
  loan: number;
  monthly: number;
  totalPaid: number;
  totalInterest: number;
  dldFee: number;
  cashToComplete: number;
  months: number;
}

export const MORTGAGE_DEFAULTS = {
  price: 5_000_000,
  downPercent: 20,
  annualRate: 4.99,
  years: 25,
};

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const price = Math.max(0, input.price);
  const downPercent = Math.min(90, Math.max(0, input.downPercent));
  const years = Math.min(30, Math.max(1, Math.round(input.years)));
  const annualRate = Math.max(0, input.annualRate);
  const downPayment = price * (downPercent / 100);
  const loan = Math.max(0, price - downPayment);
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  let monthly = 0;
  if (loan > 0 && months > 0) {
    monthly =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  }

  const totalPaid = monthly * months;
  const dldFee = price * 0.04;
  return {
    downPayment,
    loan,
    monthly,
    totalPaid,
    totalInterest: Math.max(0, totalPaid - loan),
    dldFee,
    cashToComplete: downPayment + dldFee,
    months,
  };
}
