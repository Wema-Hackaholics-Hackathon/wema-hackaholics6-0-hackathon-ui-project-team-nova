import { useState } from "react";

export default function ConsentDashboard() {
  const [consents, setConsents] = useState([
    { id: "acc_9", bank: "GTBank", granted: true, date: "2025-09-10" },
    { id: "acc_10", bank: "UBA", granted: true, date: "2025-09-09" },
  ]);

  const toggleConsent = (id) => {
    setConsents((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, granted: !c.granted } : c
      )
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="font-semibold text-lg mb-3">Consent Management</h3>
      <ul className="space-y-2">
        {consents.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between border p-2 rounded-lg"
          >
            <div>
              <p className="font-medium">{c.bank}</p>
              <p className="text-xs text-slate-500">
                {c.granted
                  ? `Access granted on ${c.date}`
                  : "Access revoked"}
              </p>
            </div>
            <button
              onClick={() => toggleConsent(c.id)}
              className={`px-3 py-1 rounded-lg text-white ${
                c.granted ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {c.granted ? "Revoke" : "Grant"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
