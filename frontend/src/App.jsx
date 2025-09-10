import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UnifiedAccounts from "./pages/UnifiedAccounts";
import BudgetTracker from "./pages/BudgetTracker";
import CardSubscriptions from "./pages/CardSubscriptions";
import CreditHealth from "./pages/CreditHealth";
import LoanTracker from "./pages/LoanTracker";
import CreditCardAccess from "./pages/CreditCardAccess";
import { AccountsProvider } from "./context/AccountsContext";
import DashboardLayout from "./components/layout/DashboardLayout";

// A simple 404 component
function NotFound() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">
        404 - Page Not Found
      </h2>
      <p className="text-slate-600 mb-4">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AccountsProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<UnifiedAccounts />} />
          <Route path="/budget" element={<BudgetTracker />} />
          <Route path="/subscriptions" element={<CardSubscriptions />} />
          <Route path="/credit-health" element={<CreditHealth />} />
          <Route path="/loans" element={<LoanTracker />} />
          <Route path="/cards" element={<CreditCardAccess />} />
          {/* Catch-all route for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </AccountsProvider>
  );
}
