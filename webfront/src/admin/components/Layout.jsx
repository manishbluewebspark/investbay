import React from "react";
import Topbar from "../../admin/components/Topbar.jsx";
import Sidebar from "../../admin/components/Sidebar.jsx";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
      <Topbar />

      <div className="pt-[58px] flex">
        <Sidebar />

        <main className="ml-[60px] flex-1 min-h-[calc(100vh-58px)] p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}