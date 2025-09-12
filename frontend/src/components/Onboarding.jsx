/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccounts from "../hooks/useAccounts";
import AccountCard from "../components/AccountCard";
import SubscriptionList from "../components/SubscriptionList";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

import { mockAccounts, mockTransactions, mockSubscriptions } from "../mock/mockData";

// Simulated FacialMatch
function FacialMatch({ onSuccess, disabled = false }) {
  const [status, setStatus] = useState(null); // null | "verifying" | "success" | "failed"

  const startVerification = () => {
    if (disabled || status === "verifying") return;
    setStatus("verifying");

    const delay = 1500 + Math.random() * 1500; // 1.5 - 3s delay
    setTimeout(() => {
      const success = Math.random() > 0.1;
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
          <Button onClick={startVerification} disabled={disabled}>Verify Face</Button>
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

export default function Onboarding({ onFinish }) {
  const navigate = useNavigate();
  const { accounts, addAccount, removeAccount, loans, subscriptions, setSubscriptions, setTransactions, transactions } = useAccounts();

  const [step, setStep] = useState(1);
  const [bvn, setBvn] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [bvnLoading, setBvnLoading] = useState(false);
  const [facialVerified, setFacialVerified] = useState(false);

  const nextStep = async () => {
    if (step === 1) {
      if (!validateBVN()) return;
      setBvnLoading(true);
      try {
        await new Promise(res => setTimeout(res, 1500));
        toast.success("BVN verified successfully!");
        setStep(2);
      } catch {
        toast.error("BVN verification failed.");
      } finally {
        setBvnLoading(false);
      }
      return;
    }

    if (step === 2) {
      if (!facialVerified) {
        toast.info("Please complete facial verification first.");
        return;
      }

      if (accounts.length === 0) {
        mockAccounts.forEach(acc => addAccount(acc));
        setTransactions(mockTransactions);
        setSubscriptions(mockSubscriptions);
      }
      setStep(3);
      return;
    }

    setStep(s => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const validateBVN = () => {
    if (!/^\d{11}$/.test(bvn)) {
      setBvnError("BVN must be exactly 11 digits");
      return false;
    }
    setBvnError("");
    return true;
  };

  const detectSubscriptions = () => {
    const detected = transactions.filter(
      tx => Math.abs(tx.amount) < 5000 && tx.description?.toLowerCase().includes("subscription")
    );
    const merged = [...subscriptions];
    detected.forEach(d => {
      if (!merged.find(m => m.vendor?.toLowerCase() === d.description?.toLowerCase())) {
        merged.push({
          id: d.id,
          vendor: d.description,
          amount: Math.abs(d.amount),
          period: "Monthly",
          nextPayment: "TBD (detected)",
        });
      }
    });
    setSubscriptions(merged);
    detected.length > 0
      ? toast.success(`${detected.length} subscription(s) detected!`)
      : toast.info("No subscriptions detected");
  };

  useEffect(() => {
    if (step === 5) {
      const timeout = setTimeout(() => {
        toast.success("Onboarding complete! Redirecting to dashboard...");
        if (onFinish) onFinish();
        navigate("/dashboard");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [step, navigate, onFinish]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h2 className="text-xl font-semibold text-center">Welcome to ALAT Companion</h2>

      {/* Step Indicator */}
      <div className="flex justify-between mb-4 text-sm text-slate-500">
        <span className={step >= 1 ? "font-semibold" : ""}>1. BVN</span>
        <span className={step >= 2 ? "font-semibold" : ""}>2. Facial Verification</span>
        <span className={step >= 3 ? "font-semibold" : ""}>3. Accounts</span>
        <span className={step >= 4 ? "font-semibold" : ""}>4. Subscriptions</span>
        <span className={step >= 5 ? "font-semibold" : ""}>5. Done</span>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 text-center">
            Enter your Bank Verification Number (BVN)
          </p>
          <label htmlFor="bvn" className="block text-sm font-medium text-slate-700">
            BVN
          </label>
          <input
            id="bvn"
            type="text"
            maxLength={11}
            placeholder="Enter your 11-digit BVN"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {bvnError && <p className="text-red-600 text-xs mt-1">{bvnError}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          {/* Engaging info message with icon */}
          <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
            {/* <span role="img" aria-label="face"></span> */}
            We need facial recognition to confirm that you are the owner of the BVN you just entered.
          </p>
          <FacialMatch onSuccess={() => setFacialVerified(true)} />
          {!facialVerified && (
            <p className="text-xs text-slate-500 mt-2">Complete the facial scan to proceed</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {accounts.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((a, idx) => (
                <div key={`${a.id}-${idx}`} className="p-3 border rounded-md bg-white">
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-sm text-slate-500">{a.accountNumber}</div>
                </div>
              ))}
              {loans.length > 0 && (
                <div className="col-span-full space-y-2 mt-4">
                  <p className="font-medium">Pending Loans:</p>
                  {loans.map(loan => loan.status === "Pending" && (
                    <div key={loan.id} className="p-3 border rounded-md bg-yellow-50">
                      <div className="font-semibold">{loan.lender}</div>
                      <div className="text-sm text-slate-600">{loan.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500 text-center">No accounts found yet.</div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">We can detect recurring subscriptions for you:</p>
          <Button onClick={detectSubscriptions}>Detect Subscriptions</Button>
          {subscriptions.length > 0 && (
            <SubscriptionList
              subscriptions={subscriptions}
              onRemove={(id) => setSubscriptions(prev => prev.filter(s => s.id !== id))}
            />
          )}
        </div>
      )}

      {step === 5 && (
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">You're all set!</p>
          <p className="text-sm text-slate-600">Redirecting to dashboard...</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {step > 1 && <Button variant="ghost" onClick={prevStep}>Back</Button>}
        {step < 5 && (
          <Button onClick={nextStep} className="ml-auto" disabled={(step === 1 && bvnLoading) || (step === 2 && !facialVerified)}>
            {step === 1 && bvnLoading ? "Verifying..." : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
