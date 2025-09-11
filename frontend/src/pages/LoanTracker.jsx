import React, { useState } from "react";
import useAccounts from "../hooks/useAccounts";
import LoanItem from "../components/LoanItem";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const MOCK_BANK_LOANS = [
  { id: "b1", bank: "First Bank", principal: 100000, rate: 0.18, tenureMonths: 12 },
  { id: "b2", bank: "GTBank", principal: 200000, rate: 0.15, tenureMonths: 24 },
  { id: "b3", bank: "Access Bank", principal: 150000, rate: 0.2, tenureMonths: 18 },
];

export default function LoanTracker() {
  const { loans, setLoans } = useAccounts();
  const [form, setForm] = useState({
    lender: "",
    principal: "",
    outstanding: "",
    rate: "",
    tenureMonths: "",
    nextDue: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addLoan = (loanData) => {
    const newLoan = {
      id: `l_${Date.now()}`,
      lender: loanData.lender,
      principal: Number(loanData.principal),
      outstanding: Number(loanData.outstanding ?? loanData.principal),
      rate: Number(loanData.rate),
      tenureMonths: Number(loanData.tenureMonths),
      nextDue: loanData.nextDue || "",
      repaymentHistory: [],
    };
    setLoans((prev) => [newLoan, ...prev]);
    // reset form if manual add
    if (!loanData.id) {
      setForm({
        lender: "",
        principal: "",
        outstanding: "",
        rate: "",
        tenureMonths: "",
        nextDue: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Loan Tracker</h2>

      {/* Available bank loans */}
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
                  NGN {loan.principal.toLocaleString()} • Rate: {loan.rate * 100}% • Tenure: {loan.tenureMonths} months
                </div>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  addLoan({
                    lender: loan.bank,
                    principal: loan.principal,
                    rate: loan.rate,
                    tenureMonths: loan.tenureMonths,
                  })
                }
              >
                Apply For Loan
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Loan list */}
      <div>
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

      {/* Add loan form */}
      <div className="p-4 border rounded-md bg-white">
        <div className="font-medium mb-3">Add Loan (manual)</div>
        <div className="space-y-3">
          {[
            { label: "Lender", name: "lender" },
            { label: "Principal (NGN)", name: "principal" },
            { label: "Outstanding (NGN)", name: "outstanding" },
            { label: "Rate (decimal, e.g., 0.18)", name: "rate" },
            { label: "Tenure months", name: "tenureMonths" },
            { label: "Next due", name: "nextDue" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1" htmlFor={field.name}>
                {field.label}
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={form[field.name]}
                onChange={onChange}
              />
            </div>
          ))}
          <div className="pt-2">
            <Button className="w-full md:w-auto" onClick={() => addLoan(form)}>
              Add Loan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
