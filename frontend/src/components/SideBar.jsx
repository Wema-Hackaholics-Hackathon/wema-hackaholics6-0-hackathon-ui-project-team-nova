import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r shadow-md transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">CampusCart Finance</h2>
        <button
          className="md:hidden p-2"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-3">
        <Link to="/" className="block text-slate-700 hover:text-indigo-600">
          Accounts
        </Link>
        <Link
          to="/budget"
          className="block text-slate-700 hover:text-indigo-600"
        >
          Budget
        </Link>
        <Link
          to="/subscriptions"
          className="block text-slate-700 hover:text-indigo-600"
        >
          Subscriptions
        </Link>
        <Link
          to="/credit-health"
          className="block text-slate-700 hover:text-indigo-600"
        >
          Credit Health
        </Link>
        <Link
          to="/loans"
          className="block text-slate-700 hover:text-indigo-600"
        >
          Loans
        </Link>
        <Link
          to="/cards"
          className="block text-slate-700 hover:text-indigo-600"
        >
          Credit Cards
        </Link>
      </nav>
    </aside>
  );
}
