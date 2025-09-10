import { mockAccounts, mockTransactions, mockLoans, mockSubscriptions, mockCards } from "../mock/mockData";

export const mockApi = {
  fetchAccounts: async () => {
    console.log("[mockApi] fetchAccounts");
    return new Promise((res) => setTimeout(() => res([...mockAccounts]), 300));
  },
  fetchTransactions: async () => {
    console.log("[mockApi] fetchTransactions");
    return new Promise((res) => setTimeout(() => res([...mockTransactions]), 300));
  },
  fetchSubscriptions: async () => {
    console.log("[mockApi] fetchSubscriptions");
    return new Promise((res) => setTimeout(() => res([...mockSubscriptions]), 300));
  },
  fetchLoans: async () => {
    console.log("[mockApi] fetchLoans");
    return new Promise((res) => setTimeout(() => res([...mockLoans]), 300));
  },
  fetchCards: async () => {
    console.log("[mockApi] fetchCards");
    return new Promise((res) => setTimeout(() => res([...mockCards]), 300));
  }
};
