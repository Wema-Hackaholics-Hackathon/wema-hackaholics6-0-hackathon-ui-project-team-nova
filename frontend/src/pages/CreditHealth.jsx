/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";
import { ArrowUp, ArrowDown, Info } from "lucide-react";

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"]; // Poor → Excellent

export default function CreditScoreCard({ params = {} }) {
  const {
    surplus = 0,
    outstandingDebt = 0,
    monthlyIncome = 1,
    monthlyExpenses = 0,
    avgBalance = 0,
    repaymentHistory = 1,
    numSubscriptions = 0,
  } = params;

  const computeScore = () => {
    let score = 600; // baseline

    // Surplus effect
    score += surplus > 0 ? Math.min(50, surplus / 1000) : -Math.min(50, Math.abs(surplus) / 1000);

    // Debt effect
    if (outstandingDebt > monthlyIncome * 3) score -= 100;
    else if (outstandingDebt > 0) score -= 40;

    // Repayment history effect
    score += (repaymentHistory - 0.5) * 200; 

    // Balance effect
    score += Math.min(80, avgBalance / 2000);

    // Subscriptions penalty
    if (numSubscriptions > 5) score -= (numSubscriptions - 5) * 5;

    return Math.max(300, Math.min(850, Math.round(score)));
  };

  const [score, setScore] = useState(computeScore());
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    const newScore = computeScore();
    let start = displayScore;
    let end = newScore;
    let step = (end - start) / 30;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      setDisplayScore(Math.round(start + step * frame));
      if (frame >= 30) clearInterval(interval);
    }, 20);

    setScore(newScore);
  }, [params]);

  const scoreLabel =
    score < 580 ? "Poor" : score < 670 ? "Fair" : score < 740 ? "Good" : "Excellent";

  const data = [
    { name: "Poor", value: 280 },
    { name: "Fair", value: 180 },
    { name: "Good", value: 200 },
    { name: "Excellent", value: 190 },
  ];

  const angle = ((displayScore - 300) / (850 - 300)) * 360;

  const insights = [];
  if (surplus < 0) insights.push("📉 Expenses exceed income. Consider budgeting carefully.");
  else if (surplus > monthlyIncome * 0.3) insights.push("💰 Great! You’re saving a healthy portion of your income.");
  if (outstandingDebt > monthlyIncome * 2) insights.push("⚠️ Debt is high relative to income. Focus on repayment.");
  else if (outstandingDebt === 0) insights.push("✅ Debt-free! This boosts your credit health.");
  if (repaymentHistory < 0.8) insights.push("⏰ Missed repayments detected. Aim to pay on time to improve your score.");
  else insights.push("🏆 Strong repayment history. Keep it up!");
  if (numSubscriptions > 5) insights.push("📝 Many active subscriptions. Cancel unused ones to free funds.");
  if (avgBalance < monthlyExpenses * 0.5) insights.push("💡 Low balances relative to expenses. Build a buffer.");

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center space-y-5 w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <Info size={18} /> Credit Health Score
      </h3>

      {/* Gauge */}
      <div className="relative flex items-center justify-center">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={-180}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>

        <motion.div
          className="absolute w-1 h-20 bg-slate-700 origin-bottom rounded"
          style={{ bottom: "50%", transformOrigin: "bottom center" }}
          animate={{ rotate: angle - 180 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        />

        <div className="absolute text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayScore}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold"
            >
              {displayScore}
            </motion.div>
          </AnimatePresence>
          <div className="text-sm text-slate-500">{scoreLabel}</div>
        </div>
      </div>

      {/* Trends */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp size={14} /> Income: ₦{monthlyIncome.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown size={14} /> Expenses: ₦{monthlyExpenses.toLocaleString()}
        </div>
      </div>

      {/* Insights */}
      <div className="w-full mt-3">
        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
          <Info size={14} /> Insights
        </h4>
        <ul className="space-y-1 text-xs text-slate-600">
          {insights.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
