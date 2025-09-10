import React from "react";

export default function LoanItem({ loan }) {
  return (
    <div className="p-3 rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left: Lender + basic info */}
      <div>
        <div className="font-semibold">{loan.lender}</div>
        <div className="text-sm text-slate-500">
          Outstanding: {loan.outstanding} • Next Due: {loan.nextDue}
        </div>
      </div>

      {/* Right: Loan details */}
      <div className="text-left sm:text-right text-sm">
        <div>Rate: {(loan.rate * 100).toFixed(2)}%</div>
        <div>{loan.tenureMonths} months</div>
      </div>
    </div>
  );
}
