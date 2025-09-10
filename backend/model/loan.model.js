const { default: mongoose } = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: { type: String },
    amount: { type: Number, required: true },
    outstanding: { type: Number, required: true },
    dueDate: { type: Date, required: false },
  },
  { timestamps: true }
);
