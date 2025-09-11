/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountLinkWidget from "../components/AccountLinkWidget"; // Mono/Okra widget
import useAccounts from "../hooks/useAccounts";
import AccountCard from "../components/AccountCard";
import SubscriptionList from "../components/SubscriptionList";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

export default function Onboarding({ onFinish }) {
  const navigate = useNavigate();
  const { accounts, addAccount, removeAccount, subscriptions, setSubscriptions, transactions } =
    useAccounts();

  // Steps: 1-Link Accounts, 2-BVN, 3-View Accounts, 4-Subscriptions, 5-Done
  const [step, setStep] = useState(1);
  const [bvn, setBvn] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [bvnLoading, setBvnLoading] = useState(false);

  // Navigation
  const nextStep = async () => {
    if (step === 2) {
      if (!validateBVN()) return;
      setBvnLoading(true);
      try {
        // Simulate API verification delay (replace with real Mono/Okra BVN call)
        await new Promise((res) => setTimeout(res, 1500));
        toast.success("BVN verified successfully!");
        setStep(step + 1);
      } catch (err) {
        toast.error("BVN verification failed.");
      } finally {
        setBvnLoading(false);
      }
      return;
    }

    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // BVN validation
  const validateBVN = () => {
    if (!/^\d{11}$/.test(bvn)) {
      setBvnError("BVN must be exactly 11 digits");
      return false;
    }
    setBvnError("");
    return true;
  };

  // Mock subscription detection
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
    if (detected.length > 0) toast.success(`${detected.length} subscription(s) detected!`);
    else toast.info("No subscriptions detected");
  };

  // Handle account linking
  const handleLinked = ({ provider, payload }) => {
    const newAccounts = (payload.accounts || []).map((a, i) => ({
      id: `${provider}_${i}_${a.id || a.accountNumber}`,
      provider: provider.toUpperCase(),
      accountNumber: a.accountNumber || "xxxx",
      name: a.name || "Linked Account",
      balance: a.balance || 0,
    }));
    newAccounts.forEach((a) => addAccount(a));
    toast.success("Bank account linked successfully!");
  };

  // Automatically finish onboarding when step 5 is reached
  useEffect(() => {
    if (step === 5) {
      const timeout = setTimeout(() => {
        if (onFinish) onFinish();
        navigate("/dashboard");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [step, navigate, onFinish]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h2 className="text-xl font-semibold text-center">Welcome to CampusCart Finance</h2>

      {/* Step Indicator */}
      <div className="flex justify-between mb-4 text-sm text-slate-500">
        <span className={step >= 1 ? "font-semibold" : ""}>1. Link Accounts</span>
        <span className={step >= 2 ? "font-semibold" : ""}>2. BVN</span>
        <span className={step >= 3 ? "font-semibold" : ""}>3. View Accounts</span>
        <span className={step >= 4 ? "font-semibold" : ""}>4. Subscriptions</span>
        <span className={step >= 5 ? "font-semibold" : ""}>5. Done</span>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 text-center">
            Connect your bank accounts securely.
          </p>
          <AccountLinkWidget onLinked={handleLinked} />
        </div>
      )}

      {step === 2 && (
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

      {step === 3 && (
        <div className="space-y-4">
          {accounts.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((a) => (
                <AccountCard key={a.id} account={a} onRemove={removeAccount} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500 text-center">No accounts linked yet.</div>
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
        {step > 1 && <Button variant="ghost" onClick={prevStep}>Back</Button>}
        {step < 5 && (
          <Button onClick={nextStep} className="ml-auto" disabled={bvnLoading && step === 2}>
            {step === 2 && bvnLoading ? "Verifying..." : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
