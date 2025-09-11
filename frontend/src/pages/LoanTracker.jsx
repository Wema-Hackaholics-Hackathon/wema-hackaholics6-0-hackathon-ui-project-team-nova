import React, { useState } from "react";
import useAccounts from "../hooks/useAccounts";
import LoanItem from "../components/LoanItem";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import FacialMatch from "../components/FacialMatch";

const MOCK_BANK_LOANS = [
  { id: "b1", bank: "First Bank", principal: 100000, rate: 0.18, tenureMonths: 12 },
  { id: "b2", bank: "GTBank", principal: 200000, rate: 0.15, tenureMonths: 24 },
  { id: "b3", bank: "Access Bank", principal: 150000, rate: 0.2, tenureMonths: 18 },
];

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

  const [loadingLoanId, setLoadingLoanId] = useState(null);
  const [loadingManual, setLoadingManual] = useState(false);
  const [facialModalOpen, setFacialModalOpen] = useState(false);
  const [pendingLoan, setPendingLoan] = useState(null);
  const [facialLoading, setFacialLoading] = useState(false);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const isFormValid = (loanData) => {
    const required = ["lender", "principal", "rate", "tenureMonths"];
    for (const f of required) {
      if (!loanData[f]) {
        toast.error(`${f.charAt(0).toUpperCase() + f.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleApplyClick = (loanData, isBankLoan = false) => {
    if (creditScore < 600) {
      toast.error("Your credit score is too low. Improve your score to be eligible for a loan.");
      return;
    }
    if (!isBankLoan && !isFormValid(loanData)) return;
    setPendingLoan({ loanData, isBankLoan });
    setFacialModalOpen(true);
  };

  const handleFacialSuccess = () => {
    if (!pendingLoan) return;

    setFacialLoading(true);
    const { loanData, isBankLoan } = pendingLoan;
    const loanId = loanData.id || `l_${Date.now()}`;
    const newLoan = {
      id: loanId,
      lender: loanData.lender,
      principal: Number(loanData.principal),
      outstanding: Number(loanData.outstanding ?? loanData.principal),
      rate: Number(loanData.rate),
      tenureMonths: Number(loanData.tenureMonths),
      nextDue: loanData.nextDue || "",
      repaymentHistory: [],
    };

    if (isBankLoan) setLoadingLoanId(loanData.id);
    else setLoadingManual(true);

    setTimeout(() => {
      setLoans(prev => [newLoan, ...prev]);

      if (isBankLoan) {
        toast.success(`Loan from ${loanData.lender} added successfully!`);
        setLoadingLoanId(null);
      } else {
        toast.success(`Manual loan added successfully!`);
        setLoadingManual(false);
        setForm({
          lender: "",
          principal: "",
          outstanding: "",
          rate: "",
          tenureMonths: "",
          nextDue: "",
        });
      }

      setPendingLoan(null);
      setFacialModalOpen(false);
      setFacialLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Loan Tracker</h2>

      {/* Facial Verification Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          facialModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => !facialLoading && setFacialModalOpen(false)}
        />
        <div
          className={`bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg transform transition-transform duration-300 ${
            facialModalOpen ? "translate-y-0 scale-100" : "translate-y-10 scale-90"
          } relative`}
        >
          <button
            className="absolute top-3 right-3 text-slate-500 hover:text-slate-800"
            onClick={() => !facialLoading && setFacialModalOpen(false)}
          >
            ✖
          </button>
          <FacialMatch onSuccess={handleFacialSuccess} disabled={facialLoading} />
        </div>
      </div>

      {/* Bank Loans */}
      <div className="p-4 border rounded-md bg-white">
        <div className="font-medium mb-3">Available Loans from Banks</div>
        <div className="space-y-2">
          {MOCK_BANK_LOANS.map(loan => (
            <div key={loan.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium">{loan.bank}</div>
                <div className="text-sm text-slate-600">
                  NGN {loan.principal.toLocaleString()} • Rate: {loan.rate*100}% • Tenure: {loan.tenureMonths} months
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleApplyClick(loan, true)}
                disabled={loadingLoanId === loan.id || facialModalOpen}
              >
                {loadingLoanId === loan.id ? "Applying..." : "Apply For Loan"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Loan List */}
      <div>
        {loans.length > 0 ? (
          <div className="space-y-3">{loans.map(l => <LoanItem key={l.id} loan={l} />)}</div>
        ) : (
          <div className="text-sm text-slate-500">No loans tracked yet.</div>
        )}
      </div>

      {/* Manual Loan Form */}
      <div className="p-4 border rounded-md bg-white">
        <div className="font-medium mb-3">Add Loan (manual)</div>
        <div className="space-y-3">
          {["lender","principal","outstanding","rate","tenureMonths","nextDue"].map(f => (
            <div key={f}>
              <label className="block text-sm font-medium mb-1" htmlFor={f}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </label>
              <Input id={f} name={f} value={form[f]} onChange={onChange} />
            </div>
          ))}
          <div className="pt-2">
            <Button
              className="w-full md:w-auto"
              onClick={() => handleApplyClick(form, false)}
              disabled={loadingManual || facialModalOpen}
            >
              {loadingManual ? "Adding..." : "Add Loan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
