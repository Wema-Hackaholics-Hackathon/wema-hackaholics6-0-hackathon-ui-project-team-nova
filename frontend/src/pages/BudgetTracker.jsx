// /* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import useTransactions from "../hooks/useTransactions";
import useAccounts from "../hooks/useAccounts";
import { categorizeTransaction } from "../utils/categorizer";
import TransactionList from "../components/TransactionList";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

const COLORS = ["#60A5FA", "#FCA5A5", "#FCD34D", "#86EFAC", "#C7B2FF", "#FBCFE8"];
const DEFAULT_CATEGORIES = ["food", "transport", "entertainment", "utilities", "supplements"];

export default function BudgetTracker() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  const [budgetPercentages, setBudgetPercentages] = useState({
    food: 20,
    transport: 10,
    entertainment: 20,
    utilities: 15,
    supplements: 10,
  });
  const [budgetForm, setBudgetForm] = useState({ ...budgetPercentages });

  // keep a local transactions state for simulation
  const [localTx, setLocalTx] = useState(transactions);
  const prevTxRef = useRef([]);

  // sync localTx with real ones
  useEffect(() => {
    setLocalTx(transactions);
  }, [transactions]);

  const onBudgetChange = (category, value) => {
    const num = Number(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setBudgetForm((prev) => ({ ...prev, [category]: num }));
    }
  };

  const saveBudgets = () => {
    const total = Object.values(budgetForm).reduce((sum, v) => sum + v, 0);
    if (total > 100) {
      toast.error("Total allocation cannot exceed 100%");
      return;
    }
    setBudgetPercentages({ ...budgetForm });
    toast.success("Budget percentages saved!");
  };

  // 🔑 Auto-compute allocation in ₦ whenever balance or percentages change
  const budgets = useMemo(() => {
    const map = {};
    Object.keys(budgetPercentages).forEach((cat) => {
      map[cat] = Math.floor((budgetPercentages[cat] / 100) * totalBalance);
    });
    return map;
  }, [budgetPercentages, totalBalance]);

  // Categorize spending
  const categorized = useMemo(() => {
    const map = {};
    localTx.forEach((tx) => {
      const cat = categorizeTransaction(tx);
      map[cat] = map[cat] || 0;
      map[cat] += Math.abs(tx.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [localTx]);

  // Alerts for overspending
  const alerts = useMemo(() => {
    return categorized
      .filter((cat) => budgets[cat.name] && cat.value > budgets[cat.name])
      .map((cat) => ({
        category: cat.name,
        spent: cat.value,
        budget: budgets[cat.name],
      }));
  }, [categorized, budgets]);

  // 🔔 Detect new inflows (credits) and show toast
  useEffect(() => {
    if (prevTxRef.current.length > 0 && localTx.length > prevTxRef.current.length) {
      const newTxs = localTx.filter(
        (tx) => !prevTxRef.current.some((prev) => prev.id === tx.id)
      );
      newTxs.forEach((tx) => {
        if (tx.amount > 0) {
          toast.success(
            `₦${tx.amount.toLocaleString()} deposited — budgets re-allocated!`
          );
        }
      });
    }
    prevTxRef.current = localTx;
  }, [localTx]);

  const simulateDeposit = () => {
  const fakeDeposit = {
    id: `sim_${Date.now()}`,
    accountId: "acc_1",
    date: new Date().toISOString(), // keep full ISO
    description: "Simulated Deposit",
    amount: 50000,
    type: "credit",
  };
  // add to the front
  setLocalTx((prev) => [fakeDeposit, ...prev]);
};


  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Budget Tracker</h2>

      {/* Budget Form */}
      <div className="p-4 border rounded-md bg-white">
        <div className="font-medium mb-3">Set Your Budgets (Percentage)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEFAULT_CATEGORIES.map((cat) => (
            <div key={cat}>
              <label className="block text-sm font-medium mb-1 capitalize">{cat}</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={budgetForm[cat]}
                onChange={(e) => onBudgetChange(cat, e.target.value)}
              />
            </div>
          ))}
        </div>
        <Button className="mt-3" onClick={saveBudgets}>
          Save Budget
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions & Balance */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="text-sm text-slate-500">Linked Balance</div>
            <div className="text-lg font-medium">{totalBalance.toLocaleString()} NGN</div>
          </div>

          <div className="bg-white p-4 rounded-md border">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Recent Transactions</div>
              {/* 🟢 Demo button */}
              <Button size="sm" onClick={simulateDeposit}>
                Simulate ₦50,000 Deposit
              </Button>
            </div>
            {localTx.length > 0 ? (
              <TransactionList transactions={localTx} />
            ) : (
              <div className="text-sm text-slate-500">No transactions yet.</div>
            )}
          </div>
        </div>

        {/* Chart, progress bars & alerts */}
        <div className="bg-white p-4 rounded-md border space-y-4">
          <div className="font-semibold mb-2">Spending by Category</div>
          {categorized.length > 0 ? (
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={categorized}
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    labelLine={false}
                    label={renderLabel}
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {categorized.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-slate-500 mt-4">No spending data yet.</div>
          )}

          {/* Progress Bars */}
          <div>
            {DEFAULT_CATEGORIES.map((cat) => {
              const spent = categorized.find((c) => c.name === cat)?.value || 0;
              const budget = budgets[cat] || 0;
              const percent = budget ? Math.min((spent / budget) * 100, 100) : 0;
              return (
                <div key={cat} className="mb-3 group relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{cat}</span>
                    <span>
                      {spent.toLocaleString()} / {budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded overflow-hidden relative">
                    <div
                      className={`h-3 rounded transition-all duration-500 ${
                        spent > budget ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                      {percent.toFixed(1)}% of budget used
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alerts */}
          <div className="mt-2">
            <div className="font-semibold">Alerts</div>
            {alerts.length === 0 ? (
              <div className="text-sm text-slate-500">No budget alerts</div>
            ) : (
              alerts.map((a) => (
                <div key={a.category} className="mt-2 text-sm text-red-600">
                  {a.category} exceeded: spent {a.spent.toLocaleString()} of{" "}
                  {a.budget.toLocaleString()}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
