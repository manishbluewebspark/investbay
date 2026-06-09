import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, TrendingUp, Users, Headphones } from "lucide-react";

export default function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [err, setErr]                   = useState("");
  const [isSuccess, setIsSuccess]       = useState(false);

  const navigate = useNavigate();
  const apiUrl   = import.meta.env.VITE_API_URL;

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setIsSuccess(false); setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    const redirect = (user) => {
      const paths = { admin: "/admin/dashboard", ra: "/admin/dashboard", user: "/user/dashboard", moderator: "/moderator/dashboard" };
      return paths[user.role?.toLowerCase()] || "/dashboard";
    };

    try {
      const { data } = await axios.post(`${apiUrl}/auth/admin/login`, {
        email: email.trim().toLowerCase(), password,
      });
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "admin" || data.user.isAdmin) localStorage.setItem("isAdmin", "true");
        setIsSuccess(true); setErr("Login successful! Redirecting…");
        setTimeout(() => navigate(redirect(data.user), { replace: true }), 500);
        return;
      }
      setErr(data.message || "Invalid credentials");
    } catch (adminErr) {
      const s = adminErr.response?.status;
      if (s === 401 || s === 403 || s === 404) {
        try {
          const { data } = await axios.post(`${apiUrl}/auth/login`, {
            email: email.trim().toLowerCase(), password,
          });
          if (data.success && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.role === "admin") localStorage.setItem("isAdmin", "true");
            setIsSuccess(true); setErr(`Welcome, ${data.user.name || data.user.email}!`);
            setTimeout(() => navigate(redirect(data.user), { replace: true }), 500);
            return;
          }
          setErr(data.message || "Login failed.");
        } catch (e2) {
          const s2 = e2.response?.status;
          if (s2 === 401) setErr("Invalid email or password");
          else if (s2 === 403) setErr("Account disabled. Contact support.");
          else if (s2 === 404) setErr("Account not found. Check your email.");
          else if (s2 === 429) setErr("Too many attempts. Try again later.");
          else setErr(e2.response?.data?.message || "Login failed.");
        }
      } else if (adminErr.code === "ERR_NETWORK") {
        setErr("Network error. Check your connection.");
      } else {
        setErr(adminErr.response?.data?.message || "Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>

      {/* ── Left panel — branding ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden m-4 rounded-3xl flex-col justify-between p-10">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        {/* Green glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-green-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-green-500/5 blur-[80px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-400" strokeWidth={1.8} />
          </div>
          <span style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 22, color: "white", letterSpacing: "-0.02em" }}>
            Invest<span style={{ color: "#22c55e" }}>Bay</span>
          </span>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-green-400 tracking-widest uppercase">Admin Portal</span>
          </div>
          <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: "clamp(28px,3.5vw,42px)", color: "white", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
            Welcome to the<br />
            <span style={{ color: "#22c55e" }}>Command Center.</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
            Manage your entire trading platform — users, analysts, signals, and more — from one powerful dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "50K+",  label: "Active Users",  Icon: Users       },
              { val: "200+",  label: "SEBI Analysts", Icon: TrendingUp  },
              { val: "24/7",  label: "Monitoring",    Icon: Headphones  },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <s.Icon className="w-4 h-4 text-green-400 mx-auto mb-2" strokeWidth={1.8} />
                <p style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>{s.val}</p>
                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p style={{ fontSize: 12, color: "#475569" }}>© {new Date().getFullYear()} InvestBay. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-green-600" strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 20, color: "#111827", letterSpacing: "-0.02em" }}>
              Invest<span style={{ color: "#16a34a" }}>Bay</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,34px)", color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.15 }} className="mb-2">
              Sign In
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280" }}>Secure access to InvestBay Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5"
                style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                Email / User ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@investbay.in"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5"
                style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(o => !o)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <button type="button" className="text-[12px] font-semibold text-green-600 hover:text-green-700 transition-colors"
                style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                Forgot password?
              </button>
            </div>

            {/* Alert */}
            {err && (
              <div className={`px-4 py-3 rounded-xl text-[13px] font-medium border ${
                isSuccess
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`} style={{ animation: "fadeIn 0.25s ease" }}>
                {err}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="group w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-[14px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]"
              style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Authenticating…</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Footer links */}
          <div className="text-center space-y-3">
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Regular user?{" "}
              <button
                type="button"
                onClick={() => navigate("/user-login")}
                className="font-bold text-green-600 hover:text-green-700 transition-colors"
                style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
              >
                User Login →
              </button>
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>
              Need access?{" "}
              <button
                type="button"
                className="font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Contact administrator
              </button>
            </p>
          </div>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.8} />
            <span style={{ fontSize: 11, color: "#d1d5db" }}>256-bit SSL encrypted · InvestBay Admin Portal</span>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}