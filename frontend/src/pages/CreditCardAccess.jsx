import React from "react";
import useAccounts from "../hooks/useAccounts";

export default function CreditCardAccess() {
  const { cards } = useAccounts();

  const offers = [
    {
      id: "offer_1",
      issuer: "Wema",
      name: "Wema Classic",
      limit: 200000,
      perks: "Cashback on utilities",
    },
    {
      id: "offer_2",
      issuer: "GTBank",
      name: "GT Premium",
      limit: 500000,
      perks: "Airport lounge",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Credit Card Access</h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked Cards */}
        <div>
          <div className="font-medium mb-2">Your linked cards</div>
          <div className="space-y-3">
            {cards.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="font-semibold">{c.issuer}</div>
                  <div className="text-sm text-slate-500">{c.cardNumberMasked}</div>
                </div>
                <div className="text-left sm:text-right text-sm">
                  <div>Available: {c.availableCredit}</div>
                  <div>Balance: {c.balance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Offers */}
        <div>
          <div className="font-medium mb-2">Card offers marketplace (mock)</div>
          <div className="space-y-3">
            {offers.map((o) => (
              <div
                key={o.id}
                className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="font-semibold">{o.name}</div>
                  <div className="text-sm text-slate-500">{o.perks}</div>
                </div>
                <div className="text-left sm:text-right">
                  <button
                    className="text-sm text-sky-600 hover:underline"
                    onClick={() => alert("Apply flow - mock")}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
