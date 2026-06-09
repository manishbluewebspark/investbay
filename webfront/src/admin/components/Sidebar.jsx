import React, { useState } from "react";
import SidebarLinks from "./sidebar/SidebarLinks";
import SidebarItem from "./sidebar/SidebarItem";

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const user     = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const accessibleLinks = SidebarLinks.filter((link) =>
    link.roles.includes(userRole)
  );

  const collapsed = !hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed top-[58px] left-0 h-[calc(100vh-58px)] z-40 flex flex-col
        bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[60px]" : "w-[220px]"}
      `}
      style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.03)" }}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-4" style={{ scrollbarWidth: "none" }}>
        <nav className="flex flex-col gap-0.5">
          {accessibleLinks.map((item) => (
            <SidebarItem key={item.name} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>
    </aside>
  );
}