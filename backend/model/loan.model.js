const { default: mongoose } = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true, // if every loan must belong to an account
    },
    provider: { type: String },
    amount: { type: Number, required: true },
    outstanding: { type: Number, required: true },
    dueDate: { type: Date, required: false },
  },
  { timestamps: true }
);

const Loan = mongoose.model("loan", loanSchema)
module.exports = Loan