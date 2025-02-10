interface CalculateParams {
  monthlyInvestment: number;
  years: number;
  returnRate: number;
  inflationRate?: number;
}

interface CalculationResult {
  investedAmount: number;
  totalWealth: number;
  totalWealthReal: number;
  totalEarnings: number;
  totalEarningsReal: number;
  yearlyData: Array<{
    year: number;
    investment: number;
    wealth: number;
    wealthReal: number;
    earnings: number;
    earningsReal: number;
  }>;
}

export function calculateInvestment({
  monthlyInvestment,
  years,
  returnRate,
  inflationRate = 9
}: CalculateParams): CalculationResult {
  const monthlyRate = returnRate / 12 / 100;
  const realMonthlyRate = (((1 + returnRate/100)/(1 + inflationRate/100)) - 1) / 12;
  const totalMonths = years * 12;

  const yearlyData = [];
  for (let year = 1; year <= years; year++) {
    const monthsCompleted = year * 12;
    const investmentAtYear = monthlyInvestment * monthsCompleted;

    const wealthAtYear = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * 
      (1 + monthlyRate);

    const wealthAtYearReal = monthlyInvestment * 
      ((Math.pow(1 + realMonthlyRate, monthsCompleted) - 1) / realMonthlyRate) * 
      (1 + realMonthlyRate);

    yearlyData.push({
      year,
      investment: Math.round(investmentAtYear),
      wealth: Math.round(wealthAtYear),
      wealthReal: Math.round(wealthAtYearReal),
      earnings: Math.round(wealthAtYear - investmentAtYear),
      earningsReal: Math.round(wealthAtYearReal - investmentAtYear)
    });
  }

  const totalWealth = yearlyData[years - 1].wealth;
  const totalWealthReal = yearlyData[years - 1].wealthReal;
  const investedAmount = yearlyData[years - 1].investment;
  const totalEarnings = yearlyData[years - 1].earnings;
  const totalEarningsReal = yearlyData[years - 1].earningsReal;

  return {
    investedAmount,
    totalWealth,
    totalWealthReal,
    totalEarnings,
    totalEarningsReal,
    yearlyData
  };
}