import React from "react";

export default function TransactionList({ transactions = [] }) {
  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 rounded-md border"
        >
          {/* Left side: description + date */}
          <div>
            <div className="font-medium">{tx.description}</div>
            <div className="text-sm text-slate-500">{tx.date}</div>
          </div>

          {/* Right side: amount */}
          <div
            className={`font-medium ${
              tx.amount < 0 ? "text-red-600" : "text-green-600"
            } text-left sm:text-right`}
          >
            {tx.amount} NGN
          </div>
        </div>
      ))}
    </div>
  );
}
