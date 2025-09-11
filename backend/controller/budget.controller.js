const Budget = require("../model/budget.model");


const createBudget = async (req, res) => {
  try {
    const { userId } = req.params;  // from URL
    const { category, percentage } = req.body;

    if (!category || typeof percentage !== "number" || percentage <= 0) {
      return res.status(400).json({ message: "Category and positive percentage are required" });
    }

    // Get total percentage of existing budgets
    const existingBudgets = await Budget.find({ userId });
    const totalPercentage = existingBudgets.reduce((sum, b) => sum + b.percentage, 0);

    if (totalPercentage + percentage > 100) {
      return res.status(400).json({ 
        message: `Cannot add budget. Total allocation would exceed 100%. Current total: ${totalPercentage}%`
      });
    }

    const budget = new Budget({ userId, category, percentage, allocated: 0 });
    await budget.save();
    res.json(budget);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getBudgets = async (req, res) => {
  try {
    const { userId } = req.params;
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createBudget, getBudgets
}