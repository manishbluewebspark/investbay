import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        user_id: user.id, ip_address: "", user_agent: navigator.userAgent, role: user.role,
      });
    } catch {}
    finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/admin");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[58px] z-50 flex items-center justify-between px-5 bg-white border-b transition-all duration-300 ${
        isScrolled ? "border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]" : "border-gray-100"
      }`}
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
          <img src="/logo.svg" alt="Logo" className="h-4 w-4 object-contain" />
        </div>
        <span
          className="hidden sm:block"
          style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 17, color: "#111827", letterSpacing: "-0.02em" }}
        >
          Invest<span style={{ color: "#16a34a" }}>Bay</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-6">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search anything…"
            className="bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400 w-full"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification bell */}
        <button className="relative h-9 w-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center hover:border-green-300 hover:bg-green-50 transition-all duration-200">
          <Bell className="h-4 w-4 text-gray-500" />
          <span className="absolute top-[7px] right-[7px] h-[7px] w-[7px] bg-red-400 rounded-full border-2 border-white" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl pl-1.5 pr-2.5 py-1.5 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
          >
            <div className="relative">
              <img
                src={user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                alt="profile"
                className="h-6 w-6 rounded-lg object-cover border border-gray-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <span
              className="text-[13px] font-semibold text-gray-700 hidden sm:block"
              style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
            >
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3.5 border-b border-gray-100">
                <p
                  className="text-[13px] font-bold text-gray-900 truncate"
                  style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
                >
                  {user?.name || "Welcome Back"}
                </p>
                <p className="text-[12px] text-gray-400 truncate mt-0.5">{user?.email || "user@example.com"}</p>
              </div>

              <div className="p-1.5">
                {[
                  { icon: User,     label: "Profile",  action: () => { setOpen(false); navigate("/admin/profile"); } },
                  { icon: Settings, label: "Settings", action: () => setOpen(false) },
                ].map(({ icon: Icon, label, action }) => (
                  <button key={label} onClick={action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-600 text-[13px] transition-all duration-150"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    {label}
                  </button>
                ))}

                <div className="h-px bg-gray-100 my-1 mx-2" />

                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 text-[13px] transition-all duration-150"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}