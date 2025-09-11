// /* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
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
    toast.success("Budget saved successfully!");
  };

  const budgets = useMemo(() => {
    const map = {};
    Object.keys(budgetPercentages).forEach((cat) => {
      map[cat] = Math.floor((budgetPercentages[cat] / 100) * totalBalance);
    });
    return map;
  }, [budgetPercentages, totalBalance]);

  const categorized = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const cat = categorizeTransaction(tx);
      map[cat] = map[cat] || 0;
      map[cat] += Math.abs(tx.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const alerts = useMemo(() => {
    const list = [];
    categorized.forEach((cat) => {
      if (budgets[cat.name] && cat.value > budgets[cat.name]) {
        list.push({
          category: cat.name,
          spent: cat.value,
          budget: budgets[cat.name],
        });
      }
    });
    return list;
  }, [categorized, budgets]);

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
            <div className="mb-2 font-semibold">Recent Transactions</div>
            {transactions.length > 0 ? (
              <TransactionList transactions={transactions} />
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

          {/* Progress Bars with tooltips */}
          <div>
            {DEFAULT_CATEGORIES.map((cat) => {
              const spent = categorized.find((c) => c.name === cat)?.value || 0;
              const budget = budgets[cat] || 0;
              const percent = budget ? Math.min((spent / budget) * 100, 100) : 0;
              return (
                <div key={cat} className="mb-3 group relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{cat}</span>
                    <span>{spent.toLocaleString()} / {budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded overflow-hidden relative">
                    <div
                      className={`h-3 rounded transition-all duration-500 ${spent > budget ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${percent}%` }}
                    />
                    {/* Tooltip */}
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
                  {a.category} exceeded: spent {a.spent.toLocaleString()} of {a.budget.toLocaleString()}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
