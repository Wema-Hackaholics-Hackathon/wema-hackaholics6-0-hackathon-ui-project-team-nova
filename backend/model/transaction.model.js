const { default: mongoose } = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    category: {type: String, required: true},
    description: { type: String, default: "" },
    date: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);


const Transaction = mongoose.model("transaction", transactionSchema)
module.exports = Transaction