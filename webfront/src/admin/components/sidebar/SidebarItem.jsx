import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarItem({ item, collapsed }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-3 py-2.5 rounded-full text-sm font-medium transition-colors
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? {
              background:
                "linear-gradient(to bottom right, #00BFA6 35%, #FDFEC5 100%)",
            }
          : {}
      }
    >

      {typeof Icon === "string" ? (
        <img
          src={Icon}
          alt={item.name}
          className={`shrink-0 h-5 w-5 object-contain ${
            collapsed ? "" : "mr-3"
          }`}
        />
      ) : (
        <Icon
          className={`shrink-0 h-5 w-5 ${
            collapsed ? "" : "mr-3"
          }`}
        />
      )}

      {!collapsed && <span>{item.name}</span>}
    </NavLink>
  );
}
