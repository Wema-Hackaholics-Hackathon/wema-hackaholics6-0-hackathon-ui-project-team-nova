export const mockAccounts = [
  {
    id: "acc_1",
    provider: "GTBank",
    accountNumber: "0123456789",
    name: "Personal Current",
    balance: 25000.0,
    currency: "NGN",
  },
  {
    id: "acc_2",
    provider: "UBA",
    accountNumber: "0987654321",
    name: "Savings",
    balance: 120000.5,
    currency: "NGN",
  },
  {
    id: "acc_3",
    provider: "Access Bank",
    accountNumber: "2233445566",
    name: "Business Account",
    balance: 450000.75,
    currency: "NGN",
  },
];

export const mockTransactions = [
  { id: "t1", accountId: "acc_1", date: "2025-09-05", description: "Kuda Food Mart", amount: -3500, type: "debit" },
  { id: "t2", accountId: "acc_1", date: "2025-09-03", description: "Office Salary", amount: +150000, type: "credit" },
  { id: "t3", accountId: "acc_2", date: "2025-09-02", description: "Netflix Sub", amount: -1200, type: "debit" },
  { id: "t4", accountId: "acc_2", date: "2025-08-30", description: "Flutterwave Subscription", amount: -3000, type: "debit" },
  { id: "t5", accountId: "acc_1", date: "2025-08-28", description: "MTN Data", amount: -1200, type: "debit" },
  { id: "t6", accountId: "acc_1", date: "2025-06-25", description: "Entertainment", amount: -15000, type: "debit" },
  { id: "t7", accountId: "acc_3", date: "2025-09-07", description: "POS Purchase - Lagos", amount: -65000, type: "debit" },
  { id: "t8", accountId: "acc_3", date: "2025-09-01", description: "Client Transfer", amount: +300000, type: "credit" },
];

export const mockSubscriptions = [
  { id: "s1", accountId: "acc_2", vendor: "Netflix", amount: 1200, period: "monthly", nextPayment: "2025-10-03" },
  { id: "s2", accountId: "acc_2", vendor: "Spotify", amount: 1600, period: "monthly", nextPayment: "2025-09-30" },
  { id: "s3", accountId: "acc_3", vendor: "AWS", amount: 25000, period: "monthly", nextPayment: "2025-10-01" },
];

export const mockLoans = [
  {
    id: "l1",
    lender: "RenMoney",
    principal: 200000,
    outstanding: 150000,
    rate: 0.18,
    tenureMonths: 12,
    nextDue: "2025-09-15",
    repaymentHistory: [true, true, true, false, true],
  },
  {
    id: "l2",
    lender: "Carbon",
    principal: 50000,
    outstanding: 20000,
    rate: 0.25,
    tenureMonths: 6,
    nextDue: "2025-09-20",
    repaymentHistory: [true, true, true, true],
  },
];

export const mockCards = [
  { id: "c1", issuer: "Wema", cardNumberMasked: "5399 **** **** 1234", availableCredit: 300000, balance: 50000 },
  { id: "c2", issuer: "Access Bank", cardNumberMasked: "4111 **** **** 9876", availableCredit: 150000, balance: 25000 },
];
