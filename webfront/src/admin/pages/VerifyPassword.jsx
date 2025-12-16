import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function VerifyPassword() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value.replace(/[^0-9]/g, "");
    setCode(newCode);
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  async function submit(e) {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < 4) {
      setErr("Please enter the complete code.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      // Simulated verify API
      await axios.post("/api/auth/verify", {
        method: "POST",
        body: { code: otp },
      });
      navigate("/new-password");
    } catch (e) {
      setErr(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
      {/* Left Section - Keep unchanged */}
      <div
        className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
        style={{
          backgroundImage: "url('/login.png')",
        }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="rounded-full p-2 mt-4 w-60">
            <img src="/logo.svg" alt="Logo" className="h-10 w-50" />
          </div>
          <div className="mb-6">
            <p className="text-white text-4xl">
              Next-Gen Investing for the Modern Trader.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Verification Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center bg-white">
        <form
          onSubmit={submit}
          className="w-full max-w-md px-4"
        >
          <h1 className="text-3xl  mb-2 text-gray-800">
            Verify It’s You
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter the code we just sent to confirm your Email
          </p>

          {/* OTP Inputs */}
          <div className="flex  gap-3 mb-6">
            {code.map((num, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-medium focus:outline-none focus:border-black"
              />
            ))}
          </div>

          {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

          <button
            type="button"
            onClick={() => alert("Resend code clicked")}
            className="text-sm text-blue-500 mb-6 hover:underline"
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
        </form>
      </div>
    </div>
  );
}
