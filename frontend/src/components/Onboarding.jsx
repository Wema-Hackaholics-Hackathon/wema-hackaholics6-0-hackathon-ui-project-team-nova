// /* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccounts from "../hooks/useAccounts";
import AccountCard from "../components/AccountCard";
import SubscriptionList from "../components/SubscriptionList";
import FacialMatch from "../components/FacialMatch"; // <-- import your facial match component
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

// Import mock data
import {
  mockAccounts,
  mockTransactions,
  mockSubscriptions,
} from "../mock/mockData";

export default function Onboarding({ onFinish }) {
  const navigate = useNavigate();
  const {
    accounts,
    addAccount,
    removeAccount,
    subscriptions,
    setSubscriptions,
    setTransactions,
    transactions,
  } = useAccounts();

  // Steps: 1-BVN, 2-Facial, 3-Accounts, 4-Subscriptions, 5-Done
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
        await new Promise((res) => setTimeout(res, 1500));
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
      // Load accounts & subscriptions after successful facial verification
      if (accounts.length === 0) {
        mockAccounts.forEach((acc) => addAccount(acc));
        setTransactions(mockTransactions);
        setSubscriptions(mockSubscriptions);
      }
      setStep(3);
      return;
    }

    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

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
      (tx) =>
        Math.abs(tx.amount) < 5000 &&
        tx.description?.toLowerCase().includes("subscription")
    );

    const merged = [...subscriptions];
    detected.forEach((d) => {
      if (!merged.find((m) => m.vendor?.toLowerCase() === d.description?.toLowerCase())) {
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
      <h2 className="text-xl font-semibold text-center">
        Welcome to ALAT Companion
      </h2>

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
    <p className="text-sm text-slate-600 mb-2">
      Perform facial verification to secure your account
    </p>
    <FacialMatch onSuccess={() => setFacialVerified(true)} />
    {!facialVerified && (
      <p className="text-xs text-slate-500 mt-2">
        Complete the facial scan to proceed
      </p>
    )}
  </div>
)}

      {step === 3 && (
        <div className="space-y-4">
          {accounts.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((a, idx) => (
                <AccountCard key={`${a.id}-${idx}`} account={a} onRemove={removeAccount} />
              ))}
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
              onRemove={(id) => setSubscriptions((prev) => prev.filter((s) => s.id !== id))}
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
        {step > 1 && (
          <Button variant="ghost" onClick={prevStep}>
            Back
          </Button>
        )}
        {step < 5 && (
          <Button
            onClick={nextStep}
            className="ml-auto"
            disabled={(step === 1 && bvnLoading) || (step === 2 && !facialVerified)}
          >
            {step === 1 && bvnLoading ? "Verifying..." : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
