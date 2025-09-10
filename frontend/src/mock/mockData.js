export const mockAccounts = [
  {
    id: "acc_1",
    provider: "GTBank",
    accountNumber: "0123456789",
    name: "Personal Current",
    balance: 25000.0,
    currency: "NGN"
  },
  {
    id: "acc_2",
    provider: "UBA",
    accountNumber: "0987654321",
    name: "Savings",
    balance: 120000.5,
    currency: "NGN"
  }
];

export const mockTransactions = [
  { id: "t1", accountId: "acc_1", date: "2025-09-05", description: "Kuda Food Mart", amount: -3500, type: "debit" },
  { id: "t2", accountId: "acc_1", date: "2025-09-03", description: "Office Salary", amount: +150000, type: "credit" },
  { id: "t3", accountId: "acc_2", date: "2025-09-02", description: "Netflix Sub", amount: -1200, type: "debit" },
  { id: "t4", accountId: "acc_2", date: "2025-08-30", description: "Flutterwave Subscription", amount: -3000, type: "debit" },
  { id: "t5", accountId: "acc_1", date: "2025-08-28", description: "MTN Data", amount: -1200, type: "debit" },
  // { id: "t6", accountId: "acc_2", date: "2025-07-03", description: "Spotify", amount: -600, type: "debit" },
  { id: "t6", accountId: "acc_1", date: "2025-06-25", description: "Entertainment", amount: -15000, type: "debit" }
  
];

export const mockSubscriptions = [
  { id: "s1", accountId: "acc_2", vendor: "Netflix", amount: 1200, period: "monthly", nextPayment: "2025-10-03" },
  { id: "s2", accountId: "acc_2", vendor: "Spotify", amount: 1600, period: "monthly", nextPayment: "2025-09-30" }
];

export const mockLoans = [
  { id: "l1", lender: "RenMoney", principal: 200000, outstanding: 150000, rate: 0.18, tenureMonths: 12, nextDue: "2025-09-15", repaymentHistory: [true, true, true, false, true] }
];

export const mockCards = [
  { id: "c1", issuer: "Wema", cardNumberMasked: "5399 **** **** 1234", availableCredit: 300000, balance: 50000 }
];
