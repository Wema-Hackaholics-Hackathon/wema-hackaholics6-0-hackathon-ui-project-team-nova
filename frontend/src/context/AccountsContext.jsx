/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import { mockApi } from "../services/mockService";

export const AccountsContext = createContext();

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [acct, tx, subs, ln, cds] = await Promise.all([
          mockApi.fetchAccounts(),
          mockApi.fetchTransactions(),
          mockApi.fetchSubscriptions(),
          mockApi.fetchLoans(),
          mockApi.fetchCards()
        ]);
        setAccounts(acct);
        setTransactions(tx);
        setSubscriptions(subs);
        setLoans(ln);
        setCards(cds);
      } catch (err) {
        console.error("[AccountsProvider] error loading mocks", err);
      }
    }
    load();
  }, []);

  const addAccount = (a) => setAccounts(prev => [a, ...prev]);
  const removeAccount = (id) => setAccounts(prev => prev.filter(p => p.id !== id));

  return (
    <AccountsContext.Provider value={{
      accounts, transactions, subscriptions, loans, cards,
      addAccount, removeAccount, setTransactions, setSubscriptions, setLoans, setCards
    }}>
      {children}
    </AccountsContext.Provider>
  );
}

