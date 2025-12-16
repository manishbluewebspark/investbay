import React, { useState } from 'react';
import Topbar from "../../admin/components/Topbar.jsx"
import Sidebar from "../../admin/components/Sidebar.jsx"

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Topbar />

      {/* Sidebar + Content */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} toggle={() => setCollapsed(v => !v)} />

        {/* Main Content Area */}
        <main
          className={`transition-all duration-300 flex-1 overflow-auto p-4 ${
            collapsed ? 'ml-18' : 'ml-64'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
