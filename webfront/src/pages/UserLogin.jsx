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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Simple light background - no dark effects */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center">
            <FiShield className="w-6 h-6 text-green-700" />
          </div>
          <span className="text-2xl font-['Aileron_Black'] font-extrabold text-gray-900">
            Invest<span className="text-green-600">Bay</span>
          </span>
        </div>

        {/* Form Card - Clean white */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-['Aileron_Black'] font-extrabold text-gray-900 mb-2">
              Welcome to InvestBay
            </h1>
            <p className="text-sm text-gray-500">
              {showOTPInput
                ? `Enter the OTP sent to ${email}`
                : "Login or signup using your email"}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 font-medium">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {!showOTPInput ? (
            <>
              {/* Email Input */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
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
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
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
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  One-Time Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-center text-xl tracking-[0.35em] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all font-mono"
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
                      ? "text-green-600 hover:text-green-700 font-medium"
                      : "text-gray-400 cursor-not-allowed"
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
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
                  disabled={loading}
                >
                  Change Email
                </button>
              </div>

              {/* Verify OTP Button */}
              <button
                onClick={verifyOTPAndLogin}
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
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
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">or</span>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}