import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaLock, FaTimesCircle, FaWallet } from "react-icons/fa";
import { FiShield, FiArrowLeft, FiLock, FiUnlock, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const PRESETS = [10000, 25000, 50000, 100000, 250000, 500000];

export default function CapitalLockSetup() {
  const navigate = useNavigate();
  const [lockData, setLockData] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { fetchLock(); }, []);

  const fetchLock = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API}/capital-lock/status`, { headers: authHeader() });
      setLockData(res.data?.data || null);
    } catch { setLockData(null); }
    finally { setFetching(false); }
  };

  const handleSet = async () => {
    const val = parseFloat(amount);
    if (!val || val < 100) { setError("Minimum ₹100 required"); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/capital-lock/set`, { locked_amount: val }, { headers: authHeader() });
      setSuccess("Capital lock activated successfully!");
      setShowConfirm(false);
      setTimeout(async () => { setSuccess(""); await fetchLock(); }, 1500);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to set capital lock");
    } finally { setLoading(false); }
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove capital lock? You can set a new one anytime.")) return;
    setLoading(true);
    try {
      await axios.post(`${API}/capital-lock/remove`, {}, { headers: authHeader() });
      setSuccess("Capital lock removed successfully.");
      setTimeout(async () => { setSuccess(""); await fetchLock(); }, 1200);
    } catch { setError("Failed to remove lock"); }
    finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-white/[0.06]" />
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#060b10] py-10 px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Back to Info */}
        <button
          onClick={() => navigate("/capital-lock")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <FiArrowLeft size={14} /> Back to information
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FiLock className="text-emerald-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f0f4f8]">Capital Lock Setup</h1>
            <p className="text-sm text-slate-400">Configure your investment protection</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <FaTimesCircle className="shrink-0" />{error}
            <button className="ml-auto hover:text-red-300" onClick={() => setError("")}>✕</button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
            <FaCheckCircle className="shrink-0" />{success}
          </div>
        )}

        {/* Active lock card */}
        {lockData?.is_active ? (
          <div className="space-y-4">
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#f0f4f8] text-lg">Capital Lock Active</h2>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <FaLock size={10} /> Locked
                </span>
              </div>

              <div className="text-center py-10 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl mb-6 border border-emerald-500/20">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Maximum Investment Cap</p>
                <p className="text-5xl font-black text-emerald-400">₹{fmt(lockData.locked_amount)}</p>
                <p className="text-xs text-slate-500 mt-3">
                  Locked on {new Date(lockData.locked_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>

              <div className="flex items-start gap-2 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-6">
                <FiShield className="text-emerald-400 mt-0.5 shrink-0" size={14} />
                <p className="text-xs text-emerald-300 leading-relaxed">
                  Any investment exceeding <strong>₹{fmt(lockData.locked_amount)}</strong> will be 
                  automatically blocked, protecting your capital from overtrading.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => { 
                    setAmount(String(lockData.locked_amount)); 
                    setLockData(null);
                  }}
                  className="w-full py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-slate-300 font-medium hover:bg-white/[0.05] transition-colors"
                >
                  Change Lock Amount
                </button>
                <button
                  onClick={handleRemove}
                  disabled={loading}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FiUnlock size={14} /> Remove Capital Lock
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Set lock card */
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#f0f4f8] mb-1">Set your capital limit</h2>
            <p className="text-sm text-slate-400 mb-6">
              Choose the maximum amount you want to invest at any given time
            </p>

            {/* Info tip */}
            <div className="flex items-start gap-2 px-4 py-3 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-5">
              <FiInfo className="text-blue-400 mt-0.5 shrink-0" size={14} />
              <p className="text-xs text-blue-300 leading-relaxed">
                This limit applies to new investments only. Your existing positions won't be affected.
              </p>
            </div>

            {/* Preset chips */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className={`py-2.5 rounded-xl text-sm border transition-all font-semibold ${
                    amount === String(p)
                      ? "bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20"
                      : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-emerald-500/30 hover:text-slate-300"
                  }`}
                >
                  ₹{fmt(p)}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">₹</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3.5 text-lg font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>

            {amount && Number(amount) > 0 && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-5">
                <p className="text-sm text-slate-400">
                  Investments above <strong className="text-emerald-400">₹{fmt(amount)}</strong> will be 
                  <strong className="text-emerald-400"> automatically blocked</strong>.
                </p>
              </div>
            )}

            {/* Confirm toggle */}
            {!showConfirm ? (
              <button
                onClick={() => { 
                  if (!amount || Number(amount) < 100) { setError("Minimum ₹100 required"); return; } 
                  setError("");
                  setShowConfirm(true); 
                }}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <FiLock size={14} /> Lock Capital at ₹{fmt(amount)}
              </button>
            ) : (
              <div className="border border-emerald-500/20 rounded-xl p-5 bg-emerald-500/5">
                <p className="text-sm font-semibold text-emerald-300 mb-4 text-center">
                  Confirm locking <strong>₹{fmt(amount)}</strong> as your investment cap?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirm(false)} 
                    className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-slate-400 font-medium hover:bg-white/[0.05] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSet} 
                    disabled={loading} 
                    className="flex-1 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Activating..." : "Confirm Lock"}
                  </button>
                </div>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-start gap-3 mt-5 px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <FaWallet className="text-slate-500 mt-0.5 shrink-0" size={12} />
              <p className="text-xs text-slate-500 leading-relaxed">
                Capital lock only restricts new investments. It does not affect your existing positions or ongoing trades. You can modify or remove the lock at any time.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}