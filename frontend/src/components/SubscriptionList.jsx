import React from "react";

export default function SubscriptionList({ subscriptions = [], onRemove = () => {} }) {
  return (
    <div className="space-y-3">
      {subscriptions.map((s) => (
        <div
          key={s.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border p-3 rounded-md"
        >
          {/* Left side: vendor + details */}
          <div>
            <div className="font-semibold">{s.vendor}</div>
            <div className="text-sm text-slate-500">
              {s.period} • Next: {s.nextPayment}
            </div>
          </div>

          {/* Right side: amount + remove button */}
          <div className="text-left sm:text-right">
            <div className="font-medium">{s.amount} NGN</div>
            <div className="mt-1 sm:mt-2">
              <button
                className="text-sm text-slate-600 hover:underline"
                onClick={() => onRemove(s.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
