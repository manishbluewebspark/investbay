// components/LoginModal.jsx
import React, { useState } from "react";

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState("mobile"); // mobile | otp
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    setLoading(true);

    // 🔹 API CALL (later)
    // await axios.post("/auth/send-otp", { mobile });

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 800);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Invalid OTP");
      return;
    }

    setLoading(true);

    // 🔹 API CALL (later)
    // await axios.post("/auth/verify-otp", { mobile, otp });

    setTimeout(() => {
      setLoading(false);
      alert("Login Successful 🎉");
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-[90%] max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {step === "mobile" ? "Login" : "Verify OTP"}
        </h2>

        {step === "mobile" && (
          <>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
 }


// import React, { useEffect, useState } from "react";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { auth } from "../utils/firebase";
// import axios from "axios";

// export default function LoginModal({ isOpen, onClose }) {
//   const [step, setStep] = useState("mobile");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [confirmation, setConfirmation] = useState(null);

//   useEffect(() => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         { size: "invisible" }
//       );
//     }
//   }, []);

//   if (!isOpen) return null;

//   // 🔹 SEND OTP
//   const sendOtp = async () => {
//     if (mobile.length !== 10) {
//       alert("Enter valid mobile number");
//       return;
//     }

//     try {
//       setLoading(true);
//       const appVerifier = window.recaptchaVerifier;

//       const result = await signInWithPhoneNumber(
//         auth,
//         `+91${mobile}`,
//         appVerifier
//       );

//       setConfirmation(result);
//       setStep("otp");
//     } catch (err) {
//       alert(err.message);
//     }
//     setLoading(false);
//   };

//   // 🔹 VERIFY OTP
//   const verifyOtp = async () => {
//     if (otp.length !== 6) {
//       alert("Invalid OTP");
//       return;
//     }

//     try {
//       setLoading(true);

//       const result = await confirmation.confirm(otp);
//       const firebaseToken = await result.user.getIdToken();

//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/firebase-login`,
//         { token: firebaseToken }
//       );

//       alert("Login Successful 🎉");
//       onClose();
//     } catch (err) {
//       alert("Wrong OTP");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="bg-white rounded-xl w-[90%] max-w-sm p-6 relative">
//         <button onClick={onClose} className="absolute top-3 right-4 text-xl">
//           ✕
//         </button>

//         <h2 className="text-xl font-semibold mb-4 text-center">
//           {step === "mobile" ? "Login" : "Verify OTP"}
//         </h2>

//         {step === "mobile" && (
//           <>
//             <input
//               type="tel"
//               placeholder="Enter mobile number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               className="w-full border px-4 py-2 rounded-lg mb-4"
//             />

//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="w-full bg-gray-900 text-white py-2 rounded-lg"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <input
//               type="number"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border px-4 py-2 rounded-lg mb-4"
//             />

//             <button
//               onClick={verifyOtp}
//               disabled={loading}
//               className="w-full bg-gray-900 text-white py-2 rounded-lg"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}

//         <div id="recaptcha-container"></div>
//       </div>
//     </div>
//   );
// }
