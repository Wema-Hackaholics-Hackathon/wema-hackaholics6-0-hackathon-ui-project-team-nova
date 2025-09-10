import { useContext } from "react";
import { AccountsContext } from "../context/AccountsContext";

export default function useAccounts() {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
}
