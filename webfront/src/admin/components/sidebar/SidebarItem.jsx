import { NavLink } from "react-router-dom";

export default function SidebarItem({ item, collapsed }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-2 py-1.5 rounded-full text-sm font-medium transition-all
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
                "linear-gradient(to right, #3A4EFB 4%, #33A4FA 100%)",
            }
          : {}
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`
              shrink-0 flex items-center justify-center rounded-full transition-all duration-300
              ${
                collapsed
                  ? "h-6 w-6"
                  : "h-8 w-8"
              }
              ${
                isActive
                  ? "bg-white text-[#3A4EFB]"
                  : "bg-transparent text-gray-600"
              }
              ${collapsed ? "" : "mr-3"}
            `}
          >
            {typeof Icon === "string" ? (
              <img
                src={Icon}
                alt={item.name}
                className={`
                  object-contain transition-all
                  ${collapsed ? "h-3.5 w-3.5" : "h-5 w-5"}
                `}
              />
            ) : (
              <Icon
                className={`
                  transition-all
                  ${collapsed ? "h-3.5 w-3.5" : "h-4 w-4"}
                `}
              />
            )}
          </span>

          {!collapsed && <span>{item.name}</span>}
        </>
      )}
    </NavLink>
  );
}
