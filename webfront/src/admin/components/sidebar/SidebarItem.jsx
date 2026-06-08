import { NavLink } from "react-router-dom";

export default function SidebarItem({ item, collapsed }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.name : undefined}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-[12px] transition-all duration-200
        ${collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2"}
        ${
          isActive
            ? "text-white shadow-[0_4px_14px_rgba(110,124,248,0.28)]"
            : "text-[#5a4e44] hover:bg-white/22 hover:text-[#2a2118]"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? {
              background:
                "linear-gradient(135deg, rgba(110,124,248,0.85) 0%, rgba(79,195,247,0.85) 100%)",
              backdropFilter: "blur(6px)",
            }
          : {}
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon wrapper */}
          <span
            className={`shrink-0 flex items-center justify-center rounded-[9px] transition-all duration-200
              ${collapsed ? "h-8 w-8" : "h-7 w-7"}
              ${isActive ? "bg-white/25" : "bg-white/15"}`}
          >
            {typeof Icon === "string" ? (
              <img
                src={Icon}
                alt={item.name}
                className={`object-contain transition-all
                  ${collapsed ? "h-4 w-4" : "h-[15px] w-[15px]"}
                  ${isActive ? "brightness-0 invert" : "opacity-70"}`}
              />
            ) : (
              <Icon
                className={`transition-all
                  ${collapsed ? "h-4 w-4" : "h-[14px] w-[14px]"}`}
              />
            )}
          </span>

          {/* Label */}
          {!collapsed && (
            <span className="font-['DM_Sans'] text-[13px] font-medium leading-none">
              {item.name}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}