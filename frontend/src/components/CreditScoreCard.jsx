import React from "react";
import { computeCreditHealth } from "../utils/creditScore";

export default function CreditScoreCard({ params = {} }) {
  const { finalScore, breakdown } = computeCreditHealth(params);

  return (
    <div className="p-4 border rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left side - score */}
        <div>
          <div className="text-sm text-slate-500">Credit Health</div>
          <div className="text-2xl font-bold">{finalScore}/100</div>
        </div>

        {/* Right side - breakdown */}
        <div className="text-left sm:text-right text-sm">
          <div className="font-medium">Breakdown:</div>
          <div className="text-xs text-slate-600 flex flex-wrap sm:block gap-x-2">
            <span>Income: {Math.round(breakdown.incomeScore)}</span>
            <span>Balance: {Math.round(breakdown.balanceScore)}</span>
            <span>Spend: {Math.round(breakdown.spendScore)}</span>
          </div>
          <div className="text-xs text-slate-600 flex flex-wrap sm:block gap-x-2">
            <span>Subs: {Math.round(breakdown.subsScore)}</span>
            <span>Debts: {Math.round(breakdown.debtsFactor)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
