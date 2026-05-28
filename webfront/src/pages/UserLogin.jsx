import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiArrowLeft, FiArrowRight, FiShield, FiSend, FiRefreshCw } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const checkAndSendOTP = async () => {
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/auth/check-and-send-otp`,
        { email }
      );

      if (response.data.success) {
        setShowOTPInput(true);
        setSuccess("OTP sent to your email");
        setResendTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        localStorage.setItem("registration_email", email);
        navigate("/login-profile-form", {
          state: { email },
          replace: true,
        });
      } else {
        setError(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndLogin = async () => {
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/auth/verify-otp-login`,
        { email, otp }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Login successful");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/auth/resend-otp`, { email });
      setResendTimer(60);
      setCanResend(false);
      setSuccess("OTP resent successfully");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b10] flex items-center justify-center px-4 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-blue-500/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <FiShield className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-[#f0f4f8]">
            Invest<span className="text-emerald-400">Bay</span>
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#f0f4f8] mb-2">
              Welcome to InvestBay
            </h1>
            <p className="text-sm text-slate-400">
              {showOTPInput
                ? `Enter the OTP sent to ${email}`
                : "Login or signup using your email"}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium">
              {error}
            </div>
          )}

          {!showOTPInput ? (
            <>
              {/* Email Input */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-slate-400 block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                onClick={checkAndSendOTP}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl py-3.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send OTP
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-slate-400 block mb-2">
                  One-Time Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-center text-xl tracking-[0.35em] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                    value={otp}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) setOtp(e.target.value);
                    }}
                    maxLength={6}
                    placeholder="000000"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={resendOTP}
                  disabled={!canResend || loading}
                  className={`flex items-center gap-1.5 text-sm transition-all ${
                    canResend && !loading
                      ? "text-emerald-400 hover:text-emerald-300 font-medium"
                      : "text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <FiRefreshCw className={`w-4 h-4 ${canResend && !loading ? "" : "opacity-50"}`} />
                  {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
                </button>

                <button
                  onClick={() => {
                    setShowOTPInput(false);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
                  disabled={loading}
                >
                  Change Email
                </button>
              </div>

              {/* Verify OTP Button */}
              <button
                onClick={verifyOTPAndLogin}
                disabled={loading || otp.length !== 6}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl py-3.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#060b10] text-slate-600">or</span>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}