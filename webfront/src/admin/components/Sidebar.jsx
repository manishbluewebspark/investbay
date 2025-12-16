import React from "react";
import SidebarLinks from "./sidebar/SidebarLinks";
import SidebarItem from "./sidebar/SidebarItem";

export default function Sidebar({ collapsed, toggle }) {
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-gray-100 bg-white transition-all duration-300 
      ${collapsed ? "w-18" : "w-64"} flex flex-col z-40`}
    >
      {/* Header Section */}
      <div className="h-16 flex items-center justify-between px-4 shrink-0">
        <div className={`${collapsed ? "hidden" : "block"} font-semibold`}>
        </div>
        <button
          onClick={toggle}
          className="h-8 w-8 rounded hover:bg-gray-100 flex items-center justify-center bg-gray-200"
          title="Toggle Sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Scrollable Nav Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <nav className="space-y-1">
          {SidebarLinks.map((item) => (
            <SidebarItem key={item.name} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
