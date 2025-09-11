import React, { useMemo } from "react";
import useAccounts from "../hooks/useAccounts";
import useTransactions from "../hooks/useTransactions";
import AccountCard from "../components/AccountCard";

export default function UnifiedAccounts() {
  const { accounts, removeAccount } = useAccounts();
  const { transactions } = useTransactions();

  // Compute total balance
  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.balance || 0), 0),
    [accounts]
  );

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h2 className="text-xl font-semibold">Unified Bank Accounts</h2>

      {/* Total Balance Card */}
      {accounts.length > 0 && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="text-sm text-slate-500">Total Balance</div>
          <div className="text-3xl font-bold">
            {totalBalance.toLocaleString()} NGN
          </div>
        </div>
      )}

      {/* Responsive account cards with transactions */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => {
            const accountTxs = transactions.filter(
              (tx) => tx.accountId === a.id
            );
            return (
              <div
                key={a.id}
                className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
              >
                {/* Account Info */}
                <AccountCard account={a} onRemove={removeAccount} />

                {/* Transaction History */}
                <div>
                  <div className="font-semibold text-sm mb-2">
                    Recent Transactions
                  </div>
                  {accountTxs.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {accountTxs.slice(0, 5).map((tx) => (
                        <li
                          key={tx.id}
                          className="flex justify-between border-b pb-1 last:border-b-0"
                        >
                          <span className="truncate">{tx.description}</span>
                          <span
                            className={`${
                              tx.amount < 0
                                ? "text-red-500"
                                : "text-green-600"
                            } font-medium`}
                          >
                            {tx.amount.toLocaleString()} NGN
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-500">
                      No transactions yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-slate-500">
          No accounts available.
        </div>
      )}
    </div>
  );
}
