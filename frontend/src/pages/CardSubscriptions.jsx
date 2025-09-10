import React, { useMemo } from "react";
import useAccounts from "../hooks/useAccounts";
import { detectRecurring } from "../utils/subscriptionDetector";
import SubscriptionList from "../components/SubscriptionList";
import useTransactions from "../hooks/useTransactions";

export default function CardSubscriptions() {
  const { subscriptions, setSubscriptions } = useAccounts();
  const { transactions } = useTransactions();

  const detected = useMemo(() => detectRecurring(transactions), [transactions]);

  const merge = [...subscriptions];
  detected.forEach((d) => {
    if (!merge.find((m) => m.vendor?.toLowerCase() === d.description?.toLowerCase())) {
      merge.push({
        id: d.id,
        vendor: d.description,
        amount: Math.abs(d.amount),
        period: d.period,
        nextPayment: "TBD (detected)",
      });
    }
  });

  const handleRemove = (id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Subscription Tracker</h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Subscriptions */}
        <div className="space-y-2">
          <div className="font-medium">Detected subscriptions</div>
          <div className="overflow-x-auto rounded border bg-slate-50 p-3">
            <pre className="text-xs whitespace-pre-wrap sm:whitespace-pre">
              {JSON.stringify(detected, null, 2)}
            </pre>
          </div>
        </div>

        {/* Active / merged subscriptions */}
        <div>
          <div className="font-medium mb-2">Your Subscriptions</div>
          <SubscriptionList subscriptions={merge} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}
