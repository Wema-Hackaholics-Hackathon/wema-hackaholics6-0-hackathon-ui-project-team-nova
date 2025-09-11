const Account = require("../model/account.model");
const Budget = require("../model/budget.model");
const Transaction = require("../model/transaction.model");



const addMoney = async (req, res) => {
  try {
    const { id } = req.params; // account ID
    const { amount, description } = req.body;

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // increase account balance
    account.balance += numericAmount;
    await account.save();

    const budgets = await Budget.find({ userId: account.userId });

    let distributions = [];

    if (budgets.length > 0) {
      for (const budget of budgets) {
        try {
          // calculate how much to allocate for this budget
          const allocation = (numericAmount * budget.percentage) / 100;

          // update budget allocated amount
          budget.allocated += allocation;
          await budget.save();

          // create transaction under this category
          const tx = new Transaction({
            userId: account.userId,
            accountId: account._id,
            type: "credit",
            amount: allocation,
            category: budget.category, // tie transaction to budget category
            description: `${description} - ${budget.category}`,
          });
          await tx.save();

          distributions.push({
            category: budget.category,
            percentage: budget.percentage,
            allocated: allocation,
            totalAllocated: budget.allocated,
          });
        } catch (err) {
          console.error(`Budget allocation failed for ${budget.category}:`, err.message);
        }
      }
    } else {
      // no budgets set → just record a single credit transaction
      const tx = new Transaction({
        userId: account.userId,
        accountId: account._id,
        type: "credit",
        amount: numericAmount,
        description,
        category: "Uncategorized",
      });
      await tx.save();

      distributions.push({
        category: "Uncategorized",
        percentage: 100,
        allocated: numericAmount,
        totalAllocated: numericAmount,
      });
    }

    res.json({
      success: true,
      balance: account.balance,
      distributions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addMoney,
};
