export function computeCreditHealth({
  incomeStability = 0.9,
  avgBalance = 25000,
  monthlyIncome = 150000,
  monthlyExpenses = 100000,
  numSubscriptions = 4,
  outstandingDebt = 200000,
  repaymentHistory = 0.8,
  weights = { income: 0.25, balance: 0.2, spending: 0.2, subs: 0.1, debts: 0.25 }
}) {
  const incomeScore = incomeStability * 100;
  const balanceScore = Math.min(avgBalance / 100000, 1) * 100;
  const savingsRate = Math.max(0, (monthlyIncome - monthlyExpenses) / Math.max(1, monthlyIncome));
  const spendScore = savingsRate * 100;
  const subsScore = Math.max(0, 100 - (numSubscriptions * 5));
  const debtToIncome = outstandingDebt / Math.max(1, monthlyIncome);
  const debtScore = Math.max(0, 100 - debtToIncome * 50);
  const repaymentScore = repaymentHistory * 100;
  const debtsFactor = debtScore * 0.6 + repaymentScore * 0.4;

  const final = (
    incomeScore * weights.income +
    balanceScore * weights.balance +
    spendScore * weights.spending +
    subsScore * weights.subs +
    debtsFactor * weights.debts
  );

  return {
    finalScore: Number(final.toFixed(2)),
    breakdown: { incomeScore, balanceScore, spendScore, subsScore, debtsFactor }
  };
}
