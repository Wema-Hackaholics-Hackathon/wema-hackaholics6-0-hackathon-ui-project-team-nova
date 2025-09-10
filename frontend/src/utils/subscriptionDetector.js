// naive recurring detection based on description similarity, amount equality and periodicity
import { differenceInDays, parseISO } from "date-fns";

export function detectRecurring(transactions = [], minOccurrences = 2) {
  const groups = {};
  transactions.forEach(tx => {
    const key = `${tx.description?.toLowerCase()?.replace(/\s+/g, " ").trim()}|${Math.abs(tx.amount)}`;
    groups[key] = groups[key] || [];
    groups[key].push(tx);
  });

  const recurring = [];
  for (const [key, txs] of Object.entries(groups)) {
    if (txs.length >= minOccurrences) {
      // check for roughly monthly periodicity (25-35 days) or weekly (6-9)
      const sorted = txs.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      const diffs = [];
      for (let i = 1; i < sorted.length; i++) {
        const d = differenceInDays(parseISO(sorted[i].date), parseISO(sorted[i - 1].date));
        diffs.push(d);
      }
      const avgDiff = diffs.reduce((s, v) => s + v, 0) / Math.max(1, diffs.length);
      const period = avgDiff > 20 ? "monthly" : (avgDiff > 3 ? "weekly" : "irregular");
      recurring.push({
        id: key,
        description: txs[0].description,
        amount: txs[0].amount,
        occurrences: txs.length,
        avgDays: avgDiff,
        period
      });
    }
  }

  return recurring;
}
