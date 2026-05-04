import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/home-signal-bg.svg')" }}
    >
      <div className="relative z-10 w-full max-w-md rounded-[22px] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:px-8">
        <h1 className="text-[30px] leading-tight text-center font-semibold text-[#1f1f1f] mb-2">
          Welcome to InvestBay
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          {showOTPInput
            ? `Enter OTP sent to ${email}`
            : "Login or signup using your email"}
        </p>

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-md text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-md text-red-600">
            {error}
          </div>
        )}

        {!showOTPInput ? (
          <>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#3e3e3e]">
                Email Address
              </label>

              <input
                className="w-full rounded-[10px] border border-[#ececec] bg-white px-4 py-3 text-[13px] text-[#1f1f1f] outline-none transition-all duration-200 placeholder:text-[#b5b5b5] focus:border-[#d8d8d8] focus:ring-2 focus:ring-black/5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <button
              onClick={checkAndSendOTP}
              disabled={loading}
              className="w-full rounded-full bg-black py-3 text-[13px] font-medium text-white transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Checking..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="mb-2 block text-[11px] font-medium text-[#3e3e3e]">
                OTP
              </label>

              <input
                className="w-full rounded-[10px] border border-[#ececec] bg-white px-4 py-3 text-center text-[20px] tracking-[0.35em] text-[#1f1f1f] outline-none transition-all duration-200 placeholder:text-[#b5b5b5] focus:border-[#d8d8d8] focus:ring-2 focus:ring-black/5"
                value={otp}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setOtp(e.target.value);
                }}
                maxLength={6}
                placeholder="Enter OTP"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between text-md mb-4">
              <button
                onClick={resendOTP}
                disabled={!canResend || loading}
                className={`transition ${
                  canResend && !loading
                    ? "text-black font-medium hover:opacity-70"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>

              <button
                onClick={() => {
                  setShowOTPInput(false);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="text-[#4b5563] font-medium hover:text-black transition"
                disabled={loading}
              >
                Change Email
              </button>
            </div>

            <button
              onClick={verifyOTPAndLogin}
              disabled={loading || otp.length !== 6}
              className="w-full rounded-full bg-black py-3 text-[13px] font-medium text-white transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ✅ FIXED: Always visible */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-black font-medium hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}