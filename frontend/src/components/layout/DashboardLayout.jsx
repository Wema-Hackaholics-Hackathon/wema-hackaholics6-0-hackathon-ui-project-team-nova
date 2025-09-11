import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../SideBar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top bar (mobile only) */}
        <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm md:hidden">
          <h1 className="text-lg font-bold">ALAT Companion</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
