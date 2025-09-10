import React from "react";
import CreditScoreCard from "../components/CreditScoreCard";
import useAccounts from "../hooks/useAccounts";

export default function CreditHealth() {
  // Sample inputs from mock data
  const { accounts, subscriptions, loans } = useAccounts();

  const avgBalance = accounts.length
    ? accounts.reduce((s, a) => s + (a.balance || 0), 0) / accounts.length
    : 0;

  const monthlyIncome = 150000; // mock - in a real app infer from credit transactions
  const monthlyExpenses = 80000;
  const outstandingDebt = loans.reduce((s, l) => s + (l.outstanding || 0), 0);
  const numSubscriptions = subscriptions.length;
  const repaymentHistory = loans.length
    ? loans[0].repaymentHistory.filter(Boolean).length /
      loans[0].repaymentHistory.length
    : 1;

  const params = {
    incomeStability: 0.9,
    avgBalance,
    monthlyIncome,
    monthlyExpenses,
    numSubscriptions,
    outstandingDebt,
    repaymentHistory,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Credit Health Meter</h2>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md">
          <CreditScoreCard params={params} />
        </div>
      </div>
    </div>
  );
}
