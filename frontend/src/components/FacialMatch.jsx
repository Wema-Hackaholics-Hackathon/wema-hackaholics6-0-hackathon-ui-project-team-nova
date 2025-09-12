/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

export default function FacialMatch({ onSuccess, disabled = false }) {
  const [status, setStatus] = useState(null); // null | "verifying" | "success" | "failed"

  // Simulate verification instantly
  const startVerification = () => {
    if (disabled || status === "verifying") return;
    setStatus("verifying");

    // Demo realistic delay
    const delay = 1500 + Math.random() * 1500; // 1.5s - 3s
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% chance success
      setStatus(success ? "success" : "failed");
      if (success && onSuccess) onSuccess();
    }, delay);
  };

  const reset = () => setStatus(null);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md text-center max-w-xs mx-auto space-y-4">
      <h3 className="font-semibold text-lg">BVN Facial Verification</h3>

      {status === null && (
        <>
          <p className="text-sm text-slate-600">Click below to start facial verification</p>
          <Button onClick={startVerification} disabled={disabled}>
            Verify Face
          </Button>
        </>
      )}

      {status === "verifying" && (
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-sm text-slate-600">Verifying your face...</p>
        </div>
      )}

      {status === "success" && (
        <p className="text-green-600 font-medium">✅ Verification Successful!</p>
      )}

      {status === "failed" && (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">❌ Verification Failed</p>
          <Button variant="ghost" onClick={reset}>Try Again</Button>
        </div>
      )}
    </div>
  );
}
