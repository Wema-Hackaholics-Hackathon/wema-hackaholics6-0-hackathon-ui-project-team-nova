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
  },
  { timestamps: true }
);
