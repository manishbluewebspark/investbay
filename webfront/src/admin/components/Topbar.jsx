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
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        user_id: user.id,
        ip_address: "",
        user_agent: navigator.userAgent,
        role: user.role,
      });
    } catch (error) {
      console.error("Logout log failed:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/admin");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[58px] z-50 flex items-center justify-between px-5 transition-all duration-300
        bg-white/20 backdrop-blur-xl border-b border-white/35
        ${isScrolled ? "shadow-sm shadow-black/5" : ""}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="h-[34px] w-[34px] rounded-[10px] bg-gradient-to-br from-[#6e7cf8] to-[#4fc3f7] flex items-center justify-center shadow-[0_4px_12px_rgba(110,124,248,0.35)]">
          <img src="/logo.svg" alt="Logo" className="h-5 w-5 object-contain brightness-0 invert" />
        </div>
        <span className="font-['Sora'] font-bold text-[15px] text-[#2a2118] tracking-tight hidden sm:block">
          InvestBay
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-6">
        <div className="flex items-center gap-2 bg-white/18 border border-white/40 rounded-[14px] px-3.5 py-2 backdrop-blur-[10px]">
          <Search className="h-3.5 w-3.5 text-[#8a7e74] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none text-[13px] text-[#2a2118] placeholder-[#8a7e74] w-full font-['DM_Sans']"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Notification */}
        <button className="relative h-9 w-9 bg-white/22 border border-white/40 rounded-[11px] flex items-center justify-center hover:bg-white/32 transition-all duration-200 group">
          <Bell className="h-[15px] w-[15px] text-[#5a4e44] group-hover:text-[#6e7cf8] transition-colors" />
          <span className="absolute top-[6px] right-[6px] h-[7px] w-[7px] bg-red-400 rounded-full border-2 border-white/60"></span>
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white/22 border border-white/40 rounded-[14px] pl-1 pr-2.5 py-1 hover:bg-white/32 transition-all duration-200"
          >
            <div className="relative">
              <img
                src={user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                alt="profile"
                className="h-7 w-7 rounded-[9px] object-cover border-2 border-white/50"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white/70"></div>
            </div>
            <span className="text-[12.5px] font-medium text-[#2a2118] hidden sm:block font-['DM_Sans']">
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown className={`h-3 w-3 text-[#8a7e74] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white/30 backdrop-blur-2xl border border-white/45 rounded-[18px] shadow-xl shadow-black/10 z-50 overflow-hidden">
              <div className="p-4 border-b border-white/30">
                <p className="font-semibold text-[13px] text-[#2a2118] font-['Sora'] truncate">
                  {user?.name || "Welcome Back"}
                </p>
                <p className="text-[12px] text-[#8a7e74] truncate mt-0.5">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <div className="p-2">
                {[
                  { icon: User, label: "Profile", action: () => { setOpen(false); navigate("/admin/profile"); } },
                  { icon: Settings, label: "Settings", action: () => setOpen(false) },
                ].map(({ icon: Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/30 text-[#5a4e44] text-[13px] transition-all duration-150"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-['DM_Sans']">{label}</span>
                  </button>
                ))}

                <div className="h-px bg-white/30 my-1.5 mx-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-red-400/15 text-red-500 text-[13px] transition-all duration-150"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="font-['DM_Sans']">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}