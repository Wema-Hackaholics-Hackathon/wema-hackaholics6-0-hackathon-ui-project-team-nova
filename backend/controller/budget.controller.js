const Budget = require("../model/budget.model");
const createBudget = async (req, res) => {
  try {
    const { userId } = req.params;  // 👈 from URL
    const { category, percentage } = req.body;
    const budget = new Budget({ userId, category, percentage });
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