import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AccountsProvider } from "./context/AccountsContext";
import DashboardLayout from "./components/layout/DashboardLayout";

import Signup from "./components/auth/Signup";
import Onboarding from "./components/Onboarding";
import UnifiedAccounts from "./pages/UnifiedAccounts";
import BudgetTracker from "./pages/BudgetTracker";
import CardSubscriptions from "./pages/CardSubscriptions";
import CreditHealth from "./pages/CreditHealth";
import LoanTracker from "./pages/LoanTracker";
import CreditCardAccess from "./pages/CreditCardAccess";

// Compliance pages
import FacialRecognition from "./components/FacialMatch";
import ConsentDashboard from "./components/ConsentDashboard";
import AuditLog from "./components/AuditLog";

// 404 component
function NotFound() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">404 - Page Not Found</h2>
      <p className="text-slate-600 mb-4">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ user, onboarded, children }) {
  if (!user) return <Navigate to="/signup" />;
  if (!onboarded) return <Navigate to="/onboarding" />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [onboarded, setOnboarded] = useState(false);

  return (
    <AccountsProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            !user ? (
              <Signup
                onSuccess={(u, navigate) => {
                  setUser(u);
                  navigate("/onboarding");
                }}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            user && !onboarded ? (
              <Onboarding onFinish={() => setOnboarded(true)} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Dashboard Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} onboarded={onboarded}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes inside Outlet */}
          <Route index element={<UnifiedAccounts />} />
          <Route path="budget" element={<BudgetTracker />} />
          <Route path="subscriptions" element={<CardSubscriptions />} />
          <Route path="credit-health" element={<CreditHealth />} />
          <Route path="loans" element={<LoanTracker />} />
          <Route path="cards" element={<CreditCardAccess />} />

          {/* Compliance routes */}
          <Route path="facial-verification" element={<FacialRecognition />} />
          <Route path="consent" element={<ConsentDashboard />} />
          <Route path="audit-log" element={<AuditLog />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AccountsProvider>
  );
}
