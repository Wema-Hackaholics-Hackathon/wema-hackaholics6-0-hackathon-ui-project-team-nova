import { useState } from "react";

export default function AuditLog() {
  const [logs] = useState([
    {
      id: 1,
      time: "2025-09-11 14:22",
      action: "Consent Granted",
      account: "GTBank",
      status: "✅ Success",
    },
    {
      id: 2,
      time: "2025-09-11 14:35",
      action: "Facial Match",
      account: "BVN Verification",
      status: "✅ Success",
    },
    {
      id: 3,
      time: "2025-09-11 15:00",
      action: "Consent Revoked",
      account: "UBA",
      status: "✅ Success",
    },
  ]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-3">Audit Logs</h3>
      <p className="text-xs text-slate-500 mb-2">
        Secure, immutable record of all user actions (CBN Data Governance).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Account</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-2 border">{log.time}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.account}</td>
                <td className="p-2 border">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
