const Account = require("../model/account.model");
const Budget = require("../model/budget.model");
const Transaction = require("../model/transaction.model");

const getAccounts = async (req, res) => {
  try {
    const { userId } = req.query;
    const accounts = await Account.find({ userId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;
    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += Number(amount);
    await account.save();

    const tx = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: "credit",
      amount: Number(amount),
      description,
    });
    await tx.save();

    const budgets = await Budget.find({ userId: account.userId });

    let distributions = [];
    if (budgets.length > 0) {
      // distribute money according to percentages
      for (const budget of budgets) {
        const allocation = (numericAmount * budget.percentage) / 100;
        budget.allocated += allocation;
        await budget.save();

        distributions.push({
          category: budget.category,
          percentage: budget.percentage,
          allocated: allocation,
          totalAllocated: budget.allocated,
        });
      }
    }

    res.json({
      success: true,
      balance: account.balance,
      transaction: tx,
      distributions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAccounts,
  addMoney,
};
