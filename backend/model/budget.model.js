const { default: mongoose } = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    percentage: { type: Number, required: true },
    allocated: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const Budget = mongoose.model("budget", budgetSchema)
module.exports = Budget