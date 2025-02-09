interface CalculateParams {
  monthlyInvestment: number;
  years: number;
  returnRate: number;
}

interface CalculationResult {
  investedAmount: number;
  totalWealth: number;
  totalEarnings: number;
  yearlyData: Array<{
    year: number;
    investment: number;
    wealth: number;
    earnings: number;
  }>;
}

export function calculateInvestment({
  monthlyInvestment,
  years,
  returnRate
}: CalculateParams): CalculationResult {
  const monthlyRate = returnRate / 12 / 100;
  const totalMonths = years * 12;

  // Calculate year by year growth
  const yearlyData = [];
  for (let year = 1; year <= years; year++) {
    const monthsCompleted = year * 12;
    const investmentAtYear = monthlyInvestment * monthsCompleted;

    const wealthAtYear = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * 
      (1 + monthlyRate);

    yearlyData.push({
      year,
      investment: Math.round(investmentAtYear),
      wealth: Math.round(wealthAtYear),
      earnings: Math.round(wealthAtYear - investmentAtYear)
    });
  }

  const totalWealth = yearlyData[years - 1].wealth;
  const investedAmount = yearlyData[years - 1].investment;
  const totalEarnings = yearlyData[years - 1].earnings;

  return {
    investedAmount,
    totalWealth,
    totalEarnings,
    yearlyData
  };
}