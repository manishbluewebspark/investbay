import axios from "axios";
import { useEffect, useState } from "react";
import { Shield, Lock, Wallet, RefreshCw, ArrowRight, ArrowLeft, Check, AlertTriangle, X, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Broker config ─────────────────────────────────────────────────────────
const BROKERS = [
  {
    id: "zerodha",   name: "Zerodha",   color: "#387ed1", bg: "#eff6ff",
    apiDocsUrl: "https://kite.zerodha.com/connect/login",
    needsTotp: true, needsMpin: false,
    clientIdLabel: "Client ID", clientIdPlaceholder: "e.g. AB1234",
    userSteps: [
      "Open the Zerodha Kite Developer Console: kite.trade/connect/apps",
      'Create a new app → App Type: "Connect"',
      "Copy the API Key and API Secret after creating the app",
      "Paste them below and click Connect",
    ],
  },
  {
    id: "upstox",    name: "Upstox",    color: "#6c47ff", bg: "#f5f3ff",
    apiDocsUrl: "https://account.upstox.com/developer/apps",
    needsTotp: false, needsMpin: true,
    clientIdLabel: "Client ID", clientIdPlaceholder: "e.g. 123456",
    userSteps: [
      "Open the Upstox Developer Portal: account.upstox.com/developer/apps",
      'Create a new app → Add "https://investbay.in" as Redirect URI',
      "Copy the API Key and Secret",
      "Paste them below and click Connect",
    ],
  },
  {
    id: "angelone",  name: "Angel One", color: "#e8622a", bg: "#fff7ed",
    apiDocsUrl: "https://smartapi.angelbroking.com/",
    needsTotp: true, needsMpin: false,
    clientIdLabel: "Client ID", clientIdPlaceholder: "e.g. A123456",
    userSteps: [
      "Open the Angel One SmartAPI portal: smartapi.angelbroking.com",
      "Register and create a new app",
      "Generate your API Key",
      "Paste it below and click Connect",
    ],
  },
  {
    id: "fyers",     name: "Fyers",     color: "#16a34a", bg: "#f0fdf4",
    apiDocsUrl: "https://myapi.fyers.in/",
    needsTotp: false, needsMpin: false,
    clientIdLabel: "Client ID", clientIdPlaceholder: "e.g. XY12345",
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
const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── Reusable input ─────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5"
        style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>{label}</label>
      {children}
      {hint && <p className="text-[12px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-900 placeholder-gray-400
        focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-white ${className}`}
      {...props}
    />
  );
}

export default function LossProtection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState(null);
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

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    try {
      const [ls, ds] = await Promise.all([
        axios.get(`${API}/loss-security/status`, { headers: authHeader() }),
        axios.get(`${API}/demat/status`,          { headers: authHeader() }),
      ]);
      const lsData = ls.data?.data;
      const dsData = ds.data?.data;
      setLossStatus(lsData);
      setDematStatus(dsData);
      if (dsData?.is_connected && lsData?.loss_limit) setStep(4);
      else if (dsData?.is_connected) setStep(3);
      else setStep(1);
    } catch { setStep(1); }
  };

  const handleConnectDemat = async () => {
    if (!clientId.trim() || !clientPass.trim()) { setError("Client ID and Password are required"); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/demat/connect`, {
        broker_name: selectedBroker.id, client_id: clientId, client_pass: clientPass,
        totp_secret: totpSecret || undefined, mpin: mpin || undefined,
      }, { headers: authHeader() });
      setSuccess("Demat successfully connected!");
      setTimeout(() => { setSuccess(""); setStep(3); }, 1200);
    } catch (e) { setError(e.response?.data?.message || "Connection failed. Check your credentials."); }
    finally { setLoading(false); }
  };

  const handleSetLossLimit = async () => {
    const val = parseFloat(lossLimit);
    if (!val || val < 100) { setError("Minimum ₹100 loss limit required"); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/loss-security/set`, { loss_limit: val }, { headers: authHeader() });
      setSuccess("Loss protection activated!");
      setTimeout(async () => { setSuccess(""); await fetchStatus(); }, 1200);
    } catch (e) { setError(e.response?.data?.message || "Failed to set limit"); }
    finally { setLoading(false); }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect demat account?")) return;
    try {
      await axios.post(`${API}/demat/disconnect`, {}, { headers: authHeader() });
      setDematStatus(null); setLossStatus(null); setStep(1);
    } catch { setError("Disconnect failed"); }
  };

  const handleResetLimit = async () => {
    if (!window.confirm("Reset loss limit?")) return;
    try {
      await axios.post(`${API}/loss-security/set`, { loss_limit: lossStatus.loss_limit }, { headers: authHeader() });
      await fetchStatus();
    } catch { setError("Reset failed"); }
  };

  const pct = lossStatus ? Math.min(100, Math.round((lossStatus.current_loss / lossStatus.loss_limit) * 100)) : 0;
  const barColor = pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#16a34a";

  const PRESETS = [2000, 5000, 10000, 25000, 50000];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">

        {/* Back link */}
        <button
          onClick={() => navigate("/loss-protection")}
          className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-green-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to information
        </button>

        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-green-600" strokeWidth={1.8} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 900, fontSize: 22, color: "#111827", letterSpacing: "-0.02em" }}>
              Loss Protection
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">Connect your broker and set a loss limit to protect your portfolio</p>
          </div>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {["Choose broker", "Connect account", "Set limit"].map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-2 text-[12px] font-semibold ${active ? "text-green-600" : done ? "text-green-500" : "text-gray-300"}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${done ? "bg-green-500 border-green-500 text-white" : active ? "border-green-500 text-green-600" : "border-gray-200 text-gray-300"}`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : s}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${done ? "bg-green-400" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* Alert strips */}
        {error && (
          <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-[13px] text-green-700">
            <Check className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* ══ STEP 1 — Broker select ══════════════════════════════════════════ */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
            <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 17, color: "#111827" }} className="mb-1">
              Choose your broker
            </h2>
            <p className="text-[13px] text-gray-400 mb-6">Select the broker you trade with</p>
            <div className="grid grid-cols-2 gap-3">
              {BROKERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBroker(b); setStep(2); }}
                  className="group flex flex-col items-start gap-2 p-5 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left hover:-translate-y-0.5"
                  style={{ background: b.bg }}
                >
                  <span style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 16, color: b.color }}>{b.name}</span>
                  <span className="text-[12px] text-gray-400 group-hover:text-green-600 transition-colors flex items-center gap-1">
                    Connect <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ STEP 2 — Credentials ════════════════════════════════════════════ */}
        {step === 2 && selectedBroker && (
          <div className="space-y-4">
            {/* Instructions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 17, color: "#111827" }}>
                  {selectedBroker.name} — Steps
                </h2>
                <a href={selectedBroker.apiDocsUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-[12px] text-green-600 hover:text-green-700 font-semibold">
                  Help <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {/* Security note */}
              <div className="flex items-start gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl mb-5">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-[12px] text-green-700">
                  Enter your <strong>{selectedBroker.name} login credentials</strong>. Secured with AES-256 encryption — no one at InvestBay can view them.
                </p>
              </div>
              <ol className="space-y-3">
                {selectedBroker.userSteps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-gray-600">
                    <span className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: selectedBroker.color }}>{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
              <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 17, color: "#111827" }} className="mb-5">
                Enter your {selectedBroker.name} details
              </h2>
              <div className="space-y-4">
                <Field label={selectedBroker.clientIdLabel || "Client ID"}>
                  <Input type="text" value={clientId}
                    onChange={e => setClientId(e.target.value.toUpperCase())}
                    placeholder={selectedBroker.clientIdPlaceholder || "e.g. A123456"}
                    className="font-mono tracking-wider uppercase" />
                </Field>

                <Field label={`${selectedBroker.name} Password`}>
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} value={clientPass}
                      onChange={e => setClientPass(e.target.value)}
                      placeholder="Password / PIN" className="pr-16" />
                    <button type="button" onClick={() => setShowPass(o => !o)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400 hover:text-gray-600 font-semibold transition-colors">
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </Field>

                {selectedBroker.needsTotp && (
                  <Field label="TOTP / OTP" hint="6-digit code from Google Authenticator or your broker app">
                    <Input type="text" value={totpSecret}
                      onChange={e => setTotpSecret(e.target.value.trim())}
                      placeholder="6-digit OTP" maxLength={6}
                      className="font-mono tracking-widest text-center text-lg" />
                  </Field>
                )}

                {selectedBroker.needsMpin && (
                  <Field label="6-digit MPIN">
                    <Input type="password" value={mpin}
                      onChange={e => setMpin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••" maxLength={6}
                      className="font-mono tracking-widest" />
                  </Field>
                )}

                {/* Encryption note */}
                <div className="flex items-start gap-2 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                  <Lock className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-gray-500">
                    Credentials stored with <strong className="text-gray-600">AES-256 encryption</strong>. No InvestBay employee can access them.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setStep(1); setError(""); }}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleConnectDemat}
                  disabled={loading || !clientId || !clientPass}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</> : <>Connect Demat <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 3 — Set loss limit ══════════════════════════════════════════ */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-green-600" strokeWidth={1.8} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 17, color: "#111827" }}>
                  Set daily loss limit
                </h2>
                <p className="text-[12px] text-gray-400 mt-0.5">New trades will be blocked once this amount is reached</p>
              </div>
            </div>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {PRESETS.map(amt => (
                <button key={amt} onClick={() => setLossLimit(String(amt))}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200 ${lossLimit === String(amt)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700"}`}>
                  ₹{fmt(amt)}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="relative mb-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-[15px]">₹</span>
              <Input type="number" value={lossLimit}
                onChange={e => setLossLimit(e.target.value)}
                placeholder="Custom amount"
                className="pl-8 text-[17px] font-bold" />
            </div>
            {lossLimit && Number(lossLimit) > 0 && (
              <p className="text-[13px] text-gray-400 mb-5">
                Trading will be blocked after <strong className="text-gray-700">₹{fmt(lossLimit)}</strong> loss today
              </p>
            )}

            {/* Warning note */}
            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-amber-700">All new trades are blocked when limit is hit. Resets automatically at midnight.</p>
            </div>

            <button onClick={handleSetLossLimit}
              disabled={loading || !lossLimit}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[14px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Activating…</> : "Activate Loss Protection"}
            </button>
          </div>
        )}

        {/* ══ STEP 4 — Dashboard ══════════════════════════════════════════════ */}
        {step === 4 && lossStatus && (
          <div className="space-y-4">
            {/* Triggered banner */}
            {lossStatus.is_triggered && (
              <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-600 text-[14px]" style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                    Trading blocked — daily limit reached
                  </p>
                  <p className="text-[12px] text-red-500 mt-0.5">New trades are being declined. Resets at midnight.</p>
                </div>
              </div>
            )}

            {/* Main status card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 800, fontSize: 16, color: "#111827" }}>
                  Protection Status
                </h2>
                <button onClick={fetchStatus} className="text-gray-400 hover:text-green-600 transition-colors" title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* P&L bar */}
              <div className="mb-5">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="text-gray-500">Loss today</span>
                  <span style={{ fontFamily: "'Aileron','Arial Black',sans-serif", fontWeight: 700, color: "#111827" }}>
                    ₹{fmt(lossStatus.current_loss)}
                    <span className="text-gray-400 font-normal"> / ₹{fmt(lossStatus.loss_limit)}</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
                  <span>₹0</span>
                  <span className="font-semibold" style={{ color: barColor }}>{pct}% used</span>
                  <span>₹{fmt(lossStatus.loss_limit)}</span>
                </div>
              </div>

              {/* 3 stat chips */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Remaining", value: `₹${fmt(Math.max(0, lossStatus.loss_limit - lossStatus.current_loss))}`, col: "#16a34a" },
                  { label: "Status",    value: lossStatus.is_triggered ? "Blocked" : "Active", col: lossStatus.is_triggered ? "#ef4444" : "#16a34a" },
                  { label: "Resets at", value: "Midnight", col: "#374151" },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-[11px] text-gray-400 mb-1">{item.label}</p>
                    <p className="text-[13px] font-bold" style={{ color: item.col, fontFamily: "'Aileron','Arial Black',sans-serif" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setLossLimit(""); setStep(3); }}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                  Change Limit
                </button>
                {lossStatus.is_triggered && (
                  <button onClick={handleResetLimit}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[13px] font-bold transition-all"
                    style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                    Reset & Reactivate
                  </button>
                )}
              </div>
            </div>

            {/* Broker connected card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900 capitalize"
                      style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                      {dematStatus?.broker_name || "Demat"} connected
                    </p>
                    <p className="text-[12px] text-gray-400">
                      {dematStatus?.connected_at ? new Date(dematStatus.connected_at).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Connected
                  </span>
                  <button onClick={handleDisconnect} className="text-[12px] text-red-400 hover:text-red-600 font-semibold transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
              <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-gray-500">
                Your credentials are secured with <strong className="text-gray-600">AES-256 encryption</strong>. InvestBay never places trades on your behalf.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}