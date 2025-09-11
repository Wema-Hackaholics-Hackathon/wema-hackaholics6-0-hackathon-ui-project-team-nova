import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Wallet,
  CreditCard,
  BarChart3,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
  UserCheck,
  FileText,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const baseClasses =
    "flex items-center gap-2 rounded px-3 py-2 transition-colors";
  const inactiveClasses =
    "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50";
  const activeClasses = "font-bold bg-indigo-100 text-indigo-700";

  const links = [
    { to: "", label: "Accounts", icon: <Home className="w-5 h-5" /> },
    { to: "budget", label: "Budget", icon: <BarChart3 className="w-5 h-5" /> },
    { to: "subscriptions", label: "Subscriptions", icon: <ClipboardList className="w-5 h-5" /> },
    { to: "credit-health", label: "Credit Health", icon: <TrendingUp className="w-5 h-5" /> },
    { to: "loans", label: "Loans", icon: <Wallet className="w-5 h-5" /> },
    { to: "cards", label: "Credit Cards", icon: <CreditCard className="w-5 h-5" /> },
  ];

  const complianceLinks = [
    { to: "facial-verification", label: "Facial Match", icon: <UserCheck className="w-5 h-5" /> },
    { to: "consent", label: "Consent Dashboard", icon: <ShieldCheck className="w-5 h-5" /> },
    { to: "audit-log", label: "Audit Log", icon: <FileText className="w-5 h-5" /> },
  ];

  const isActiveLink = (to) => {
    const current = location.pathname.replace("/dashboard/", "");
    return to === "" ? current === "" : current.startsWith(to);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r shadow-md transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">ALAT Companion</h2>
        <button className="md:hidden p-2" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={`${baseClasses} ${isActiveLink(link.to) ? activeClasses : inactiveClasses}`}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        {/* Compliance Section */}
        <div className="pt-4 mt-4 border-t">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Compliance
          </p>
          {complianceLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`${baseClasses} ${isActiveLink(link.to) ? activeClasses : inactiveClasses}`}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
