// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from '../firebase'


// import { FiEye, FiEyeOff } from "react-icons/fi";

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");

//   const sendOTP = async () => {
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       "recaptcha-container",
//       { size: "invisible" },
//       auth
//     );

//     const confirmation = await signInWithPhoneNumber(
//       auth,
//       phone,
//       window.recaptchaVerifier
//     );

//     window.confirmationResult = confirmation;
//     alert("OTP Sent");
//   };

//   const verifyOTP = async () => {
//     const result = await window.confirmationResult.confirm(otp);
//     const token = await result.user.getIdToken();

//     await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//     });

//     alert("Login Success");
//   };

//     return (
//         <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
//             <div
//                 className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
//                 style={{ backgroundImage: "url('/login.png')" }}
//             >
//                 <div className="flex flex-col justify-between h-full">
//                     <div className="rounded-full p-2 mt-4 w-60">
//                         <img
//                             src="/adminlogo.svg"
//                             alt="Logo"
//                             className="h-10 w-50"
//                             draggable={false}
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <p className="text-white text-4xl">
//                             Next-Gen Investing for the Modern Trader.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//             <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50">
              

//                                  <div>
//       <input
//         placeholder="+91XXXXXXXXXX"
//         onChange={(e) => setPhone(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none no-spinner"
//       />
//       <button 
//       className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 disabled:opacity-60"
//       onClick={sendOTP}>Send OTP</button>

//       <input
//         placeholder="Enter OTP"
//         onChange={(e) => setOtp(e.target.value)}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none no-spinner"
//       />
//       <button onClick={verifyOTP}
      
//       className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 disabled:opacity-60"
      
//       >Verify OTP</button>


//     </div>

//             </div>
//         </div>
//     );
// }





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

  // Resend timer effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const checkAndSendOTP = async () => {
    setError("");
    setSuccess("");

    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/check-and-send-otp`, {
        email
      });

      if (response.data.success) {
        setShowOTPInput(true);
        setSuccess("OTP sent to your registered email");
        setError("");
        
        // Start resend timer (60 seconds)
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      
      if (error.response?.status === 404) {
        // User not found, redirect to profile form
        localStorage.setItem("registration_email", email);
        navigate("/login-profile-form", { 
          state: { email: email },
          replace: true 
        });
      } else {
        setError(error.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndLogin = async () => {
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/verify-otp-login`, {
        email,
        otp
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        setSuccess("Login successful! Redirecting...");
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend) return;
    
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/resend-otp`, {
        email
      });

      if (response.data.success) {
        setSuccess("New OTP sent to your email");
        
        // Reset timer
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setShowOTPInput(false);
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
      {/* Left Side - Image */}
      <div
        className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
        style={{ backgroundImage: "url('/login.png')" }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="rounded-full p-2 mt-4 w-60">
            <img
              src="/adminlogo.svg"
              alt="Logo"
              className="h-10 w-50"
              draggable={false}
            />
          </div>
          <div className="mb-6">
            <p className="text-white text-4xl">
              Next-Gen Investing for the Modern Trader.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-lg p-8">
          <h1 className="text-3xl mb-1">
            Login to{" "}
            <span className="gradient-text font-semibold">InvestBay</span>
          </h1>
          
          <p className="text-sm text-gray-500 mb-6">
            {showOTPInput 
              ? `Enter the OTP sent to ${email}`
              : "Enter your email address to login"
            }
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* OTP Input Section */}
          {showOTPInput ? (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  OTP sent to: <span className="font-semibold">{email}</span>
                  <button
                    onClick={handleGoBack}
                    className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Back
                  </button>
                </p>
              </div>
              
              <label className="block text-sm mb-1 text-gray-700">
                Enter OTP
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 6) {
                    setOtp(value);
                  }
                }}
                type="text"
                placeholder="Enter 6-digit OTP"
                disabled={loading}
                inputMode="numeric"
                maxLength={6}
              />
              
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={resendOTP}
                  disabled={!canResend || loading}
                  className="text-sm text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
                </button>
                
                <span className="text-sm text-gray-500">
                  {otp.length}/6
                </span>
              </div>
              
              <button
                onClick={verifyOTPAndLogin}
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-60 transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : "Verify OTP"}
              </button>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>• Enter the 6-digit OTP sent to your email</p>
                <p>• OTP is valid for 10 minutes</p>
                <p>• Didn't receive OTP? Click "Resend OTP"</p>
              </div>
            </div>
          ) : (
            /* Login Form - Email Input */
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Email Address
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your registered email"
                disabled={loading}
              />
              
              <button
                onClick={checkAndSendOTP}
                disabled={loading || !email.includes('@')}
                className="w-full bg-black text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-60 transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </span>
                ) : "Send OTP"}
              </button>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>• Enter your registered email address</p>
                <p>• You will receive a 6-digit OTP via email</p>
                <p>• Check your spam folder if you don't see it</p>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}