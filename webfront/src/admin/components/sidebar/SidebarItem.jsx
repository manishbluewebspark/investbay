import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarItem({ item, collapsed }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.name : undefined}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-xl transition-all duration-200 group
        ${collapsed ? "justify-center px-0 py-2.5 mx-auto w-10" : "px-3 py-2.5"}
        ${isActive
          ? "bg-green-600 text-white shadow-[0_2px_10px_rgba(22,163,74,0.25)]"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon */}
          <span className={`shrink-0 flex items-center justify-center rounded-lg transition-all duration-200
            ${collapsed ? "h-8 w-8" : "h-6 w-6"}
            ${isActive ? "bg-white/20" : "bg-transparent group-hover:bg-gray-100"}`}
          >
            {typeof Icon === "string" ? (
              <img
                src={Icon}
                alt={item.name}
                className={`object-contain transition-all
                  ${collapsed ? "h-4 w-4" : "h-3.5 w-3.5"}
                  ${isActive ? "brightness-0 invert" : "opacity-50 group-hover:opacity-70"}`}
              />
            ) : (
              <Icon
                className={`transition-all
                  ${collapsed ? "h-4 w-4" : "h-3.5 w-3.5"}
                  ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                strokeWidth={1.8}
              />
            )}
          </span>

          {/* Label */}
          {!collapsed && (
            <span
              className={`text-[13px] leading-none font-semibold transition-colors ${
                isActive ? "text-white" : "text-gray-600 group-hover:text-gray-800"
              }`}
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {item.name}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}