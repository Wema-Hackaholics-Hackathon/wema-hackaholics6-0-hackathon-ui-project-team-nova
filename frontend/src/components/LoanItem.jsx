import React from "react";

export default function LoanItem({ loan }) {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-3 rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left: Lender + basic info */}
      <div className="flex flex-col gap-1">
        <div className="font-semibold">{loan.lender}</div>
        <div className="text-sm text-slate-500">
          Outstanding: NGN {loan.outstanding?.toLocaleString()} • Next Due: {loan.nextDue || "TBD"}
        </div>
        {loan.status && (
          <span
            className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${statusColors[loan.status] || "bg-slate-100 text-slate-800"}`}
          >
            {loan.status}
          </span>
        )}
        {loan.message && (
          <p className="text-xs text-slate-500 mt-1">{loan.message}</p>
        )}
      </div>

      {/* Right: Loan details */}
      <div className="text-left sm:text-right text-sm flex flex-col gap-1">
        <div>Rate: {(loan.rate * 100).toFixed(2)}%</div>
        <div>Tenure: {loan.tenureMonths} months</div>
      </div>
    </div>
  );
}
