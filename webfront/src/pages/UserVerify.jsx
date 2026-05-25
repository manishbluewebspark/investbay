// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function VerifyPassword() {
//   const [code, setCode] = useState(["", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const handleChange = (index, value) => {
//     if (value.length > 1) return;
//     const newCode = [...code];
//     newCode[index] = value.replace(/[^0-9]/g, "");
//     setCode(newCode);
//     if (value && index < 3) {
//       document.getElementById(`code-${index + 1}`).focus();
//     }
//   };

//   async function submit(e) {
//     e.preventDefault();
//     const otp = code.join("");
//     if (otp.length < 4) {
//       setErr("Please enter the complete code.");
//       return;
//     }

//     setErr("");
//     setLoading(true);

//     try {
//       const email = localStorage.getItem("resetEmail");

//       await axios.post(`${apiUrl}/auth/verify-otp-login`, {
//         email,
//         code: otp,
//       });

//       navigate("/admin/update-password");
//     } catch (e) {
//       setErr(e.response?.data?.message || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
//       <div
//         className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
//         style={{
//           backgroundImage: "url('/login.png')",
//         }}
//       >
//         <div className="flex flex-col justify-between h-full">
//           <div className="rounded-full p-2 mt-4 w-60">
//             <img src="/adminlogo.svg" alt="Logo" className="h-10 w-50" />
//           </div>
//           <div className="mb-6">
//             <p className="text-white text-4xl">
//               Next-Gen Investing for the Modern Trader.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="w-full md:w-3/5 flex items-center justify-center bg-white">
//         <form onSubmit={submit} className="w-full max-w-md px-4">
//           <h1 className="text-3xl mb-2 text-gray-800">Verify It’s You</h1>
//           <p className="text-md text-gray-500 mb-6">
//             Enter the code we just sent to confirm your Number
//           </p>

//           <div className="flex gap-3 mb-6">
//             {code.map((num, i) => (
//               <input
//                 key={i}
//                 id={`code-${i}`}
//                 type="text"
//                 maxLength={1}
//                 value={num}
//                 onChange={(e) => handleChange(i, e.target.value)}
//                 className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-medium focus:outline-none focus:border-black"
//               />
//             ))}
//           </div>

//           {err && <p className="text-red-500 text-md mb-4">{err}</p>}

//           <button
//             type="button"
//             onClick={() => alert("Resend code clicked")}
//             className="text-md text-blue-500 mb-6 hover:underline"
//           >
//             Resend code
//           </button>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white rounded-md py-3 font-medium hover:opacity-90 transition-all disabled:opacity-60"
//           >
//             {loading ? "Verifying..." : "Verify"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyPassword() {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Changed to 6 digits
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Get email from location state
  const email = location.state?.email || '';

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value.replace(/[^0-9]/g, "");
    setCode(newCode);
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  async function submit(e) {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/verify-otp-login`, {
        email,
        otp,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        setSuccess("Verification successful! Redirecting...");
        
        // Check if user has set password
        if (user.passwordHash) {
          // Redirect to dashboard
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
        } else {
          // Redirect to set password page
          setTimeout(() => {
            navigate("/set-password", { 
              state: { email: email },
              replace: true 
            });
          }, 1500);
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const resendOTP = async () => {
    setError("");
    setSuccess("");
    setCode(["", "", "", "", "", ""]);
    
    try {
      const response = await axios.post(`${apiUrl}/auth/resend-otp`, {
        email
      });

      if (response.data.success) {
        setSuccess("New OTP sent to your email");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
      <div
        className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
        style={{
          backgroundImage: "url('/login.png')",
        }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="rounded-full p-2 mt-4 w-60">
            <img src="/adminlogo.svg" alt="Logo" className="h-10 w-50" />
          </div>
          <div className="mb-6">
            <p className="text-white text-4xl">
              Next-Gen Investing for the Modern Trader.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center bg-white">
        <form onSubmit={submit} className="w-full max-w-md px-4">
          <h1 className="text-3xl mb-2 text-gray-800">Verify It's You</h1>
          <p className="text-md text-gray-500 mb-6">
            Enter the 6-digit code we just sent to your email
            {email && <span className="block mt-1"><strong>{email}</strong></span>}
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-md">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-md">
              {error}
            </div>
          )}

          <div className="flex gap-3 mb-6 justify-center">
            {code.map((num, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-medium focus:outline-none focus:border-black focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={resendOTP}
            className="text-md text-blue-500 mb-6 hover:underline"
          >
            Resend code
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-md py-3 font-medium hover:opacity-90 transition-all disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>• Enter the 6-digit OTP sent to your email</p>
            <p>• OTP is valid for 10 minutes</p>
          </div>
        </form>
      </div>
    </div>
  );
}