import React, { useMemo } from "react";
import useTransactions from "../hooks/useTransactions";
import useAccounts from "../hooks/useAccounts";
import { categorizeTransaction } from "../utils/categorizer";
import TransactionList from "../components/TransactionList";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#60A5FA", "#FCA5A5", "#FCD34D", "#86EFAC", "#C7B2FF", "#FBCFE8"];

export default function BudgetTracker() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();

  // Categorize transactions
  const categorized = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const cat = categorizeTransaction(tx);
      map[cat] = map[cat] || 0;
      map[cat] += Math.abs(tx.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Mock budgets (in real app: user-defined)
  const budgets = {
    food: 10000,
    transport: 5000,
    entertainment: 30000,
    utilities: 6000,
    supplements: 8000,
    
  };

  // Alerts if overspending
  const alerts = [];
  categorized.forEach((cat) => {
    if (budgets[cat.name] && cat.value > budgets[cat.name]) {
      alerts.push({
        category: cat.name,
        spent: cat.value,
        budget: budgets[cat.name],
      });
    }
  });

  // Custom label to show percentages
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Budget Tracker</h2>

      {/* Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions & balance */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="text-sm text-slate-500">Linked Balance</div>
            <div className="text-lg font-medium">
              {accounts
                .reduce((s, a) => s + (a.balance || 0), 0)
                .toLocaleString()}{" "}
              NGN
            </div>
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

        {/* Chart & alerts */}
        <div className="bg-white p-4 rounded-md border">
          <div className="mb-2 font-semibold">Spending by Category</div>

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
            <div className="text-sm text-slate-500 mt-4">
              No spending data yet.
            </div>
          )}

          <div className="mt-4">
            <div className="font-semibold">Alerts</div>
            {alerts.length === 0 ? (
              <div className="text-sm text-slate-500">No budget alerts</div>
            ) : (
              alerts.map((a) => (
                <div key={a.category} className="mt-2 text-sm text-red-600">
                  {a.category} exceeded: spent{" "}
                  {a.spent.toLocaleString()} of {a.budget.toLocaleString()}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
