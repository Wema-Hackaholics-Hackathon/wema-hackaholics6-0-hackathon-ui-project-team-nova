import React, { useState } from "react";
import useAccounts from "../hooks/useAccounts";
import LoanItem from "../components/LoanItem";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

// Mock Bank Loans
const MOCK_BANK_LOANS = [
  { id: "b1", bank: "First Bank", principal: 100000, rate: 0.18, tenureMonths: 12 },
  { id: "b2", bank: "GTBank", principal: 200000, rate: 0.15, tenureMonths: 24 },
  { id: "b3", bank: "Access Bank", principal: 150000, rate: 0.2, tenureMonths: 18 },
];

// Simulated FacialMatch (no real camera, realistic demo)
function FacialMatch({ onSuccess, disabled = false, onClose }) {
  const [status, setStatus] = useState(null);

  const startVerification = () => {
    if (disabled || status === "verifying") return;
    setStatus("verifying");
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      setStatus(success ? "success" : "failed");
      if (success && onSuccess) onSuccess();
    }, delay);
  };

  const reset = () => setStatus(null);

  return (
    <div className="text-center">
      {status === null && (
        <Button onClick={startVerification} disabled={disabled}>
          Verify Face
        </Button>
      )}
      {status === "verifying" && <p className="text-slate-600 mt-2">Verifying...</p>}
      {status === "success" && <p className="text-green-600 mt-2">✅ Verification Successful!</p>}
      {status === "failed" && (
        <div className="space-y-2">
          <p className="text-red-600">❌ Verification Failed</p>
          <Button variant="ghost" onClick={reset}>
            Try Again
          </Button>
        </div>
      )}
      {onClose && (
        <Button variant="ghost" onClick={onClose} className="mt-2">
          Cancel
        </Button>
      )}
    </div>
  );
}

export default function LoanTracker() {
  const { loans, setLoans, creditScore } = useAccounts();
  const [form, setForm] = useState({
    lender: "",
    principal: "",
    outstanding: "",
    rate: "",
    tenureMonths: "",
    nextDue: "",
  });
  const [facialModalOpen, setFacialModalOpen] = useState(false);
  const [pendingLoan, setPendingLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Apply logic: check credit, facial verification, then Pending loan
  const handleApplyClick = (loanData) => {
    if (creditScore < 600) {
      toast.error("Your credit score is too low. You cannot apply for this loan.");
      return;
    }
    toast.info("Your credit score is good! Proceed to facial verification.");
    setPendingLoan(loanData);
    setFacialModalOpen(true);
  };

  const handleFacialSuccess = () => {
    if (!pendingLoan) return;
    setLoading(true);

    const loanId = pendingLoan.id || `l_${Date.now()}`;
    const newLoan = {
      ...pendingLoan,
      id: loanId,
      status: "Pending", // Mark as Pending
      message: "Your bank will verify your loan details.",
      outstanding: pendingLoan.principal || 0,
      nextDue: pendingLoan.nextDue || "TBD",
    };

    setTimeout(() => {
      setLoans((prev) => [newLoan, ...prev]);
      toast.success("Loan application submitted! Status: Pending verification.");
      setForm({
        lender: "",
        principal: "",
        outstanding: "",
        rate: "",
        tenureMonths: "",
        nextDue: "",
      });
      setPendingLoan(null);
      setFacialModalOpen(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Loan Tracker</h2>

      {/* Facial Verification Modal */}
      {facialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl max-w-md w-11/12">
            <FacialMatch
              onSuccess={handleFacialSuccess}
              disabled={loading}
              onClose={() => setFacialModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Bank Loans */}
      <div className="p-4 border rounded-md bg-white">
        <div className="font-medium mb-3">Available Loans from Banks</div>
        <div className="space-y-2">
          {MOCK_BANK_LOANS.map((loan) => (
            <div
              key={loan.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                <div className="font-medium">{loan.bank}</div>
                <div className="text-sm text-slate-600">
                  NGN {loan.principal.toLocaleString()} • Rate: {(loan.rate * 100).toFixed(2)}% • Tenure: {loan.tenureMonths} months
                </div>
              </div>
              <Button
                onClick={() => handleApplyClick(loan)}
                disabled={facialModalOpen || loading}
              >
                {loading ? "Processing..." : "Apply"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Loan Form */}
      <div className="p-4 border rounded-md bg-white">
        <div className="font-medium mb-3">Add Loan (manual)</div>
        {["lender", "principal", "outstanding", "rate", "tenureMonths", "nextDue"].map((f) => (
          <div key={f} className="mb-2">
            <label className="block text-sm font-medium">
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
            <Input name={f} value={form[f]} onChange={onChange} />
          </div>
        ))}
        <Button
          onClick={() => handleApplyClick(form)}
          disabled={facialModalOpen || loading}
        >
          {loading ? "Adding..." : "Add Loan"}
        </Button>
      </div>

      {/* Loan List */}
      {loans.length > 0 ? (
        <div className="space-y-3">
          {loans.map((l) => (
            <LoanItem key={l.id} loan={l} />
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">No loans tracked yet.</div>
      )}
    </div>
  );
}
