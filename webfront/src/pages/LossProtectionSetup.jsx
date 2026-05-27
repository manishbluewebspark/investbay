import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaAngleRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaLock,
  FaShieldAlt,
  FaSync,
  FaTimesCircle,
  FaWallet,
} from "react-icons/fa";
import { FiArrowRight, FiArrowLeft, FiRefreshCw, FiShield, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ─── broker config ────────────────────────────────────────────────────────────
const BROKERS = [
  {
    id: "zerodha",
    name: "Zerodha",
    logo: "https://zerodha.com/static/images/logo.svg",
    color: "#387ed1",
    apiDocsUrl: "https://kite.zerodha.com/connect/login",
    needsTotp: true,
    needsMpin: false,
    clientIdLabel: "Client ID",
    clientIdPlaceholder: "e.g. AB1234",
    totpHelpUrl: "https://kite.trade/connect/apps",
    userSteps: [
      "Open the Zerodha Kite Developer Console: kite.trade/connect/apps",
      'Create a new app → App Type: "Connect"',
      "After creating the app, copy the API Key and API Secret",
      "Paste them below and click Connect",
    ],
  },
  {
    id: "upstox",
    name: "Upstox",
    logo: null,
    color: "#6c47ff",
    apiDocsUrl: "https://account.upstox.com/developer/apps",
    needsTotp: false,
    needsMpin: true,
    clientIdLabel: "Client ID",
    clientIdPlaceholder: "e.g. 123456",
    totpHelpUrl: null,
    userSteps: [
      "Open the Upstox Developer Portal: account.upstox.com/developer/apps",
      'Create a new app → Add "https://investbay.in" as the Redirect URI',
      "Copy the API Key and Secret",
      "Paste them below and click Connect",
    ],
  },
  {
    id: "angelone",
    name: "Angel One",
    logo: null,
    color: "#e8622a",
    apiDocsUrl: "https://smartapi.angelbroking.com/",
    needsTotp: true,
    needsMpin: false,
    clientIdLabel: "Client ID",
    clientIdPlaceholder: "e.g. A123456",
    totpHelpUrl: "https://smartapi.angelbroking.com/",
    userSteps: [
      "Open the Angel One SmartAPI portal: smartapi.angelbroking.com",
      "Register and create a new app",
      "Generate your API Key",
      "Paste the API Key below and click Connect",
    ],
  },
  {
    id: "fyers",
    name: "Fyers",
    logo: null,
    color: "#1db954",
    apiDocsUrl: "https://myapi.fyers.in/",
    needsTotp: false,
    needsMpin: false,
    clientIdLabel: "Client ID",
    clientIdPlaceholder: "e.g. XY12345",
    totpHelpUrl: null,
    userSteps: [
      "Open the Fyers API portal: myapi.fyers.in",
      "Create a new app",
      "Copy the Client ID and Secret Key",
      "Paste them below and click Connect",
    ],
  },
];

const API = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function LossProtection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [lossLimit, setLossLimit] = useState("");
  const [lossStatus, setLossStatus] = useState(null);
  const [dematStatus, setDematStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientPass, setClientPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [mpin, setMpin] = useState("");

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const [ls, ds] = await Promise.all([
        axios.get(`${API}/loss-security/status`, { headers: authHeader() }),
        axios.get(`${API}/demat/status`, { headers: authHeader() }),
      ]);
      const lsData = ls.data?.data;
      const dsData = ds.data?.data;
      setLossStatus(lsData);
      setDematStatus(dsData);

      if (dsData?.is_connected && lsData?.loss_limit) {
        setStep(4);
      } else if (dsData?.is_connected) {
        setStep(3);
      } else {
        setStep(1);
      }
    } catch {
      setStep(1);
    }
  };

  const handleConnectDemat = async () => {
    if (!clientId.trim() || !clientPass.trim()) {
      setError("Client ID and Password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${API}/demat/connect`,
        {
          broker_name: selectedBroker.id,
          client_id: clientId,
          client_pass: clientPass,
          totp_secret: totpSecret || undefined,
          mpin: mpin || undefined,
        },
        { headers: authHeader() }
      );
      setSuccess("Demat successfully connected!");
      setTimeout(() => { setSuccess(""); setStep(3); }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || "Connection failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetLossLimit = async () => {
    const val = parseFloat(lossLimit);
    if (!val || val < 100) {
      setError("Minimum ₹100 loss limit required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${API}/loss-security/set`,
        { loss_limit: val },
        { headers: authHeader() }
      );
      setSuccess("Loss protection activated!");
      setTimeout(async () => {
        setSuccess("");
        await fetchStatus();
      }, 1200);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to set limit");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect demat account?")) return;
    try {
      await axios.post(`${API}/demat/disconnect`, {}, { headers: authHeader() });
      setDematStatus(null);
      setLossStatus(null);
      setStep(1);
    } catch {
      setError("Disconnect failed");
    }
  };

  const handleResetLimit = async () => {
    if (!window.confirm("Reset loss limit?")) return;
    try {
      await axios.post(
        `${API}/loss-security/set`,
        { loss_limit: lossStatus.loss_limit },
        { headers: authHeader() }
      );
      await fetchStatus();
    } catch {
      setError("Reset failed");
    }
  };

  const pct = lossStatus
    ? Math.min(100, Math.round((lossStatus.current_loss / lossStatus.loss_limit) * 100))
    : 0;
  const barColor =
    pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#10b981";

  return (
    <div className="min-h-screen bg-[#060b10] py-10 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <button onClick={() => navigate("/loss-protection")} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <FiArrowLeft size={14} /> Back to information
        </button>
        {/* Page header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FiShield className="text-emerald-400" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f0f4f8]">Loss Protection</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Connect your broker and set a loss limit to protect your portfolio
            </p>
          </div>
        </div>

        {/* Step indicator (steps 1-3) */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {["Broker select", "API connect", "Set limit"].map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${active ? "text-emerald-400" : done ? "text-emerald-500" : "text-slate-600"
                      }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${done
                        ? "bg-emerald-500 border-emerald-500 text-black"
                        : active
                          ? "border-emerald-400 text-emerald-400"
                          : "border-slate-700 text-slate-600"
                        }`}
                    >
                      {done ? "✓" : s}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-0.5 transition-all duration-300 ${done ? "bg-emerald-500" : "bg-slate-800"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Alert strip */}
        {error && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <FaTimesCircle className="shrink-0" />
            {error}
            <button className="ml-auto text-red-400 hover:text-red-300" onClick={() => setError("")}>
              <FiX size={16} />
            </button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
            <FaCheckCircle className="shrink-0" />
            {success}
          </div>
        )}

        {/* ═══════════════════════ STEP 1 — Broker select ═══════════════════════ */}
        {step === 1 && (
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#f0f4f8] mb-1">Choose your broker</h2>
            <p className="text-sm text-slate-400 mb-6">Select your broker and connect your account</p>
            <div className="grid grid-cols-2 gap-3">
              {BROKERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBroker(b); setStep(2); }}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] transition-all group"
                >
                  {b.logo ? (
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="h-7 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: b.color,
                      display: b.logo ? 'none' : 'block'
                    }}
                  >
                    {b.name}
                  </span>
                  <span className="text-sm text-slate-400 font-medium group-hover:text-emerald-400 transition-colors">
                    {b.logo ? b.name : "Connect"}
                  </span>
                  <FiArrowRight className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 2 — Client credentials ═══════════════════════ */}
        {step === 2 && selectedBroker && (
          <div className="space-y-4">
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-[#f0f4f8]">
                  {selectedBroker.name} — Instructions
                </h2>
                <a
                  href={selectedBroker.apiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
                >
                  Help <FaExternalLinkAlt size={10} />
                </a>
              </div>

              <div className="flex items-start gap-2 my-4 px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <FiShield className="text-emerald-400 mt-0.5 shrink-0" size={13} />
                <p className="text-xs text-emerald-300">
                  No API key required — just enter your{" "}
                  <strong>{selectedBroker.name} login credentials</strong>.
                  InvestBay will securely connect to your account.
                </p>
              </div>

              <ol className="space-y-3">
                {selectedBroker.userSteps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span
                      className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: selectedBroker.color }}
                    >
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#f0f4f8] mb-5">
                Enter your {selectedBroker.name} account details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1.5">
                    {selectedBroker.clientIdLabel || "Client ID"}
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value.toUpperCase())}
                    placeholder={selectedBroker.clientIdPlaceholder || "e.g. A123456"}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 font-mono tracking-wider uppercase"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1.5">
                    {selectedBroker.name} Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={clientPass}
                      onChange={(e) => setClientPass(e.target.value)}
                      placeholder="Password/PIN"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-16 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {selectedBroker.needsTotp && (
                  <div>
                    <label className="text-sm font-medium text-slate-400 block mb-1.5">
                      TOTP / OTP{" "}
                      <span className="text-slate-600 font-normal">
                        (optional — only if 2FA is enabled)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={totpSecret}
                      onChange={(e) => setTotpSecret(e.target.value.trim())}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 font-mono tracking-widest text-center text-lg"
                    />
                    <p className="text-xs text-slate-600 mt-1.5">
                      Get the 6-digit code from Google Authenticator or your broker app.
                    </p>
                  </div>
                )}

                {selectedBroker.needsMpin && (
                  <div>
                    <label className="text-sm font-medium text-slate-400 block mb-1.5">
                      6-digit MPIN
                    </label>
                    <input
                      type="password"
                      value={mpin}
                      onChange={(e) => setMpin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 font-mono tracking-widest"
                    />
                  </div>
                )}

                <div className="flex items-start gap-2 px-3 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                  <FaLock className="text-slate-500 mt-0.5 shrink-0" size={11} />
                  <p className="text-xs text-slate-500">
                    Your password is securely stored using <strong className="text-slate-400">AES-256 encryption</strong>.
                    No InvestBay employee can access or view your credentials.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-slate-400 hover:bg-white/[0.05] hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <FiArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleConnectDemat}
                  disabled={loading || !clientId || !clientPass}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSync className="animate-spin" size={12} /> Connecting...
                    </>
                  ) : (
                    <>
                      Connect Demat <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 3 — Loss limit ═══════════════════════ */}
        {step === 3 && (
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FaWallet className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#f0f4f8]">Set daily loss limit</h2>
                <p className="text-xs text-slate-500">New trades will be blocked after this amount</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 my-5">
              {[2000, 5000, 10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setLossLimit(String(amt))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${lossLimit === String(amt)
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:border-emerald-500/30 hover:text-slate-300"
                    }`}
                >
                  ₹{fmt(amt)}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                ₹
              </span>
              <input
                type="number"
                value={lossLimit}
                onChange={(e) => setLossLimit(e.target.value)}
                placeholder="Custom amount"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>

            {lossLimit && Number(lossLimit) > 0 && (
              <p className="text-sm text-slate-500 mt-2">
                Trading will be blocked after ₹{fmt(lossLimit)} loss today
              </p>
            )}

            <button
              onClick={handleSetLossLimit}
              disabled={loading || !lossLimit}
              className="w-full mt-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Activating..." : "Activate Loss Protection"}
            </button>
          </div>
        )}

        {/* ═══════════════════════ STEP 4 — Dashboard ═══════════════════════ */}
        {step === 4 && lossStatus && (
          <div className="space-y-4">
            {lossStatus.is_triggered && (
              <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <FaExclamationTriangle className="text-red-400 shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-red-400 text-sm">
                    Trading blocked — daily limit reached
                  </p>
                  <p className="text-xs text-red-400/70 mt-0.5">
                    New trades are being declined. Resets at midnight.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#f0f4f8]">Loss Protection Status</h2>
                <button
                  onClick={fetchStatus}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title="Refresh"
                >
                  <FiRefreshCw size={14} />
                </button>
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Current loss today</span>
                  <span className="font-bold text-[#f0f4f8]">
                    ₹{fmt(lossStatus.current_loss)}
                    <span className="text-slate-500 font-normal"> / ₹{fmt(lossStatus.loss_limit)}</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>₹0</span>
                  <span className="font-medium" style={{ color: barColor }}>
                    {pct}% used
                  </span>
                  <span>₹{fmt(lossStatus.loss_limit)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Remaining", value: `₹${fmt(Math.max(0, lossStatus.loss_limit - lossStatus.current_loss))}`, color: "text-emerald-400" },
                  { label: "Status", value: lossStatus.is_triggered ? "Blocked" : "Active", color: lossStatus.is_triggered ? "text-red-400" : "text-emerald-400" },
                  { label: "Resets at", value: "Midnight", color: "text-[#f0f4f8]" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                    <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setLossLimit(""); setStep(3); }}
                  className="flex-1 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-slate-400 hover:bg-white/[0.05] hover:text-slate-300 transition-colors"
                >
                  Change Limit
                </button>
                {lossStatus.is_triggered && (
                  <button
                    onClick={handleResetLimit}
                    className="flex-1 py-2 bg-emerald-500 text-black rounded-xl text-sm font-medium hover:bg-emerald-400 transition-colors"
                  >
                    Reset & Reactivate
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FaWallet className="text-emerald-400" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#f0f4f8] capitalize">
                      {dematStatus?.broker_name || "Demat"} connected
                    </p>
                    <p className="text-xs text-slate-600">
                      {dematStatus?.connected_at
                        ? new Date(dematStatus.connected_at).toLocaleDateString("en-IN")
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    Connected
                  </span>
                  <button
                    onClick={handleDisconnect}
                    className="text-xs text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}