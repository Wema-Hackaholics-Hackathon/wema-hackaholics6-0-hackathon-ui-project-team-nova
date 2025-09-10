import { useContext } from "react";
import { AccountsContext } from "../context/AccountsContext";

export default function useTransactions() {
  const { transactions, setTransactions } = useContext(AccountsContext);
  return { transactions, setTransactions };
}
