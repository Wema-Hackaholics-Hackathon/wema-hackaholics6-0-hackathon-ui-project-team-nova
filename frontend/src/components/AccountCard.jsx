import React from "react";
import { Button } from "./ui/Button";

export default function AccountCard({ account, onRemove }) {
  return (
    <div className="border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: account info */}
      <div className="flex-1">
        <div className="font-semibold text-base sm:text-lg">{account.name}</div>
        <div className="text-sm text-slate-500 break-words">
          {account.provider} • {account.accountNumber}
        </div>
      </div>

      {/* Right: balance + action */}
      <div className="flex flex-col items-start sm:items-end">
        <div className="text-lg font-medium text-slate-800">
          {account.balance?.toLocaleString?.() ?? account.balance} NGN
        </div>
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(account.id)}
            className="w-full sm:w-auto"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
