import React, { useState } from "react";
import useAccounts from "../hooks/useAccounts";
import LoanItem from "../components/LoanItem";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

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

  const addLoan = () => {
    const newLoan = {
      id: `l_${Date.now()}`,
      lender: form.lender,
      principal: Number(form.principal),
      outstanding: Number(form.outstanding),
      rate: Number(form.rate),
      tenureMonths: Number(form.tenureMonths),
      nextDue: form.nextDue,
      repaymentHistory: [],
    };
    setLoans((prev) => [newLoan, ...prev]);
    setForm({
      lender: "",
      principal: "",
      outstanding: "",
      rate: "",
      tenureMonths: "",
      nextDue: "",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Loan Tracker</h2>

      <div className="grid gap-6 md:grid-cols-2">
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
        <div>
          <div className="p-4 border rounded-md bg-white">
            <div className="font-medium mb-3">Add Loan (manual)</div>
            <div className="space-y-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="lender"
                >
                  Lender
                </label>
                <Input
                  id="lender"
                  name="lender"
                  value={form.lender}
                  onChange={onChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="principal"
                >
                  Principal (NGN)
                </label>
                <Input
                  id="principal"
                  name="principal"
                  value={form.principal}
                  onChange={onChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="outstanding"
                >
                  Outstanding (NGN)
                </label>
                <Input
                  id="outstanding"
                  name="outstanding"
                  value={form.outstanding}
                  onChange={onChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="rate"
                >
                  Rate (decimal, e.g., 0.18)
                </label>
                <Input
                  id="rate"
                  name="rate"
                  value={form.rate}
                  onChange={onChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="tenureMonths"
                >
                  Tenure months
                </label>
                <Input
                  id="tenureMonths"
                  name="tenureMonths"
                  value={form.tenureMonths}
                  onChange={onChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="nextDue"
                >
                  Next due
                </label>
                <Input
                  id="nextDue"
                  name="nextDue"
                  value={form.nextDue}
                  onChange={onChange}
                />
              </div>

              <div className="pt-2">
                <Button className="w-full md:w-auto" onClick={addLoan}>
                  Add Loan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
