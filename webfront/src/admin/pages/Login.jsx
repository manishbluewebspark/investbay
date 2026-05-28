import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiShield, FiUser, FiHeadphones, FiTrendingUp } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    try {
      const response = await axios.post(`${apiUrl}/auth/admin/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user, success, message } = response.data;

      if (success && token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        if (user.role === 'admin' || user.isAdmin) {
          localStorage.setItem("isAdmin", "true");
        }

        let redirectPath = "/dashboard";
        switch (user.role?.toLowerCase()) {
          case 'admin': redirectPath = "/admin/dashboard"; break;
          case 'ra': redirectPath = "/admin/dashboard"; break;
          case 'user': redirectPath = "/user/dashboard"; break;
          case 'moderator': redirectPath = "/moderator/dashboard"; break;
        }

        setErr("Login successful! Redirecting...");
        setTimeout(() => { navigate(redirectPath, { replace: true }); }, 500);
        return;
      } else {
        setErr(message || "Invalid admin credentials");
      }
    } catch (error) {
      const isAdminError = error.response?.status === 401 || 
                           error.response?.status === 403 || 
                           error.response?.status === 404;
      
      if (isAdminError) {
        try {
          const regularResponse = await axios.post(`${apiUrl}/auth/login`, {
            email: email.trim().toLowerCase(),
            password,
          });
          
          const { token, user, success, message } = regularResponse.data;
          
          if (success && token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            if (user.role === 'admin') localStorage.setItem("isAdmin", "true");

            let redirectPath = "/dashboard";
            switch (user.role?.toLowerCase()) {
              case 'admin': redirectPath = "/admin/dashboard"; break;
              case 'ra': redirectPath = "/admin/dashboard"; break;
              case 'user': redirectPath = "/user/dashboard"; break;
            }

            setErr(`Welcome, ${user.name || user.email}!`);
            setTimeout(() => { navigate(redirectPath, { replace: true }); }, 500);
            return;
          } else {
            setErr(message || "Login failed. Please check your credentials.");
          }
        } catch (regularError) {
          const errorMessage = regularError.response?.data?.message || regularError.message || "Login failed.";
          if (regularError.response?.status === 401) setErr("Invalid email or password");
          else if (regularError.response?.status === 403) setErr("Account is disabled. Please contact support.");
          else if (regularError.response?.status === 404) setErr("Account not found. Please check your email.");
          else if (regularError.response?.status === 429) setErr("Too many login attempts. Please try again later.");
          else setErr(errorMessage);
        }
      } else {
        if (error.code === 'ERR_NETWORK') setErr("Network error. Please check your connection.");
        else if (error.response?.status === 500) setErr("Server error. Please try again later.");
        else setErr(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserLoginRedirect = () => {
    navigate("/user-login");
  };

  return (
    <div className="min-h-screen bg-[#060b10] flex">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[100px]" />
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative m-4">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-3xl"
          style={{ backgroundImage: "url('/login.png')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060b10]/95 via-[#060b10]/80 to-emerald-900/50 rounded-3xl" />
        
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                <FiShield className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-[#f0f4f8]">
                Invest<span className="text-emerald-400">Bay</span>
              </span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-8 mt-auto mb-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">Admin Portal</span>
              </div>
              <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
                Welcome to the{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Command Center
                </span>
              </h2>
              <p className="text-lg text-slate-300/80 leading-relaxed max-w-md">
                Manage your entire trading platform from one powerful dashboard.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "50K+", label: "Active Users", icon: FiUser },
                { value: "200+", label: "SEBI Analysts", icon: FiTrendingUp },
                { value: "24/7", label: "Monitoring", icon: FiHeadphones },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} InvestBay. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <FiShield className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-2xl font-extrabold text-[#f0f4f8]">
              Invest<span className="text-emerald-400">Bay</span>
            </span>
          </div>

          {/* Form Card */}
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.1] transition-all duration-300">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#f0f4f8] mb-2">Sign In</h1>
              <p className="text-slate-400 text-sm">Secure access to InvestBay Admin Dashboard</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="text-sm font-semibold text-slate-400 block mb-2">
                  Email / User ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 z-10" />
                  <input
                    className="relative w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all z-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    placeholder="admin@investbay.in"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-semibold text-slate-400 block mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 z-10" />
                  <input
                    className="relative w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-12 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all z-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors z-10"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Alert Message */}
              {err && (
                <div className={`p-4 rounded-xl text-sm font-medium animate-fadeIn ${
                  err.includes("successful") || err.includes("Welcome")
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {err}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl py-3.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#060b10] text-slate-600">quick links</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-3">
              <p className="text-xs text-slate-600">
                Forgot password?{" "}
                <button type="button" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Contact administrator
                </button>
              </p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xs text-slate-600">Regular user?</span>
                <button
                  type="button"
                  onClick={handleUserLoginRedirect}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  User Login →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}