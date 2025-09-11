const Account = require("../model/account.model");
const Budget = require("../model/budget.model");
const Transaction = require("../model/transaction.model");


const spendMoney = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount, category, description } = req.body;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const budgets = await Budget.find({ userId: account.userId });

    let remainingAmount = Number(amount);
    let allocations = [];

    // First, deduct from the selected category if it exists
    if (category) {
      const budget = budgets.find(b => b.category === category);
      if (budget) {
        const deduction = Math.min(budget.allocated, remainingAmount);
        budget.allocated -= deduction;
        remainingAmount -= deduction;
        await budget.save();
        allocations.push({ category: budget.category, deducted: deduction });
      }
    }

    // Then deduct from other budgets proportionally
    if (remainingAmount > 0 && budgets.length > 0) {
      for (const b of budgets) {
        if (b.category === category) continue; // already deducted
        const deduction = Math.min(b.allocated, remainingAmount);
        b.allocated -= deduction;
        remainingAmount -= deduction;
        await b.save();
        allocations.push({ category: b.category, deducted: deduction });
        if (remainingAmount <= 0) break;
      }
    }

    // Finally, deduct remaining from main balance
    if (remainingAmount > 0) {
      if (account.balance < remainingAmount) return res.status(400).json({ message: "Insufficient funds" });
      account.balance -= remainingAmount;
      await account.save();
      allocations.push({ category: "Main Balance", deducted: remainingAmount });
    }

    const tx = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: "debit",
      amount: amount,
      category: category || "General",
      description,
    });
    await tx.save();

    res.json({ success: true, allocations, balance: account.balance, transaction: tx });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = spendMoney