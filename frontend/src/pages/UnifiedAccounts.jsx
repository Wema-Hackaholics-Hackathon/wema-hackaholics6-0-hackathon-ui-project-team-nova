import React from "react";
import AccountLinkWidget from "../components/AccountLinkWidget";
import useAccounts from "../hooks/useAccounts";
import AccountCard from "../components/AccountCard";

export default function UnifiedAccounts() {
  const { accounts, addAccount, removeAccount } = useAccounts();

  const handleLinked = ({ provider, payload }) => {
    console.log("[UnifiedAccounts] linked", provider, payload);
    // Mock transform to account object(s)
    const newAccounts = (payload.accounts || []).map((a, i) => ({
      id: `${provider}_${i}_${a.id || a.accountNumber}`,
      provider: provider.toUpperCase(),
      accountNumber: a.accountNumber || "xxxx",
      name: a.name || "Linked Account",
      balance: a.balance || 0,
    }));
    newAccounts.forEach((a) => addAccount(a));
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h2 className="text-xl font-semibold">Unified Bank Accounts</h2>

      {/* Account linking widget */}
      <div className="w-full">
        <AccountLinkWidget onLinked={handleLinked} />
      </div>

      {/* Responsive account cards */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => (
            <AccountCard
              key={a.id}
              account={a}
              onRemove={removeAccount}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">
          No linked accounts yet. Link one above.
        </div>
      )}
    </div>
  );
}
